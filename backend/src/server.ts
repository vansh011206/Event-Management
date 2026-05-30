import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import enquiryRoutes from "./routes/enquiries";
import paymentRoutes from "./routes/payments";

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure Database connection for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
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

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.json({ success: true, message: "The Grand Lounge Standalone API is running." });
});

// API Routes
app.use("/api", authRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", paymentRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Express standalone backend listening on port ${PORT}`);
  });
}

export default app;
