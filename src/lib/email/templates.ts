// Email Templates for Different Notification Types

// --- Design System & Layout ---

const COLORS = {
  primary: '#2563eb', // Blue 600
  primaryDark: '#1d4ed8', // Blue 700
  secondary: '#4b5563', // Gray 600
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  background: '#f3f4f6', // Gray 100
  card: '#ffffff',
  text: '#1f2937', // Gray 800
  textLight: '#6b7280', // Gray 500
  border: '#e5e7eb', // Gray 200
  link: '#2563eb',
};

const STYLES = {
  body: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${COLORS.text}; background-color: ${COLORS.background}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;`,
  container: `max-width: 600px; margin: 0 auto; background-color: ${COLORS.card}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); margin-top: 40px; margin-bottom: 40px;`,
  header: `background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); padding: 40px 20px; text-align: center;`,
  headerTitle: `color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;`,
  headerSubtitle: `color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;`,
  content: `padding: 40px 30px;`,
  footer: `background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: ${COLORS.textLight}; border-top: 1px solid ${COLORS.border};`,
  button: `display: inline-block; padding: 14px 28px; background-color: ${COLORS.primary}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);`,
  link: `color: ${COLORS.link}; text-decoration: underline;`,
  divider: `height: 1px; background-color: ${COLORS.border}; margin: 24px 0; border: none;`,
  infoBox: `background-color: #f8fafc; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 24px 0;`,
  infoLabel: `color: ${COLORS.textLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px;`,
  infoValue: `color: ${COLORS.text}; font-size: 16px; font-weight: 500; margin-bottom: 12px;`,
  badge: `display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 600;`,
};

interface EmailLayoutProps {
  title: string;
  subtitle?: string;
  content: string;
  previewText?: string;
}

const EmailLayout = ({ title, subtitle, content, previewText }: EmailLayoutProps) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; }
      .content { padding: 24px 20px !important; }
      .header { padding: 32px 20px !important; }
    }
  </style>
</head>
<body style="${STYLES.body}">
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
  <div class="container" style="${STYLES.container}">
    <div class="header" style="${STYLES.header}">
      <h1 style="${STYLES.headerTitle}">${title}</h1>
      ${subtitle ? `<p style="${STYLES.headerSubtitle}">${subtitle}</p>` : ''}
    </div>
    <div class="content" style="${STYLES.content}">
      ${content}
    </div>
    <div class="footer" style="${STYLES.footer}">
      <p style="margin: 0 0 12px 0;">© ${new Date().getFullYear()} StudyAtChina. All rights reserved.</p>
      <p style="margin: 0;">You are receiving this email because you signed up on our platform.</p>
    </div>
  </div>
