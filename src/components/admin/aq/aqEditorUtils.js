export const AQ_TARGET_QUESTIONS = 16; // spec §9: the 16-question assessment
export const MIN_OPTIONS = 3;
export const MAX_OPTIONS = 4;

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30";

export const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

let counter = 0;
export const cid = () => `c${Date.now().toString(36)}${(counter++).toString(36)}`;

export const slugifyKey = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const newOption = () => ({ _cid: cid(), label: "", profileKey: "", points: 0 });

export const newQuestion = () => ({
  _cid: cid(),
  prompt: "",
  published: true,
  options: Array.from({ length: MIN_OPTIONS }, newOption),
});

export const newProfile = () => ({
  _cid: cid(),
  key: "",
  keyTouched: false,
  name: "",
  headline: "",
  description: "",
  strengthsText: "",
  watchOutsText: "",
  recommendedService: "",
  imageUrl: "",
  minScore: "",
  maxScore: "",
});

// Server shape -> editor state
export function fromServer(aq) {
  return {
    scoringMode: aq?.scoringMode === "points" ? "points" : "profile",
    questions: (aq?.questions || []).map((q) => ({
      _cid: cid(),
      _id: q._id,
      prompt: q.prompt || "",
      published: q.published !== false,
      options: (q.options || []).map((o) => ({
        _cid: cid(),
        _id: o._id,
        label: o.label ?? o.text ?? "",
        profileKey: o.profileKey || "",
        points: o.points ?? 0,
      })),
    })),
    profiles: (aq?.profiles || []).map((p) => ({
      _cid: cid(),
      _id: p._id,
      key: p.key || slugifyKey(p.name),
      keyTouched: true,
      name: p.name || "",
      headline: p.headline || "",
      description: p.description || "",
      strengthsText: (p.strengths || []).join("\n"),
      watchOutsText: (p.watchOuts || []).join("\n"),
      recommendedService: p.recommendedService ? String(p.recommendedService) : "",
      imageUrl: p.imageUrl || "",
      minScore: p.minScore ?? "",
      maxScore: p.maxScore ?? "",
    })),
  };
}

// Editor state -> request body
export function toServer({ scoringMode, questions, profiles }) {
  return {
    scoringMode,
    questions: questions.map((q) => ({
      _id: q._id,
      prompt: q.prompt,
      published: q.published,
      options: q.options.map((o) => ({ _id: o._id, label: o.label, profileKey: o.profileKey, points: o.points })),
    })),
    profiles: profiles.map((p) => ({
      _id: p._id,
      key: p.key,
      name: p.name,
      headline: p.headline,
      description: p.description,
      strengths: splitLines(p.strengthsText),
      watchOuts: splitLines(p.watchOutsText),
      recommendedService: p.recommendedService || null,
      imageUrl: p.imageUrl,
      minScore: p.minScore,
      maxScore: p.maxScore,
    })),
  };
}

export function scoreRange(questions) {
  return questions
    .filter((q) => q.published)
    .reduce(
      (range, q) => {
        const points = q.options.map((o) => Number(o.points) || 0);
        if (!points.length) return range;
        return { min: range.min + Math.min(...points), max: range.max + Math.max(...points) };
      },
      { min: 0, max: 0 },
    );
}

// Mirrors the model's checks so problems show before saving. The server stays the authority.
export function findIssues({ scoringMode, questions, profiles }) {
  const issues = [];
  const keys = profiles.map((p) => p.key);
  const known = new Set(keys);

  profiles.forEach((p, i) => {
    const name = p.name || `Profile ${i + 1}`;
    const add = (message) => issues.push({ tab: "profiles", index: i, message: `${name}: ${message}` });
    if (!p.name.trim()) add("needs a name");
    if (!p.key) add("needs a key");
    if (!p.headline.trim()) add("needs a headline");
    if (!p.description.trim()) add("needs a description");
    if (scoringMode === "points") {
      const min = Number(p.minScore);
      const max = Number(p.maxScore);
      if (p.minScore === "" || p.maxScore === "" || !Number.isFinite(min) || !Number.isFinite(max) || min > max) {
        add("needs a valid score range");
      }
    }
  });
  if (new Set(keys).size !== keys.length) {
    issues.push({ tab: "profiles", index: null, message: "Two profiles share the same key" });
  }

  questions.forEach((q, i) => {
    const add = (message) => issues.push({ tab: "questions", index: i, message: `Question ${i + 1}: ${message}` });
    if (!q.prompt.trim()) add("needs a prompt");
    if (q.options.length < MIN_OPTIONS || q.options.length > MAX_OPTIONS) add(`needs ${MIN_OPTIONS}–${MAX_OPTIONS} options`);
    if (q.options.some((o) => !o.label.trim())) add("has an option without a label");
    if (q.options.some((o) => o.points === "" || !Number.isFinite(Number(o.points)))) add("has an invalid points value");
    if (scoringMode === "profile" && q.options.some((o) => !o.profileKey)) add("has an option not linked to a profile");
    if (q.options.some((o) => o.profileKey && !known.has(o.profileKey))) add("links to a profile that doesn't exist");
  });

  if (questions.some((q) => q.published) && profiles.length === 0) {
    issues.push({ tab: "profiles", index: null, message: "Add at least one result profile" });
  }

  if (scoringMode === "points" && profiles.length > 0 && questions.some((q) => q.published)) {
    const ranges = profiles
      .map((p) => ({ name: p.name, min: Number(p.minScore), max: Number(p.maxScore) }))
      .filter((r) => Number.isFinite(r.min) && Number.isFinite(r.max))
      .sort((a, b) => a.min - b.min);
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].min <= ranges[i - 1].max) {
        issues.push({ tab: "profiles", index: null, message: `Score ranges overlap: ${ranges[i - 1].name} and ${ranges[i].name}` });
      }
    }
    const { min, max } = scoreRange(questions);
    if (ranges.length && (ranges[0].min > min || ranges[ranges.length - 1].max < max)) {
      issues.push({ tab: "profiles", index: null, message: `Score ranges must cover every possible score (${min}–${max})` });
    }
  }

  return issues;
}
