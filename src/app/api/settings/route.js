import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/model/SiteSettings";

const defaultSettings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  newsletterTitle: "Presentation Science",
  phone: "+91 99717 64792",
  email: "clientcenteredconsulting@gmail.com",
  address: "India",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
};

export async function GET() {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne().lean();

    return NextResponse.json({
      settings: settings || defaultSettings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    return NextResponse.json(
      { message: "Something went wrong", settings: defaultSettings },
      { status: 500 }
    );
  }
}
