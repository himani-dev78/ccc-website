import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Team from "@/model/Team";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 },
      );
    }

    await connectDB();

    const teamMember = await Team.findById(id)
      .select("name role intro photo social marketing advisory closing createdAt")
      .lean();

    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ teamMember });
  } catch (error) {
    console.error("Get public team member error:", error);

    return NextResponse.json(
      { message: "Unable to load this team member" },
      { status: 500 },
    );
  }
}
