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

function normalizeImages(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter((image) => typeof image === "string").map((image) => image.trim()).filter(Boolean))]
    : [];
}

async function getId(context) {
  const { id } = await context.params;
  return mongoose.isValidObjectId(id) ? id : null;
}

export async function GET(_request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getId(context);
    if (!id) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    await connectDB();
    const blog = await Blog.findById(id).populate("category", "name slug").lean();
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Get admin blog error:", error);
    return NextResponse.json({ message: "Unable to load blog" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getId(context);
    if (!id) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const category = typeof body.category === "string" ? body.category : "";
    const featuredImage =
      typeof body.featuredImage === "string" ? body.featuredImage.trim() : "";

    if (!title || !slug || !content || !category || !featuredImage) {
      return NextResponse.json(
        { message: "Heading, content, category and a featured image are required" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ message: "The heading must produce a valid URL slug" }, { status: 400 });
    }

    await connectDB();
    if (
      !mongoose.isValidObjectId(category) ||
      !(await BlogCategory.exists({ _id: category }))
    ) {
      return NextResponse.json({ message: "Select a valid blog category" }, { status: 400 });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, slug, content, category, featuredImage, images: normalizeImages(body.images) },
      { new: true, runValidators: true },
    )
      .populate("category", "name slug")
      .lean();

    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    return NextResponse.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "A blog with this heading already exists" },
        { status: 409 },
      );
    }

    console.error("Update blog error:", error);
    return NextResponse.json({ message: "Unable to update blog" }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getId(context);
    if (!id) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    await connectDB();
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json({ message: "Unable to delete blog" }, { status: 500 });
  }
}
