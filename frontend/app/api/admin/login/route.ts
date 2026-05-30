import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const nextResponse = NextResponse.json(data, { status: res.status });

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: any) {
    console.error("Next.js Admin Login Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to login admin." },
      { status: 500 }
    );
  }
}
