"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { ArrowRight, Briefcase } from "lucide-react";
import { CASE_STUDIES, CATEGORIES } from "@/components/getCaseStudy";


const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
      {children}
    </span>
  );
}

function CaseStudyCard({ cs }) {
  return (
    <Link
      href={`/work/${cs.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-18px_rgba(11,42,106,0.3)]"
    >
      <span className="inline-flex w-fit rounded-full bg-[#0b2a6a]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0b2a6a]/60">
        {cs.category}
      </span>

      <p className={`${bebas.className} mt-5 text-2xl uppercase tracking-wide text-[#0b2a6a]`}>
        {cs.client}
      </p>
      <h3 className="mt-1 text-[17px] font-bold text-[#0b2a6a]">
        {cs.title}
      </h3>

      <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-slate-500">
        {cs.shortDescription}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[#0b2a6a] group-hover:text-[#f9bd0e]">
        View Case Study
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return CASE_STUDIES;
    return CASE_STUDIES.filter((cs) => cs.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="bg-white">
      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <SectionLabel>Our Work</SectionLabel>
          <h1
            className={`${bebas.className} mt-6 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.98]`}
          >
            Real challenges.{" "}
            <span className="text-[#f9bd0e]">Practical interventions.</span>{" "}
            Meaningful outcomes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">
            Explore how CCC for Leaders has worked with organisations to
            strengthen communication, collaboration, leadership and learning.
          </p>
        </div>
      </section>

      {/* ───────────────────── FILTERS + GRID ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10 lg:py-24">
        <div
          role="group"
          aria-label="Filter by intervention type"
          className="flex flex-wrap justify-center gap-2.5"
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-bold transition-colors ${
                  active
                    ? "bg-[#f9bd0e] text-[#0b2a6a]"
                    : "border border-slate-200 text-slate-600 hover:border-[#0b2a6a]/30 hover:text-[#0b2a6a]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f9bd0e]/15">
              <Briefcase className="h-7 w-7 text-[#0b2a6a]" />
            </span>
            <p className="mt-4 text-[15px] text-slate-500">
              No case studies in this category yet.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cs) => (
              <CaseStudyCard key={cs.slug} cs={cs} />
            ))}
          </div>
        )}
      </section>

      {/* ───────────────────── CLIENT PROOF STRIP ───────────────────── */}
      <section className="bg-[#f6f7fb] py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-10">
          <p className="text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]/50">
            Trusted by organisations that expect leadership to deliver
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[...new Set(CASE_STUDIES.map((cs) => cs.client))].map((client) => (
              <span
                key={client}
                className={`${bebas.className} rounded-xl border border-[#0b2a6a]/10 bg-white px-6 py-3 text-xl tracking-wide text-[#0b2a6a] shadow-sm`}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── CTA ───────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <h2
            className={`${bebas.className} text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Ready to see what this looks like{" "}
            <span className="text-[#f9bd0e]">for your team?</span>
          </h2>
          <Link
            href="/contact"
            className={`${bebas.className} group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-9 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
          >
            Talk to CCC
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}