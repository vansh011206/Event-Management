"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserHeader = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdmin = (req, res, next) => {
    const adminToken = req.cookies?.admin_token;
    if (!adminToken) {
        return res.status(401).json({ success: false, error: "Unauthorized. Admin token missing." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(adminToken, process.env.NEXTAUTH_SECRET || "fallback_secret");
        req.admin = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, error: "Unauthorized. Invalid admin token." });
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyUserHeader = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (userId) {
        req.user = {
            id: String(userId),
        };
    }
    next();
};
exports.verifyUserHeader = verifyUserHeader;