</body>
</html>
`;

// --- Templates ---

export const emailTemplates = {
  // STUDENT: Application Submitted
  applicationSubmitted: (data: {
    studentName: string;
    programTitle: string;
    universityName: string;
    applicationId: string;
  }) => ({
    subject: 'Application Submitted Successfully',
    html: EmailLayout({
      title: 'Application Submitted!',
      subtitle: 'We have received your application',
      previewText: `Thanks for applying to ${data.programTitle}.`,
      content: `
        <p>Dear ${data.studentName},</p>
        <p>Thank you for submitting your application. We are excited to review your profile!</p>
        
        <div style="${STYLES.infoBox}">
          <div style="margin-bottom: 0;">
            <div style="${STYLES.infoLabel}">Program</div>
            <div style="${STYLES.infoValue}">${data.programTitle}</div>
            
            <div style="${STYLES.infoLabel}">University</div>
            <div style="${STYLES.infoValue}">${data.universityName}</div>
            
            <div style="${STYLES.infoLabel}">Application ID</div>
            <div style="${STYLES.infoValue}" style="margin-bottom: 0;">${data.applicationId}</div>
          </div>
        </div>

        <p><strong>What's Next?</strong></p>
        <ul style="padding-left: 20px; color: ${COLORS.textLight};">
            <li style="margin-bottom: 8px;">Our admissions team will review your documents (2-3 business days)</li>
            <li style="margin-bottom: 8px;">You will receive email updates for any status changes</li>
        </ul>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" style="${STYLES.button}">Track Application</a>
        </div>
      `
    }),
    text: `Application Submitted!\n\nDear ${data.studentName},\n\nWe have received your application for ${data.programTitle} at ${data.universityName}.`
  }),

  // STUDNET: Status Changed
  statusChanged: (data: {
    studentName: string;
    programTitle: string;
    oldStatus: string;
    newStatus: string;
    applicationId: string;
  }) => {
    let statusColor = COLORS.primary;
    if (data.newStatus === 'accepted') statusColor = COLORS.success;
    if (data.newStatus === 'rejected') statusColor = COLORS.error;
    if (data.newStatus === 'submitted') statusColor = COLORS.primary;

    return {
      subject: `Application Update: ${data.programTitle}`,
      html: EmailLayout({
        title: 'Application Status Update',
        subtitle: data.programTitle,
        previewText: `Your application status has changed to ${data.newStatus}.`,
        content: `
          <p>Dear ${data.studentName},</p>
          <p>There has been an update to your application status.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <div style="${STYLES.badge}; background-color: ${statusColor}; color: white; padding: 12px 24px; font-size: 18px;">
              ${data.newStatus.charAt(0).toUpperCase() + data.newStatus.slice(1).replace('_', ' ')}
            </div>
          </div>

          <div style="${STYLES.infoBox}">
             <p style="margin: 0; color: ${COLORS.textLight}; text-align: center;">Previous Status: ${data.oldStatus}</p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" style="${STYLES.button}">View Application</a>
          </div>
        `
      }),
      text: `Status Update\n\nDear ${data.studentName},\n\nYour application status for ${data.programTitle} has been updated to: ${data.newStatus}.`
    };
  },

  // STUDENT: Document Requested
  documentRequested: (data: {
    studentName: string;
    documentName: string;
    description: string;
    deadline: string;
    applicationId: string;
  }) => ({
    subject: 'Action Required: Document Missing',
    html: EmailLayout({
      title: 'Document Required',
      subtitle: 'Additional information needed',
      previewText: `We need you to upload: ${data.documentName}`,
      content: `
        <p>Dear ${data.studentName},</p>
        <p>We require an additional document to proceed with your application. Please review the details below and upload it as soon as possible.</p>
        
        <div style="${STYLES.infoBox}; border-left: 4px solid ${COLORS.warning};">
          <div style="${STYLES.infoLabel}">Missing Document</div>
          <div style="${STYLES.infoValue}">${data.documentName}</div>
          
          <div style="${STYLES.infoLabel}">Instructions</div>
          <div style="${STYLES.infoValue}">${data.description}</div>
          
          ${data.deadline ? `
            <div style="${STYLES.infoLabel}">Deadline</div>
            <div style="${STYLES.infoValue}" style="margin-bottom: 0;">${data.deadline}</div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" style="${STYLES.button}">Upload Document</a>
        </div>
      `
    }),
    text: `Document Required\n\nWe need: ${data.documentName}\n\n${data.description}`
  }),

  // STUDENT: Payment Requested
  paymentRequested: (data: {
    studentName: string;
    amount: number;
    currency: string;
    paymentType: string;
    paymentLink: string;
    deadline: string;
    paymentId?: string; // Optional now in case not passed
  }) => ({
    subject: `Action Required: Payment of ${data.currency} ${data.amount}`,
    html: EmailLayout({
      title: 'Payment Request',
      subtitle: 'Complete your application',
      previewText: `A payment of ${data.currency} ${data.amount} is required.`,
      content: `
        <p>Dear ${data.studentName},</p>
        <p>A payment is required to proceed with your application process.</p>
        
        <div style="text-align: center; background-color: #f0fdf4; border: 1px solid ${COLORS.success}; border-radius: 12px; padding: 32px; margin: 24px 0;">
          <div style="color: ${COLORS.secondary}; font-size: 14px; margin-bottom: 4px;">Amount Due</div>
          <div style="color: ${COLORS.success}; font-size: 36px; font-weight: 700;">${data.currency} ${data.amount}</div>
          <div style="color: ${COLORS.secondary}; font-size: 14px; margin-top: 8px;">${data.paymentType}</div>
        </div>

        ${data.deadline ? `<p style="text-align: center; color: ${COLORS.error}; font-size: 14px;"><strong>Due Date:</strong> ${data.deadline}</p>` : ''}

        <div style="text-align: center; margin-top: 32px;">
          <a href="${data.paymentLink}" style="${STYLES.button}">Pay Now Securely</a>
        </div>
        
        <p style="text-align: center; font-size: 12px; color: ${COLORS.textLight}; margin-top: 16px;">
          Secure payment processed by Stripe.
        </p>
      `
    }),
    text: `Payment Required: ${data.currency} ${data.amount}\n\nPlease pay here: ${data.paymentLink}`
  }),

  // STUDENT: Payment Success (New)
  paymentSuccess: (data: {
    studentName: string;
    amount: number;
    currency: string;
    applicationId: string;
  }) => ({
    subject: 'Payment Successful',
    html: EmailLayout({
      title: 'Payment Confirmed',
      content: `
        <p>Dear ${data.studentName},</p>
        <p>We have successfully received your payment of <strong>${data.currency} ${data.amount.toFixed(2)}</strong>.</p>
        
        <div style="${STYLES.infoBox}">
             <p style="margin: 0; color: ${COLORS.success}; font-weight: 600; text-align: center;">✅ Transaction Completed Successfully</p>
        </div>

        <p>Your application is now being processed further.</p>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" style="${STYLES.button}">View Application</a>
        </div>
      `
    }),
    text: `Payment of ${data.currency} ${data.amount} was successful.`
  }),

  // STUDENT: New Message
  messageReceived: (data: {
    studentName: string;
    subject: string;
    message: string;
    applicationId: string;
    messageId: string;
    requiresAction: boolean;
  }) => ({
    subject: `New Message: ${data.subject}`,
    html: EmailLayout({
      title: 'New Message',
      subtitle: data.subject,
      content: `
        <p>Dear ${data.studentName},</p>
        <p>You have received a new message from the admissions team.</p>
        
        <div style="${STYLES.infoBox}">
          <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
        </div>
        
        ${data.requiresAction ? `
           <div style="background-color: #fffbeb; border: 1px solid ${COLORS.warning}; color: ${COLORS.warning}; padding: 12px; border-radius: 6px; margin: 16px 0; font-weight: 600; text-align: center;">
             ⚠️ Response Required
           </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/messages" style="${STYLES.button}">Reply to Message</a>
        </div>
      `
    }),
    text: `New Message: ${data.subject}\n\n${data.message}\n\nReply here: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/messages`
  }),

  // STUDENT: Acceptance Letter
  acceptanceLetter: (data: {
    studentName: string;
    programTitle: string;
    universityName: string;
    letterNumber: string;
    letterUrl: string;
  }) => ({
    subject: '🎉 Congratulations! You Are Accepted!',
    html: EmailLayout({
      title: 'Congratulations!',
      subtitle: 'You are going to China! 🇨🇳',
      content: `
        <p>Dear ${data.studentName},</p>
        <p>We are absolutely delighted to inform you that you have been <strong>accepted</strong> into the <strong>${data.programTitle}</strong> at <strong>${data.universityName}</strong>!</p>
        
        <div style="${STYLES.infoBox}; background-color: #f0fdf4; border-color: ${COLORS.success};">
          <div style="text-align: center; margin-bottom: 16px;">
             <span style="font-size: 48px;">🎓</span>
          </div>
          <p style="text-align: center; margin: 0; font-weight: 600; color: ${COLORS.success};">Official Acceptance Issued</p>
          <p style="text-align: center; margin: 8px 0 0 0; color: ${COLORS.textLight}; font-size: 12px;">Letter #${data.letterNumber}</p>
        </div>

        <p>Your official acceptance letter is ready for download. Please save this document as it is crucial for your visa application.</p>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${data.letterUrl}" style="${STYLES.button}">Download Acceptance Letter</a>
        </div>
      `
    }),
    text: `Congratulations! You have been accepted to ${data.programTitle}. Download your letter here: ${data.letterUrl}`
  }),

  // --- ADMIN TEMPLATES ---

  // ADMIN: New Application
  adminNewApplication: (data: {
    studentName: string;
    programTitle: string;
    applicationId: string;
  }) => ({
    subject: `[New App] ${data.studentName} - ${data.programTitle}`,
    html: EmailLayout({
      title: 'New Application',
      subtitle: 'Action Required',
      content: `
        <div style="${STYLES.infoBox}">
          <div style="${STYLES.infoLabel}">Student</div>
          <div style="${STYLES.infoValue}">${data.studentName}</div>
          
          <div style="${STYLES.infoLabel}">Program</div>
          <div style="${STYLES.infoValue}">${data.programTitle}</div>
          
          <div style="${STYLES.infoLabel}">ID</div>
          <div style="${STYLES.infoValue}" style="margin-bottom: 0;">${data.applicationId}</div>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/applications/${data.applicationId}" style="${STYLES.button}">Review Application</a>
        </div>
      `
    }),
    text: `New Application from ${data.studentName} for ${data.programTitle}.`
  }),

  // ADMIN: New Payment
  adminNewPayment: (data: {
    studentName: string;
    amount: number;
    currency: string;
    applicationId: string;
  }) => ({
    subject: `💰 Payment Received: ${data.currency} ${data.amount.toFixed(2)}`,
    html: EmailLayout({
      title: 'Payment Received',
      content: `
        <p>A new payment has been processed successfully.</p>
        
        <div style="${STYLES.infoBox}">
          <div style="${STYLES.infoLabel}">Student</div>
          <div style="${STYLES.infoValue}">${data.studentName}</div>
          
          <div style="${STYLES.infoLabel}">Amount</div>
          <div style="${STYLES.infoValue} color: ${COLORS.success};">${data.currency} ${data.amount.toFixed(2)}</div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/applications/${data.applicationId}" style="${STYLES.button}">View Application</a>
        </div>
      `
    }),
    text: `Payment Received: ${data.currency} ${data.amount} from ${data.studentName}.`
  }),

  // ADMIN: New Reply
  adminNewMessage: (data: {
    studentName: string;
    message: string;
    applicationId: string;
  }) => ({
    subject: `New Message from ${data.studentName}`,
    html: EmailLayout({
      title: 'New Student Message',
      content: `
        <p><strong>${data.studentName}</strong> has replied to a thread.</p>
        
        <div style="${STYLES.infoBox}">
          <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages/${data.applicationId}" style="${STYLES.button}">Reply in Admin Panel</a>
        </div>
      `
    }),
    text: `New Message from ${data.studentName}:\n\n${data.message}`
  }),
};

export type EmailTemplate = keyof typeof emailTemplates;
