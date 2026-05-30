import mongoose from "mongoose";

export const connectDB = async () => {
  // Check readyState: 1 is connected, 2 is connecting
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const connStr = process.env.MONGODB_URI;
  if (!connStr) {
    throw new Error("MONGODB_URI environment variable is not defined in env settings.");
  }

  try {
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Database connection failure:", error);
    throw error;
  }
};
