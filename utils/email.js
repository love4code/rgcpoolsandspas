const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.ADMIN_EMAIL,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendInquiryEmail = async (inquiryData) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'markagrover85@gmail.com';

    const sizesText = inquiryData.selectedSizes && inquiryData.selectedSizes.length > 0
      ? `Selected Pool Sizes: ${inquiryData.selectedSizes.join(', ')}\n`
      : '';

    const message = `
New Contact Form Inquiry

Name: ${inquiryData.name}
Town: ${inquiryData.town || 'N/A'}
Phone: ${inquiryData.phone || 'N/A'}
Email: ${inquiryData.email}
Service: ${inquiryData.service}
${sizesText}
Message: ${inquiryData.message || 'No message provided'}

Source: ${inquiryData.source || 'contact'}
${inquiryData.productId ? `Product ID: ${inquiryData.productId}` : ''}

Submitted: ${new Date().toLocaleString()}
    `.trim();

    const mailOptions = {
      from: process.env.SMTP_USER || adminEmail,
      to: adminEmail,
      subject: `New Inquiry: ${inquiryData.service} - ${inquiryData.name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">New Contact Form Inquiry</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${inquiryData.name}</p>
            <p><strong>Town:</strong> ${inquiryData.town || 'N/A'}</p>
            <p><strong>Phone:</strong> ${inquiryData.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${inquiryData.email}</p>
            <p><strong>Service:</strong> ${inquiryData.service}</p>
            ${sizesText ? `<p><strong>Selected Pool Sizes:</strong> ${inquiryData.selectedSizes.join(', ')}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 10px; border-radius: 3px;">${inquiryData.message || 'No message provided'}</p>
            <hr>
            <p><small>Source: ${inquiryData.source || 'contact'}</small></p>
            <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    return false;
  }
};

module.exports = {
  sendInquiryEmail
};

