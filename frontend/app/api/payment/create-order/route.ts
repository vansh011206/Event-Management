import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const rawBackendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const backendUrl = rawBackendUrl.replace(/\/$/, "");
    const res = await fetch(`${backendUrl}/api/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Create Payment Order Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order." },
      { status: 500 }
    );
  }
}
