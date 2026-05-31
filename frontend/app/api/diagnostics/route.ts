import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const diagnostics: any = {
    env: {
      MONGODB_URI_exists: !!process.env.MONGODB_URI,
      MONGODB_URI_starts_with: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : null,
      AUTH_SECRET_exists: !!process.env.AUTH_SECRET,
      NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      BACKEND_API_URL: process.env.BACKEND_API_URL || null,
      NODE_ENV: process.env.NODE_ENV || null,
    },
    databaseConnection: "Not attempted",
  };

  if (process.env.MONGODB_URI) {
    try {
      if (mongoose.connection.readyState === 1) {
        diagnostics.databaseConnection = "Already connected";
      } else {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of waiting forever
        });
        diagnostics.databaseConnection = "Connected successfully during diagnostics";
      }
    } catch (dbError: any) {
      diagnostics.databaseConnection = `Failed: ${dbError.message}`;
    }
  } else {
    diagnostics.databaseConnection = "Failed: MONGODB_URI env variable is missing";
  }

  return NextResponse.json(diagnostics);
}
