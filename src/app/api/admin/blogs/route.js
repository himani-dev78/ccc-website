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

export async function GET(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));

    await connectDB();

    const [blogs, total] = await Promise.all([
      Blog.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title slug category featuredImage createdAt")
        .populate("category", "name slug")
        .lean(),
      Blog.countDocuments(),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin blogs error:", error);
    return NextResponse.json({ message: "Unable to load blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const category = typeof body.category === "string" ? body.category : "";
    const featuredImage =
      typeof body.featuredImage === "string" ? body.featuredImage.trim() : "";
    const images = normalizeImages(body.images);

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

    const blog = await Blog.create({ title, slug, content, category, featuredImage, images });

    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "A blog with this heading already exists" },
        { status: 409 },
      );
    }

    console.error("Create blog error:", error);
    return NextResponse.json({ message: "Unable to create blog" }, { status: 500 });
  }
}
