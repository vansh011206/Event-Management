import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawBackendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const backendUrl = rawBackendUrl.replace(/\/$/, "");
    const res = await fetch(`${backendUrl}/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Verify Payment Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
