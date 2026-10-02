import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Portfolio from "@/model/Portfolio";

export async function GET() {
  try {
    await connectDB();

    const portfolio = await Portfolio.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Get public portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
