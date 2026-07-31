const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use SMTP settings from env if available
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Fallback for local development if no SMTP config is present
  console.warn('⚠️ No SMTP configuration found. Emails will only be logged to console.');
  return {
    sendMail: async (options) => {
      console.log('--- EMAIL MOCK ---');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.html || options.text);
      console.log('------------------');
      return { messageId: 'mock-id' };
    }
  };
};

const transporter = createTransporter();

exports.sendVerificationEmail = async (toEmail, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"منصة عمو إسلام" <noreply@example.com>',
    to: toEmail,
    subject: 'تفعيل حسابك في منصة عمو إسلام',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d4af37;">أهلاً بك في منصة عمو إسلام!</h2>
        <p>لقد قمت بإنشاء حساب جديد لدينا. لكي تتمكن من تسجيل الدخول والبدء في التعلم، يرجى الضغط على الرابط أدناه لتفعيل حسابك:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verifyLink}" style="background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">تفعيل الحساب الآن</a>
        </div>
        <p>إذا لم تكن قد قمت بإنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان.</p>
        <p>أطيب التحيات،<br>فريق الدعم التقني</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
