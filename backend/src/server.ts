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

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
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

app.listen(PORT, () => {
  console.log(`Express standalone backend listening on port ${PORT}`);
});
