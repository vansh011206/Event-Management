import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  // Send the email. Since we want it to run asynchronously without blocking the main API response,
  // we handle errors within the function and don't force the API to block.
  try {
    const mailOptions = {
      from: `"The Grand Lounge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Email Error:", error);
  }
}
