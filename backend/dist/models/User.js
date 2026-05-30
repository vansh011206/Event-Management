"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.models.User || (0, mongoose_1.model)("User", UserSchema);
