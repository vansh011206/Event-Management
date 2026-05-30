import mongoose from "mongoose";
import bcrypt from "bcrypt";
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

// Define Admin Schema directly
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function clearDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);

    // Delete all collections
    console.log("Deleting enquiries...");
    await mongoose.connection.collection("enquiries").deleteMany({});

    console.log("Deleting users...");
    await mongoose.connection.collection("users").deleteMany({});

    console.log("Deleting admins...");
    await mongoose.connection.collection("admins").deleteMany({});

    console.log("Database cleared successfully. Now re-seeding admin account...");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD!, 12);
    await Admin.create({
      name: "Arjun Mehta",
      email: ADMIN_EMAIL!.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin account seeded successfully.");

  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

clearDatabase();
