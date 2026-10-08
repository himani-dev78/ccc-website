import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import AQSettings, { AQSubmission } from "@/model/AQSettings";
import { scoreAssessment, publishedQuestions, normalizeAQ } from "@/lib/aqScoring";
import { pushToBrevo } from "@/lib/aqEmail";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number")
    .refine((value) => value.replace(/\D/g, "").length >= 7, "Please enter a valid phone number"),
  company: z.string().trim().max(150).optional().default(""),
  website: z.string().optional().default(""), // honeypot
  source: z.string().max(100).optional().default(""),
  campaign: z.string().max(100).optional().default(""),
  answers: z.array(z.object({ questionId: z.string().max(40), optionId: z.string().max(40) })).min(1).max(100),
});

// The visitor only gets a thank-you. The result email is sent by an admin from /admin/aq/leads/[id].
export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`aq:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check your details.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }); // bot: pretend success, store nothing

  try {
    await connectDB();
    const aq = normalizeAQ(await AQSettings.findOne().lean());
    const questions = publishedQuestions(aq);
    const profiles = aq?.profiles || [];
    if (!questions.length || !profiles.length) {
      return NextResponse.json({ message: "The assessment is not configured." }, { status: 400 });
    }

    // Score on the server — never trust the client
    const result = scoreAssessment({ questions, profiles, scoringMode: aq.scoringMode }, data.answers);
    if (result.error || !result.profile) {
      return NextResponse.json({ message: result.error || "No result profile matches these answers." }, { status: 400 });
    }

    const submission = await AQSubmission.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      answers: result.answers,
      score: result.score,
      maxScore: result.maxScore,
      scores: result.scores,
      scoringMode: aq.scoringMode,
      resultProfileKey: result.profile.key,
      secondaryProfileKey: result.secondaryKey,
      source: data.source,
      campaign: data.campaign,
      ipCountry: request.headers.get("x-vercel-ip-country") || "",
    });

    // CRM sync (only when Brevo is configured). A failure never costs the lead.
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      try {
        await pushToBrevo({ email: data.email, name: data.name, company: data.company, profileName: result.profile.name, source: data.source });
        await AQSubmission.updateOne({ _id: submission._id }, { syncedToEsp: true, syncedAt: new Date() });
      } catch (error) {
        console.error("Brevo sync failed:", error); // leaves syncedToEsp=false for the resync button
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("AQ submit error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
