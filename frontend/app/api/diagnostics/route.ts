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
    importUser: "Not attempted",
    importAuth: "Not attempted",
  };

  // Test DB connection
  if (process.env.MONGODB_URI) {
    try {
      if (mongoose.connection.readyState === 1) {
        diagnostics.databaseConnection = "Already connected";
      } else {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
        });
        diagnostics.databaseConnection = "Connected successfully during diagnostics";
      }
    } catch (dbError: any) {
      diagnostics.databaseConnection = `Failed: ${dbError.message}`;
    }
  } else {
    diagnostics.databaseConnection = "Failed: MONGODB_URI env variable is missing";
  }

  // Test User Model Import
  try {
    const UserModule = await import("@/lib/models/User");
    diagnostics.importUser = "Success";
  } catch (userImportError: any) {
    diagnostics.importUser = `Failed: ${userImportError.message || userImportError.toString()}`;
  }

  // Test NextAuth Import
  try {
    const AuthModule = await import("@/lib/auth");
    diagnostics.importAuth = "Success";
  } catch (authImportError: any) {
    diagnostics.importAuth = `Failed: ${authImportError.message || authImportError.toString()}`;
  }

  return NextResponse.json(diagnostics);
}
