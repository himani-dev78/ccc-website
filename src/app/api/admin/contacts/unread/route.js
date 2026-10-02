import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Contact from "@/model/Contact";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
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

    await connectDB();
    const unreadFilter = { $or: [{ readAt: null }, { readAt: { $exists: false } }] };
    const [count, contacts] = await Promise.all([
      Contact.countDocuments(unreadFilter),
      Contact.find(unreadFilter).sort({ createdAt: -1 }).limit(8).select("name subject message createdAt").lean(),
    ]);

    return NextResponse.json({ count, contacts });
  } catch (error) {
    console.error("Get unread contacts error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}