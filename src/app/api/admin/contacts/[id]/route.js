import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Contact from "@/model/Contact";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function PATCH(_request, { params }) {
  try {
    const token = (await cookies()).get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(token, secretKey);
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { readAt: new Date() } },
      { new: true }
    ).select("_id readAt");

    if (!contact) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Mark contact as read error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}