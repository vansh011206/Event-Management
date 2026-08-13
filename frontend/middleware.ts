import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If someone attempts to access /admin/login directly, redirect to standard /login
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Intercept all /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", "/admin/dashboard");
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret"
      );
      const { payload } = await jose.jwtVerify(adminToken, secret);

      if (payload.role !== "admin") {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", "/admin/dashboard");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("admin_token");
        return response;
      }
    } catch (error) {
      console.error("Middleware Admin Verification Error:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", "/admin/dashboard");
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

