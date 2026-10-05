"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { FaEnvelope, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const SOCIAL_ICONS = {
  email: FaEnvelope,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  mail: FaEnvelope,
  twitter: FaTwitter,
};

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ExpertiseSection({ title, group }) {
  if (!group?.heading && !group?.items?.length) return null;

  return (
    <section className="mt-14">
      <div className="mb-7 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88900]">
          {title}
        </p>
        {group.heading && (
          <p className="mt-3 text-lg leading-8 text-slate-600">
            {group.heading}
          </p>
        )}
      </div>
      {group.items?.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_-28px_rgba(8,35,89,0.55)]"
            >
              {item.icon && (
                <span className="inline-flex rounded-full bg-[#f9bd0e]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b2a6a]">
                  {item.icon}
                </span>
              )}
              {item.title && (
                <h3 className="mt-4 font-bold text-[#0b2a6a]">{item.title}</h3>
              )}
              {item.text && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TeamMemberPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function loadMember() {
      try {
        const response = await fetch(`/api/team/${encodeURIComponent(id)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load this team member.");
        }

        if (!data.teamMember) {
          throw new Error("Team member details were not found.");
        }

        setMember(data.teamMember);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          console.error("Load team member page error:", loadError);
          setError(loadError.message || "Unable to load this team member.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMember();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main
        role="status"
        className="min-h-[60vh] bg-[#f7f8fb] px-6 py-24 text-center text-slate-600"
      >
        Loading team member…
      </main>
    );
  }

  if (error || !member) {
    return (
      <main className="min-h-[60vh] bg-[#f7f8fb] px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className={`${bebas.className} text-4xl uppercase text-[#0b2a6a]`}>
            {error || "Team member not found"}
          </h1>
          <Link
            href="/team"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0b2a6a] hover:text-[#b88900]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to our team
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="relative isolate overflow-hidden bg-[#0b2a6a] text-white">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-32 -z-10 h-[32rem] w-[32rem] rounded-full border-[70px] border-white/[0.035]"
        />
        <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-8 lg:px-10 lg:pb-24">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-[#f9bd0e] hover:text-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All team members
          </Link>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              <div className="absolute -inset-3 rounded-[2rem] bg-[#f9bd0e]" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#132f68]">
                {member.photo && !photoFailed ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 420px, 90vw"
                    unoptimized={member.photo.startsWith("data:")}
                    onError={() => setPhotoFailed(true)}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className={`${bebas.className} text-8xl text-white/90`}>
                      {initials(member.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-[#f9bd0e]" />
                Meet the team
              </span>
              <h1
                className={`${bebas.className} mt-6 text-[clamp(3.5rem,8vw,7rem)] uppercase leading-[0.88] tracking-wide`}
              >
                {member.name}
              </h1>
              {member.role && (
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[#f9bd0e]">
                  {member.role}
                </p>
              )}
              <span className="mt-6 block h-1.5 w-20 rounded-full bg-[#f9bd0e]" />
              {member.intro && (
                <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-white/75 sm:text-lg">
                  {member.intro}
                </p>
              )}
              {member.social?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {member.social.map((social, index) => {
                    const Icon = SOCIAL_ICONS[social.icon?.toLowerCase()];
                    const className =
                      "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-[#f9bd0e] hover:text-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]";
                    const content = (
                      <>
                        {Icon ? (
                          <Icon aria-hidden="true" className="h-4 w-4" />
                        ) : (
                          <span className="text-xs uppercase">{social.icon}</span>
                        )}
                        {social.label}
                        {social.href && (
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                        )}
                      </>
                    );

                    return social.href ? (
                      <a
                        key={`${social.label}-${index}`}
                        href={social.href}
                        target={
                          social.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          social.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={`${social.label}-${index}`} className={className}>
                        {content}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="h-1.5 bg-[#f9bd0e]" />
      </section>

      <div className="mx-auto max-w-[1280px] px-6 py-12 sm:py-16 lg:px-10 lg:py-20">
        <ExpertiseSection title="Marketing expertise" group={member.marketing} />
        <ExpertiseSection title="Advisory expertise" group={member.advisory} />

        {member.closing && (
          <section className="mt-14 rounded-[1.75rem] bg-white px-7 py-9 shadow-[0_14px_45px_-32px_rgba(8,35,89,0.5)] sm:px-10 sm:py-12">
            <span
              aria-hidden="true"
              className={`${bebas.className} text-6xl leading-none text-[#f9bd0e]`}
            >
              “
            </span>
            <p className="mt-1 max-w-4xl whitespace-pre-line text-lg leading-8 text-[#0b2a6a] sm:text-xl">
              {member.closing}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
