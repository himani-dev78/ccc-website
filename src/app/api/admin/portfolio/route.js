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

    const portfolio = await Portfolio.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Get portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

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
      title,
      slug,
      client,
      category,
      image,
      images,
      shortDescription,
      context,
      complexity,
      resolution,
    } = body;

    const normalizedImages = Array.isArray(images)
      ? images.filter((item) => typeof item === "string" && item.trim())
      : [];
    const legacyImage = typeof image === "string" && image.trim() ? [image.trim()] : [];
    const finalImages = [...new Set([...normalizedImages, ...legacyImage])];

    if (
      !title ||
      !slug ||
      !client ||
      !category ||
      !context ||
      !complexity ||
      !resolution
    ) {
      return NextResponse.json(
        {
          message:
            "Title, slug, client, category, context, complexity and resolution are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingPortfolio = await Portfolio.findOne({
      slug,
    });

    if (existingPortfolio) {
      return NextResponse.json(
        {
          message: "A portfolio with this slug already exists",
        },
        { status: 409 }
      );
    }

    const portfolio = await Portfolio.create({
      title,
      slug,
      client,
      category,
      image: finalImages[0] || "",
      images: finalImages,
      shortDescription,
      context,
      complexity,
      resolution,
    });

    return NextResponse.json(
      {
        message: "Portfolio created successfully",
        portfolio,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create portfolio error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}