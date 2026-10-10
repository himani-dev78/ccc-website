import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/model/SiteSettings";

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
