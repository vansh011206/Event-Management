import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in environment variables.");
  process.exit(1);
}

// Define Admin Schema directly to keep seed script independent
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);

    console.log("Checking for existing admin accounts...");
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL!.toLowerCase() });

    if (existingAdmin) {
      console.log(`Admin account with email ${ADMIN_EMAIL} already exists. Updating password...`);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD!, 12);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin password updated successfully.");
    } else {
      console.log(`Creating new admin account with email ${ADMIN_EMAIL}...`);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD!, 12);
      await Admin.create({
        name: "Arjun Mehta",
        email: ADMIN_EMAIL!.toLowerCase(),
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin account created successfully.");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAdmin();
