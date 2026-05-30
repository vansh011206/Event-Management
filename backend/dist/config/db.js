"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        return;
    }
    // Check readyState
    if (mongoose_1.default.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
        throw new Error("MONGODB_URI environment variable is not defined in env settings.");
    }
    try {
        // Enable serverless optimization options if needed
        await mongoose_1.default.connect(connStr);
        isConnected = true;
        console.log("Connected to MongoDB successfully.");
    }
    catch (error) {
        console.error("Database connection failure:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
