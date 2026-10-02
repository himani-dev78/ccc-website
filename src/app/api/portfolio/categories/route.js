import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import PortfolioCategory from "@/model/PortfolioCategory";

export async function GET() {
  try {
    await connectDB();

    const categories = await PortfolioCategory.find()
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get public portfolio categories error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
