import mongoose from "mongoose";

const { Schema } = mongoose;

// AQ Assessment — CCC build spec §7.2 (funnel tables) and §9 (the funnel).
// One AQSettings document holds the page content, the questions (with their options)
// and the result profiles. Array order is the display order; `order` mirrors it.

export const AQ_PROFILE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const AQ_MIN_OPTIONS = 3;
export const AQ_MAX_OPTIONS = 4;

const aqOptionSchema = new Schema({
  label: { type: String, required: true, trim: true, maxlength: 300 },
  // Which profile this answer counts towards ("driver" | "connector" | ...) — spec §9.5
  profileKey: { type: String, trim: true, lowercase: true, default: "" },
  // Optional numeric score (spec §15.2: AQ can be a number, a profile, or both)
  points: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const aqQuestionSchema = new Schema({
  prompt: { type: String, required: true, trim: true, maxlength: 500 },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  options: { type: [aqOptionSchema], default: [] },
});

const aqProfileSchema = new Schema({
  key: { type: String, required: true, trim: true, lowercase: true }, // "connector"
  name: { type: String, required: true, trim: true, maxlength: 120 }, // "The Connector"
  headline: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, required: true, trim: true }, // shown on screen and in the email
  strengths: { type: [String], default: [] },
  watchOuts: { type: [String], default: [] },
  recommendedService: { type: Schema.Types.ObjectId, ref: "Service", default: null },
  imageUrl: { type: String, trim: true, default: "" },
  // Only used when scoringMode is "points"
  minScore: { type: Number, default: null },
  maxScore: { type: Number, default: null },
});

const aqSettingsSchema = new Schema(
  {
    content: { type: Schema.Types.Mixed, default: {} },
    // "profile": result = most-picked profile (spec §9.5). "points": result = score band.
    scoringMode: { type: String, enum: ["profile", "points"], default: "profile" },
    questions: { type: [aqQuestionSchema], default: [] },
    profiles: { type: [aqProfileSchema], default: [] },
  },
  { timestamps: true },
);

class AQValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AQValidationError";
  }
}

function questionLabel(index) {
  return `Question ${index + 1}`;
}

// Friendly, admin-facing checks. Runs before Mongoose's own path validation.
// Mongoose 9 middleware no longer receives `next` — throw to reject.
aqSettingsSchema.pre("validate", function () {
  const fail = (message) => {
    throw new AQValidationError(message);
  };

  this.questions.forEach((question, index) => {
    question.order = index;
    question.options.forEach((option, optionIndex) => {
      option.order = optionIndex;
    });
  });

  const keys = this.profiles.map((profile) => profile.key);

  this.profiles.forEach((profile, index) => {
    const label = profile.name || `Profile ${index + 1}`;
    if (!profile.name) fail(`Profile ${index + 1} needs a name.`);
    if (!profile.key || !AQ_PROFILE_KEY_PATTERN.test(profile.key)) {
      fail(`"${label}" needs a key made of lowercase letters, numbers and dashes (e.g. "connector").`);
    }
    if (!profile.headline) fail(`"${label}" needs a headline.`);
    if (!profile.description) fail(`"${label}" needs a description.`);
  });

  if (new Set(keys).size !== keys.length) fail("Each profile key must be unique.");

  const known = new Set(keys);
  this.questions.forEach((question, index) => {
    if (!question.prompt) fail(`${questionLabel(index)} needs a prompt.`);
    const count = question.options.length;
    if (count < AQ_MIN_OPTIONS || count > AQ_MAX_OPTIONS) {
      fail(`${questionLabel(index)} needs ${AQ_MIN_OPTIONS} or ${AQ_MAX_OPTIONS} answer options (it has ${count}).`);
    }
    question.options.forEach((option, optionIndex) => {
      const where = `${questionLabel(index)}, option ${optionIndex + 1}`;
      if (!option.label) fail(`${where} needs a label.`);
      if (!Number.isFinite(option.points)) fail(`${where} has an invalid points value.`);
      if (option.profileKey && !known.has(option.profileKey)) {
        fail(`${where} points to a profile that no longer exists ("${option.profileKey}").`);
      }
      if (this.scoringMode === "profile" && !option.profileKey) {
        fail(`${where} must be linked to a result profile.`);
      }
    });
  });

  const published = this.questions.filter((question) => question.published !== false);
  if (published.length > 0 && this.profiles.length === 0) {
    fail("Add at least one result profile before publishing questions.");
  }

  if (this.scoringMode === "points" && this.profiles.length > 0) {
    const ranges = this.profiles.map((profile) => ({
      name: profile.name,
      min: profile.minScore,
      max: profile.maxScore,
    }));
    for (const range of ranges) {
      if (!Number.isFinite(range.min) || !Number.isFinite(range.max) || range.min > range.max) {
        fail(`"${range.name}" needs a valid score range (min ≤ max).`);
      }
    }
    ranges.sort((a, b) => a.min - b.min);
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].min <= ranges[i - 1].max) {
        fail(`Score ranges overlap: "${ranges[i - 1].name}" and "${ranges[i].name}".`);
      }
    }
    if (published.length > 0) {
      const possibleMin = published.reduce((sum, q) => sum + Math.min(...q.options.map((o) => o.points)), 0);
      const possibleMax = published.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.points)), 0);
      if (ranges[0].min > possibleMin || ranges[ranges.length - 1].max < possibleMax) {
        fail(`Profile score ranges must cover every possible score (${possibleMin} to ${possibleMax}).`);
      }
    }
  }
});

export const AQSettings =
  mongoose.models.AQSettings || mongoose.model("AQSettings", aqSettingsSchema);

// Leads — the funnel's output (spec §7.2 assessment_submissions, §8.5).
// Answers are snapshotted so later edits to questions never change a lead's history,
// and so the paid "full AQ report" (Phase 2) can be built from stored data.
const aqSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    answers: [
      {
        _id: false,
        questionId: Schema.Types.ObjectId,
        optionId: Schema.Types.ObjectId,
        prompt: String,
        label: String,
        profileKey: String,
        points: Number,
      },
    ],
    scores: { type: Map, of: Number, default: {} }, // per-profile tally {driver: 5, connector: 8}
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    scoringMode: { type: String, default: "profile" },
    resultProfileKey: { type: String, required: true, index: true },
    secondaryProfileKey: { type: String, default: null },
    source: { type: String, default: "" }, // utm_source
    campaign: { type: String, default: "" }, // utm_campaign
    syncedToEsp: { type: Boolean, default: false },
    syncedAt: { type: Date, default: null },
    // The result email is sent by an admin from /admin/aq/leads/[id] — never automatically
    resultEmailSentAt: { type: Date, default: null },
    resultEmailSentCount: { type: Number, default: 0 },
    ipCountry: { type: String, default: "" },
  },
  { timestamps: true },
);

aqSubmissionSchema.index({ createdAt: -1 });

export const AQSubmission =
  mongoose.models.AQSubmission || mongoose.model("AQSubmission", aqSubmissionSchema);

export default AQSettings;
