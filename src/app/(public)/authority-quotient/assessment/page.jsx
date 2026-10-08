"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

const fields = [
  { key: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { key: "email", label: "Email address", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  { key: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "+91 98765 43210" },
];

export default function AQAssessmentPage() {
  const [aq, setAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState([]); // option index per question
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState("quiz"); // quiz | form | done
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAQ() {
      try {
        const response = await fetch("/api/aq", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load assessment.");
        setAQ(data.aq);
      } catch (loadError) {
        if (loadError.name !== "AbortError") setLoadError(loadError.message || "Unable to load assessment.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAQ();
    return () => controller.abort();
  }, []);

  const questions = aq?.questions || [];
  const profiles = aq?.profiles || [];

  function chooseAnswer(optionIndex) {
    setAnswers((current) => {
      const next = [...current];
      next[step] = optionIndex;
      return next;
    });
  }

  function validate() {
    const errors = {};
    if (form.name.trim().length < 2) errors.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 7 || !/^\+?[0-9\s\-()]{7,20}$/.test(form.phone.trim())) {
      errors.phone = "Please enter a valid phone number";
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    setSubmitError("");
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    const params = new URLSearchParams(window.location.search);
    try {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          source: params.get("utm_source") || "",
          campaign: params.get("utm_campaign") || "",
          answers: questions.map((question, index) => ({
            questionId: question._id,
            optionId: question.options[answers[index]]?._id,
          })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const serverErrors = Object.fromEntries(
          Object.entries(data?.errors || {}).map(([key, messages]) => [key, messages?.[0]]),
        );
        setFieldErrors(serverErrors);
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }
      setStage("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center gap-3 text-sm text-slate-500">
        <Loader2 size={22} className="animate-spin text-[#0b2a6a]" /> Loading assessment...
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className={`${bebas.className} text-4xl uppercase text-[#0b2a6a]`}>Assessment unavailable</h1>
        <p role="alert" className="mt-3 text-sm text-slate-600">{loadError}</p>
      </main>
    );
  }

  if (questions.length === 0 || profiles.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className={`${bebas.className} text-4xl uppercase text-[#0b2a6a]`}>Assessment coming soon</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The AQ assessment is being prepared. Please check back soon.
        </p>
        <Link href="/aq" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0b2a6a]">
          <ArrowLeft size={17} /> Back to Authority Quotient
        </Link>
      </main>
    );
  }

  /* ---------- thank you ---------- */
  if (stage === "done") {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-12 sm:py-20">
        <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white text-center shadow-xl">
          <div className="bg-[#0b2a6a] px-7 py-12 text-white sm:px-12">
            <CheckCircle2 size={52} className="mx-auto text-[#f9bd0e]" />
            <h1 className={`${bebas.className} mt-5 text-4xl uppercase leading-tight sm:text-5xl`}>
              Thank you, {form.name.trim().split(/\s+/)[0]}!
            </h1>
            <p className="mt-3 text-white/80">Your assessment has been submitted.</p>
          </div>
          <div className="space-y-5 p-7 sm:p-10">
            <p className="text-base leading-7 text-slate-600">
              We&apos;re preparing your detailed Authority Quotient result — your AQ score, your profile, your strengths
              and the areas to watch. It will be sent to <strong className="text-[#0b2a6a]">{form.email.trim()}</strong> shortly.
            </p>
            <p className="text-sm text-slate-500">Can&apos;t see it? Check your spam or promotions folder.</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/aq" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-slate-50">
                Learn about AQ
              </Link>
              <Link href="/contact-us" className="rounded-xl bg-[#f9bd0e] px-5 py-3 text-sm font-bold text-[#0b2a6a] hover:bg-[#f5c93e]">
                Talk to CCC
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* ---------- details form ---------- */
  if (stage === "form") {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-12 sm:py-20">
        <section className="mx-auto max-w-xl">
          <button
            type="button"
            onClick={() => setStage("quiz")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]"
          >
            <ArrowLeft size={17} /> Back to questions
          </button>
          <form onSubmit={handleSubmit} noValidate className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a77b00]">Almost there</span>
            <h1 className={`${bebas.className} mt-3 text-4xl uppercase leading-tight text-[#0b2a6a]`}>See your AQ result</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tell us where to send it. Your AQ score and detailed profile will be emailed to you.
            </p>

            {fields.map((field) => (
              <div key={field.key} className="mt-5">
                <label htmlFor={field.key} className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">
                  {field.label} <span className="text-red-600">*</span>
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  aria-invalid={Boolean(fieldErrors[field.key])}
                  aria-describedby={fieldErrors[field.key] ? `${field.key}-error` : undefined}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-[#0b2a6a] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30 ${
                    fieldErrors[field.key] ? "border-red-400" : "border-slate-200 focus:border-[#f9bd0e]"
                  }`}
                />
                {fieldErrors[field.key] && (
                  <p id={`${field.key}-error`} className="mt-1 text-sm text-red-700">{fieldErrors[field.key]}</p>
                )}
              </div>
            ))}

            {/* honeypot — hidden from people and screen readers */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => setForm({ ...form, website: event.target.value })}
              />
            </div>

            {submitError && <p role="alert" className="mt-5 text-sm text-red-700">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <p className="mt-4 text-center text-xs text-slate-500">We&apos;ll only use your details to send your result and follow up about AQ.</p>
          </form>
        </section>
      </main>
    );
  }

  /* ---------- quiz ---------- */
  const question = questions[step];
  const selected = answers[step];
  const progress = ((step + 1) / questions.length) * 100;
  const isLast = step === questions.length - 1;

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-12 sm:py-20">
      <section className="mx-auto max-w-3xl">
        <Link href="/aq" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]">
          <ArrowLeft size={17} /> Back to Authority Quotient
        </Link>
        <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a77b00]">Authority Quotient assessment</span>
            <span className="text-sm font-semibold text-slate-500">{step + 1} / {questions.length}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#f9bd0e] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <h1 className={`${bebas.className} mt-9 text-3xl uppercase leading-tight text-[#0b2a6a] sm:text-4xl`}>
            {question.prompt}
          </h1>
          <div className="mt-7 space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option._id}
                type="button"
                aria-pressed={selected === index}
                onClick={() => chooseAnswer(index)}
                className={`w-full rounded-xl border p-4 text-left text-sm leading-6 transition ${
                  selected === index
                    ? "border-[#0b2a6a] bg-[#0b2a6a] font-medium text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#f9bd0e] hover:bg-[#fffaea]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0b2a6a] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={selected === undefined}
              onClick={() => (isLast ? setStage("form") : setStep((current) => current + 1))}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLast ? "See your result" : "Next question"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
