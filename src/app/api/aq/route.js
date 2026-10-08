import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { defaultAQ } from "@/lib/aqDefaults";
import { normalizeAQ, publishedQuestions } from "@/lib/aqScoring";
import AQSettings from "@/model/AQSettings";

export const dynamic = "force-dynamic";

// Public, read-only. Editing happens through /api/admin/aq (admin-only).
// Option profile keys and points are not exposed — scoring happens on the server.
export async function GET() {
  try {
    await connectDB();
    const saved = await AQSettings.findOne().lean();

    if (!saved) {
      return NextResponse.json({ aq: { ...defaultAQ, questions: [] } });
    }

    const aq = normalizeAQ(saved);
    return NextResponse.json({
      aq: {
        content: { ...defaultAQ.content, ...(aq.content || {}) },
        scoringMode: aq.scoringMode,
        questions: publishedQuestions(aq).map((question) => ({
          _id: String(question._id),
          prompt: question.prompt,
          options: question.options.map((option) => ({
            _id: String(option._id),
            label: option.label,
          })),
        })),
        profiles: aq.profiles.map((profile) => ({
          key: profile.key,
          name: profile.name,
          headline: profile.headline,
          description: profile.description,
          imageUrl: profile.imageUrl,
          minScore: profile.minScore,
          maxScore: profile.maxScore,
        })),
      },
    });
  } catch (error) {
    console.error("Get public AQ settings error:", error);
    return NextResponse.json({ message: "Unable to load AQ content" }, { status: 500 });
  }
}
