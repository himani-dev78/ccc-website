"use client";

import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import {
  ArrowRight,
  MessageSquare,
  Users2,
  BookOpen,
  Handshake,
  Fingerprint,
  GraduationCap,
  MapPin,
  Award,
  Quote,
  Gauge,
} from "lucide-react";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: navy #0b2a6a · yellow #f9bd0e · white · black
 * Content source: CCC-BUILD-SPEC(1). Where the spec said not to invent
 * details (AQ dimensions/scores, award year/category, street addresses),
 * this file leaves clearly marked placeholders instead of guessing.
 */

const WORK_AREAS = [
  "Leadership development",
  "Communication",
  "Team effectiveness",
  "Storytelling",
  "Meetings",
  "Networking",
  "Personal branding",
  "Instructional design & facilitation",
  "Coaching",
];

const APPROACH = [
  {
    icon: MessageSquare,
    title: "Communicate with clarity",
    text: "Help people express ideas in ways that others can understand and respond to.",
  },
  {
    icon: Users2,
    title: "Build stronger connections",
    text: "Develop the communication and relationship skills that make collaboration more effective.",
  },
  {
    icon: BookOpen,
    title: "Tell better stories",
    text: "Turn information and expertise into stories that people can understand, remember and act on.",
  },
  {
    icon: Handshake,
    title: "Work better together",
    text: "Strengthen the behaviours that help teams collaborate and perform collectively.",
  },
  {
    icon: Fingerprint,
    title: "Build your professional brand",
    text: "Help leaders communicate their value and build a professional identity that reflects their expertise.",
  },
  {
    icon: GraduationCap,
    title: "Facilitate meaningful learning",
    text: "Equip people to design and facilitate learning experiences that are engaging and useful.",
  },
];

const CLIENTS = [
  "ITC",
  "Accenture",
  "PwC",
  "Sony",
  "Tata AIG",
  "Xceedance",
  "Trilegal",
  "Airtel",
  "Ericsson",
  "NatWest",
  "L&T Finance",
];

const LOCATIONS = [
  { city: "Gurgaon", region: "India — NCR" },
  { city: "Mumbai", region: "India" },
  { city: "Cape Town", region: "South Africa" },
];

const CASE_STUDIES = [
  { client: "ITC", program: "Team Synergy" },
  { client: "Accenture", program: "Client Partnering" },
  { client: "Xceedance", program: "High Impact Communication" },
  { client: "Tata AIG", program: "Instructional Design & Facilitation" },
  { client: "Sony", program: "Storytelling for Business" },
  { client: "Trilegal", program: "Coaching for Leaders" },
  { client: "PwC", program: "Storytelling for Business" },
];

