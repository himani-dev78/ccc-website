import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bebas_Neue } from "next/font/google";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { CASE_STUDIES, getCaseStudyBySlug } from "./caseStudies";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Route: app/work/[slug]/page.js
 * Next.js passes `params.slug` automatically for a dynamic segment.
 */

// Pre-render all seven known case studies at build time.
export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }) {
  const cs = getCaseStudyBySlug(params.slug);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.client} — ${cs.title} | CCC for Leaders`,
    description: cs.shortDescription,
  };
}

function Narrative({ heading, content }) {
  const hasContent = content && content.trim().length > 0;
  return (
    <div>
      <h2
        className={`${bebas.className} text-2xl uppercase tracking-wide text-[#0b2a6a]`}
      >
        {heading}
      </h2>
      <span className="mt-2 block h-1 w-12 rounded-full bg-[#f9bd0e]" />
      {hasContent ? (
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
          {content}
        </p>
      ) : (
        <p className="mt-4 text-[15px] italic leading-relaxed text-slate-400">
          Content pending — to be supplied by CCC.
        </p>
      )}
    </div>
  );
}

export default function CaseStudyPage({ params }) {
  const cs = getCaseStudyBySlug(params.slug);

  if (!cs) {
    notFound();
  }

  const hasQuote = cs.clientQuote && cs.clientQuote.trim().length > 0;
  const hasMetrics = Array.isArray(cs.metrics) && cs.metrics.length > 0;

  return (
    <main className="bg-white">
      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[900px] px-6 lg:px-10">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-[#f9bd0e]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Our Work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {/* Client logo */}
            <div className="flex h-20 w-32 items-center justify-center rounded-xl bg-white p-4">
              <Image
                src={cs.image}
                alt={`${cs.client} logo`}
                width={120}
                height={60}
                className="h-auto max-h-12 w-full object-contain"
              />
            </div>

            <div>
              <span className="inline-flex rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#f9bd0e]">
                {cs.category}
              </span>
              <h1
                className={`${bebas.className} mt-3 text-[clamp(2.25rem,5vw,4rem)] uppercase leading-[0.98]`}
              >
                {cs.client} <span className="text-[#f9bd0e]">— {cs.title}</span>
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">
            {cs.shortDescription}
          </p>
        </div>
      </section>

      {/* ───────────────────── CHALLENGE / APPROACH / OUTCOME ───────────────────── */}
      <section className="mx-auto max-w-[800px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="space-y-12">
          <Narrative heading="Challenge" content={cs.challenge} />
          <Narrative heading="Approach" content={cs.approach} />
          <Narrative heading="Outcome" content={cs.outcome} />
        </div>
      </section>

      {/* ───────────────────── CLIENT PERSPECTIVE ───────────────────── */}
      {hasQuote && (
        <section className="bg-[#f6f7fb] py-16 lg:py-20">
          <div className="mx-auto max-w-[700px] px-6 text-center lg:px-10">
            <Quote className="mx-auto h-9 w-9 text-[#f9bd0e]/60" />
            <p
              className={`${bebas.className} mt-5 text-[clamp(1.75rem,3.5vw,2.5rem)] uppercase leading-[1.08] text-[#0b2a6a]`}
            >
              &ldquo;{cs.clientQuote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {cs.client}
            </p>
          </div>
        </section>
      )}

      {/* ───────────────────── RESULTS / METRICS ───────────────────── */}
      {hasMetrics && (
        <section className="mx-auto max-w-[900px] px-6 py-16 lg:px-10 lg:py-20">
          <h2
            className={`${bebas.className} text-center text-2xl uppercase tracking-wide text-[#0b2a6a]`}
          >
            Results
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {cs.metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#f9bd0e] bg-[#fffaea] p-6 text-center"
              >
                <p className={`${bebas.className} text-4xl text-[#0b2a6a]`}>
                  {m.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────── NEXT CASE STUDY / CTA ───────────────────── */}
      <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-6 text-center lg:px-10">
          <h2
            className={`${bebas.className} text-2xl uppercase tracking-wide text-[#0b2a6a]`}
          >
            See more of our work
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/work"
              className={`${bebas.className} inline-flex items-center gap-2 rounded-xl border-2 border-[#0b2a6a] px-7 py-3.5 text-lg uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-[#0b2a6a] hover:text-white`}
            >
              All Case Studies
            </Link>
            <Link
              href="/contact"
              className={`${bebas.className} group inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-7 py-3.5 text-lg uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-[#0b2a6a] hover:text-white`}
            >
              Talk to CCC
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
