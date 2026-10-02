import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Portfolio from "@/model/Portfolio";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: "Portfolio slug is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.findOne({ slug }).lean();

    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Get public portfolio by slug error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
