import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Testimonial from "@/model/Testimonial";

const secret = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(secret);

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Get admin testimonials error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, org = "", text, photo = "", rating = 5, active = true, order = 0 } = body;

    if (![name, role, text].every((value) => typeof value === "string" && value.trim())) {
      return NextResponse.json(
        { message: "Name, role and testimonial text are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5 stars" }, { status: 400 });
    }

    await connectDB();

    const testimonial = await Testimonial.create({
      name,
      role,
      org,
      text,
      photo,
      rating: Number(rating),
      active,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    return NextResponse.json(
      { message: "Testimonial created successfully", testimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
