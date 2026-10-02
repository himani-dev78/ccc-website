import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Contact from "@/model/Contact";
import Portfolio from "@/model/Portfolio";
import Team from "@/model/Team";
import Testimonial from "@/model/Testimonial";

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

    const [team, portfolio, contacts, testimonials, recentContacts] = await Promise.all([
      Team.countDocuments(),
      Portfolio.countDocuments(),
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5).select("name subject message createdAt").lean(),
    ]);

    return NextResponse.json({
      overview: { team, portfolio, contacts, testimonials, recentContacts },
    });
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}