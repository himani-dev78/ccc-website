"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  ChevronDown,
  Gauge,
  ListChecks,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { defaultAQ } from "@/lib/aqDefaults";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30";

const newProfile = () => ({
  name: "",
  headline: "",
  minScore: 0,
  maxScore: 0,
  description: "",
  strengths: [],
  watchOuts: [],
  recommendedService: "",
});

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function AdminAQPage() {
  const [content, setContent] = useState(defaultAQ.content);
  const [questions, setQuestions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAQ() {
      try {
        const response = await fetch("/api/admin/aq", { signal: controller.signal });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load AQ settings.");
        setContent({ ...defaultAQ.content, ...(data.aq?.content || {}) });
        const loadedQuestions = data.aq?.questions || [];
        setQuestions(loadedQuestions);
        const loadedProfiles = data.aq?.profiles || [];
        setProfiles(loadedProfiles);
        setOpenQuestion(loadedQuestions.length ? 0 : null);
        setOpenProfile(loadedProfiles.length ? 0 : null);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load AQ settings.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAQ();
    return () => controller.abort();
  }, []);

  const scoreRange = useMemo(
    () =>
      questions.reduce(
        (range, question) => {
          const points = question.options.map((option) => Number(option.points) || 0);
          if (!points.length) return range;
          return {
            min: range.min + Math.min(...points),
            max: range.max + Math.max(...points),
          };
        },
        { min: 0, max: 0 },
      ),
    [questions],
  );

  function updateQuestion(questionIndex, changes) {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex ? { ...question, ...changes } : question,
      ),
    );
    setSuccess("");
  }

  function updateOption(questionIndex, optionIndex, changes) {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, answerIndex) =>
                answerIndex === optionIndex ? { ...option, ...changes } : option,
              ),
            }
          : question,
      ),
    );
    setSuccess("");
  }

  function updateProfile(profileIndex, changes) {
    setProfiles((current) =>
      current.map((profile, index) =>
        index === profileIndex ? { ...profile, ...changes } : profile,
      ),
    );
    setSuccess("");
  }

  function addQuestion() {
    const index = questions.length;
    setQuestions((current) => [
      ...current,
      {
        prompt: "",
        options: [
          { text: "", points: 0 },
          { text: "", points: 0 },
        ],
      },
    ]);
    setOpenQuestion(index);
    setSuccess("");
  }

  function removeQuestion(questionIndex) {
    setQuestions((current) => current.filter((_, index) => index !== questionIndex));
    setOpenQuestion((current) => {
      if (current === questionIndex) return null;
      if (current > questionIndex) return current - 1;
      return current;
    });
    setSuccess("");
  }

  function addProfile() {
    const index = profiles.length;
    setProfiles((current) => [...current, newProfile()]);
    setOpenProfile(index);
    setSuccess("");
  }

  function removeProfile(profileIndex) {
    setProfiles((current) => current.filter((_, index) => index !== profileIndex));
    setOpenProfile((current) => {
      if (current === profileIndex) return null;
      if (current > profileIndex) return current - 1;
      return current;
    });
    setSuccess("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/aq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, questions, profiles }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to save AQ settings.");
      setSuccess("AQ assessment settings saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save AQ settings.");
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    {
      id: "questions",
      label: "Assessment questions",
      count: questions.length,
      icon: ListChecks,
    },
    {
      id: "profiles",
      label: "Score profiles",
      count: profiles.length,
      icon: Award,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      <header className="overflow-hidden rounded-2xl bg-[#0b2a6a] text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5 px-6 py-7 sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f9bd0e] text-[#0b2a6a]">
              <Gauge size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-bold">AQ assessment</h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-white/70">
                Manage quiz questions, answer points and the result people receive.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Possible score
            </p>
            <p className="mt-1 text-lg font-bold text-[#f9bd0e]">
              {scoreRange.min}–{scoreRange.max}
            </p>
          </div>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
          <Loader2 className="animate-spin text-[#0b2a6a]" size={22} />
          Loading assessment settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <nav
            aria-label="AQ management sections"
            className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
          >
            {tabs.map(({ id, label, count, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`flex min-h-14 items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === id
                    ? "bg-[#0b2a6a] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={18} />
                  {label}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    activeTab === id
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </nav>

          {activeTab === "questions" ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b2a6a]">Assessment questions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add each question and set the points awarded for every answer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] hover:bg-[#f5c93e]"
                >
                  <Plus size={16} /> Add question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <ListChecks className="mx-auto text-slate-300" size={32} />
                  <h3 className="mt-3 font-semibold text-[#0b2a6a]">No questions yet</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your first question to start building the assessment.
                  </p>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus size={16} /> Create first question
                  </button>
                </div>
              ) : (
                questions.map((question, questionIndex) => {
                  const expanded = openQuestion === questionIndex;
                  return (
                    <article
                      key={questionIndex}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => setOpenQuestion(expanded ? null : questionIndex)}
                          className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f9bd0e]/20 text-sm font-bold text-[#0b2a6a]">
                            {String(questionIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-[#0b2a6a]">
                              {question.prompt.trim() || `Question ${questionIndex + 1}`}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                              {question.options.length} answers · Points assigned per answer
                            </span>
                          </span>
                          <ChevronDown
                            size={18}
                            className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="mr-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove question ${questionIndex + 1}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      {expanded && (
                        <div className="space-y-5 border-t border-slate-100 bg-slate-50/70 p-5">
                          <label className="block">
                            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                              Question
                            </span>
                            <textarea
                              value={question.prompt}
                              onChange={(event) =>
                                updateQuestion(questionIndex, { prompt: event.target.value })
                              }
                              className={`${inputClass} min-h-20 resize-y`}
                              placeholder="Write the assessment question"
                              required
                            />
                          </label>

                          <div className="space-y-3">
                            <div className="grid grid-cols-[1fr_105px_36px] gap-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid-cols-[1fr_130px_40px]">
                              <span>Answer choice</span>
                              <span>Points</span>
                              <span className="sr-only">Actions</span>
                            </div>
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="grid grid-cols-[1fr_105px_36px] items-center gap-2 sm:grid-cols-[1fr_130px_40px]"
                              >
                                <input
                                  value={option.text}
                                  onChange={(event) =>
                                    updateOption(questionIndex, optionIndex, {
                                      text: event.target.value,
                                    })
                                  }
                                  className={inputClass}
                                  placeholder={`Answer ${optionIndex + 1}`}
                                  required
                                />
                                <input
                                  type="number"
                                  step="any"
                                  value={option.points}
                                  onChange={(event) =>
                                    updateOption(questionIndex, optionIndex, {
                                      points: event.target.value,
                                    })
                                  }
                                  className={inputClass}
                                  aria-label={`Points for answer ${optionIndex + 1}`}
                                  required
                                />
                                <button
                                  type="button"
                                  disabled={question.options.length <= 2}
                                  onClick={() =>
                                    updateQuestion(questionIndex, {
                                      options: question.options.filter(
                                        (_, index) => index !== optionIndex,
                                      ),
                                    })
                                  }
                                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label={`Remove answer ${optionIndex + 1}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(questionIndex, {
                                  options: [
                                    ...question.options,
                                    { text: "", points: 0 },
                                  ],
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]"
                            >
                              <Plus size={15} /> Add answer
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b2a6a]">Score profiles</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Match score bands to the result and guidance shown after the assessment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] hover:bg-[#f5c93e]"
                >
                  <Plus size={16} /> Add profile
                </button>
              </div>

              <div className="rounded-xl border border-[#f9bd0e]/40 bg-[#fffaea] px-4 py-3 text-sm text-[#725700]">
                Current possible total: <strong>{scoreRange.min}–{scoreRange.max}</strong>.
                Set non-overlapping profile ranges that cover this score range.
              </div>

              {profiles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <Award className="mx-auto text-slate-300" size={32} />
                  <h3 className="mt-3 font-semibold text-[#0b2a6a]">No result profiles yet</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add profiles to define what each assessment score means.
                  </p>
                  <button
                    type="button"
                    onClick={addProfile}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus size={16} /> Create first profile
                  </button>
                </div>
              ) : (
                profiles.map((profile, profileIndex) => (
                  <article
                    key={profileIndex}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-expanded={openProfile === profileIndex}
                        onClick={() =>
                          setOpenProfile((current) =>
                            current === profileIndex ? null : profileIndex,
                          )
                        }
                        className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2a6a]/5 text-[#0b2a6a]">
                          <Award size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-[#0b2a6a]">
                            {profile.name || `Result profile ${profileIndex + 1}`}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            Scores {profile.minScore}–{profile.maxScore}
                          </span>
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-slate-400 transition-transform ${openProfile === profileIndex ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProfile(profileIndex)}
                        className="mr-4 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove result profile ${profileIndex + 1}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {openProfile === profileIndex && (
                      <div className="grid gap-4 border-t border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2">
                      <input
                        value={profile.name}
                        onChange={(event) =>
                          updateProfile(profileIndex, { name: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Profile name"
                        aria-label="Profile name"
                        required
                      />
                      <input
                        value={profile.headline}
                        onChange={(event) =>
                          updateProfile(profileIndex, { headline: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Result headline"
                        aria-label="Result headline"
                        required
                      />
                      <label>
                        <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                          Minimum score
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={profile.minScore}
                          onChange={(event) =>
                            updateProfile(profileIndex, { minScore: event.target.value })
                          }
                          className={inputClass}
                          required
                        />
                      </label>
                      <label>
                        <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                          Maximum score
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={profile.maxScore}
                          onChange={(event) =>
                            updateProfile(profileIndex, { maxScore: event.target.value })
                          }
                          className={inputClass}
                          required
                        />
                      </label>
                      <textarea
                        value={profile.description}
                        onChange={(event) =>
                          updateProfile(profileIndex, { description: event.target.value })
                        }
                        className={`${inputClass} min-h-24 resize-y sm:col-span-2`}
                        placeholder="Describe this result"
                        
                      />
                      <textarea
                        value={(profile.strengths || []).join("\n")}
                        onChange={(event) =>
                          updateProfile(profileIndex, {
                            strengths: splitLines(event.target.value),
                          })
                        }
                        className={`${inputClass} min-h-24 resize-y`}
                        placeholder="Strengths (one per line)"
                      />
                      <textarea
                        value={(profile.watchOuts || []).join("\n")}
                        onChange={(event) =>
                          updateProfile(profileIndex, {
                            watchOuts: splitLines(event.target.value),
                          })
                        }
                        className={`${inputClass} min-h-24 resize-y`}
                        placeholder="Areas to watch (one per line)"
                      />
                      <input
                        value={profile.recommendedService || ""}
                        onChange={(event) =>
                          updateProfile(profileIndex, {
                            recommendedService: event.target.value,
                          })
                        }
                        className={`${inputClass} sm:col-span-2`}
                        placeholder="Recommended CCC service (optional)"
                      />
                      </div>
                    )}
                  </article>
                ))
              )}
            </section>
          )}

          <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <p className="hidden text-sm text-slate-500 sm:block">
                {questions.length} questions · {profiles.length} score profiles
              </p>
              <button
                type="submit"
                disabled={saving}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving..." : "Save assessment"}
              </button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
}
