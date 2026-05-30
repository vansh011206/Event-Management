import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  // Check readyState
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const connStr = process.env.MONGODB_URI;
  if (!connStr) {
    throw new Error("MONGODB_URI environment variable is not defined in env settings.");
  }

  try {
    // Enable serverless optimization options if needed
    await mongoose.connect(connStr);
    isConnected = true;
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Database connection failure:", error);
    throw error;
  }
};
