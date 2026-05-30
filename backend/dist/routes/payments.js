"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Enquiry_1 = __importDefault(require("../models/Enquiry"));
const razorpay_1 = require("../lib/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../lib/email");
const emailTemplates_1 = require("../lib/emailTemplates");
const router = (0, express_1.Router)();
// POST /api/payment/create-order - Create Razorpay order
router.post("/payment/create-order", auth_1.verifyUserHeader, async (req, res) => {
    try {
        const { enquiryId } = req.body;
        const userId = req.user?.id;
        if (!enquiryId) {
            return res.status(400).json({ success: false, error: "Enquiry ID is required." });
        }
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized. User ID is missing." });
        }
        const enquiry = await Enquiry_1.default.findOne({ _id: enquiryId, userId });
        if (!enquiry) {
            return res.status(404).json({ success: false, error: "Enquiry not found or unauthorized access." });
        }
        if (enquiry.status !== "approved") {
            return res.status(400).json({ success: false, error: "Enquiry is not approved yet." });
        }
        if (enquiry.paymentStatus === "paid") {
            return res.status(400).json({ success: false, error: "Enquiry has already been paid." });
        }
        let orderId = enquiry.paymentOrderId;
        let amount = enquiry.paymentAmount;
        if (!amount) {
            if (enquiry.packageSelected === "basic")
                amount = 15000;
            else if (enquiry.packageSelected === "premium")
                amount = 30000;
            else if (enquiry.packageSelected === "luxury")
                amount = 45000;
            else
                amount = 20000;
        }
        if (!orderId) {
            const options = {
                amount: amount * 100, // paise
                currency: "INR",
                receipt: enquiry._id.toString(),
            };
            const order = await razorpay_1.razorpay.orders.create(options);
            orderId = order.id;
            enquiry.paymentOrderId = orderId;
            enquiry.paymentAmount = amount;
            await enquiry.save();
        }
        return res.json({
            success: true,
            data: {
                orderId,
                amount: amount * 100,
                currency: "INR",
                keyId: process.env.RAZORPAY_KEY_ID || "",
            },
        });
    }
    catch (error) {
        console.error("Express Create Order Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
// POST /api/payment/verify - Verify signature
router.post("/payment/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enquiryId } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !enquiryId) {
            return res.status(400).json({ success: false, error: "Missing required verification fields." });
        }
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, error: "Razorpay secret key is not configured." });
        }
        const payload = razorpay_order_id + "|" + razorpay_payment_id;
        const generatedSignature = crypto_1.default
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");
        const isValid = generatedSignature === razorpay_signature;
        if (!isValid) {
            return res.status(400).json({ success: false, error: "Signature verification failed." });
        }
        const enquiry = await Enquiry_1.default.findById(enquiryId).populate("userId");
        if (!enquiry) {
            return res.status(404).json({ success: false, error: "Enquiry not found." });
        }
        enquiry.paymentStatus = "paid";
        await enquiry.save();
        const name = enquiry.userId ? enquiry.userId.name : enquiry.guestName;
        const email = enquiry.userId ? enquiry.userId.email : enquiry.guestEmail;
        if (email) {
            (0, email_1.sendEmail)(email, "Payment Confirmed — The Grand Lounge", (0, emailTemplates_1.getPaymentConfirmationTemplate)(name, enquiry.eventType, enquiry.preferredDate, enquiry.paymentAmount, razorpay_payment_id)).catch((err) => console.error("Payment confirmation email failed:", err));
        }
        return res.json({ success: true, message: "Payment verified successfully." });
    }
    catch (error) {
        console.error("Express Verify Signature Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
