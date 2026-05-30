import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all /admin/ paths except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret");
      await jose.jwtVerify(adminToken, secret);
    } catch (error) {
      console.error("Middleware Verification Error:", error);
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
