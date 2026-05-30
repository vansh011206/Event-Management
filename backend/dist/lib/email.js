"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendEmail(to, subject, htmlContent) {
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
    }
    catch (error) {
        console.error("Express Nodemailer Email Error:", error);
    }
}
