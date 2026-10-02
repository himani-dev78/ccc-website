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

export async function PUT(request, { params }) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updates = {};

    for (const field of ["name", "role", "org", "text", "photo", "rating", "active", "order"]) {
      if (Object.hasOwn(body, field)) updates[field] = body[field];
    }

    if (["name", "role", "text"].some((field) =>
      Object.hasOwn(updates, field) && (typeof updates[field] !== "string" || !updates[field].trim())
    )) {
      return NextResponse.json(
        { message: "Name, role and testimonial text cannot be empty" },
        { status: 400 }
      );
    }

    if (Object.hasOwn(updates, "order")) {
      updates.order = Number(updates.order);
      if (!Number.isFinite(updates.order)) {
        return NextResponse.json({ message: "Display order must be a number" }, { status: 400 });
      }
    }

    if (Object.hasOwn(updates, "rating")) {
      updates.rating = Number(updates.rating);
      if (!Number.isInteger(updates.rating) || updates.rating < 1 || updates.rating > 5) {
        return NextResponse.json({ message: "Rating must be between 1 and 5 stars" }, { status: 400 });
      }
    }

    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Testimonial updated successfully", testimonial });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
