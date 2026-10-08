import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";
import { defaultAQ } from "@/lib/aqDefaults";
import { normalizeAQ, slugifyKey } from "@/lib/aqScoring";
import AQSettings from "@/model/AQSettings";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ message: "Unauthorized" }, { status: 401 });

const str = (value) => (typeof value === "string" ? value.trim() : "");
const num = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN; // NaN is reported by the model's validation
};
const lines = (value) =>
  (Array.isArray(value) ? value : []).filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
// Keep existing ids so saved progress and stored leads keep pointing at the same questions/options.
const keepId = (value) => (mongoose.isValidObjectId(value) ? { _id: value } : {});

function sanitize(body) {
  return {
    scoringMode: body.scoringMode === "points" ? "points" : "profile",
    questions: (Array.isArray(body.questions) ? body.questions : []).slice(0, 100).map((question) => ({
      ...keepId(question?._id),
      prompt: str(question?.prompt),
      published: question?.published !== false,
      options: (Array.isArray(question?.options) ? question.options : []).slice(0, 10).map((option) => ({
        ...keepId(option?._id),
        label: str(option?.label),
        profileKey: str(option?.profileKey).toLowerCase(),
        points: num(option?.points),
      })),
    })),
    profiles: (Array.isArray(body.profiles) ? body.profiles : []).slice(0, 20).map((profile) => ({
      ...keepId(profile?._id),
      key: slugifyKey(str(profile?.key) || str(profile?.name)),
      name: str(profile?.name),
      headline: str(profile?.headline),
      description: str(profile?.description),
      strengths: lines(profile?.strengths),
      watchOuts: lines(profile?.watchOuts),
      recommendedService: mongoose.isValidObjectId(profile?.recommendedService) ? profile.recommendedService : null,
      imageUrl: str(profile?.imageUrl),
      minScore: num(profile?.minScore, null),
      maxScore: num(profile?.maxScore, null),
    })),
  };
}

export async function GET() {
  try {
    if (!(await isAdminRequest())) return unauthorized();

    await connectDB();
    const saved = await AQSettings.findOne().lean();
    return NextResponse.json({
      aq: saved ? normalizeAQ(saved) : { ...defaultAQ, scoringMode: "profile" },
    });
  } catch (error) {
    console.error("Get admin AQ settings error:", error);
    return NextResponse.json({ message: "Unable to load AQ settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!(await isAdminRequest())) return unauthorized();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const data = sanitize(body);

    await connectDB();
    const doc = (await AQSettings.findOne()) || new AQSettings({ content: defaultAQ.content });
    doc.scoringMode = data.scoringMode;
    doc.questions = data.questions;
    doc.profiles = data.profiles;
    if (body.content && typeof body.content === "object") {
      doc.content = body.content;
      doc.markModified("content");
    }

    try {
      await doc.save(); // runs the AQ validation in the model
    } catch (error) {
      if (error.name === "AQValidationError" || error.name === "ValidationError" || error.name === "CastError") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({
      message: "AQ assessment saved",
      aq: normalizeAQ(doc.toObject()),
    });
  } catch (error) {
    console.error("Update admin AQ settings error:", error);
    return NextResponse.json({ message: "Unable to save AQ settings" }, { status: 500 });
  }
}
