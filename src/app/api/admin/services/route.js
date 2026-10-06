import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Service from "@/model/Service";
import { readService, validateService } from "@/lib/serviceValidation";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Get admin services error:", error);
    return NextResponse.json({ message: "Unable to load services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const service = readService(await request.json());
    const validationError = validateService(service);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectDB();
    const created = await Service.create(service);
    return NextResponse.json(
      { message: "Service created successfully", service: created },
      { status: 201 },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ message: "A service with this URL already exists" }, { status: 409 });
    }
    console.error("Create service error:", error);
    return NextResponse.json({ message: "Unable to create service" }, { status: 500 });
  }
}
