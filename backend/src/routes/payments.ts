import { Router } from "express";
import { verifyUserHeader, AuthenticatedRequest } from "../middleware/auth";
import Enquiry from "../models/Enquiry";
import { sendEmail } from "../lib/email";
import { getPaymentConfirmationTemplate } from "../lib/emailTemplates";

const router = Router();

// POST /api/payment/create-order - Create a mock payment order
router.post("/payment/create-order", verifyUserHeader, async (req: AuthenticatedRequest, res) => {
  try {
    const { enquiryId } = req.body;
    const userId = req.user?.id;

    if (!enquiryId) {
      return res.status(400).json({ success: false, error: "Enquiry ID is required." });
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized. User ID is missing." });
    }

    const enquiry = await Enquiry.findOne({ _id: enquiryId, userId });
    if (!enquiry) {
      return res.status(404).json({ success: false, error: "Enquiry not found or unauthorized access." });
    }

    if (enquiry.status !== "approved") {
      return res.status(400).json({ success: false, error: "Enquiry is not approved yet." });
    }

    if (enquiry.paymentStatus === "paid") {
      return res.status(400).json({ success: false, error: "Enquiry has already been paid." });
    }

    let amount = enquiry.paymentAmount;
    if (!amount) {
      if (enquiry.packageSelected === "basic") amount = 15000;
      else if (enquiry.packageSelected === "premium") amount = 30000;
      else if (enquiry.packageSelected === "luxury") amount = 45000;
      else amount = 20000;
    }

    const orderId = enquiry.paymentOrderId || `mock_order_${enquiry._id}_${Date.now()}`;

    if (!enquiry.paymentOrderId) {
      enquiry.paymentOrderId = orderId;
      enquiry.paymentAmount = amount;
      await enquiry.save();
    }

    return res.json({
      success: true,
      data: {
        orderId,
        amount,
        currency: "INR",
      },
    });
  } catch (error: any) {
    console.error("Express Create Order Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/payment/verify - Mock verify and mark as paid
router.post("/payment/verify", async (req, res) => {
  try {
    const { enquiryId, paymentMethod } = req.body;

    if (!enquiryId) {
      return res.status(400).json({ success: false, error: "Enquiry ID is required." });
    }

    const enquiry = await Enquiry.findById(enquiryId).populate("userId");
    if (!enquiry) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }

    if (enquiry.paymentStatus === "paid") {
      return res.status(400).json({ success: false, error: "Already paid." });
    }

    // Mark as paid (mock — no real transaction)
    enquiry.paymentStatus = "paid";
    await enquiry.save();

    const name = enquiry.userId ? enquiry.userId.name : enquiry.guestName;
    const email = enquiry.userId ? enquiry.userId.email : enquiry.guestEmail;
    const mockPaymentId = `mock_pay_${Date.now()}`;

    if (email) {
      sendEmail(
        email,
        "Payment Confirmed — The Grand Lounge",
        getPaymentConfirmationTemplate(
          name,
          enquiry.eventType,
          enquiry.preferredDate,
          enquiry.paymentAmount,
          mockPaymentId
        )
      ).catch((err) => console.error("Payment confirmation email failed:", err));
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      data: { paymentId: mockPaymentId },
    });
  } catch (error: any) {
    console.error("Express Verify Payment Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
