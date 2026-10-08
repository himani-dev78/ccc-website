import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { slugifyKey } from "@/lib/aqScoring";
import AQSettings, { AQSubmission } from "@/model/AQSettings";

export const dynamic = "force-dynamic";

// Spec §8.5 — lead detail: their answers and score breakdown.
export async function GET(_request, { params }) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    await connectDB();
    const [lead, aq] = await Promise.all([
      AQSubmission.findById(id).lean(),
      AQSettings.findOne().lean(),
    ]);
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    // Older leads have no prompt/label snapshot — fill those in from the current questions.
    const questionsById = new Map((aq?.questions || []).map((q) => [String(q._id), q]));
    const answers = (lead.answers || []).map((answer) => {
      const question = questionsById.get(String(answer.questionId));
      const option = question?.options?.find((o) => String(o._id) === String(answer.optionId));
      return {
        ...answer,
        prompt: answer.prompt || question?.prompt || "(question since deleted)",
        label: answer.label || option?.label || option?.text || "(option since deleted)",
      };
    });

    return NextResponse.json({
      lead: { ...lead, answers },
      profiles: (aq?.profiles || []).map((p) => ({ key: p.key || slugifyKey(p.name), name: p.name })),
    });
  } catch (error) {
    console.error("Get AQ lead error:", error);
    return NextResponse.json({ message: "Unable to load lead" }, { status: 500 });
  }
}
