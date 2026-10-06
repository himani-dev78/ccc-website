import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import BlogCategory from "@/model/BlogCategory";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const categories = await BlogCategory.find().sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get blog categories error:", error);
    return NextResponse.json({ message: "Unable to load blog categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) {
      return NextResponse.json({ message: "Category name is invalid" }, { status: 400 });
    }

    await connectDB();
    const existing = await BlogCategory.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json({ message: "This category already exists" }, { status: 409 });
    }

    const category = await BlogCategory.create({ name, slug });
    return NextResponse.json({ message: "Category added successfully", category }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ message: "This category already exists" }, { status: 409 });
    }

    console.error("Create blog category error:", error);
    return NextResponse.json({ message: "Unable to create blog category" }, { status: 500 });
  }
}
