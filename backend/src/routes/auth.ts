import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Admin from "../models/Admin";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters long." });
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      return res.status(400).json({ success: false, error: "Phone number must be exactly 10 digits." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase(),
      phone: cleanedPhone,
      password: hashedPassword,
    });

    return res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (error: any) {
    console.error("Express Register Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to register." });
  }
});

// POST /api/admin/login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid admin credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid admin credentials." });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), name: admin.name, email: admin.email, role: "admin" },
      process.env.NEXTAUTH_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1000,
    });

    return res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error: any) {
    console.error("Express Admin Login Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to login." });
  }
});

export default router;
