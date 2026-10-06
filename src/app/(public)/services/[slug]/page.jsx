"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, MoveUpRight, Sparkles } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

function DetailList({ title, items, variant }) {
  if (!items?.length) return null;

  return (
    <article
      className={`relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9 ${
        variant === "gold"
          ? "bg-[#f9bd0e] text-[#0b2a6a]"
          : "border border-white/10 bg-[#0b2a6a] text-white"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute -right-8 -top-10 h-36 w-36 rounded-full border-[24px] ${
          variant === "gold" ? "border-white/25" : "border-white/[0.06]"
        }`}
      />
      <div className="relative">
        <span className={`text-xs font-bold uppercase tracking-[0.2em] ${variant === "gold" ? "text-[#0b2a6a]/60" : "text-[#f9bd0e]"}`}>
          What to expect
        </span>
        <h2 className={`${bebas.className} mt-2 text-3xl uppercase leading-tight sm:text-4xl`}>
          {title}
        </h2>
        <ul className="mt-7 space-y-4">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-3 text-[15px] leading-6">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                variant === "gold" ? "bg-[#0b2a6a] font-bold text-[#f9bd0e]" : "bg-[#f9bd0e] text-[#0b2a6a]"
              }`}>
                <Check size={14} strokeWidth={3} />
              </span>
              <span className={variant === "gold" ? "text-[#0b2a6a]/85" : "text-white/80"}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    async function loadService() {
      try {
        const response = await fetch(`/api/services/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load this service.");
        }
        setService(data.service);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load this service.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadService();
    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-slate-500">
        <Loader2 className="animate-spin text-[#0b2a6a]" size={22} />
        Loading service...
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#0b2a6a]">Service unavailable</h1>
        <p role={error ? "alert" : undefined} className="mt-2 text-sm text-slate-500">
          {error || "This service could not be found."}
        </p>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 font-semibold text-[#0b2a6a]">
          <ArrowLeft size={17} /> Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7]">
      <section className="relative isolate overflow-hidden bg-[#0b2a6a] text-white">
        <div aria-hidden="true" className="absolute -right-28 -top-36 -z-10 h-[32rem] w-[32rem] rounded-full border-[70px] border-white/[0.035]" />
        <div aria-hidden="true" className="absolute -bottom-40 left-[38%] -z-10 h-[28rem] w-[28rem] rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:py-20">
          <div className="relative z-10">
           
            <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f9bd0e]">
              <Sparkles size={15} /> CCC for Leaders · Signature program
            </span>
            <h1 className={`${bebas.className} mt-5 max-w-3xl text-[clamp(3.25rem,8vw,7.5rem)] uppercase leading-[0.88] tracking-wide`}>
              {service.title}
              <span aria-hidden="true" className="ml-2 text-[#f9bd0e]">.</span>
            </h1>
            <span aria-hidden="true" className="mt-7 block h-1.5 w-20 rounded-full bg-[#f9bd0e]" />
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {service.intro}
            </p>
            <Link href="/contact-us" className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#f9bd0e] px-6 py-3.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-white">
              Let&apos;s talk about your team
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] border border-[#f9bd0e]/35" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#153b87] shadow-2xl">
              {service.heroImage ? (
                <Image src={service.heroImage} alt="" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(249,189,14,0.35),transparent_32%),linear-gradient(135deg,#153b87,#071c48)]" />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071c48]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f9bd0e]">Built around people</span>
                <p className={`${bebas.className} mt-2 text-3xl uppercase leading-tight text-white sm:text-4xl`}>
                  Better together. Stronger by design.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 flex h-10 w-20 items-center justify-center rounded-2xl border-2 border-[#fbfaf7] bg-[#f9bd0e] text-center text-xs font-extrabold uppercase leading-tight text-[#0b2a6a] shadow-lg sm:-left-20 sm:h-24 sm:w-24">
              Practical<br />learning
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="h-1.5 bg-[#f9bd0e]" />
      </section>

      {(service.audience?.length > 0 || service.outcomes?.length > 0) && (
        <section className="relative z-10 mx-auto -mt-1 max-w-[1200px] px-6 py-14 sm:py-20 lg:px-10">
          <div className="mb-8 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88900]">The difference</span>
            <h2 className={`${bebas.className} mt-2 text-4xl uppercase leading-tight text-[#0b2a6a] sm:text-5xl`}>
              Designed for real-world change
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <DetailList title={service.audienceHeading || "Who should attend?"} items={service.audience} />
            <DetailList title={service.outcomesHeading || "Program outcomes"} items={service.outcomes} variant="gold" />
          </div>
        </section>
      )}

      {service.sections?.map((section, sectionIndex) => (
        <section key={`${section.title}-${sectionIndex}`} className="relative py-14 sm:py-20">
          <div aria-hidden="true" className={`absolute inset-y-0 ${sectionIndex % 2 === 0 ? "left-0 w-[70%] rounded-r-[4rem] bg-white" : "right-0 w-[70%] rounded-l-[4rem] bg-[#f1eee6]"}`} />
          <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#b88900]">
                  <span className="h-px w-8 bg-[#f9bd0e]" /> Chapter {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <h2 className={`${bebas.className} mt-4 text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.92] text-[#0b2a6a]`}>
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="mt-5 max-w-lg text-sm font-bold uppercase leading-6 tracking-wide text-[#a77b00]">
                    {section.subtitle}
                  </p>
                )}
                {section.description && (
                  <p className="mt-5 max-w-lg whitespace-pre-line text-[15px] leading-7 text-slate-600">
                    {section.description}
                  </p>
                )}
              </div>

              {section.features?.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.features.map((feature, featureIndex) => {
                    const featured = featureIndex === 0 && section.features.length > 2;
                    return (
                      <article
                        key={`${feature.title}-${featureIndex}`}
                        className={`group relative overflow-hidden rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${
                          featured
                            ? "bg-[#0b2a6a] text-white sm:col-span-2"
                            : "border border-[#0b2a6a]/[0.08] bg-white text-[#0b2a6a] shadow-[0_12px_40px_-28px_rgba(11,42,106,0.4)]"
                        }`}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                          featured ? "bg-[#f9bd0e] text-[#0b2a6a]" : "bg-[#f9bd0e]/20 text-[#0b2a6a]"
                        }`}>
                          {String(featureIndex + 1).padStart(2, "0")}
                        </span>
                        <h3 className={`${bebas.className} mt-5 text-2xl uppercase leading-tight sm:text-3xl`}>
                          {feature.title}
                        </h3>
                        <p className={`mt-3 max-w-xl text-sm leading-6 ${
                          featured ? "text-white/70" : "text-slate-600"
                        }`}>
                          {feature.text}
                        </p>
                        <MoveUpRight aria-hidden="true" className={`absolute right-6 top-6 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                          featured ? "text-[#f9bd0e]" : "text-[#0b2a6a]/25"
                        }`} />
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#0b2a6a] px-6 py-14 text-white sm:py-20">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f9bd0e]">Make the next move</span>
            <h2 className={`${bebas.className} mt-2 text-3xl uppercase leading-tight sm:text-4xl`}>
              Ready to bring this to your team?
            </h2>
          </div>
          <Link href="/contact-us" className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#f9bd0e] px-6 py-3.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-white">
            Talk to our team
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
