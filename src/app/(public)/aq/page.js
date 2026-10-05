"use client";

import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import {
  ArrowRight,
  Gauge,
  Users2,
  Presentation,
  MessageSquareWarning,
  UsersRound,
  Handshake,
  ClipboardCheck,
  Sparkles,
  Compass,
  Info,
} from "lucide-react";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: navy #0b2a6a · yellow #f9bd0e · white · black
 * Content source: CCC-BUILD-SPEC(1).
 *
 * Important: the spec explicitly says not to invent final AQ profile
 * names/dimensions. The schema examples (driver/connector/analyst/coach,
 * "The Connector") are shown ONLY as a labeled, illustrative example —
 * swap EXAMPLE_PROFILE for real CMS data once CCC confirms the public
 * profile set.
 */

const GAP_POINTS = [
  "How your ideas are received",
  "How you contribute in important conversations",
  "How effectively you communicate your thinking",
  "How your expertise translates into influence",
  "Where your leadership authority can be strengthened",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Answer",
    text: "Complete 16 questions about how you communicate, contribute and lead.",
  },
  {
    step: "02",
    title: "Discover",
    text: "Receive your AQ score and profile.",
  },
  {
    step: "03",
    title: "Understand",
    text: "Explore the strengths and areas to watch associated with your profile.",
  },
  {
    step: "04",
    title: "Take the next step",
    text: "Explore relevant CCC resources or start a conversation about developing your leadership.",
  },
];

// Schema example only — not the confirmed public profile. See note above.
const EXAMPLE_PROFILE = {
  name: "Connector",
  headline: "The Connector",
  description:
    "An illustrative example only — the schema supports a profile name, headline, description, strengths, watch-outs and a recommended CCC service per result.",
};

const WORKPLACE_SITUATIONS = [
  {
    icon: UsersRound,
    title: "Meetings",
    text: "How effectively do your contributions influence the conversation?",
  },
  {
    icon: Presentation,
    title: "Presentations",
    text: "How does your expertise translate into a message people remember?",
  },
  {
    icon: MessageSquareWarning,
    title: "Difficult conversations",
    text: "How do you communicate when the stakes are high?",
  },
  {
    icon: Users2,
    title: "Team interactions",
    text: "How do people respond to your leadership and ideas?",
  },
  {
    icon: Handshake,
    title: "Client conversations",
    text: "How effectively do you establish credibility and influence?",
  },
];

const SERVICES = [
  "Ace Your Meetings",
  "Networking Conversations",
  "Storytelling for Business",
  "Team Synergy",
  "Brand You",
  "Instructional Design & Facilitation",
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
      {children}
    </span>
  );
}

