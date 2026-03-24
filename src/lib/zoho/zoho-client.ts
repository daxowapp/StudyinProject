'use server';

/**
 * Zoho CRM API Client
 * Handles OAuth2 token refresh and lead creation via Zoho CRM REST API v2.
 */

// --- Token Cache (in-memory, per-process) ---
let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

const ZOHO_CONFIG = {
  clientId: process.env.ZOHO_CLIENT_ID || '',
  clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
  refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
  accountsUrl: process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com',
  apiDomain: process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com',
  layoutId: '6421426000004346065',
  leadSource: 'China',
  tag: 'Website Application',
};

/**
 * Refresh the Zoho OAuth2 access token using the stored refresh token.
 */
async function refreshAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: ZOHO_CONFIG.clientId,
    client_secret: ZOHO_CONFIG.clientSecret,
    refresh_token: ZOHO_CONFIG.refreshToken,
  });

  const response = await fetch(`${ZOHO_CONFIG.accountsUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.error) {
    console.error('[Zoho] Token refresh failed:', data.error);
    throw new Error(`Zoho OAuth error: ${data.error}`);
  }

  cachedAccessToken = data.access_token;
  // Zoho tokens expire in 3600s (1 hour)
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  console.log('[Zoho] Access token refreshed successfully');
  return cachedAccessToken!;
}

// --- Lead Creation ---

export interface ZohoLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  nationality?: string;
  englishLevel?: string;
  department?: string;
  startSemester?: string;
  // UTM fields
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

/**
 * Create a lead in Zoho CRM with the specified layout, tags, and fields.
 */
export async function createZohoLead(leadData: ZohoLeadData): Promise<{
  success: boolean;
  zohoId?: string;
  error?: string;
}> {
  try {
    const accessToken = await refreshAccessToken();

    const record: Record<string, unknown> = {
      First_Name: leadData.firstName,
      Last_Name: leadData.lastName,
      Email: leadData.email,
      Phone: leadData.phone,
      Lead_Source: ZOHO_CONFIG.leadSource,
      Layout: { id: ZOHO_CONFIG.layoutId },
      Tag: [{ name: ZOHO_CONFIG.tag }],
    };

    // Optional standard fields
    if (leadData.country) record.Country = leadData.country;
    if (leadData.nationality) record.Nationality = leadData.nationality;

    // Custom fields
    if (leadData.englishLevel) record.English_Level = leadData.englishLevel;
    if (leadData.department) record.Department = leadData.department;
    if (leadData.startSemester) record.Start_Semester = leadData.startSemester;

    // UTM tracking fields
    if (leadData.utmSource) record.UTM_Source = leadData.utmSource;
    if (leadData.utmMedium) record.UTM_Medium = leadData.utmMedium;
    if (leadData.utmCampaign) record.UTM_Campaign = leadData.utmCampaign;
    if (leadData.utmContent) record.UTM_Content = leadData.utmContent;
    if (leadData.utmTerm) record.UTM_Term = leadData.utmTerm;

    const response = await fetch(`${ZOHO_CONFIG.apiDomain}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [record],
        trigger: ['workflow'],
      }),
    });

    const result = await response.json();

    if (result.data?.[0]?.status === 'success') {
      const zohoId = result.data[0].details?.id;
      console.log(`[Zoho] Lead created successfully: ${zohoId}`);
      return { success: true, zohoId };
    }

    const errorMsg = result.data?.[0]?.message || result.message || 'Unknown Zoho API error';
    console.error('[Zoho] Lead creation failed:', errorMsg, JSON.stringify(result));
    return { success: false, error: errorMsg };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Zoho] Lead creation error:', message);
    return { success: false, error: message };
  }
}

/**
 * Exchange an authorization code for a refresh token (run once during setup).
 * Usage: call from a temporary API route or script.
 */
export async function exchangeAuthCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: ZOHO_CONFIG.clientId,
    client_secret: ZOHO_CONFIG.clientSecret,
    code,
  });

  const response = await fetch(`${ZOHO_CONFIG.accountsUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Zoho auth code exchange failed: ${data.error}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}
