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

// GET all team members
export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const team = await Team.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      team,
    });
  } catch (error) {
    console.error("Get team error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST new team member
export async function POST(request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      role,
      intro,
      photo,
      social,
      marketing,
      advisory,
      closing,
    } = body;

    if (!name || !role || !intro) {
      return NextResponse.json(
        {
          message: "Name, role and intro are required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const teamMember = await Team.create({
      name,
      role,
      intro,
      photo,
      social,
      marketing,
      advisory,
      closing,
    });

    return NextResponse.json(
      {
        message: "Team member created successfully",
        teamMember,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create team member error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}