export default function AuthorityQuotientPage() {
  return (
    <main className="bg-white">
      {/* ───────────────────── 1. HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-24 text-white lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div
          aria-hidden
          className={`${bebas.className} pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap text-[clamp(5rem,16vw,13rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.1)]`}
        >
          AQ
        </div>

        <div className="relative mx-auto max-w-[850px] px-6 text-center lg:px-10">
          <SectionLabel>Authority Quotient</SectionLabel>
          <h1
            className={`${bebas.className} mt-6 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.98]`}
          >
            How much authority do you{" "}
            <span className="text-[#f9bd0e]">command in the room?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Authority Quotient (AQ) is CCC for Leaders' framework for
            understanding how much authority a leader actually commands in a
            room — and how to raise it.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            You may have the expertise, experience and ideas. But how
            effectively does that expertise translate into influence?
          </p>

          <Link
            href="/authority-quotient/assessment"
            className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-9 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}
          >
            Discover My AQ
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ───────────────────── 2. WHAT IS AQ ───────────────────── */}
      <section className="mx-auto max-w-[800px] px-6 py-20 text-center lg:px-10 lg:py-28">
        <SectionLabel>What is Authority Quotient?</SectionLabel>
        <h2
          className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
        >
          Expertise is valuable.{" "}
          <span className="text-[#f9bd0e]">
            Authority determines how it lands.
          </span>
        </h2>
        <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
          Authority Quotient looks at the way a leader's contribution is
          experienced in the room. It gives leaders a framework for
          understanding their current Authority Quotient and identifying
          opportunities to strengthen it.
        </p>
      </section>

      {/* ───────────────────── 3. WHY AQ MATTERS ───────────────────── */}
      <section className="bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <div className="text-center">
            <SectionLabel>Why AQ matters</SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
            >
              You can know the answer and{" "}
              <span className="text-[#f9bd0e]">
                still struggle to move the room.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-slate-600">
              A leader's expertise is only part of the equation. The way you
              communicate, contribute and engage with others can affect how your
              expertise is received. AQ gives leaders a way to examine that gap.
              It can help you think about:
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl gap-3">
            {GAP_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#f9bd0e]" />
                <p className="text-[15px] font-medium text-[#0b2a6a]">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/authority-quotient/assessment"
              className={`${bebas.className} group inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-8 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
            >
              Take the AQ Assessment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────── 4. AQ ASSESSMENT (biggest CTA) ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-24 text-white lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f9bd0e] text-[#0b2a6a]">
            <Gauge className="h-7 w-7" />
          </span>
          <h2
            className={`${bebas.className} mt-6 text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.98]`}
          >
            Discover your{" "}
            <span className="text-[#f9bd0e]">Authority Quotient</span>
          </h2>
          <p className="mt-5 text-[15px] font-bold uppercase tracking-wide text-[#f9bd0e]">
            16 questions &middot; Approximately 2 minutes
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/75">
            Answer questions based on how you typically respond in workplace
            situations. Your answers are used to calculate your AQ and generate
            an AQ profile.
          </p>

          {/* How it works */}
          <div className="mt-16 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <span
                  className={`${bebas.className} text-4xl text-[#f9bd0e]/50`}
                >
                  {step.step}
                </span>
                <h3 className="mt-2 text-[16px] font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/authority-quotient/assessment"
            className={`${bebas.className} group mt-14 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-10 py-5 text-2xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}
          >
            Find My AQ Score
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ───────────────────── 5. YOUR AQ PROFILE ───────────────────── */}
      <section className="mx-auto max-w-[1000px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="text-center">
          <SectionLabel>Your AQ Profile</SectionLabel>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            More than <span className="text-[#f9bd0e]">a score</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Your AQ result includes a profile designed to give you a more useful
            picture of how your authority shows up.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* What the profile includes */}
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Profile name",
              "Headline",
              "Description",
              "Strengths",
              "Watch-outs",
              "Recommended CCC service",
            ].map((field) => (
              <div
                key={field}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-[#f9bd0e]" />
                <p className="text-[14.5px] font-semibold text-[#0b2a6a]">
                  {field}
                </p>
              </div>
            ))}
          </div>

          {/* Illustrative example — clearly labeled, not the final public set */}
          <div className="rounded-2xl border-2 border-dashed border-[#0b2a6a]/20 bg-[#f6f7fb] p-7">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
              <Info className="h-3.5 w-3.5" />
              Schema example — not final
            </span>
            <p
              className={`${bebas.className} mt-3 text-3xl uppercase text-[#0b2a6a]/70`}
            >
              "{EXAMPLE_PROFILE.headline}"
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-500">
              {EXAMPLE_PROFILE.description}
            </p>
            <p className="mt-4 text-[13px] italic text-slate-400">
              Final AQ profile names and dimensions to be confirmed by CCC —
              this field stays dynamic in the CMS.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────── 6. AQ AND LEADERSHIP ───────────────────── */}
      <section className="bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <SectionLabel>AQ and Leadership</SectionLabel>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Authority is{" "}
            <span className="text-[#f9bd0e]">
              experienced, not simply assigned.
            </span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            Job title can give someone formal authority. AQ is concerned with
            the authority a leader actually commands in the room — that
            distinction is central to CCC's new positioning.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
            This is also where AQ connects to specific applications of the
            framework — including how it shows up for introverted leaders —
            explored as one application of AQ, not a separate organising idea.
          </p>
        </div>
      </section>

      {/* ───────────────────── 7. AQ IN THE WORKPLACE ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>AQ in the Workplace</SectionLabel>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Where does{" "}
            <span className="text-[#f9bd0e]">Authority Quotient matter?</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            You can connect AQ to situations leaders encounter every day.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORKPLACE_SITUATIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-18px_rgba(11,42,106,0.3)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e] transition-colors group-hover:bg-[#f9bd0e] group-hover:text-[#0b2a6a]">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-[#0b2a6a]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────── 8. FROM AQ TO ACTION ───────────────────── */}
      <section className="bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>From AQ to Action</SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98]`}
            >
              Knowing your AQ is{" "}
              <span className="text-[#f9bd0e]">the starting point.</span>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-white/70">
              The assessment is designed to introduce people to the framework.
              For organisations that want to go further, CCC can connect AQ
              insights with its existing interventions:
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4"
              >
                <Compass className="h-4.5 w-4.5 shrink-0 text-[#f9bd0e]" />
                <p className="text-[15px] font-semibold text-white">
                  {service}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className={`${bebas.className} group inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}
            >
              Explore Our Services
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────── 9. FINAL CTA ───────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <ClipboardCheck className="mx-auto h-10 w-10 text-[#f9bd0e]/60" />
          <h2
            className={`${bebas.className} mt-6 text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            What is your{" "}
            <span className="text-[#f9bd0e]">Authority Quotient?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-slate-600">
            You don't need hours to get started. 16 questions. About two
            minutes. Discover your AQ and get a clearer starting point for your
            leadership development.
          </p>
          <Link
            href="/authority-quotient/assessment"
            className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-9 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
          >
            Discover My AQ
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
