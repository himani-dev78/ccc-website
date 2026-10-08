"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Award, Gauge, ListChecks, Loader2, Plus, Save, SlidersHorizontal } from "lucide-react";

import AQAdminNav from "@/components/admin/aq/AQAdminNav";
import QuestionCard from "@/components/admin/aq/QuestionCard";
import ProfileCard from "@/components/admin/aq/ProfileCard";
import {
  AQ_TARGET_QUESTIONS,
  findIssues,
  fromServer,
  newProfile,
  newQuestion,
  scoreRange,
  slugifyKey,
  toServer,
} from "@/components/admin/aq/aqEditorUtils";

const scoringModes = [
  {
    id: "profile",
    title: "Profile type",
    text: "Each answer counts towards a profile. The profile picked most often wins; ties go to whichever appeared first. This is the method in the build spec (§9.5).",
  },
  {
    id: "points",
    title: "Score bands",
    text: "Each answer carries points. The total score falls into a profile's min–max range.",
  },
];

function move(list, from, to) {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminAQPage() {
  const [scoringMode, setScoringMode] = useState("profile");
  const [questions, setQuestions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dragIndex = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const [aqResponse, servicesResponse] = await Promise.all([
          fetch("/api/admin/aq", { signal: controller.signal, cache: "no-store" }),
          fetch("/api/admin/services", { signal: controller.signal, cache: "no-store" }),
        ]);
        const data = await aqResponse.json().catch(() => null);
        if (!aqResponse.ok) throw new Error(data?.message || "Unable to load AQ settings.");
        const state = fromServer(data.aq);
        setScoringMode(state.scoringMode);
        setQuestions(state.questions);
        setProfiles(state.profiles);
        const servicesData = await servicesResponse.json().catch(() => null);
        if (servicesResponse.ok) setServices(servicesData?.services || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load AQ settings.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const issues = useMemo(() => findIssues({ scoringMode, questions, profiles }), [scoringMode, questions, profiles]);
  const range = useMemo(() => scoreRange(questions), [questions]);
  const publishedCount = questions.filter((q) => q.published).length;
  const usageByKey = useMemo(() => {
    const usage = {};
    for (const q of questions) for (const o of q.options) if (o.profileKey) usage[o.profileKey] = (usage[o.profileKey] || 0) + 1;
    return usage;
  }, [questions]);

  function touch() {
    setDirty(true);
    setSuccess("");
  }

  /* ---------- questions ---------- */
  function updateQuestion(index, changes) {
    setQuestions((current) => current.map((q, i) => (i === index ? { ...q, ...changes } : q)));
    touch();
  }

  function addQuestion() {
    setQuestions((current) => [...current, newQuestion()]);
    setOpenQuestion(questions.length);
    touch();
  }

  function removeQuestion(index) {
    const label = questions[index].prompt.trim() || `Question ${index + 1}`;
    if (!window.confirm(`Delete "${label}"? Existing leads keep their saved answers.`)) return;
    setQuestions((current) => current.filter((_, i) => i !== index));
    setOpenQuestion(null);
    touch();
  }

  function moveQuestion(from, to) {
    if (to < 0 || to >= questions.length) return;
    setQuestions((current) => move(current, from, to));
    setOpenQuestion((current) => (current === from ? to : current === to ? from : current));
    touch();
  }

  // Only collapsed cards drag, so selecting text inside an open card still works
  const dragHandlers = (index) => ({
    draggable: openQuestion !== index,
    onDragStart: (event) => {
      dragIndex.current = index;
      event.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (event) => event.preventDefault(),
    onDrop: (event) => {
      event.preventDefault();
      if (dragIndex.current !== null && dragIndex.current !== index) {
        setQuestions((current) => move(current, dragIndex.current, index));
        setOpenQuestion(null);
        touch();
      }
      dragIndex.current = null;
    },
  });

  /* ---------- profiles ---------- */
  function updateProfile(index, changes) {
    const previous = profiles[index];
    const next = { ...previous, ...changes };
    if ("name" in changes && !previous.keyTouched) next.key = slugifyKey(changes.name);
    if ("key" in changes) next.key = slugifyKey(changes.key);

    setProfiles((current) => current.map((p, i) => (i === index ? next : p)));
    // Keep answers linked when a profile's key changes
    if (previous.key && next.key !== previous.key) {
      setQuestions((current) =>
        current.map((q) => ({
          ...q,
          options: q.options.map((o) => (o.profileKey === previous.key ? { ...o, profileKey: next.key } : o)),
        })),
      );
    }
    touch();
  }

  function addProfile() {
    setProfiles((current) => [...current, newProfile()]);
    setOpenProfile(profiles.length);
    touch();
  }

  function removeProfile(index) {
    const profile = profiles[index];
    const linked = usageByKey[profile.key] || 0;
    const message = linked
      ? `Delete "${profile.name || "this profile"}"? ${linked} answer(s) are linked to it and will be unlinked.`
      : `Delete "${profile.name || "this profile"}"?`;
    if (!window.confirm(message)) return;
    setProfiles((current) => current.filter((_, i) => i !== index));
    if (profile.key) {
      setQuestions((current) =>
        current.map((q) => ({
          ...q,
          options: q.options.map((o) => (o.profileKey === profile.key ? { ...o, profileKey: "" } : o)),
        })),
      );
    }
    setOpenProfile(null);
    touch();
  }

  /* ---------- save ---------- */
  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/aq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServer({ scoringMode, questions, profiles })),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to save AQ settings.");
      // Reload from the saved document so new items pick up their database ids
      const state = fromServer(data.aq);
      setScoringMode(state.scoringMode);
      setQuestions(state.questions);
      setProfiles(state.profiles);
      setDirty(false);
      setSuccess("AQ assessment saved. Changes are live on /assessment.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save AQ settings.");
    } finally {
      setSaving(false);
    }
  }

  const questionIssues = new Set(issues.filter((i) => i.tab === "questions").map((i) => i.index));
  const profileIssues = new Set(issues.filter((i) => i.tab === "profiles").map((i) => i.index));

  const tabs = [
    { id: "questions", label: "Questions", count: questions.length, icon: ListChecks },
    { id: "profiles", label: "Result profiles", count: profiles.length, icon: Award },
    { id: "scoring", label: "Scoring", count: null, icon: SlidersHorizontal },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-28">
      <header className="overflow-hidden rounded-2xl bg-[#0b2a6a] text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5 px-6 py-7 sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f9bd0e] text-[#0b2a6a]">
              <Gauge size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-bold">AQ Assessment</h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-white/70">
                Questions, answer options and the result profiles visitors receive at /assessment.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Published</p>
              <p className={`mt-1 text-lg font-bold ${publishedCount === AQ_TARGET_QUESTIONS ? "text-[#f9bd0e]" : "text-white"}`}>
                {publishedCount} / {AQ_TARGET_QUESTIONS}
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Profiles</p>
              <p className="mt-1 text-lg font-bold text-white">{profiles.length}</p>
            </div>
          </div>
        </div>
      </header>

      <AQAdminNav />

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
          Loading assessment…
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <nav
            aria-label="AQ editor sections"
            className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
          >
            {tabs.map(({ id, label, count, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition sm:justify-between ${
                  activeTab === id ? "bg-[#0b2a6a] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={17} />
                  <span className="hidden sm:inline">{label}</span>
                </span>
                {count !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === id ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {issues.length > 0 && (
            <details className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <summary className="flex cursor-pointer items-center gap-2 font-semibold">
                <AlertTriangle size={16} /> {issues.length} {issues.length === 1 ? "thing needs" : "things need"} fixing before saving
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {issues.slice(0, 20).map((issue, i) => (
                  <li key={i}>{issue.message}</li>
                ))}
              </ul>
            </details>
          )}

          {activeTab === "questions" && (
            <section className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b2a6a]">Questions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Shown one per screen, in this order. Drag or use the arrows to reorder. Hidden questions are kept but not asked.
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

              {profiles.length === 0 && scoringMode === "profile" && (
                <p className="rounded-xl border border-[#f9bd0e]/40 bg-[#fffaea] px-4 py-3 text-sm text-[#725700]">
                  Tip: create your result profiles first, so each answer can be linked to one.
                </p>
              )}

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <ListChecks className="mx-auto text-slate-300" size={32} />
                  <h3 className="mt-3 font-semibold text-[#0b2a6a]">No questions yet</h3>
                  <p className="mt-1 text-sm text-slate-500">The assessment has {AQ_TARGET_QUESTIONS} questions with 3–4 options each.</p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <QuestionCard
                    key={question._cid}
                    question={question}
                    index={index}
                    total={questions.length}
                    expanded={openQuestion === index}
                    onToggle={() => setOpenQuestion(openQuestion === index ? null : index)}
                    onChange={(changes) => updateQuestion(index, changes)}
                    onRemove={() => removeQuestion(index)}
                    onMove={(delta) => moveQuestion(index, index + delta)}
                    profiles={profiles}
                    scoringMode={scoringMode}
                    hasIssue={questionIssues.has(index)}
                    dragHandlers={dragHandlers(index)}
                  />
                ))
              )}
            </section>
          )}

          {activeTab === "profiles" && (
            <section className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b2a6a]">Result profiles</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    The AQ result a visitor receives — shown on screen, in the result email, and sent to Brevo.
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

              {scoringMode === "points" && (
                <p className="rounded-xl border border-[#f9bd0e]/40 bg-[#fffaea] px-4 py-3 text-sm text-[#725700]">
                  Possible total score: <strong>{range.min}–{range.max}</strong>. Give each profile a range; ranges must not overlap and must cover the whole span.
                </p>
              )}

              {profiles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <Award className="mx-auto text-slate-300" size={32} />
                  <h3 className="mt-3 font-semibold text-[#0b2a6a]">No result profiles yet</h3>
                  <p className="mt-1 text-sm text-slate-500">For example: The Driver, The Connector, The Analyst, The Coach.</p>
                </div>
              ) : (
                profiles.map((profile, index) => (
                  <ProfileCard
                    key={profile._cid}
                    profile={profile}
                    index={index}
                    expanded={openProfile === index}
                    onToggle={() => setOpenProfile(openProfile === index ? null : index)}
                    onChange={(changes) => updateProfile(index, changes)}
                    onRemove={() => removeProfile(index)}
                    services={services}
                    scoringMode={scoringMode}
                    usage={usageByKey[profile.key] || 0}
                    hasIssue={profileIssues.has(index)}
                  />
                ))
              )}
            </section>
          )}

          {activeTab === "scoring" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#0b2a6a]">How the result is decided</h2>
                <p className="mt-1 text-sm text-slate-500">Scoring always runs on the server when the visitor submits.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Scoring method">
                {scoringModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    role="radio"
                    aria-checked={scoringMode === mode.id}
                    onClick={() => {
                      setScoringMode(mode.id);
                      touch();
                    }}
                    className={`rounded-2xl border p-5 text-left transition ${
                      scoringMode === mode.id
                        ? "border-[#0b2a6a] bg-[#0b2a6a] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#f9bd0e]"
                    }`}
                  >
                    <span className="block font-bold">{mode.title}</span>
                    <span className={`mt-2 block text-sm leading-6 ${scoringMode === mode.id ? "text-white/80" : "text-slate-500"}`}>
                      {mode.text}
                    </span>
                  </button>
                ))}
              </div>
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Showing a number as well: if any answers carry points, the result screen and email also show
                “AQ score X / {range.max || "max"}”. Leave every answer at 0 points to show the profile only.
              </p>
            </section>
          )}

          <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <p className="hidden text-sm text-slate-500 sm:block">
                {dirty ? "Unsaved changes" : "All changes saved"} · {publishedCount} published questions · {profiles.length} profiles
              </p>
              <button
                type="submit"
                disabled={saving || !dirty}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                {saving ? "Saving…" : "Save assessment"}
              </button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
}
