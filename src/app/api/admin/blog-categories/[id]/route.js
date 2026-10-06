import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Blog from "@/model/Blog";
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

export async function DELETE(_request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    await connectDB();
    const category = await BlogCategory.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    if (await Blog.exists({ category: category._id })) {
      return NextResponse.json(
        { message: "This category is assigned to blogs. Reassign or delete those blogs first." },
        { status: 409 },
      );
    }

    await category.deleteOne();
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete blog category error:", error);
    return NextResponse.json({ message: "Unable to delete blog category" }, { status: 500 });
  }
}
