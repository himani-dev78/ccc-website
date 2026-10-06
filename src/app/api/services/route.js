import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Service from "@/model/Service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find()
      .select("title slug heroImage intro audience outcomes sections createdAt")
      .sort({ title: 1 })
      .lean();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Get public services error:", error);
    return NextResponse.json(
      { message: "Unable to load services" },
      { status: 500 },
    );
  }
}
