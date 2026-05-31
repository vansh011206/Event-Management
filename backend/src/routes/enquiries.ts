import { Router } from "express";
import { verifyAdmin, verifyUserHeader, AuthenticatedRequest } from "../middleware/auth";
import Enquiry from "../models/Enquiry";
import User from "../models/User";
import { sendEmail } from "../lib/email";
import { getEnquiryReceivedTemplate, getApprovalTemplate, getRejectionTemplate } from "../lib/emailTemplates";

const router = Router();

// POST /api/enquiries - Submit enquiry (Guest or User)
router.post("/enquiries", verifyUserHeader, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      eventType,
      packageSelected,
      expectedGuests,
      preferredDate,
      message,
      addOns,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    if (!eventType || !packageSelected || !expectedGuests || !preferredDate) {
      return res.status(400).json({ success: false, error: "Required fields are missing." });
    }

    const userId = req.user?.id;
    let finalName = "";
    let finalEmail = "";

    if (userId) {
      const user = await User.findById(userId);
      finalName = user?.name || "Valued Member";
      finalEmail = user?.email || "";
    } else {
      if (!guestName || !guestEmail || !guestPhone) {
        return res.status(400).json({ success: false, error: "Guest details are required." });
      }
      finalName = guestName;
      finalEmail = guestEmail;
    }

    const enquiry = await Enquiry.create({
      userId: userId || undefined,
      guestName: userId ? undefined : guestName,
      guestEmail: userId ? undefined : guestEmail,
      guestPhone: userId ? undefined : guestPhone,
      eventType,
      packageSelected,
      expectedGuests: Number(expectedGuests),
      preferredDate: new Date(preferredDate),
      message: message || "",
      addOns: addOns || [],
      status: "pending",
      paymentStatus: "unpaid",
    });

    if (finalEmail) {
      sendEmail(
        finalEmail,
        "We've Received Your Enquiry — The Grand Lounge",
        getEnquiryReceivedTemplate(
          finalName,
          eventType,
          preferredDate,
          Number(expectedGuests),
          packageSelected
        )
      ).catch((err) => console.error("Async received email error:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: { id: enquiry._id },
    });
  } catch (error: any) {
    console.error("Enquiry Submit Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/enquiries/my - Get user's active enquiries
router.get("/enquiries/my", verifyUserHeader, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized. User ID is missing." });
    }

    const enquiries = await Enquiry.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: enquiries });
  } catch (error: any) {
    console.error("Fetch User Enquiries Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/enquiries/confirmed - Get all confirmed bookings (for booking slot verification)
router.get("/enquiries/confirmed", async (req, res) => {
  try {
    const confirmedEnquiries = await Enquiry.find({ status: "confirmed" })
      .select("preferredDate eventType addOns");
    return res.json({ success: true, data: confirmedEnquiries });
  } catch (error: any) {
    console.error("Fetch Confirmed Enquiries Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/enquiries - Admin view enquiries list (with search, filter, pagination)
router.get("/admin/enquiries", verifyAdmin, async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const eventType = req.query.eventType || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const page = parseInt(req.query.page as string || "1", 10);
    const limit = parseInt(req.query.limit as string || "10", 10);
    const skip = (page - 1) * limit;

    const query: any = {};

    if (status && status !== "All") {
      query.status = status.toString().toLowerCase();
    }

    if (eventType && eventType !== "All") {
      query.eventType = eventType;
    }

    if (startDate || endDate) {
      query.preferredDate = {};
      if (startDate) query.preferredDate.$gte = new Date(startDate as string);
      if (endDate) query.preferredDate.$lte = new Date(endDate as string);
    }

    if (search) {
      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      }).select("_id");
      const userIds = matchedUsers.map(u => u._id.toString());

      query.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } }
      ];
    }

    const totalEnquiries = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total: totalEnquiries,
          pages: Math.ceil(totalEnquiries / limit),
          currentPage: page,
          limit,
        }
      }
    });
  } catch (error: any) {
    console.error("Admin Fetch Enquiries Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/enquiries/:id - Admin view single details
router.get("/admin/enquiries/:id", verifyAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate("userId", "name email phone");
    if (!enquiry) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }
    return res.json({ success: true, data: enquiry });
  } catch (error: any) {
    console.error("Admin GET Enquiry Detail Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/admin/enquiries/:id - Admin update status / note
router.patch("/admin/enquiries/:id", verifyAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const enquiry = await Enquiry.findById(req.params.id).populate("userId");

    if (!enquiry) {
      return res.status(404).json({ success: false, error: "Enquiry not found." });
    }

    const name = enquiry.userId ? enquiry.userId.name : enquiry.guestName;
    const email = enquiry.userId ? enquiry.userId.email : enquiry.guestEmail;

    if (adminNote !== undefined) {
      enquiry.adminNote = adminNote;
    }

    if (status) {
      if (status === "approved") {
        enquiry.status = "approved";

        let pricePerPerson = 3999;
        if (enquiry.packageSelected === "standard") pricePerPerson = 7499;
        else if (enquiry.packageSelected === "premium") pricePerPerson = 14999;
        else if (enquiry.packageSelected === "royal-elite") pricePerPerson = 24999;

        const isFullDay = enquiry.addOns && enquiry.addOns.includes("Full Day");
        if (isFullDay) {
          pricePerPerson += 699;
        }

        const guests = enquiry.expectedGuests || 20;
        const subtotal = pricePerPerson * guests;

        let discountPct = 0;
        if (guests >= 350) discountPct = 20;
        else if (guests >= 200) discountPct = 15;
        else if (guests >= 100) discountPct = 10;
        else if (guests >= 50) discountPct = 5;

        const discountAmount = Math.round(subtotal * (discountPct / 100));
        const amountInRupees = subtotal - discountAmount;

        // Mock order ID (no real payment gateway)
        enquiry.paymentOrderId = `mock_order_${enquiry._id.toString()}_${Date.now()}`;
        enquiry.paymentAmount = amountInRupees;

        await enquiry.save();

        const redirectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/my-enquiries`;
        sendEmail(
          email,
          "Your Event Booking is Confirmed — The Grand Lounge",
          getApprovalTemplate(
            name,
            enquiry.eventType,
            enquiry.preferredDate,
            enquiry.expectedGuests,
            enquiry.packageSelected,
            amountInRupees,
            redirectUrl
          )
        ).catch((err) => console.error("Approval email dispatch failed:", err));

      } else if (status === "confirmed") {
        enquiry.status = "confirmed";
        await enquiry.save();

        sendEmail(
          email,
          "Your Celebration Slot is Formally Booked! — The Grand Lounge",
          `
            <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #F8F5F0; padding: 40px 20px; text-align: center; color: #1F1F1F;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E8E2D9; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-weight: 600; text-align: center; color: #C5A880; font-size: 24px; letter-spacing: 1px; margin-bottom: 30px;">THE GRAND LOUNGE</h2>
                <div style="text-align: center; margin-bottom: 25px;">
                  <span style="font-size: 40px; color: #C5A880; line-height: 1;">★</span>
                  <h3 style="font-size: 18px; margin-top: 10px; color: #C5A880;">Slot Fully Reserved</h3>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
                <p style="font-size: 14px; line-height: 1.6; color: #6B6B6B;">Your booking for the <strong>${enquiry.eventType}</strong> on <strong>${new Date(enquiry.preferredDate).toLocaleDateString()}</strong> has been finalized by our Curation board. Your slot is now marked as <strong>Fully Booked and Locked</strong> in our master calendar.</p>
                <p style="font-size: 14px; text-align: center; font-weight: bold; margin: 30px 0; color: #C5A880;">We await you with pleasure.</p>
                <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #E8E2D9; padding-top: 20px;">Warm regards,<br><strong style="color: #1F1F1F;">Vanshaj Sharma</strong><br><span style="font-size: 12px; color: #C5A880;">General Manager, The Grand Lounge</span></p>
              </div>
            </div>
          `
        ).catch((err) => console.error("Confirmed email dispatch failed:", err));
      } else if (status === "rejected") {
        enquiry.status = "rejected";
        await enquiry.save();

        sendEmail(
          email,
          "Update on Your Enquiry — The Grand Lounge",
          getRejectionTemplate(
            name,
            enquiry.eventType,
            enquiry.preferredDate,
            enquiry.adminNote,
            `${process.env.NEXT_URL || "http://localhost:3000"}/contact`
          )
        ).catch((err) => console.error("Rejection email dispatch failed:", err));
      } else {
        await enquiry.save();
      }
    } else {
      await enquiry.save();
    }

    return res.json({ success: true, message: "Enquiry updated successfully.", data: enquiry });
  } catch (error: any) {
    console.error("Admin PATCH Enquiry Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
