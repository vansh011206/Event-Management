"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EnquirySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    guestName: {
        type: String,
        required: function () {
            return !this.userId;
        },
        trim: true,
    },
    guestEmail: {
        type: String,
        required: function () {
            return !this.userId;
        },
        trim: true,
        lowercase: true,
    },
    guestPhone: {
        type: String,
        required: function () {
            return !this.userId;
        },
        trim: true,
    },
    eventType: {
        type: String,
        required: true,
        enum: ["Birthday", "Corporate", "Wedding", "Social", "Product Launch", "Custom"],
    },
    packageSelected: {
        type: String,
        required: true,
        enum: ["basic", "premium", "luxury", "custom"],
    },
    expectedGuests: {
        type: Number,
        required: true,
    },
    preferredDate: {
        type: Date,
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    addOns: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "confirmed"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid",
    },
    paymentOrderId: {
        type: String,
        default: "",
    },
    paymentAmount: {
        type: Number,
        default: 0,
    },
    adminNote: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.models.Enquiry || (0, mongoose_1.model)("Enquiry", EnquirySchema);
