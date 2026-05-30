"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const payments_1 = __importDefault(require("./routes/payments"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Ensure Database connection for every request
app.use(async (req, res, next) => {
    try {
        await (0, db_1.connectDB)();
        next();
    }
    catch (err) {
        console.error("Database connection failure on request:", err);
        res.status(500).json({
            success: false,
            error: "Database connection failed. Please ensure MongoDB Atlas IP Whitelist allows Vercel serverless connections.",
        });
    }
});
// Middlewares
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
if (process.env.CLIENT_URL) {
    const urls = process.env.CLIENT_URL.split(",").map((url) => url.trim());
    allowedOrigins.push(...urls);
}
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Health Check
app.get("/", (req, res) => {
    res.json({ success: true, message: "The Grand Lounge Standalone API is running." });
});
// API Routes
app.use("/api", auth_1.default);
app.use("/api", enquiries_1.default);
app.use("/api", payments_1.default);
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Express standalone backend listening on port ${PORT}`);
    });
}
exports.default = app;
