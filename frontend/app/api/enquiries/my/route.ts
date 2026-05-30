import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const rawBackendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const backendUrl = rawBackendUrl.replace(/\/$/, "");
    const res = await fetch(`${backendUrl}/api/enquiries/my`, {
      headers: { "x-user-id": session.user.id },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js My Enquiries Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user enquiries." },
      { status: 500 }
    );
  }
}
