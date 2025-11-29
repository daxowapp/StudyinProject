// Email Templates for Different Notification Types

export const emailTemplates = {
  applicationSubmitted: (data: {
    studentName: string;
    programTitle: string;
    universityName: string;
    applicationId: string;
  }) => ({
    subject: 'Application Submitted Successfully',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Submitted!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>Thank you for submitting your application to <strong>${data.programTitle}</strong> at <strong>${data.universityName}</strong>.</p>
              
              <div class="info-box">
                <p><strong>Application ID:</strong> ${data.applicationId}</p>
                <p><strong>Program:</strong> ${data.programTitle}</p>
                <p><strong>University:</strong> ${data.universityName}</p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your application within 2-3 business days</li>
                <li>You'll receive email updates on your application status</li>
                <li>You can track your application progress in your dashboard</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">View Application Status</a>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} StudyAtChina. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.studentName},\n\nThank you for submitting your application to ${data.programTitle} at ${data.universityName}.\n\nApplication ID: ${data.applicationId}\n\nOur team will review your application within 2-3 business days.\n\nBest regards,\nStudyAtChina Team`
  }),

  statusChanged: (data: {
    studentName: string;
    programTitle: string;
    oldStatus: string;
    newStatus: string;
    applicationId: string;
  }) => ({
    subject: `Application Status Update: ${data.newStatus}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
            .status-accepted { background: #10b981; color: white; }
            .status-review { background: #3b82f6; color: white; }
            .status-pending { background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Application Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>Your application status for <strong>${data.programTitle}</strong> has been updated.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <span class="status-badge status-review">${data.newStatus}</span>
              </p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" class="button">View Application Details</a>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.studentName},\n\nYour application status has been updated to: ${data.newStatus}\n\nView details: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}`
  }),

  documentRequested: (data: {
    studentName: string;
    documentName: string;
    description: string;
    deadline: string;
    applicationId: string;
  }) => ({
    subject: `Document Required: ${data.documentName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📄 Document Required</h1>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>We need an additional document to process your application:</p>
              
              <div class="alert-box">
                <p><strong>Document:</strong> ${data.documentName}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Deadline:</strong> ${data.deadline}</p>
              </div>
              
              <p>Please upload this document as soon as possible to avoid delays in processing your application.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" class="button">Upload Document</a>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.studentName},\n\nDocument Required: ${data.documentName}\n${data.description}\nDeadline: ${data.deadline}\n\nUpload at: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}`
  }),

  paymentRequested: (data: {
    studentName: string;
    amount: number;
    currency: string;
    paymentType: string;
    paymentLink: string;
    deadline: string;
  }) => ({
    subject: `Payment Required: ${data.amount} ${data.currency}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .amount-box { background: white; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0; }
            .amount { font-size: 36px; font-weight: bold; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Required</h1>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>A payment is required to proceed with your application:</p>
              
              <div class="amount-box">
                <p style="margin: 0; color: #666;">Payment Type</p>
                <p style="margin: 10px 0; font-size: 18px; font-weight: bold;">${data.paymentType}</p>
                <p class="amount">${data.amount} ${data.currency}</p>
                <p style="margin: 10px 0; color: #666;">Due by: ${data.deadline}</p>
              </div>
              
              <p>Click the button below to complete your payment securely:</p>
              
              <a href="${data.paymentLink}" class="button">Pay Now</a>
              
              <p><small>This payment link is secure and will expire after use or on the deadline date.</small></p>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.studentName},\n\nPayment Required: ${data.amount} ${data.currency}\nType: ${data.paymentType}\nDue: ${data.deadline}\n\nPay at: ${data.paymentLink}`
  }),

  acceptanceLetter: (data: {
    studentName: string;
    programTitle: string;
    universityName: string;
    letterNumber: string;
    letterUrl: string;
  }) => ({
    subject: '🎉 Congratulations! Acceptance Letter Issued',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p style="font-size: 20px; margin: 10px 0;">You've been accepted!</p>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>We are delighted to inform you that you have been <strong>accepted</strong> to:</p>
              
              <div class="success-box">
                <p><strong>Program:</strong> ${data.programTitle}</p>
                <p><strong>University:</strong> ${data.universityName}</p>
                <p><strong>Letter Number:</strong> ${data.letterNumber}</p>
              </div>
              
              <p>Your official acceptance letter is now available for download.</p>
              
              <a href="${data.letterUrl}" class="button">Download Acceptance Letter</a>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Download and review your acceptance letter</li>
                <li>Complete any remaining payment requirements</li>
                <li>Prepare your visa application documents</li>
                <li>Check your dashboard for additional instructions</li>
              </ul>
              
              <p>Congratulations once again on this achievement!</p>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Congratulations ${data.studentName}!\n\nYou've been accepted to ${data.programTitle} at ${data.universityName}!\n\nLetter Number: ${data.letterNumber}\nDownload: ${data.letterUrl}`
  }),

  messageReceived: (data: {
    studentName: string;
    subject: string;
    message: string;
    applicationId: string;
    requiresAction: boolean;
  }) => ({
    subject: `New Message: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .message-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Message</h1>
            </div>
            <div class="content">
              <p>Dear ${data.studentName},</p>
              
              <p>You have received a new message regarding your application:</p>
              
              <div class="message-box">
                <p><strong>${data.subject}</strong></p>
                <p>${data.message}</p>
              </div>
              
              ${data.requiresAction ? '<p><strong style="color: #f59e0b;">⚠️ This message requires your action.</strong></p>' : ''}
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}" class="button">View Message</a>
              
              <p>Best regards,<br>StudyAtChina Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.studentName},\n\nNew Message: ${data.subject}\n\n${data.message}\n\nView at: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${data.applicationId}`
  }),
};

export type EmailTemplate = keyof typeof emailTemplates;
