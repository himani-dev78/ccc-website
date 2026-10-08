import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { normalizeAQ } from "@/lib/aqScoring";
import { buildResultEmail } from "@/lib/aqEmail";
import AQSettings, { AQSubmission } from "@/model/AQSettings";

export const dynamic = "force-dynamic";

const MAX_NOTE = 2000;

async function loadEmail(id, note) {
  await connectDB();
  const [lead, saved] = await Promise.all([AQSubmission.findById(id), AQSettings.findOne().lean()]);
  if (!lead) return { error: "Lead not found", status: 404 };

  const aq = normalizeAQ(saved);
  const profiles = aq?.profiles || [];
  const profile = profiles.find((p) => p.key === lead.resultProfileKey);
  if (!profile) {
    return { error: `The result profile "${lead.resultProfileKey}" no longer exists in AQ settings.`, status: 409 };
  }
  const secondaryProfile = lead.secondaryProfileKey ? profiles.find((p) => p.key === lead.secondaryProfileKey) : null;

  let service = null;
  if (profile.recommendedService && mongoose.isValidObjectId(profile.recommendedService)) {
    const Service = (await import("@/model/Service")).default;
    service = await Service.findById(profile.recommendedService).select("title slug").lean();
  }

  const email = buildResultEmail({
    name: lead.name,
    profile,
    secondaryProfile,
    score: lead.score,
    maxScore: lead.maxScore,
    service,
    note,
  });
  return { lead, email };
}

const cleanNote = (value) => (typeof value === "string" ? value.trim().slice(0, MAX_NOTE) : "");

// Preview: GET /api/admin/aq/leads/:id/email?note=...
export async function GET(request, { params }) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    const note = cleanNote(new URL(request.url).searchParams.get("note"));
    const result = await loadEmail(id, note);
    if (result.error) return NextResponse.json({ message: result.error }, { status: result.status });

    return NextResponse.json({
      to: result.lead.email,
      ...result.email,
    });
  } catch (error) {
    console.error("Preview AQ email error:", error);
    return NextResponse.json({ message: "Unable to build the email" }, { status: 500 });
  }
}

// The admin sends the email from their own mail app, then marks it as sent here
export async function PATCH(_request, { params }) {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    await connectDB();
    const lead = await AQSubmission.findByIdAndUpdate(
      id,
      { $set: { resultEmailSentAt: new Date() }, $inc: { resultEmailSentCount: 1 } },
      { new: true },
    ).lean();
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    return NextResponse.json({ ok: true, resultEmailSentAt: lead.resultEmailSentAt, resultEmailSentCount: lead.resultEmailSentCount });
  } catch (error) {
    console.error("Mark AQ email sent error:", error);
    return NextResponse.json({ message: "Unable to update the lead" }, { status: 500 });
  }
}
