export function getEnquiryReceivedTemplate(name: string, eventType: string, date: string, guests: number, packageSelected: string) {
  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F5F0; padding: 40px 20px; text-align: center; color: #1F1F1F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E2D9; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="font-weight: 600; text-align: center; color: #C5A880; font-size: 24px; letter-spacing: 1px; margin-bottom: 30px;">THE GRAND LOUNGE</h2>
        <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #6B6B6B;">We have received your enquiry for hosting a celebration at The Grand Lounge. Our curation team will review the details and respond within 24 hours.</p>
        
        <div style="background-color: #F8F5F0; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #E8E2D9;">
          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #C5A880; margin-top: 0;">Submission Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Event Type:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${eventType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Preferred Date:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Expected Guests:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${guests} Guests</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Package Selected:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; text-transform: capitalize;">${packageSelected}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #6B6B6B;">Should you have any immediate questions, please do not hesitate to contact our Curator Desk.</p>
        <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #E8E2D9; padding-top: 20px;">Warm regards,<br><strong style="color: #1F1F1F;">Vanshaj Sharma</strong><br><span style="font-size: 12px; color: #C5A880;">General Manager, The Grand Lounge</span></p>
      </div>
    </div>
  `;
}

export function getApprovalTemplate(name: string, eventType: string, date: string, guests: number, packageSelected: string, amount: number, redirectUrl: string) {
  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F5F0; padding: 40px 20px; text-align: center; color: #1F1F1F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E2D9; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="font-weight: 600; text-align: center; color: #C5A880; font-size: 24px; letter-spacing: 1px; margin-bottom: 30px;">THE GRAND LOUNGE</h2>
        <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #1F1F1F;">We are pleased to inform you that your <strong>${eventType}</strong> booking for <strong>${new Date(date).toLocaleDateString()}</strong> has been approved by our curation board.</p>
        
        <div style="background-color: #F8F5F0; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #E8E2D9;">
          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #C5A880; margin-top: 0;">Booking Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Event Type:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${eventType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Preferred Date:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Expected Guests:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${guests} Guests</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Package Selected:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; text-transform: capitalize;">${packageSelected}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Booking Deposit:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #C5A880; font-size: 16px;">₹${amount.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${redirectUrl}" style="background-color: #1F1F1F; color: #FFFFFF; text-decoration: none; padding: 16px 36px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 50px; display: inline-block;">COMPLETE PAYMENT</a>
        </div>
        
        <p style="font-size: 12px; line-height: 1.6; color: #888888; text-align: center;">Please complete the booking deposit within 48 hours to secure your master slot in our calendar.</p>
        
        <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #E8E2D9; padding-top: 20px;">Warm regards,<br><strong style="color: #1F1F1F;">Vanshaj Sharma</strong><br><span style="font-size: 12px; color: #C5A880;">General Manager, The Grand Lounge</span></p>
      </div>
    </div>
  `;
}

export function getRejectionTemplate(name: string, eventType: string, date: string, adminNote?: string, redirectUrl?: string) {
  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F5F0; padding: 40px 20px; text-align: center; color: #1F1F1F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E2D9; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="font-weight: 600; text-align: center; color: #C5A880; font-size: 24px; letter-spacing: 1px; margin-bottom: 30px;">THE GRAND LOUNGE</h2>
        <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #6B6B6B;">Thank you for your interest in hosting your celebration with us. After careful review of our master venue schedule, we regret to inform you that we are unable to accommodate your <strong>${eventType}</strong> booking on <strong>${new Date(date).toLocaleDateString()}</strong>.</p>
        
        ${adminNote ? `
        <div style="background-color: #FAF4F4; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #F0D5D5;">
          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #C85C5C; margin-top: 0;">Curation Feedback</h3>
          <p style="font-size: 13px; line-height: 1.6; color: #6B6B6B; margin-bottom: 0; font-style: italic;">“${adminNote}”</p>
        </div>
        ` : ""}
        
        <p style="font-size: 13px; line-height: 1.6; color: #6B6B6B;">We would be delighted to discuss alternative dates or layouts. Please visit our <a href="${redirectUrl || 'http://localhost:3000/contact'}" style="color: #C5A880; text-decoration: underline;">contact page</a> to connect with our concierge team.</p>
        
        <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #E8E2D9; padding-top: 20px;">Warm regards,<br><strong style="color: #1F1F1F;">Vanshaj Sharma</strong><br><span style="font-size: 12px; color: #C5A880;">General Manager, The Grand Lounge</span></p>
      </div>
    </div>
  `;
}

export function getPaymentConfirmationTemplate(name: string, eventType: string, date: string, amount: number, orderId: string) {
  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F5F0; padding: 40px 20px; text-align: center; color: #1F1F1F;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E2D9; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="font-weight: 600; text-align: center; color: #C5A880; font-size: 24px; letter-spacing: 1px; margin-bottom: 30px;">THE GRAND LOUNGE</h2>
        <div style="text-align: center; margin-bottom: 25px;">
          <span style="font-size: 40px; color: #5CB85C; line-height: 1;">✓</span>
          <h3 style="font-size: 18px; margin-top: 10px; color: #5CB85C;">Payment Confirmed</h3>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #6B6B6B;">Your deposit of <strong>₹${amount.toLocaleString("en-IN")}</strong> has been received and verified. Your booking is now fully secured in our master calendar.</p>
        
        <div style="background-color: #F8F5F0; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #E8E2D9;">
          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #C5A880; margin-top: 0;">Receipt Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Event Type:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${eventType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Event Date:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Transaction Order ID:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6B6B6B;">Amount Paid:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #5CB85C; font-size: 15px;">₹${amount.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; text-align: center; font-weight: bold; margin: 30px 0; color: #C5A880;">See you on ${new Date(date).toLocaleDateString()}!</p>
        
        <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #E8E2D9; padding-top: 20px;">Warm regards,<br><strong style="color: #1F1F1F;">Vanshaj Sharma</strong><br><span style="font-size: 12px; color: #C5A880;">General Manager, The Grand Lounge</span></p>
      </div>
    </div>
  `;
}