// FIX: now accepts a className prop and applies it — previously this was
// passed in (e.g. className="text-white") but silently ignored because the
// component never destructured it.
function SectionLabel({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a] ${className}`}
    >
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-24 text-white lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div
          aria-hidden
          className={`${bebas.className} pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap text-[clamp(5rem,16vw,13rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.1)]`}
        >
          AUTHORITY
        </div>

        <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-10">
          {/* On the navy hero, override the label's default navy text for white */}
          <SectionLabel className="bg-white/10 text-white">
            About Us
          </SectionLabel>
          <h1
            className={`${bebas.className} mt-6 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.98]`}
          >
            Leadership is about{" "}
            <span className="text-[#f9bd0e]">what happens in the room.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            At CCC for Leaders, we help organisations develop leaders who can
            communicate with clarity, build meaningful connections and turn
            expertise into influence.
          </p>
          <p className="mx-auto mt-8 max-w-xl text-[15px] font-semibold uppercase tracking-wide text-[#f9bd0e]">
            How much authority do you actually command in the room?
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            That question led to the development of Authority Quotient (AQ) —
            CCC's framework for understanding how authority is experienced and
            how leaders can raise it.
          </p>
        </div>
      </section>

      {/* ───────────────────── MEET THE FOUNDER ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-xs lg:mx-0">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-[#f9bd0e]" />
           
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[2rem] bg-[#0b2a6a] p-10">
              <Image
                src="/ccc-logo-black-text.png"
                alt="CCC for Leaders"
                width={220}
                height={61}
                className="h-auto w-full max-w-[220px] object-contain"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Meet the Founder</SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
            >
              Greg Chapman
            </h2>
            <p className="mt-1 text-[14px] font-bold uppercase tracking-wide text-[#f9bd0e]">
              Founder, CCC for Leaders
            </p>
            <span className="mt-5 block h-1.5 w-20 rounded-full bg-[#f9bd0e]" />
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-slate-600">
              Greg Chapman founded CCC for Leaders with a focus on helping
              leaders and organisations become more effective in the moments
              that matter — when ideas need to be communicated, conversations
              need to move forward and people need to act.
            </p>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-slate-600">
              Over time, this work has developed into a broader approach to
              leadership, communication, coaching and workplace learning. Today,
              CCC's work is centred around Authority Quotient (AQ): a framework
              for understanding how much authority a leader commands in a room
              and how to raise it.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────── FROM EXPERTISE TO AUTHORITY ───────────────────── */}
      <section className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <h2
            className={`${bebas.className} text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            From expertise to <span className="text-[#f9bd0e]">authority</span>
          </h2>
          <p className="mt-6 text-[17px] font-semibold text-[#0b2a6a]/80">
            Being knowledgeable is not always enough.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
            A leader may have the expertise, experience and ideas needed to make
            a difference — but what matters is also how those ideas are
            received. AQ gives leaders a way to think about that gap. It brings
            together the way a leader communicates, contributes and shows up in
            important moments with the response those behaviours create in the
            room.
          </p>

          <Link
            href="/authority-quotient"
            className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-8 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
          >
            Discover Authority Quotient
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ───────────────────── ABOUT CCC ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>About CCC</SectionLabel>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Leadership development designed for the{" "}
            <span className="text-[#f9bd0e]">real world</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            CCC for Leaders is a corporate leadership training and coaching
            consultancy working with organisations from Gurgaon, Mumbai and Cape
            Town. We work with organisations that want their leaders and teams
            to communicate more effectively, collaborate better and create
            greater impact.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {WORK_AREAS.map((area) => (
            <span
              key={area}
              className="rounded-full border border-[#0b2a6a]/15 bg-white px-5 py-2.5 text-[14px] font-semibold text-[#0b2a6a] shadow-sm"
            >
              {area}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-slate-500">
          Rather than treating these as isolated skills, CCC connects them to
          the situations where leadership is actually experienced —
          conversations, meetings, presentations, decisions and relationships.
        </p>
      </section>

      {/* ───────────────────── OUR APPROACH ───────────────────── */}
      <section className="bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="bg-white/10 text-white">
              Our Approach
            </SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98]`}
            >
              Make leadership{" "}
              <span className="text-[#f9bd0e]">count when it matters</span>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-white/70">
              Leadership development should not end when a workshop ends. The
              goal is to give people practical capabilities they can take back
              into their work — and use when the stakes are real.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {APPROACH.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:bg-white/[0.07]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9bd0e] text-[#0b2a6a]">
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── AUTHORITY QUOTIENT ───────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b2a6a] text-[#f9bd0e]">
            <Gauge className="h-7 w-7" />
          </span>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            A new way to think about{" "}
            <span className="text-[#f9bd0e]">leadership influence</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
            Authority Quotient (AQ) is CCC for Leaders' framework for
            understanding how much authority a leader actually commands in a
            room — and how to raise it. AQ is at the centre of CCC's new
            positioning. It is not a generic personality quiz or another way of
            describing leadership presence. The AQ Assessment is designed to
            score a person's Authority Quotient and return an individual AQ
            profile.
          </p>

          <div className="mx-auto mt-10 max-w-sm rounded-2xl border-2 border-[#f9bd0e] bg-[#fffaea] p-8">
            <p className="text-[17px] font-bold text-[#0b2a6a]">
              Want to discover your AQ?
            </p>
            <p className="mt-1 text-[15px] text-slate-600">
              Take the assessment.
            </p>
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-wide text-[#0b2a6a]/60">
              16 questions &middot; Approximately two minutes
            </p>
            <Link
              href="/authority-quotient/assessment"
              className={`${bebas.className} group mt-6 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-[#0b2a6a] hover:text-white`}
            >
              Find My AQ Score
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────── EXPERIENCE & RECOGNITION ───────────────────── */}
      <section className="bg-[#f6f7fb] py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Experience & Recognition</SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
            >
              Trusted by organisations that{" "}
              <span className="text-[#f9bd0e]">
                expect leadership to deliver
              </span>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
              Our work includes programmes across communication, storytelling,
              team synergy, client partnering, facilitation and leadership
              coaching.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {CLIENTS.map((client) => (
              <span
                key={client}
                className={`${bebas.className} rounded-xl border border-[#0b2a6a]/10 bg-white px-6 py-3 text-xl tracking-wide text-[#0b2a6a] shadow-sm`}
              >
                {client}
              </span>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/our-work"
              className="group inline-flex items-center gap-2 text-[15px] font-bold text-[#0b2a6a] hover:text-[#f9bd0e]"
            >
              Explore Our Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Brandon Hall recognition */}
          <div className="mx-auto mt-16 max-w-xl rounded-2xl border-2 border-[#f9bd0e] bg-gradient-to-br from-[#fffaea] to-white p-8 text-center shadow-[0_16px_40px_-18px_rgba(249,189,14,0.6)]">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f9bd0e] text-[#0b2a6a]">
              <Award className="h-6.5 w-6.5" />
            </span>
            <p className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#0b2a6a]/60">
              Recognised for excellence in learning and development
            </p>
            <p
              className={`${bebas.className} mt-2 text-3xl uppercase text-[#0b2a6a]`}
            >
              Brandon Hall Award
            </p>
            <p className="mt-2 text-sm italic text-slate-400">
              [Award category and year to be confirmed]
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────── WHERE WE WORK ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Where We Work</SectionLabel>
          <h2
            className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Based across <span className="text-[#f9bd0e]">three locations</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.city}
              className="group rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-18px_rgba(11,42,106,0.3)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0b2a6a] text-[#f9bd0e]">
                <MapPin className="h-5.5 w-5.5" />
              </span>
              <h3
                className={`${bebas.className} mt-5 text-3xl uppercase text-[#0b2a6a]`}
              >
                {loc.city}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{loc.region}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────── OUR WORK ───────────────────── */}
      <section className="bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="bg-white/10 text-white">
              Our Work
            </SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.98]`}
            >
              Leadership development backed by{" "}
              <span className="text-[#f9bd0e]">real experience</span>
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-white/70">
              Real work. Real organisations. Practical outcomes.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((cs, i) => (
              <div
                key={`${cs.client}-${i}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-6 transition-all hover:border-[#f9bd0e] hover:bg-white/[0.07]"
              >
                <div>
                  <p
                    className={`${bebas.className} text-2xl uppercase tracking-wide`}
                  >
                    {cs.client}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{cs.program}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#f9bd0e] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/our-work"
              className={`${bebas.className} group inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}
            >
              See Our Work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────── FINAL CTA ───────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <Quote className="mx-auto h-10 w-10 text-[#f9bd0e]/40" />
          <h2
            className={`${bebas.className} mt-6 text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            What happens when your expertise has{" "}
            <span className="text-[#f9bd0e]">
              the authority to move the room?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-slate-600">
            Discover your Authority Quotient and understand where your
            leadership authority stands today.
          </p>
          <Link
            href="/authority-quotient/assessment"
            className={`${bebas.className} group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-9 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
          >
            Find My AQ Score
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
