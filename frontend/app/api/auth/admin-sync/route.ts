import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as jose from "jose";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const user = session.user as any;

    if (user.role === "admin") {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret"
      );

      const token = await new jose.SignJWT({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .setIssuedAt()
        .sign(secret);

      const response = NextResponse.json({
        success: true,
        isAdmin: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "admin",
        },
      });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    // If user is not an admin, ensure no admin_token is left
    const response = NextResponse.json({
      success: true,
      isAdmin: false,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });

    response.cookies.delete("admin_token");
    return response;
  } catch (error: any) {
    console.error("Admin Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync admin token." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Admin token removed." });
  response.cookies.delete("admin_token");
  return response;
}
