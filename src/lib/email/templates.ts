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
      <p style="margin: 0 0 12px 0;">© ${new Date().getFullYear()} Studyatchina. All rights reserved.</p>
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

  // --- CONTACT FORM TEMPLATES ---

  // CONTACT: Confirmation to Client
  contactConfirmation: (data: {
    name: string;
    subject: string;
  }) => ({
    subject: 'We Received Your Message — Study at China',
    html: EmailLayout({
      title: 'Message Received!',
      subtitle: 'Thank you for contacting us',
      previewText: 'We received your message and will get back to you shortly.',
      content: `
        <p>Dear ${data.name},</p>
        <p>Thank you for reaching out to us! We have received your message regarding <strong>${data.subject}</strong>.</p>
        
        <div style="${STYLES.infoBox}; border-left: 4px solid ${COLORS.success};">
          <p style="margin: 0; color: ${COLORS.success}; font-weight: 600;">✅ Your message has been received</p>
          <p style="margin: 8px 0 0 0; color: ${COLORS.textLight};">Our team will review it and get back to you within <strong>24 hours</strong>.</p>
        </div>

        <p><strong>What happens next?</strong></p>
        <ul style="padding-left: 20px; color: ${COLORS.textLight};">
            <li style="margin-bottom: 8px;">Our team will review your inquiry</li>
            <li style="margin-bottom: 8px;">You will receive a detailed response within 24 hours</li>
            <li style="margin-bottom: 8px;">For urgent matters, you can reach us at <a href="tel:+905543081000" style="${STYLES.link}">+90 554 308 10 00</a></li>
        </ul>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com'}" style="${STYLES.button}">Visit Our Website</a>
        </div>

        <p style="margin-top: 24px; color: ${COLORS.textLight}; font-size: 14px;">
          Best regards,<br/>
          <strong>Study at China Team</strong>
        </p>
      `
    }),
    text: `Dear ${data.name},\n\nThank you for contacting us! We received your message regarding "${data.subject}".\n\nOur team will review it and get back to you within 24 hours.\n\nFor urgent matters, call us at +90 554 308 10 00.\n\nBest regards,\nStudy at China Team`
  }),

  // ADMIN: Contact Form Notification
  adminContactNotification: (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => ({
    subject: `[Contact Form] ${data.name} — ${data.subject}`,
    html: EmailLayout({
      title: 'New Contact Form Submission',
      subtitle: 'A visitor has sent a message',
      previewText: `New contact from ${data.name}: ${data.subject}`,
      content: `
        <p>A new message has been received via the contact form on the website.</p>
        
        <div style="${STYLES.infoBox}">
          <div style="${STYLES.infoLabel}">Name</div>
          <div style="${STYLES.infoValue}">${data.name}</div>
          
          <div style="${STYLES.infoLabel}">Email</div>
          <div style="${STYLES.infoValue}"><a href="mailto:${data.email}" style="${STYLES.link}">${data.email}</a></div>
          
          <div style="${STYLES.infoLabel}">Phone</div>
          <div style="${STYLES.infoValue}">${data.phone || 'Not provided'}</div>
          
          <div style="${STYLES.infoLabel}">Subject</div>
          <div style="${STYLES.infoValue}">${data.subject}</div>
        </div>

        <div style="${STYLES.infoBox}; border-left: 4px solid ${COLORS.primary};">
          <div style="${STYLES.infoLabel}">Message</div>
          <p style="white-space: pre-wrap; margin: 8px 0 0 0; color: ${COLORS.text};">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="mailto:${data.email}?subject=Re: ${data.subject}" style="${STYLES.button}">Reply to ${data.name}</a>
        </div>
      `
    }),
    text: `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`
  }),

  // --- LEAD FORM TEMPLATES ---

  // LEAD: Student Confirmation (Localized)
  applicationLeadConfirmation: (data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    locale: string;
  }) => {
    // Inline translations for email (server-side rendered, can't use next-intl)
    const t: Record<string, Record<string, string>> = {
      en: { subject: 'We Received Your Application — Study at China', greeting: 'Dear', body: 'Thank you for your interest in studying in China! We have received your application and our team will contact you shortly to guide you through the admission process.', received: 'Your application has been received', contact: 'Our admissions team will contact you within 24 hours', next: 'What happens next?', step1: 'Our team will review your application details', step2: 'You will be contacted via WhatsApp or email within 24 hours', step3: 'We will guide you through university selection and admission', urgent: 'For urgent matters, you can reach us at', regards: 'Best regards,', team: 'Study at China Team', visit: 'Visit Our Website' },
      ar: { subject: 'استلمنا طلبك — الدراسة في الصين', greeting: 'عزيزي/عزيزتي', body: 'شكراً لاهتمامك بالدراسة في الصين! لقد استلمنا طلبك وسيتواصل معك فريقنا قريباً لإرشادك خلال عملية القبول.', received: 'تم استلام طلبك', contact: 'سيتواصل معك فريق القبول خلال 24 ساعة', next: 'ماذا يحدث بعد ذلك؟', step1: 'سيقوم فريقنا بمراجعة تفاصيل طلبك', step2: 'سيتم التواصل معك عبر واتساب أو البريد الإلكتروني خلال 24 ساعة', step3: 'سنرشدك في اختيار الجامعة وعملية القبول', urgent: 'للأمور العاجلة، يمكنك التواصل معنا على', regards: 'مع أطيب التحيات،', team: 'فريق الدراسة في الصين', visit: 'زيارة موقعنا' },
      tr: { subject: 'Başvurunuzu Aldık — Çin\'de Eğitim', greeting: 'Sayın', body: 'Çin\'de eğitim almaya olan ilginiz için teşekkür ederiz! Başvurunuzu aldık ve ekibimiz kabul süreci boyunca size rehberlik etmek için en kısa sürede sizinle iletişime geçecektir.', received: 'Başvurunuz alındı', contact: 'Kabul ekibimiz 24 saat içinde sizinle iletişime geçecektir', next: 'Bundan sonra ne olacak?', step1: 'Ekibimiz başvuru detaylarınızı inceleyecek', step2: '24 saat içinde WhatsApp veya e-posta ile sizinle iletişime geçilecek', step3: 'Üniversite seçimi ve kabul sürecinde size rehberlik edeceğiz', urgent: 'Acil durumlar için bize ulaşabilirsiniz:', regards: 'Saygılarımla,', team: 'Çin\'de Eğitim Ekibi', visit: 'Web Sitemizi Ziyaret Edin' },
      fa: { subject: 'درخواست شما دریافت شد — تحصیل در چین', greeting: 'با سلام', body: 'از علاقه شما به تحصیل در چین متشکریم! درخواست شما دریافت شده و تیم ما به زودی برای راهنمایی در فرآیند پذیرش با شما تماس خواهد گرفت.', received: 'درخواست شما دریافت شده است', contact: 'تیم پذیرش ما ظرف ۲۴ ساعت با شما تماس خواهد گرفت', next: 'مراحل بعدی چیست؟', step1: 'تیم ما جزئیات درخواست شما را بررسی خواهد کرد', step2: 'ظرف ۲۴ ساعت از طریق واتساپ یا ایمیل با شما تماس گرفته خواهد شد', step3: 'ما شما را در انتخاب دانشگاه و فرآیند پذیرش راهنمایی خواهیم کرد', urgent: 'برای موارد فوری، با ما تماس بگیرید:', regards: 'با احترام،', team: 'تیم تحصیل در چین', visit: 'بازدید از وبسایت ما' },
      tk: { subject: 'Ýüz tutmanyňyz kabul edildi — Hytaýda okamak', greeting: 'Hormatly', body: 'Hytaýda okamaga bolan gyzyklanmanyňyz üçin sag boluň! Ýüz tutmanyňyzy aldyk we toparymyz kabul ediş prosesinde size ýol görkezmek üçin ýakyn wagtda siz bilen habarlaşar.', received: 'Ýüz tutmanyňyz kabul edildi', contact: 'Kabul ediş toparymyz 24 sagadyň içinde siz bilen habarlaşar', next: 'Indiki ädimler näme?', step1: 'Toparymyz ýüz tutma jikme-jiklikleňizi gözden geçirer', step2: '24 sagadyň içinde WhatsApp ýa-da e-poçta arkaly siz bilen habarlaşylar', step3: 'Uniwersitet saýlamagy we kabul ediş prosesinde size ýol görkezeris', urgent: 'Gyssagly ýagdaýlar üçin bize ýüz tutuň:', regards: 'Hormat bilen,', team: 'Hytaýda Okamak Topary', visit: 'Web sahypamyza giriň' },
      zh: { subject: '我们已收到您的申请 — 留学中国', greeting: '亲爱的', body: '感谢您对留学中国的兴趣！我们已收到您的申请，我们的团队将尽快与您联系，指导您完成录取流程。', received: '您的申请已收到', contact: '我们的招生团队将在24小时内与您联系', next: '接下来会怎样？', step1: '我们的团队将审核您的申请详情', step2: '24小时内将通过WhatsApp或电子邮件与您联系', step3: '我们将指导您完成大学选择和录取流程', urgent: '如有紧急事项，请联系我们：', regards: '此致敬礼，', team: '留学中国团队', visit: '访问我们的网站' },
      fr: { subject: 'Nous avons reçu votre candidature — Étudier en Chine', greeting: 'Cher(e)', body: 'Merci pour votre intérêt pour les études en Chine ! Nous avons reçu votre candidature et notre équipe vous contactera prochainement pour vous guider dans le processus d\'admission.', received: 'Votre candidature a été reçue', contact: 'Notre équipe d\'admission vous contactera dans les 24 heures', next: 'Que se passe-t-il ensuite ?', step1: 'Notre équipe examinera les détails de votre candidature', step2: 'Vous serez contacté(e) par WhatsApp ou e-mail dans les 24 heures', step3: 'Nous vous guiderons dans le choix de l\'université et l\'admission', urgent: 'Pour les urgences, vous pouvez nous joindre au', regards: 'Cordialement,', team: 'L\'équipe Étudier en Chine', visit: 'Visiter notre site web' },
      es: { subject: 'Recibimos tu solicitud — Estudiar en China', greeting: 'Estimado/a', body: '¡Gracias por tu interés en estudiar en China! Hemos recibido tu solicitud y nuestro equipo te contactará pronto para guiarte en el proceso de admisión.', received: 'Tu solicitud ha sido recibida', contact: 'Nuestro equipo de admisiones te contactará en 24 horas', next: '¿Qué sucede después?', step1: 'Nuestro equipo revisará los detalles de tu solicitud', step2: 'Te contactaremos por WhatsApp o correo electrónico en 24 horas', step3: 'Te guiaremos en la selección de universidad y el proceso de admisión', urgent: 'Para asuntos urgentes, puedes contactarnos al', regards: 'Saludos cordiales,', team: 'Equipo de Estudiar en China', visit: 'Visita nuestro sitio web' },
      ru: { subject: 'Мы получили вашу заявку — Обучение в Китае', greeting: 'Уважаемый(ая)', body: 'Спасибо за интерес к обучению в Китае! Мы получили вашу заявку, и наша команда свяжется с вами в ближайшее время, чтобы помочь с процессом поступления.', received: 'Ваша заявка получена', contact: 'Наша приёмная комиссия свяжется с вами в течение 24 часов', next: 'Что будет дальше?', step1: 'Наша команда рассмотрит детали вашей заявки', step2: 'С вами свяжутся по WhatsApp или электронной почте в течение 24 часов', step3: 'Мы поможем вам с выбором университета и процессом поступления', urgent: 'По срочным вопросам вы можете связаться с нами по телефону', regards: 'С уважением,', team: 'Команда «Обучение в Китае»', visit: 'Посетите наш сайт' },
    };

    const isRTL = ['ar', 'fa'].includes(data.locale);
    const l = t[data.locale] || t.en;
    const dir = isRTL ? 'rtl' : 'ltr';

    return {
      subject: l.subject,
      html: EmailLayout({
        title: l.received,
        subtitle: l.contact,
        previewText: l.body,
        content: `
          <div style="direction: ${dir}; text-align: ${isRTL ? 'right' : 'left'};">
            <p>${l.greeting} ${data.firstName} ${data.lastName},</p>
            <p>${l.body}</p>
            
            <div style="${STYLES.infoBox}; border-left: 4px solid ${COLORS.success};">
              <p style="margin: 0; color: ${COLORS.success}; font-weight: 600;">✅ ${l.received}</p>
              <p style="margin: 8px 0 0 0; color: ${COLORS.textLight};">${l.contact}</p>
            </div>

            <p><strong>${l.next}</strong></p>
            <ul style="padding-left: 20px; color: ${COLORS.textLight};">
              <li style="margin-bottom: 8px;">${l.step1}</li>
              <li style="margin-bottom: 8px;">${l.step2}</li>
              <li style="margin-bottom: 8px;">${l.step3}</li>
            </ul>

            <p style="color: ${COLORS.textLight}; font-size: 14px;">
              ${l.urgent} <a href="tel:+905543081000" style="${STYLES.link}">+90 554 308 10 00</a>
            </p>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://studyatchina.com'}" style="${STYLES.button}">${l.visit}</a>
            </div>

            <p style="margin-top: 24px; color: ${COLORS.textLight}; font-size: 14px;">
              ${l.regards}<br/>
              <strong>${l.team}</strong>
            </p>
          </div>
        `
      }),
      text: `${l.greeting} ${data.firstName},\n\n${l.body}\n\n${l.regards}\n${l.team}`
    };
  },

  // ADMIN: New Lead from Application Form
  adminApplicationLeadNotification: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    englishLevel: string;
    department: string;
    startSemester: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  }) => ({
    subject: `[New Lead] ${data.firstName} ${data.lastName} — ${data.department}`,
    html: EmailLayout({
      title: 'New Lead from Website',
      subtitle: 'Application Form Submission',
      previewText: `New lead: ${data.firstName} ${data.lastName} wants to study ${data.department}`,
      content: `
        <p>A new lead has been submitted via the website application form.</p>
        
        <div style="${STYLES.infoBox}">
          <div style="${STYLES.infoLabel}">Name</div>
          <div style="${STYLES.infoValue}">${data.firstName} ${data.lastName}</div>
          
          <div style="${STYLES.infoLabel}">Email</div>
          <div style="${STYLES.infoValue}"><a href="mailto:${data.email}" style="${STYLES.link}">${data.email}</a></div>
          
          <div style="${STYLES.infoLabel}">WhatsApp</div>
          <div style="${STYLES.infoValue}"><a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="${STYLES.link}">${data.phone}</a></div>
          
          <div style="${STYLES.infoLabel}">English Level</div>
          <div style="${STYLES.infoValue}">${data.englishLevel}</div>
          
          <div style="${STYLES.infoLabel}">Department</div>
          <div style="${STYLES.infoValue}">${data.department}</div>
          
          <div style="${STYLES.infoLabel}">Start Semester</div>
          <div style="${STYLES.infoValue}" style="margin-bottom: 0;">${data.startSemester}</div>
        </div>

        ${(data.utmSource || data.utmMedium || data.utmCampaign) ? `
        <div style="${STYLES.infoBox}; border-left: 4px solid ${COLORS.primary};">
          <div style="${STYLES.infoLabel}">Marketing Attribution</div>
          ${data.utmSource ? `<div style="font-size: 13px; color: ${COLORS.textLight}; margin-bottom: 4px;">Source: <strong>${data.utmSource}</strong></div>` : ''}
          ${data.utmMedium ? `<div style="font-size: 13px; color: ${COLORS.textLight}; margin-bottom: 4px;">Medium: <strong>${data.utmMedium}</strong></div>` : ''}
          ${data.utmCampaign ? `<div style="font-size: 13px; color: ${COLORS.textLight}; margin-bottom: 4px;">Campaign: <strong>${data.utmCampaign}</strong></div>` : ''}
          ${data.utmContent ? `<div style="font-size: 13px; color: ${COLORS.textLight}; margin-bottom: 4px;">Content: <strong>${data.utmContent}</strong></div>` : ''}
          ${data.utmTerm ? `<div style="font-size: 13px; color: ${COLORS.textLight}; margin-bottom: 4px;">Term: <strong>${data.utmTerm}</strong></div>` : ''}
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="${STYLES.button}">Contact on WhatsApp</a>
        </div>
      `
    }),
    text: `New Lead: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nDepartment: ${data.department}\nEnglish: ${data.englishLevel}\nSemester: ${data.startSemester}${data.utmSource ? `\nUTM Source: ${data.utmSource}` : ''}${data.utmMedium ? `\nUTM Medium: ${data.utmMedium}` : ''}${data.utmCampaign ? `\nUTM Campaign: ${data.utmCampaign}` : ''}`
  }),
};

export type EmailTemplate = keyof typeof emailTemplates;
