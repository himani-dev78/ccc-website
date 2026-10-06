import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import AQSettings from "@/model/AQSettings";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.answers)) {
      return NextResponse.json({ message: "Assessment answers are required" }, { status: 400 });
    }

    await connectDB();
    const aq = await AQSettings.findOne().lean();
    const questions = aq?.questions || [];
    const profiles = aq?.profiles || [];

    if (!questions.length || !profiles.length || body.answers.length !== questions.length) {
      return NextResponse.json({ message: "The AQ assessment is not configured or the submitted answers are incomplete" }, { status: 400 });
    }

    let score = 0;
    for (const [index, answerIndex] of body.answers.entries()) {
      if (!Number.isInteger(answerIndex) || !questions[index]?.options[answerIndex]) {
        return NextResponse.json({ message: `Answer ${index + 1} is invalid` }, { status: 400 });
      }
      score += questions[index].options[answerIndex].points;
    }

    const profile = profiles.find(
      (item) => score >= item.minScore && score <= item.maxScore,
    );

    return NextResponse.json({
      score,
      profile: profile
        ? {
            name: profile.name,
            headline: profile.headline,
            description: profile.description,
            strengths: profile.strengths,
            watchOuts: profile.watchOuts,
            recommendedService: profile.recommendedService,
          }
        : null,
    });
  } catch (error) {
    console.error("Score AQ assessment error:", error);
    return NextResponse.json({ message: "Unable to calculate AQ result" }, { status: 500 });
  }
}
