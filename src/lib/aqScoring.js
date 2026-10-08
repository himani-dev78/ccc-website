// AQ scoring — spec §9.5. Runs on the server on submit; the client's result is never trusted.

export const slugifyKey = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const publishedQuestions = (aq) =>
  (aq?.questions || []).filter((question) => question.published !== false);

/**
 * @param {{questions, profiles, scoringMode}} aq  questions should already be the published ones, in order
 * @param {{questionId: string, optionId: string}[]} answers
 */
export function scoreAssessment({ questions, profiles, scoringMode }, answers) {
  const picked = new Map(answers.map((a) => [String(a.questionId), String(a.optionId)]));
  const tally = {};
  const firstSeen = []; // profile keys in question order — the deterministic tie-break
  const resolved = [];
  let score = 0;
  let maxScore = 0;

  for (const question of questions) {
    const option = question.options.find((o) => String(o._id) === picked.get(String(question._id)));
    if (!option) return { error: "One or more answers are missing or invalid." };

    const points = Number(option.points) || 0;
    score += points;
    maxScore += Math.max(...question.options.map((o) => Number(o.points) || 0));

    if (option.profileKey) {
      if (!(option.profileKey in tally)) firstSeen.push(option.profileKey);
      tally[option.profileKey] = (tally[option.profileKey] || 0) + 1;
    }

    resolved.push({
      questionId: question._id,
      optionId: option._id,
      prompt: question.prompt,
      label: option.label,
      profileKey: option.profileKey || "",
      points,
    });
  }

  // Array.prototype.sort is stable, so ties keep first-seen (question) order.
  const ranked = [...firstSeen].sort((a, b) => tally[b] - tally[a]);

  let profile;
  let secondaryKey = null;
  if (scoringMode === "points") {
    profile = profiles.find((p) => score >= p.minScore && score <= p.maxScore);
  } else {
    profile = profiles.find((p) => p.key === ranked[0]);
    secondaryKey = ranked[1] ?? null;
  }

  return {
    score,
    maxScore,
    scores: tally,
    answers: resolved,
    profile,
    secondaryKey,
  };
}

// Brings documents saved by the earlier AQ admin (options had `text`, profiles had no `key`)
// into the current shape, so nothing already entered is lost.
export function normalizeAQ(aq) {
  if (!aq) return aq;
  const profiles = (aq.profiles || []).map((profile) => ({
    ...profile,
    key: profile.key || slugifyKey(profile.name),
    recommendedService: profile.recommendedService ? String(profile.recommendedService) : "",
  }));
  return {
    ...aq,
    scoringMode: aq.scoringMode || (profiles.some((p) => p.minScore != null) ? "points" : "profile"),
    questions: (aq.questions || []).map((question) => ({
      ...question,
      published: question.published !== false,
      options: (question.options || []).map((option) => ({
        ...option,
        label: option.label ?? option.text ?? "",
        profileKey: option.profileKey || "",
        points: Number(option.points) || 0,
      })),
    })),
    profiles,
  };
}
