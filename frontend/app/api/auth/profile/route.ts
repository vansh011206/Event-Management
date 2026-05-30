import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Profile GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name: name.trim(), phone: cleanedPhone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error("Profile PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
