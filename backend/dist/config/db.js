"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI;
        if (!connStr) {
            throw new Error("MONGODB_URI environment variable is not defined in env settings.");
        }
        await mongoose_1.default.connect(connStr);
        console.log("Connected to MongoDB successfully.");
    }
    catch (error) {
        console.error("Database connection failure:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
