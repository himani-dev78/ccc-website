import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Contact from "@/model/Contact";

const secret = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(secret);

export async function GET() {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Verify token
    try {
      await jwtVerify(token, secretKey);
    } catch {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
        },
        {
          status: 401,
        }
      );
    }

    // Connect to database
    await connectDB();

    // Get all contact messages
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH() {
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
    const result = await Contact.updateMany(
      { $or: [{ readAt: null }, { readAt: { $exists: false } }] },
      { $set: { readAt: new Date() } }
    );

    return NextResponse.json({ markedRead: result.modifiedCount });
  } catch (error) {
    console.error("Mark inbox messages as read error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}