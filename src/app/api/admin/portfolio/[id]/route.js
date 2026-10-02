import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import Portfolio from "@/model/Portfolio";

const secret = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(secret);

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

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

    if (!id) {
      return NextResponse.json(
        { message: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.findById(id).lean();

    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { portfolio },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

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
    const { image, images, ...rest } = body;

    const normalizedImages = Array.isArray(images)
      ? images.filter((item) => typeof item === "string" && item.trim())
      : [];
    const legacyImage = typeof image === "string" && image.trim() ? [image.trim()] : [];
    const finalImages = [...new Set([...normalizedImages, ...legacyImage])];

    await connectDB();

    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      {
        ...rest,
        image: finalImages[0] || "",
        images: finalImages,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Update portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

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

    const portfolio = await Portfolio.findByIdAndDelete(id);

    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

