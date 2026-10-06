import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/db";
import { defaultAQ } from "@/lib/aqDefaults";
import AQSettings from "@/model/AQSettings";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

function validateAQ(value) {
  if (!value || typeof value !== "object" || !value.content || typeof value.content !== "object") {
    return "AQ page content is required";
  }

  const questions = Array.isArray(value.questions) ? value.questions : [];
  for (const [index, question] of questions.entries()) {
    if (!question.prompt?.trim() || !Array.isArray(question.options) || question.options.length < 2) {
      return `Question ${index + 1} needs a prompt and at least two answers`;
    }
    if (question.options.some((option) => !option.text?.trim() || !Number.isFinite(Number(option.points)))) {
      return `Every answer in question ${index + 1} needs text and a valid points value`;
    }
  }

  const profiles = Array.isArray(value.profiles) ? value.profiles : [];
  if (questions.length > 0 && profiles.length === 0) {
    return "Add at least one result profile before publishing assessment questions";
  }
  for (const [index, profile] of profiles.entries()) {
    if (
      !profile.name?.trim() ||
      !profile.headline?.trim() ||
      !profile.description?.trim() ||
      !Number.isFinite(Number(profile.minScore)) ||
      !Number.isFinite(Number(profile.maxScore)) ||
      Number(profile.minScore) > Number(profile.maxScore)
    ) {
      return `Result profile ${index + 1} needs a name, headline, description and valid score range`;
    }
  }

  if (questions.length > 0 && profiles.length > 0) {
    const possibleMin = questions.reduce(
      (total, question) => total + Math.min(...question.options.map((option) => Number(option.points))),
      0,
    );
    const possibleMax = questions.reduce(
      (total, question) => total + Math.max(...question.options.map((option) => Number(option.points))),
      0,
    );
    const sortedProfiles = [...profiles].sort((a, b) => Number(a.minScore) - Number(b.minScore));

    if (
      Number(sortedProfiles[0].minScore) > possibleMin ||
      Number(sortedProfiles[sortedProfiles.length - 1].maxScore) < possibleMax
    ) {
      return `Result profiles must cover all possible assessment scores (${possibleMin} to ${possibleMax})`;
    }

    for (let index = 1; index < sortedProfiles.length; index += 1) {
      if (Number(sortedProfiles[index].minScore) <= Number(sortedProfiles[index - 1].maxScore)) {
        return "Result profile score ranges must not overlap";
      }
    }
  }

  return "";
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const saved = await AQSettings.findOne().lean();
    return NextResponse.json({ aq: saved || defaultAQ });
  } catch (error) {
    console.error("Get admin AQ settings error:", error);
    return NextResponse.json({ message: "Unable to load AQ settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const aq = {
      content: body.content,
      questions: Array.isArray(body.questions)
        ? body.questions.map((question) => ({
            prompt: typeof question.prompt === "string" ? question.prompt.trim() : "",
            options: Array.isArray(question.options)
              ? question.options.map((option) => ({
                  text: typeof option.text === "string" ? option.text.trim() : "",
                  points: Number(option.points),
                }))
              : [],
          }))
        : [],
      profiles: Array.isArray(body.profiles)
        ? body.profiles.map((profile) => ({
            name: typeof profile.name === "string" ? profile.name.trim() : "",
            headline: typeof profile.headline === "string" ? profile.headline.trim() : "",
            minScore: Number(profile.minScore),
            maxScore: Number(profile.maxScore),
            description: typeof profile.description === "string" ? profile.description.trim() : "",
            strengths: Array.isArray(profile.strengths)
              ? profile.strengths.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
              : [],
            watchOuts: Array.isArray(profile.watchOuts)
              ? profile.watchOuts.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
              : [],
            recommendedService:
              typeof profile.recommendedService === "string" ? profile.recommendedService.trim() : "",
          }))
        : [],
    };

    const validationError = validateAQ(aq);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectDB();
    const saved = await AQSettings.findOneAndUpdate({}, aq, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();

    return NextResponse.json({ message: "AQ settings saved successfully", aq: saved });
  } catch (error) {
    console.error("Update admin AQ settings error:", error);
    return NextResponse.json({ message: "Unable to save AQ settings" }, { status: 500 });
  }
}
