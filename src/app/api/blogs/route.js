import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Blog from "@/model/Blog";
import "@/model/BlogCategory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .sort({ createdAt: -1, _id: -1 })
      .select("title slug category featuredImage content createdAt")
      .populate("category", "name slug")
      .lean();

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Get public blogs error:", error);
    return NextResponse.json({ message: "Unable to load blogs" }, { status: 500 });
  }
}
