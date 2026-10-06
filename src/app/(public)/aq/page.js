"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Gauge,
  Handshake,
  Lightbulb,
  Loader2,
  MessageSquareWarning,
  Presentation,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import { defaultAQ } from "@/lib/aqDefaults";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const situationIcons = {
  UsersRound,
  Presentation,
  MessageSquareWarning,
  Users,
  Handshake,
  Lightbulb,
  Gauge,
};

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
      {children}
    </span>
  );
}

function HighlightHeading({ data, className = "" }) {
  return (
    <h2 className={`${bebas.className} ${className}`}>
      {data.heading} <span className="text-[#f9bd0e]">{data.accent}</span>
    </h2>
  );
}

export default function AuthorityQuotientPage() {
  const [aq, setAq] = useState(defaultAQ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAQ() {
      try {
        const response = await fetch("/api/aq", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load AQ content.");
        if (!data?.aq?.content) throw new Error("The AQ content response was not in the expected format.");
        setAq({
          ...defaultAQ,
          ...data.aq,
          content: { ...defaultAQ.content, ...data.aq.content },
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          console.error("Load AQ page error:", loadError);
          setError(loadError.message || "Unable to load AQ content.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAQ();
    return () => controller.abort();
  }, []);

  const content = aq.content;
  const questionCount = aq.questions?.length || 0;
  const profiles = aq.profiles || [];

  return (
    <main className="bg-white">
      {error && (
        <p role="alert" className="mx-auto max-w-5xl px-6 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && (
        <div className="sr-only" role="status">
          <Loader2 className="animate-spin" /> Loading AQ content
        </div>
      )}

      <section className="relative overflow-hidden bg-[#0b2a6a] py-24 text-white lg:py-32">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div aria-hidden className={`${bebas.className} pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap text-[clamp(5rem,16vw,13rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.1)]`}>AQ</div>
        <div className="relative mx-auto max-w-[850px] px-6 text-center lg:px-10">
          <SectionLabel>{content.hero.eyebrow}</SectionLabel>
          <h1 className={`${bebas.className} mt-6 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.98]`}>
            {content.hero.title} <span className="text-[#f9bd0e]">{content.hero.accent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">{content.hero.description}</p>
          {content.hero.secondary && <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">{content.hero.secondary}</p>}
          <Link href="/authority-quotient/assessment" className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-9 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}>
            {content.hero.button} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[800px] px-6 py-20 text-center lg:px-10 lg:py-28">
        <SectionLabel>{content.overview.eyebrow}</SectionLabel>
        <HighlightHeading data={content.overview} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]" />
        <p className="mt-6 text-[16px] leading-relaxed text-slate-600">{content.overview.body}</p>
      </section>

      <section className="bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <div className="text-center">
            <SectionLabel>{content.why.eyebrow}</SectionLabel>
            <HighlightHeading data={content.why} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]" />
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-slate-600">{content.why.body}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-3">
            {(content.why.points || []).map((point, index) => (
              <div key={`${point}-${index}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#f9bd0e]" />
                <p className="text-[15px] font-medium text-[#0b2a6a]">{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/authority-quotient/assessment" className={`${bebas.className} group inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-8 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}>
              {content.assessment.button} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b2a6a] py-24 text-white lg:py-32">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f9bd0e] text-[#0b2a6a]"><Gauge className="h-7 w-7" /></span>
          <HighlightHeading data={content.assessment} className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.98]" />
          <p className="mt-5 text-[15px] font-bold uppercase tracking-wide text-[#f9bd0e]">
            {questionCount} {questionCount === 1 ? "question" : "questions"} · {content.assessment.duration}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/75">{content.assessment.body}</p>
          {(content.assessment.steps || []).length > 0 && (
            <div className="mt-16 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {content.assessment.steps.map((step, index) => (
                <div key={`${step.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                  <span className={`${bebas.className} text-4xl text-[#f9bd0e]/50`}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-[16px] font-bold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{step.text}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/authority-quotient/assessment" className={`${bebas.className} group mt-14 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-10 py-5 text-2xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}>
            {content.assessment.button} <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="text-center">
          <SectionLabel>{content.profile.eyebrow}</SectionLabel>
          <HighlightHeading data={content.profile} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]" />
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-slate-600">{content.profile.body}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-2">
            {(content.profile.fields || []).map((field, index) => (
              <div key={`${field}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5">
                <Sparkles className="h-4 w-4 shrink-0 text-[#f9bd0e]" />
                <p className="text-[14.5px] font-semibold text-[#0b2a6a]">{field}</p>
              </div>
            ))}
          </div>
          {profiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {profiles.map((profile, index) => (
                <article key={`${profile.name}-${index}`} className="rounded-2xl border border-slate-200 bg-[#f6f7fb] p-6">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-[#a77b00]">
                    <Sparkles className="h-3.5 w-3.5" /> AQ profile · {profile.minScore}–{profile.maxScore}
                  </span>
                  <p className={`${bebas.className} mt-3 text-3xl uppercase text-[#0b2a6a]`}>{profile.headline}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{profile.name}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{profile.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#0b2a6a]/20 bg-[#f6f7fb] p-7">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400"><Sparkles className="h-3.5 w-3.5" />{content.profile.exampleLabel}</span>
              <p className={`${bebas.className} mt-3 text-3xl uppercase text-[#0b2a6a]/70`}>{content.profile.exampleHeadline}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-500">{content.profile.exampleDescription}</p>
              {content.profile.exampleNote && <p className="mt-4 text-[13px] italic text-slate-400">{content.profile.exampleNote}</p>}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <SectionLabel>{content.leadership.eyebrow}</SectionLabel>
          <HighlightHeading data={content.leadership} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]" />
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">{content.leadership.body}</p>
          {content.leadership.secondary && <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{content.leadership.secondary}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{content.workplace.eyebrow}</SectionLabel>
          <HighlightHeading data={content.workplace} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]" />
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">{content.workplace.body}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(content.workplace.situations || []).map((item, index) => {
            const Icon = situationIcons[item.icon] || Lightbulb;
            return (
              <div key={`${item.title}-${index}`} className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-18px_rgba(11,42,106,0.3)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e] transition-colors group-hover:bg-[#f9bd0e] group-hover:text-[#0b2a6a]"><Icon className="h-5.5 w-5.5" /></span>
                <h3 className="mt-5 text-[17px] font-bold text-[#0b2a6a]">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>{content.action.eyebrow}</SectionLabel>
            <HighlightHeading data={content.action} className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98]" />
            <p className="mt-6 text-[16px] leading-relaxed text-white/70">{content.action.body}</p>
          </div>
          {(content.action.services || []).length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.action.services.map((service, index) => (
                <div key={`${service}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
                  <Compass className="h-4.5 w-4.5 shrink-0 text-[#f9bd0e]" />
                  <p className="text-[15px] font-semibold text-white">{service}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link href="/services" className={`${bebas.className} group inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}>
              {content.action.button} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 lg:py-32">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#f9bd0e]/60" />
          <HighlightHeading data={content.finalCta} className={`${bebas.className} mt-6 text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.98] text-[#0b2a6a]`} />
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-slate-600">{content.finalCta.body}</p>
          <Link href="/authority-quotient/assessment" className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-9 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}>
            {content.finalCta.button} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
