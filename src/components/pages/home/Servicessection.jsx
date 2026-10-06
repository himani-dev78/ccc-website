"use client";

import { useState } from "react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: yellow #f9bd0e (primary) · white · black
 * Tabs act as filters: click one to spotlight its cards, click again to show all.
 * Edit TABS / CARDS freely. Each card's `tab` must match a tab id.
 */
const TABS = [
  { id: "communicate", label: "Communicate with Impact" },
  { id: "relationships", label: "Build Stronger Relationships" },
  { id: "grow", label: "Grow Your Brand & Skills" },
];

const CARDS = [
  {
    tab: "communicate",
    title: "Ace Your Meetings",
    href: "/services/ace-your-meetings",
    points: [
      "Build instant credibility",
      "The art of giving advice",
      "How to confront positively",
      "Rebuild trust with a stakeholder",
    ],
  },
  {
    tab: "relationships",
    title: "Networking Conversations",
    href: "/services/networking-conversations",
    points: [
      "Build a foundation for persuasion",
      "Craft a persuasive introduction",
      "Navigate networking conversations",
      "Deliver a persuasive close",
    ],
  },
  {
    tab: "communicate",
    title: "Storytelling for Business",
    href: "/services/storytelling",
    points: [
      "Command the boardroom",
      "Overcome data overwhelm",
      "Win clients with story power",
      "Ignite team action",
    ],
  },
  {
    tab: "relationships",
    title: "Team Synergy",
    href: "/services/team-synergy",
    points: [
      "Build genuine connections",
      "Embrace productive conflict",
      "Develop a shared vision",
      "Create a culture of feedback",
    ],
  },
  {
    tab: "grow",
    title: "Brand You",
    href: "/services/brand-you",
    points: [
      "Define your brand essence",
      "Communicate your brand narrative",
      "Establish your brand presence",
      "Champion your brand",
    ],
  },
  {
    tab: "grow",
    title: "Instructional Design & Facilitation",
    href: "/services/instructional-design",
    points: [
      "Understand how people learn",
      "Design intuitive learning experiences",
      'Spark "aha!" moments',
      "Manage difficult participants",
    ],
  },
];

function Chevron({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

/* Line-art document / envelope / pencil, echoing the reference icon */
function ServiceIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 10h30v30H8z" />
      <path d="M14 18h10M14 24h14M14 30h8" />
      <circle cx="30" cy="30" r="2.5" />
      <path d="M26 40h30v18H26z" />
      <path d="m26 40 15 11 15-11" />
      <path d="M50 8v22l3.5 5L57 30V8a3.5 3.5 0 0 0-7 0Z" />
    </svg>
  );
}

export default function ServicesSection() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="home-services"
      aria-labelledby="services-tabs"
      className="scroll-mt-24 bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Tab row */}
        <div
          id="services-tabs"
          role="group"
          aria-label="Filter programs"
          className="grid gap-6 md:grid-cols-3 md:gap-10"
        >
          {TABS.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(on ? null : t.id)}
                className={`group flex items-center justify-between gap-4 border-b-2 pb-4 text-left text-xl font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${
                  on
                    ? "border-black text-black"
                    : "border-[#062970] text-[#062970] hover:border-black"
                }`}
              >
                {t.label}
                <Chevron
                  className={`shrink-0 transition-transform ${
                    on ? "rotate-90" : "group-hover:translate-x-1"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CARDS.map((c, i) => {
            const dark = i % 2 === 0;
            const dim = active && active !== c.tab;

            return (
              <li
                key={c.title}
                className={`transition-opacity duration-300 ${
                  dim ? "opacity-35" : "opacity-100"
                }`}
              >
                <article
                  className={`group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_18px_0_-6px_#f9bd0e] focus-within:-translate-y-3 focus-within:shadow-[0_18px_0_-6px_#f9bd0e] ${
                    dark
                      ? "bg-[#0d0d0d] text-white"
                      : "bg-[#a0baef] text-black"
                  }`}
                >
                  {/* Watermark icon */}
                  <ServiceIcon
                    className={`pointer-events-none absolute -bottom-4 -right-4 h-40 w-40 ${
                      dark ? "text-[#f9bd0e]/15" : "text-black/10"
                    }`}
                  />

                  <ServiceIcon
                    className={`h-12 w-12 ${
                      dark ? "text-[#f9bd0e]" : "text-black"
                    }`}
                  />

                  <h3
                    className={`${bebas.className} mt-6 text-[38px] uppercase leading-[1.02] tracking-wide`}
                  >
                    {c.title}
                  </h3>

                  <span className="mt-5 block h-1.5 w-16 rounded-full bg-[#f9bd0e]" />

                  <ul className="relative mt-6 space-y-3 text-[16px] leading-snug">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-[0.7em] h-0.5 w-3 shrink-0 bg-[#f9bd0e]"
                        />
                        <span className={dark ? "text-white/85" : "text-black/80"}>
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={c.href}
                    className={`relative mt-auto inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                      dark
                        ? "mt-8 bg-[#f9bd0e] text-black hover:bg-white focus-visible:outline-white"
                        : "mt-8 bg-black text-white hover:bg-[#f9bd0e] hover:text-black focus-visible:outline-black"
                    }`}
                  >
                    Learn more
                    <Chevron className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 h-px w-full bg-black" />
      </div>
    </section>
  );
}