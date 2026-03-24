/**
 * UTM Parameter Tracking Utility
 * Captures UTM params from URL and stores them in sessionStorage
 * so they persist across page navigations within the same session.
 */

const UTM_STORAGE_KEY = 'studyin_utm_params';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * Capture UTM parameters from the current URL and store in sessionStorage.
 * Only overwrites if new UTM params are present (preserves original referrer data).
 */
export function captureUTMParams(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

  const newUtm: UTMParams = {};
  let hasUtm = false;

  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) {
      newUtm[key] = value;
      hasUtm = true;
    }
  }

  // Only store if we found at least one UTM param in the URL
  if (hasUtm) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtm));
  }
}

/**
 * Retrieve stored UTM parameters from sessionStorage.
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
