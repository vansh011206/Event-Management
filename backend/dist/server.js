"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const payments_1 = __importDefault(require("./routes/payments"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
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
app.listen(PORT, () => {
    console.log(`Express standalone backend listening on port ${PORT}`);
});
