import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const adminToken = cookies().get("admin_token")?.value;
    const { searchParams } = new URL(req.url);

    const res = await fetch(`http://localhost:5000/api/admin/enquiries?${searchParams.toString()}`, {
      headers: adminToken ? { Cookie: `admin_token=${adminToken}` } : {},
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Admin Enquiries Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch enquiries." },
      { status: 500 }
    );
  }
}
