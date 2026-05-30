import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:5000/api/enquiries/confirmed", {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Confirmed Enquiries Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch confirmed slots." },
      { status: 500 }
    );
  }
}
