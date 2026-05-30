"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Enquiry_1 = __importDefault(require("../models/Enquiry"));
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../lib/email");
const emailTemplates_1 = require("../lib/emailTemplates");
const razorpay_1 = require("../lib/razorpay");
const router = (0, express_1.Router)();
// POST /api/enquiries - Submit enquiry (Guest or User)
router.post("/enquiries", auth_1.verifyUserHeader, async (req, res) => {
    try {
        const { eventType, packageSelected, expectedGuests, preferredDate, message, addOns, guestName, guestEmail, guestPhone, } = req.body;
        if (!eventType || !packageSelected || !expectedGuests || !preferredDate) {
            return res.status(400).json({ success: false, error: "Required fields are missing." });
        }
        const userId = req.user?.id;
        let finalName = "";
        let finalEmail = "";
        if (userId) {
            const user = await User_1.default.findById(userId);
            finalName = user?.name || "Valued Member";
            finalEmail = user?.email || "";
        }
        else {
            if (!guestName || !guestEmail || !guestPhone) {
                return res.status(400).json({ success: false, error: "Guest details are required." });
            }
            finalName = guestName;
            finalEmail = guestEmail;
        }
        const enquiry = await Enquiry_1.default.create({
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
            (0, email_1.sendEmail)(finalEmail, "We've Received Your Enquiry — The Grand Lounge", (0, emailTemplates_1.getEnquiryReceivedTemplate)(finalName, eventType, preferredDate, Number(expectedGuests), packageSelected)).catch((err) => console.error("Async received email error:", err));
        }
        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: { id: enquiry._id },
        });
    }
    catch (error) {
        console.error("Enquiry Submit Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/enquiries/my - Get user's active enquiries
router.get("/enquiries/my", auth_1.verifyUserHeader, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized. User ID is missing." });
        }
        const enquiries = await Enquiry_1.default.find({ userId }).sort({ createdAt: -1 });
        return res.json({ success: true, data: enquiries });
    }
    catch (error) {
        console.error("Fetch User Enquiries Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/admin/enquiries - Admin view enquiries list (with search, filter, pagination)
router.get("/admin/enquiries", auth_1.verifyAdmin, async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";
        const eventType = req.query.eventType || "";
        const startDate = req.query.startDate || "";
        const endDate = req.query.endDate || "";
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);
        const skip = (page - 1) * limit;
        const query = {};
        if (status && status !== "All") {
            query.status = status.toString().toLowerCase();
        }
        if (eventType && eventType !== "All") {
            query.eventType = eventType;
        }
        if (startDate || endDate) {
            query.preferredDate = {};
            if (startDate)
                query.preferredDate.$gte = new Date(startDate);
            if (endDate)
                query.preferredDate.$lte = new Date(endDate);
        }
        if (search) {
            const matchedUsers = await User_1.default.find({
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
        const totalEnquiries = await Enquiry_1.default.countDocuments(query);
        const enquiries = await Enquiry_1.default.find(query)
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
    }
    catch (error) {
        console.error("Admin Fetch Enquiries Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/admin/enquiries/:id - Admin view single details
router.get("/admin/enquiries/:id", auth_1.verifyAdmin, async (req, res) => {
    try {
        const enquiry = await Enquiry_1.default.findById(req.params.id).populate("userId", "name email phone");
        if (!enquiry) {
            return res.status(404).json({ success: false, error: "Enquiry not found." });
        }
        return res.json({ success: true, data: enquiry });
    }
    catch (error) {
        console.error("Admin GET Enquiry Detail Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
// PATCH /api/admin/enquiries/:id - Admin update status / note
router.patch("/admin/enquiries/:id", auth_1.verifyAdmin, async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const enquiry = await Enquiry_1.default.findById(req.params.id).populate("userId");
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
                let amountInRupees = 20000;
                if (enquiry.packageSelected === "basic")
                    amountInRupees = 15000;
                else if (enquiry.packageSelected === "premium")
                    amountInRupees = 30000;
                else if (enquiry.packageSelected === "luxury")
                    amountInRupees = 45000;
                const amountInPaise = amountInRupees * 100;
                const options = {
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: enquiry._id.toString(),
                };
                const order = await razorpay_1.razorpay.orders.create(options);
                enquiry.paymentOrderId = order.id;
                enquiry.paymentAmount = amountInRupees;
                await enquiry.save();
                const redirectUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/my-enquiries`;
                (0, email_1.sendEmail)(email, "Your Event Booking is Confirmed — The Grand Lounge", (0, emailTemplates_1.getApprovalTemplate)(name, enquiry.eventType, enquiry.preferredDate, enquiry.expectedGuests, enquiry.packageSelected, amountInRupees, redirectUrl)).catch((err) => console.error("Approval email dispatch failed:", err));
            }
            else if (status === "rejected") {
                enquiry.status = "rejected";
                await enquiry.save();
                (0, email_1.sendEmail)(email, "Update on Your Enquiry — The Grand Lounge", (0, emailTemplates_1.getRejectionTemplate)(name, enquiry.eventType, enquiry.preferredDate, enquiry.adminNote, `${process.env.NEXT_URL || "http://localhost:3000"}/contact`)).catch((err) => console.error("Rejection email dispatch failed:", err));
            }
            else {
                await enquiry.save();
            }
        }
        else {
            await enquiry.save();
        }
        return res.json({ success: true, message: "Enquiry updated successfully.", data: enquiry });
    }
    catch (error) {
        console.error("Admin PATCH Enquiry Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
