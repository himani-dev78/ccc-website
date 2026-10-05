"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Users, Sparkles } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TeamCard({ member, index }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const skills = [
    ...(member.marketing?.items || []),
    ...(member.advisory?.items || []),
  ]
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link
      href={`/team/${member._id}`}
      aria-label={`View ${member.name}'s full profile`}
      className="group block overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_14px_45px_-28px_rgba(8,35,89,0.45)] transition duration-300 hover:-translate-y-1.5 hover:border-[#f9bd0e]/70 hover:shadow-[0_24px_55px_-28px_rgba(8,35,89,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b2a6a]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0b2a6a]">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-12 h-48 w-48 rounded-full border-[28px] border-white/5"
        />
        {member.photo && !photoFailed ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`${bebas.className} text-6xl tracking-wider text-white/90 sm:text-7xl`}
            >
              {initials(member.name)}
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#071c48]/50 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white backdrop-blur sm:left-5 sm:top-5">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[#b88900]">
          {member.role}
        </p>
        <h2
          className={`${bebas.className} mt-2 text-2xl uppercase leading-tight tracking-wide text-[#0b2a6a] sm:text-3xl`}
        >
          {member.name}
        </h2>
        {member.intro && (
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
            {member.intro}
          </p>
        )}
        {skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#f4f6fa] px-3 py-1.5 text-xs font-medium text-[#0b2a6a]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0b2a6a] transition group-hover:text-[#b88900]">
          View full profile
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>
      </div>
    </Link>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeam() {
      try {
        const response = await fetch("/api/team", {
          signal: controller.signal,
          cache: "no-store",
        });

        // Guard against a non-JSON response (e.g. a 500 HTML error page),
        // which would otherwise throw inside response.json() and surface
        // a confusing parser error instead of a clean message.
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load the team.");
        }

        if (!data || !Array.isArray(data.team)) {
          throw new Error("The team response was not in the expected format.");
        }

        setTeam(data.team);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          console.error("Load team page error:", loadError);
          setError(loadError.message || "Unable to load the team.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadTeam();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0b2a6a] text-white">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-36 -z-10 h-[32rem] w-[32rem] rounded-full border-[70px] border-white/[0.035]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-20 -z-10 h-80 w-80 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 sm:gap-12 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-32">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-[#f9bd0e]" />
              The people behind CCC
            </span>
            {/* Lower clamp floor so this doesn't overpower very narrow screens */}
            <h1
              className={`${bebas.className} mt-6 text-[clamp(2.75rem,12vw,8.5rem)] uppercase leading-[0.9] tracking-wide sm:mt-7 sm:leading-[0.82]`}
            >
              Meet the
              <span className="block text-[#f9bd0e]">team.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:mt-8 sm:text-lg sm:leading-8">
              A thoughtful group of coaches, facilitators and specialists,
              bringing different perspectives together to help people and
              organisations do their best work.
            </p>
          </div>
          <a
            href="#our-team"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#f9bd0e] hover:text-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
          >
            Discover our people
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
        <div aria-hidden="true" className="h-1.5 bg-[#f9bd0e]" />
      </section>

      {/* ───────────────────── TEAM GRID ───────────────────── */}
      <section
        id="our-team"
        className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-14 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88900]">
              People make the difference
            </p>
            <h2
              className={`${bebas.className} mt-2 text-3xl uppercase tracking-wide text-[#0b2a6a] sm:text-4xl lg:text-5xl`}
            >
              Our people
            </h2>
          </div>
          {!loading && !error && team.length > 0 && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <Users aria-hidden="true" className="h-4 w-4 text-[#0b2a6a]" />
              {team.length} {team.length === 1 ? "team member" : "team members"}
            </span>
          )}
        </div>

        {loading ? (
          <div
            role="status"
            className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            <span className="sr-only">Loading team members</span>
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-6 sm:p-7">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center"
          >
            <p className="font-semibold text-red-800">
              We couldn&rsquo;t load the team right now.
            </p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        ) : team.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-[#0b2a6a]">
              Our team profiles are coming soon.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please check back again shortly.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {team.map((member, index) => (
              <TeamCard
                key={member._id || `${member.name}-${index}`}
                member={member}
                index={index}
              />
            ))}
          </div>
        )}

        {/* CTA band */}
        <div className="mt-14 overflow-hidden rounded-[1.75rem] bg-[#0b2a6a] px-6 py-8 text-white sm:mt-16 sm:px-10 sm:py-11">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f9bd0e]">
                Let&rsquo;s make good work happen
              </p>
              <p
                className={`${bebas.className} mt-2 text-2xl uppercase tracking-wide sm:text-3xl lg:text-4xl`}
              >
                Bring your next challenge to CCC.
              </p>
            </div>
            <a
              href="/contact-us"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f9bd0e] px-5 py-3 text-sm font-bold text-[#0b2a6a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Get in touch
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
