import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      throw new Error("MONGODB_URI environment variable is not defined in env settings.");
    }
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Database connection failure:", error);
    process.exit(1);
  }
};
