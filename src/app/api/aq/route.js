import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { defaultAQ } from "@/lib/aqDefaults";
import AQSettings from "@/model/AQSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const saved = await AQSettings.findOne().lean();

    return NextResponse.json({
      aq: saved
        ? {
            content: { ...defaultAQ.content, ...(saved.content || {}) },
            questions: (saved.questions || []).map((question) => ({
              prompt: question.prompt,
              options: question.options.map(({ text }) => ({ text })),
            })),
            profiles: saved.profiles || [],
          }
        : {
            ...defaultAQ,
            questions: [],
          },
    });
  } catch (error) {
    console.error("Get public AQ settings error:", error);
    return NextResponse.json(
      { message: "Unable to load AQ content" },
      { status: 500 },
    );
  }
}
