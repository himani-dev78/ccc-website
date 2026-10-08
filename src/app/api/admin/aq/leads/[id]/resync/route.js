import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { pushToBrevo } from "@/lib/aqEmail";
import AQSettings, { AQSubmission } from "@/model/AQSettings";

// Spec §9.6 — manual "resync" for leads whose Brevo push failed.
export async function POST(_request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ message: "Lead not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const lead = await AQSubmission.findById(id);
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    const aq = await AQSettings.findOne().select("profiles.key profiles.name").lean();
    const profile = aq?.profiles?.find((p) => p.key === lead.resultProfileKey);

    await pushToBrevo({
      email: lead.email,
      name: lead.name,
      company: lead.company,
      profileName: profile?.name || lead.resultProfileKey,
      source: lead.source,
    });
    lead.syncedToEsp = true;
    lead.syncedAt = new Date();
    await lead.save();
    return NextResponse.json({ ok: true, syncedAt: lead.syncedAt });
  } catch (error) {
    console.error("AQ lead resync error:", error);
    return NextResponse.json({ message: error.message || "Brevo sync failed" }, { status: 502 });
  }
}
