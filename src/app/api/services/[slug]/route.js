import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Service from "@/model/Service";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const service = await Service.findOne({ slug }).lean();
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Get public service error:", error);
    return NextResponse.json(
      { message: "Unable to load service" },
      { status: 500 },
    );
  }
}
