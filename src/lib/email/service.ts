'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { emailTemplates } from './templates';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Helper to get admin email
const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@studyatchina.com';
const getSenderEmail = () => process.env.EMAIL_FROM || 'Studyatchina <noreply@studyatchina.com>';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string; // Auto-generated if not provided? For now, optional
  recipientId?: string; // Optional if sending to admin
  applicationId?: string;
  messageId?: string;
  paymentId?: string;
  emailType: string;
}

/**
 * Core: Send email using Resend API and log to database
 */
export async function sendEmail(params: SendEmailParams) {
  const supabase = await createClient();

  try {
    // 1. Send via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: getSenderEmail(),
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || '', // Resend likes text version too
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      throw new Error(resendError.message);
    }

    console.log('Email sent via Resend:', resendData?.id);

    // 2. Log to database
    // Only log if we have a recipient ID (internal user) or if we want to log admin emails too (maybe with null recipient_id)
    // The current schema demands recipient_id? Let's check schema. 
    // Usually it's better to log everything. If recipientId is missing (e.g. admin), we might skip or put a dummy ID if schema enforces it.
    // We'll proceed with logging if recipientId is present.

    if (params.recipientId) {
      const { error: logError } = await supabase
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
        });

      if (logError) {
        console.error('Error logging email:', logError);
      }
    }

    return { success: true, resendId: resendData?.id };
  } catch (error: unknown) {
    console.error('Error sending email:', error);

    // Log failure if possible
    if (params.recipientId) {
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
    }

    return { success: false, error: (error as Error).message };
  }
}

// --- STUDENT NOTIFICATIONS ---

export async function sendApplicationSubmittedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  programTitle: string;
  universityName: string;
  applicationId: string;
}) {
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

export async function sendStatusChangedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  programTitle: string;
  oldStatus: string;
  newStatus: string;
  applicationId: string;
}) {
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

export async function sendDocumentRequestedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  documentName: string;
  description: string;
  deadline: string;
  applicationId: string;
}) {
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

export async function sendPaymentRequestedEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  amount: number;
  currency: string;
  paymentType: string;
  paymentLink: string;
  deadline: string;
  paymentId?: string;
}) {
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

export async function sendPaymentSuccessEmail(data: {
  studentId: string;
  studentEmail: string;
  studentName: string;
  amount: number;
  currency: string;
  applicationId: string;
}) {
  const template = emailTemplates.paymentSuccess(data);
  return sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    recipientId: data.studentId,
    applicationId: data.applicationId,
    emailType: 'payment_success',
  });
}

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

// --- ADMIN NOTIFICATIONS ---

export async function sendAdminNewApplicationEmail(data: {
  studentName: string;
  programTitle: string;
  applicationId: string;
}) {
  const template = emailTemplates.adminNewApplication(data);
  return sendEmail({
    to: getAdminEmail(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    // recipientId: undefined, // Admins might not have ID or we don't want to log them as 'recipient' in same table logic
    applicationId: data.applicationId,
    emailType: 'admin_new_application',
  });
}

export async function sendAdminNewPaymentEmail(data: {
  studentName: string;
  amount: number;
  currency: string;
  applicationId: string;
}) {
  const template = emailTemplates.adminNewPayment(data);
  return sendEmail({
    to: getAdminEmail(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    applicationId: data.applicationId,
    emailType: 'admin_payment_received',
  });
}

export async function sendAdminNewMessageEmail(data: {
  studentName: string;
  message: string;
  applicationId: string;
  messageId: string;
}) {
  const template = emailTemplates.adminNewMessage(data);
  return sendEmail({
    to: getAdminEmail(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    applicationId: data.applicationId,
    messageId: data.messageId,
    emailType: 'admin_new_message',
  });
}
