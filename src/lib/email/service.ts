'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  recipientId: string;
  applicationId?: string;
  messageId?: string;
  paymentId?: string;
  emailType: string;
}

/**
 * Send email using Resend API and log to database
 */
export async function sendEmail(params: SendEmailParams) {
  const supabase = await createClient();

  try {
    // Send email via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'StudyAtChina <noreply@studyatchina.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      throw new Error(resendError.message);
    }

    console.log('Email sent via Resend:', resendData?.id);

    // Log email to database
    const { data: emailLog, error: logError } = await supabase
      .from('email_notifications')
      .insert({
        recipient_id: params.recipientId,
        recipient_email: params.to,
        application_id: params.applicationId,
        message_id: params.messageId,
        payment_id: params.paymentId,
        email_type: params.emailType,
        subject: params.subject,
        body: params.text || '',
        html_body: params.html,
        status: 'sent',
        resend_id: resendData?.id,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging email:', logError);
      // Don't throw - email was sent successfully
    }

    console.log('Email logged:', emailLog?.id);
    return { success: true, emailId: emailLog?.id, resendId: resendData?.id };
  } catch (error: unknown) {
    console.error('Error sending email:', error);

    // Log failed email attempt
    await supabase.from('email_notifications').insert({
      recipient_id: params.recipientId,
      recipient_email: params.to,
      application_id: params.applicationId,
      email_type: params.emailType,
      subject: params.subject,
      body: params.text || '',
      html_body: params.html,
      status: 'failed',
      error_message: (error as Error).message,
    });

    return { success: false, error: (error as Error).message };
  }
}

/**
 * Send application submitted email
 */
export async function sendApplicationSubmittedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  programTitle: string;
  universityName: string;
  applicationId: string;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.applicationSubmitted(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    emailType: 'application_submitted',
  });
}

/**
 * Send status changed email
 */
export async function sendStatusChangedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  programTitle: string;
  oldStatus: string;
  newStatus: string;
  applicationId: string;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.statusChanged(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    emailType: 'status_changed',
  });
}

/**
 * Send document requested email
 */
export async function sendDocumentRequestedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  documentName: string;
  description: string;
  deadline: string;
  applicationId: string;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.documentRequested(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    emailType: 'document_requested',
  });
}

/**
 * Send payment requested email
 */
export async function sendPaymentRequestedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  amount: number;
  currency: string;
  paymentType: string;
  paymentLink: string;
  deadline: string;
  paymentId: string;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.paymentRequested(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    paymentId: data.paymentId,
    emailType: 'payment_requested',
  });
}

/**
 * Send acceptance letter email
 */
export async function sendAcceptanceLetterEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  programTitle: string;
  universityName: string;
  letterNumber: string;
  letterUrl: string;
  applicationId: string;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.acceptanceLetter(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    emailType: 'acceptance_letter',
  });
}

/**
 * Send message received email
 */
export async function sendMessageReceivedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  subject: string;
  message: string;
  applicationId: string;
  messageId: string;
  requiresAction: boolean;
}) {
  const { emailTemplates } = await import('./templates');
  const template = emailTemplates.messageReceived(data);

  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    messageId: data.messageId,
    emailType: 'message_received',
  });
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching preferences:', error);
    return null;
  }

  // Return default preferences if none exist
  if (!data) {
    return {
      email_application_updates: true,
      email_messages: true,
      email_payment_requests: true,
      email_document_requests: true,
      email_status_changes: true,
      email_deadlines: true,
      email_marketing: false,
    };
  }

  return data;
}

/**
 * Check if user wants to receive this type of email
 */
export async function shouldSendEmail(userId: string, emailType: string): Promise<boolean> {
  const prefs = await getNotificationPreferences(userId);
  if (!prefs) return true; // Default to sending if no preferences

  const typeMap: Record<string, keyof typeof prefs> = {
    application_submitted: 'email_application_updates',
    status_changed: 'email_status_changes',
    document_requested: 'email_document_requests',
    payment_requested: 'email_payment_requests',
    message_received: 'email_messages',
    acceptance_letter: 'email_application_updates',
  };

  const prefKey = typeMap[emailType];
  return prefKey ? prefs[prefKey] : true;
}
