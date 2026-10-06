import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Blog from "@/model/Blog";
import "@/model/BlogCategory";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const blog = await Blog.findOne({ slug }).populate("category", "name slug").lean();
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Get public blog error:", error);
    return NextResponse.json({ message: "Unable to load blog" }, { status: 500 });
  }
}
