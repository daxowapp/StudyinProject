'use server';

import { z } from 'zod';
import { createZohoLead } from '@/lib/zoho/zoho-client';
import {
  sendApplicationLeadConfirmationEmail,
  sendAdminApplicationLeadEmail,
} from '@/lib/email/service';

// ── Validation Schema ──────────────────────────────────────────────
const LeadFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(30),
  englishLevel: z.enum([
    'beginner',
    'intermediate',
    'upper_intermediate',
    'advanced',
    'native',
  ]),
  department: z.enum([
    'medicine',
    'engineering',
    'computer_science',
    'business',
    'arts',
    'law',
    'language',
    'other',
  ]),
  startSemester: z.enum(['fall_2026', 'spring_2026', 'fall_2027']),
  // UTM params (optional)
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  // Locale for email localization
  locale: z.string().max(5),
});

export type LeadFormData = z.infer<typeof LeadFormSchema>;

export type LeadFormResult = {
  success: boolean;
  error?: string;
};

// ── Server Action ──────────────────────────────────────────────────
export async function submitLeadForm(
  formData: LeadFormData,
): Promise<LeadFormResult> {
  // 1. Validate
  const parsed = LeadFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((e) => e.message).join(', '),
    };
  }

  const data = parsed.data;

  // Run Zoho CRM + emails in parallel, don't let one failure block others
  const results = await Promise.allSettled([
    // 2. Push to Zoho CRM
    createZohoLead({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      englishLevel: data.englishLevel,
      department: data.department,
      startSemester: data.startSemester,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
    }),

    // 3. Send localized confirmation email to student
    sendApplicationLeadConfirmationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      department: data.department,
      locale: data.locale,
    }),

    // 4. Send admin notification email
    sendAdminApplicationLeadEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      englishLevel: data.englishLevel,
      department: data.department,
      startSemester: data.startSemester,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
    }),
  ]);

  // Log any failures but don't fail the user submission
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const labels = ['Zoho CRM', 'Student Email', 'Admin Email'];
      console.error(`[Lead Form] ${labels[index]} failed:`, result.reason);
    }
  });

  // Only fail if ALL services fail
  const allFailed = results.every((r) => r.status === 'rejected');
  if (allFailed) {
    return {
      success: false,
      error: 'All submission services failed. Please try again.',
    };
  }

  return { success: true };
}
