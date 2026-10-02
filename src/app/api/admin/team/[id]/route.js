import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Team from "@/model/Team";

const secret = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(secret);

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

// GET one team member
export async function GET(request, { params }) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const teamMember = await Team.findById(id).lean();

    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      teamMember,
    });
  } catch (error) {
    console.error("Get team member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// UPDATE one team member
export async function PUT(request, { params }) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const teamMember = await Team.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Team member updated successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Update team member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE one team member
export async function DELETE(request, { params }) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const teamMember = await Team.findByIdAndDelete(id);

    if (!teamMember) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete team member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}