import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Testimonial from "@/model/Testimonial";

export async function GET() {
  try {
    await connectDB();

    const testimonials = await Testimonial.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Get testimonials error:", error);

    return NextResponse.json(
      { message: "Something went wrong", testimonials: [] },
      { status: 500 }
    );
  }
}
