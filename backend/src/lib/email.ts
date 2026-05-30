import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const mailOptions = {
      from: `"The Grand Lounge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully from backend: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Express Nodemailer Email Error:", error);
  }
}
