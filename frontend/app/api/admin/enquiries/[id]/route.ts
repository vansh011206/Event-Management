import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const adminToken = cookies().get("admin_token")?.value;

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/admin/enquiries/${params.id}`, {
      headers: adminToken ? { Cookie: `admin_token=${adminToken}` } : {},
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Admin Enquiry GET Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch enquiry details." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const adminToken = cookies().get("admin_token")?.value;
    const body = await req.json();

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/admin/enquiries/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Cookie: `admin_token=${adminToken}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Next.js Admin Enquiry PATCH Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update enquiry." },
      { status: 500 }
    );
  }
}
