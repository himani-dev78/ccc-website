"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Bebas_Neue } from "next/font/google";
import { defaultAQ } from "@/lib/aqDefaults";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const STORE_KEY = "aq-progress";
const CLIENTS = ["ITC", "Accenture", "PwC", "Sony", "Tata AIG"];
const TESTIMONIAL = null; // { quote, name, title } — use a real, approved testimonial from Greg

const track = (event) => {
  if (typeof window !== "undefined") window.gtag?.("event", event);
};

export default function AssessmentPage() {
  const [aq, setAQ] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [stage, setStage] = useState("landing"); // landing | quiz | gate
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // load questions
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/aq", { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d?.message || "Unable to load assessment.");
        setAQ(d.aq);
      })
      .catch((err) => err.name !== "AbortError" && setLoadError(err.message));
    track("aq_landing_view");
    return () => controller.abort();
  }, []);

  const questions = aq?.questions || [];
  const content = { ...defaultAQ.content, ...(aq?.content || {}) };

  // restore progress after a refresh (only answers that still exist)
  useEffect(() => {
    if (!questions.length) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
      if (!saved) return;
      const valid = {};
      for (const q of questions) {
        const optionId = saved.answers?.[q._id];
        if (q.options.some((o) => o._id === optionId)) valid[q._id] = optionId;
      }
      setAnswers(valid);
      setStep(Math.min(saved.step || 0, questions.length - 1));
      if (saved.stage === "quiz" || saved.stage === "gate") setStage(saved.stage);
    } catch {}
  }, [questions.length]);

  // mirror progress to sessionStorage
  useEffect(() => {
    if (!questions.length || stage === "done") return;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ answers, step, stage }));
    } catch {}
  }, [answers, step, stage, questions.length]);

  if (loadError) {
    return <main className="mx-auto max-w-xl px-6 py-24 text-center"><p role="alert" className="text-slate-600">{loadError}</p></main>;
  }
  if (!aq) {
    return <main className="flex min-h-[70vh] items-center justify-center"><Loader2 className="animate-spin text-[#0b2a6a]" /></main>;
  }
  if (!questions.length) {
    return <main className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className={`${bebas.className} text-4xl text-[#0b2a6a]`}>Assessment coming soon</h1></main>;
  }

  const question = questions[step];
  const selected = answers[question?._id];
  const isLast = step === questions.length - 1;

  function start() {
    track("aq_start");
    setStage("quiz");
  }

  function next() {
    if (isLast) {
      track("aq_complete");
      setStage("gate");
    } else setStep((s) => s + 1);
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setFieldErrors({});
    const params = new URLSearchParams(window.location.search);
    try {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: params.get("utm_source") || "",
          campaign: params.get("utm_campaign") || "",
          answers: questions.map((q) => ({ questionId: q._id, optionId: answers[q._id] })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setFieldErrors(data?.errors || {});
        throw new Error(data?.message || "Something went wrong.");
      }
      track("aq_email_submitted");
      sessionStorage.removeItem(STORE_KEY);
      setStage("done"); // the result is emailed by the admin — no score on screen
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  /* ---------- landing ---------- */
  if (stage === "landing") {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-[#0b2a6a] px-6 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-3xl">
            <h1 className={`${bebas.className} text-5xl leading-[0.98] sm:text-7xl`}>
              {content.hero.title} {content.hero.accent}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Get your Authority Quotient score and profile. {questions.length} questions, about two minutes.
            </p>
            <button onClick={start} className="mt-9 inline-flex items-center gap-3 rounded bg-[#f9bd0e] px-8 py-4 font-bold text-[#0b2a6a] hover:bg-white">
              Find my AQ score <ArrowRight size={18} />
            </button>
            <div className="mt-12 border-t border-white/15 pt-6">
              <p className="text-sm text-white/60">Trusted by leaders at {CLIENTS.join(", ")}</p>
              {TESTIMONIAL && (
                <blockquote className="mt-4 max-w-xl text-white/90">
                  “{TESTIMONIAL.quote}”
                  <footer className="mt-2 text-sm text-white/60">{TESTIMONIAL.name}, {TESTIMONIAL.title}</footer>
                </blockquote>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className={`${bebas.className} text-3xl text-[#0b2a6a]`}>What Authority Quotient measures</h2>
          <p className="mt-4 leading-7 text-slate-600">{content.overview.body}</p>
          {aq.profiles.length > 0 && (
            <>
              <h3 className="mt-10 font-bold text-[#0b2a6a]">The AQ profiles</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {aq.profiles.map((p) => (
                  <li key={p.key} className="border-t border-slate-200 py-3 text-slate-700">{p.name}</li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-10 text-sm text-slate-600">
            Want the full framework first? <Link href="/authority-quotient" className="font-semibold text-[#0b2a6a] underline">Read about Authority Quotient</Link>.
          </p>
        </section>

        <footer className="px-6 pb-10 text-center text-xs text-slate-500">
          <Link href="/privacy" className="underline">Privacy</Link>
        </footer>
      </main>
    );
  }

  /* ---------- thank you ---------- */
  if (stage === "done") {
    return (
      <main className="flex min-h-screen items-center bg-[#f6f7fb] px-6 py-16">
        <section className="mx-auto max-w-lg bg-white p-8 text-center sm:p-10">
          <CheckCircle2 size={48} className="mx-auto text-[#0b2a6a]" />
          <h1 className={`${bebas.className} mt-4 text-4xl text-[#0b2a6a]`}>Thank you, {form.name.trim().split(/\s+/)[0]}!</h1>
          <p className="mt-3 leading-7 text-slate-600">
            Your assessment has been submitted. Your AQ score and detailed result will be sent to{" "}
            <strong className="text-[#0b2a6a]">{form.email.trim()}</strong> shortly.
          </p>
          <p className="mt-3 text-sm text-slate-500">Can&apos;t see it? Check your spam or promotions folder.</p>
        </section>
      </main>
    );
  }

  /* ---------- email gate ---------- */
  if (stage === "gate") {
    const field = (name) => fieldErrors[name]?.[0];
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-16">
        <form onSubmit={submit} noValidate className="mx-auto max-w-lg bg-white p-8">
          <h1 className={`${bebas.className} text-4xl text-[#0b2a6a]`}>See your AQ result</h1>
          <p className="mt-2 text-sm text-slate-600">Tell us where to send it. Your AQ score and detailed profile will be emailed to you.</p>

          {[
            ["name", "Name", "text", "name"],
            ["email", "Email", "email", "email"],
            ["phone", "Phone number", "tel", "tel"],
          ].map(([key, label, type, auto]) => (
            <div key={key} className="mt-5">
              <label htmlFor={key} className="mb-1 block text-sm font-semibold text-[#0b2a6a]">{label}</label>
              <input
                id={key} type={type} autoComplete={auto} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                aria-invalid={!!field(key)} aria-describedby={field(key) ? `${key}-error` : undefined}
                className="w-full rounded border border-slate-300 px-4 py-3 text-sm"
              />
              {field(key) && <p id={`${key}-error`} className="mt-1 text-sm text-red-700">{field(key)}</p>}
            </div>
          ))}

          {/* honeypot — hidden from people and screen readers */}
          <div aria-hidden="true" className="absolute left-[-9999px]">
            <label htmlFor="website">Website</label>
            <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>

          {submitError && <p role="alert" className="mt-5 text-sm text-red-700">{submitError}</p>}

          <button type="submit" disabled={submitting} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded bg-[#0b2a6a] px-6 py-3 font-bold text-white disabled:opacity-60">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Submit"}
          </button>
          <p className="mt-4 text-xs text-slate-500">By continuing you agree to our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
          <button type="button" onClick={() => setStage("quiz")} className="mt-4 text-sm font-semibold text-[#0b2a6a]">
            <ArrowLeft size={14} className="mr-1 inline" /> Back to questions
          </button>
        </form>
      </main>
    );
  }

  /* ---------- quiz ---------- */
  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-12 sm:py-20">
      <section className="mx-auto max-w-3xl bg-white p-6 sm:p-10">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Authority Quotient assessment</span>
          <span>{step + 1} of {questions.length}</span>
        </div>
        <div className="mt-3 h-2 bg-slate-100" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={step + 1}>
          <div className="h-full bg-[#f9bd0e] transition-all duration-200" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
        <h1 className={`${bebas.className} mt-9 text-3xl leading-tight text-[#0b2a6a] sm:text-4xl`}>{question.prompt}</h1>
        <div className="mt-7 space-y-3">
          {question.options.map((option) => (
            <button
              key={option._id} type="button" aria-pressed={selected === option._id}
              onClick={() => setAnswers((a) => ({ ...a, [question._id]: option._id }))}
              className={`w-full rounded border p-4 text-left text-sm leading-6 transition ${
                selected === option._id ? "border-[#0b2a6a] bg-[#0b2a6a] text-white" : "border-slate-200 hover:border-[#f9bd0e] hover:bg-[#fffaea]"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <button type="button" onClick={() => (step === 0 ? setStage("landing") : setStep((s) => s - 1))} className="rounded border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0b2a6a]">
            Back
          </button>
          <button type="button" disabled={!selected} onClick={next} className="inline-flex items-center gap-2 rounded bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
            {isLast ? "Continue" : "Next"} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}