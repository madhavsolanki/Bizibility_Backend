import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  service: process.env.SMTP_SERVICE,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Your App" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Your OTP Code for Verification',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px;">Thank you for registering! Please use the following OTP to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 20px 0;">${otp}</div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendPasswordResetEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Your App" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="font-size: 16px;">We received a request to reset your password. Please use the following OTP:</p>
          <div style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 20px 0;">${otp}</div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
