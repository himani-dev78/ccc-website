import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/model/SiteSettings";

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

const defaultSettings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  newsletterTitle: "Presentation Science",
  phone: "(+91) 997-176-4792",
  email: "greg@cccforleaders.com",
  address: "Gurgaon, NCR, Mumbai, Cape Town - S.A.",
  facebook: "",
  linkedin: "https://www.linkedin.com/in/thisisgregchapman/",
  instagram: "",
  youtube: "",
};

export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const settings = await SiteSettings.findOne().lean();

    return NextResponse.json({ settings: settings || defaultSettings });
  } catch (error) {
    console.error("Get admin settings error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { ...defaultSettings, ...body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      message: "Settings saved successfully",
      settings,
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
