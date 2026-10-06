"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function AQAssessmentPage() {
  const router = useRouter();
  const [aq, setAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [scoring, setScoring] = useState(false);

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
  const score = result?.score ?? 0;
  const resultProfile = result?.profile;

  function chooseAnswer(optionIndex) {
    setAnswers((current) => {
      const next = [...current];
      next[step] = optionIndex;
      return next;
    });
  }

  async function finishAssessment() {
    try {
      setScoring(true);
      setScoreError("");
      const response = await fetch("/api/aq/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to calculate your AQ result.");
      setResult(data);
      setComplete(true);
    } catch (scoreError) {
      setScoreError(scoreError.message || "Unable to calculate your AQ result.");
    } finally {
      setScoring(false);
    }
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setComplete(false);
    setResult(null);
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

  if (complete) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-12 sm:py-20">
        <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-[#0b2a6a] px-7 py-10 text-center text-white sm:px-12 sm:py-14">
            <span className="inline-flex rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f9bd0e]">
              Your AQ result
            </span>
            <p className={`${bebas.className} mt-5 text-6xl text-[#f9bd0e]`}>{score}</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Assessment score</p>
            {resultProfile ? (
              <>
                <h1 className={`${bebas.className} mt-7 text-4xl uppercase leading-tight sm:text-5xl`}>
                  {resultProfile.headline}
                </h1>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-[#f9bd0e]">{resultProfile.name}</p>
              </>
            ) : (
              <h1 className={`${bebas.className} mt-7 text-4xl uppercase`}>Your score is ready</h1>
            )}
          </div>
          <div className="space-y-7 p-7 sm:p-10">
            {resultProfile ? (
              <>
                <p className="text-base leading-7 text-slate-600">{resultProfile.description}</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {resultProfile.strengths?.length > 0 && (
                    <div>
                      <h2 className="font-bold text-[#0b2a6a]">Strengths</h2>
                      <ul className="mt-3 space-y-2">
                        {resultProfile.strengths.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-sm text-slate-600"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {resultProfile.watchOuts?.length > 0 && (
                    <div>
                      <h2 className="font-bold text-[#0b2a6a]">Areas to watch</h2>
                      <ul className="mt-3 space-y-2">
                        {resultProfile.watchOuts.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-sm text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f9bd0e]" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                {resultProfile.recommendedService && (
                  <div className="rounded-xl bg-[#fffaea] p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#a77b00]">Recommended CCC service</p>
                    <p className="mt-1 font-semibold text-[#0b2a6a]">{resultProfile.recommendedService}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                Your score does not currently fall within a configured result profile. Please contact CCC for help interpreting your result.
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-slate-50">
                <RotateCcw size={16} /> Retake assessment
              </button>
              <Link href="/contact-us" className="rounded-xl bg-[#f9bd0e] px-5 py-3 text-sm font-bold text-[#0b2a6a] hover:bg-[#f5c93e]">
                Talk to CCC
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const question = questions[step];
  const selected = answers[step];
  const progress = ((step + 1) / questions.length) * 100;

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
                key={`${option.text}-${index}`}
                type="button"
                aria-pressed={selected === index}
                onClick={() => chooseAnswer(index)}
                className={`w-full rounded-xl border p-4 text-left text-sm leading-6 transition ${
                  selected === index
                    ? "border-[#0b2a6a] bg-[#0b2a6a] font-medium text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#f9bd0e] hover:bg-[#fffaea]"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
          {scoreError && <p role="alert" className="mt-5 text-sm text-red-700">{scoreError}</p>}
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
              disabled={selected === undefined || scoring}
              onClick={() => step === questions.length - 1 ? finishAssessment() : setStep((current) => current + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {scoring ? "Calculating..." : step === questions.length - 1 ? "See my result" : "Next question"}
              {scoring ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
