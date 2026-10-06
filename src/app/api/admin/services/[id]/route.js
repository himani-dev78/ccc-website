import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import { readService, validateService } from "@/lib/serviceValidation";
import Service from "@/model/Service";

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

async function getServiceId(context) {
  const { id } = await context.params;
  return mongoose.isValidObjectId(id) ? id : null;
}

export async function GET(_request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getServiceId(context);
    if (!id) return NextResponse.json({ message: "Service not found" }, { status: 404 });

    await connectDB();
    const service = await Service.findById(id).lean();
    if (!service) return NextResponse.json({ message: "Service not found" }, { status: 404 });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Get admin service error:", error);
    return NextResponse.json({ message: "Unable to load service" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getServiceId(context);
    if (!id) return NextResponse.json({ message: "Service not found" }, { status: 404 });

    const serviceData = readService(await request.json());
    const validationError = validateService(serviceData);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectDB();
    const service = await Service.findByIdAndUpdate(id, serviceData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!service) return NextResponse.json({ message: "Service not found" }, { status: 404 });
    return NextResponse.json({ message: "Service updated successfully", service });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ message: "A service with this URL already exists" }, { status: 409 });
    }
    console.error("Update service error:", error);
    return NextResponse.json({ message: "Unable to update service" }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await getServiceId(context);
    if (!id) return NextResponse.json({ message: "Service not found" }, { status: 404 });

    await connectDB();
    const service = await Service.findByIdAndDelete(id);
    if (!service) return NextResponse.json({ message: "Service not found" }, { status: 404 });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ message: "Unable to delete service" }, { status: 500 });
  }
}
