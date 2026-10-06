"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue, Newsreader } from "next/font/google";
import {
  ArrowRight,
  Mail,
  CheckCircle2,
  Lightbulb,
  Gauge,
  Loader2,
} from "lucide-react";
import { FEATURED_INSIGHT } from "@/components/Articles";


const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
// Spec calls for Newsreader body typography on article content; used here
// for excerpts too, so the index and article pages read consistently.
const newsreader = Newsreader({ subsets: ["latin"] });

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
      {children}
    </span>
  );
}

function ArticleCard({ article }) {
  const content = (article.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const excerpt =
    content.length > 160 ? `${content.slice(0, 157).trimEnd()}...` : content;

  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-18px_rgba(11,42,106,0.3)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b2a6a]">
        <Image
          src=          {article.featuredImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex w-fit rounded-full bg-[#0b2a6a]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0b2a6a]/60">
          {article.category?.name || "Insight"}
        </span>

        <h3 className="mt-3 text-[18px] font-bold leading-snug text-[#0b2a6a]">
          {article.title}
        </h3>

        <p
          className={`${newsreader.className} mt-2.5 flex-1 text-[15px] leading-relaxed text-slate-500`}
        >
          {excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <time className="text-[13px] text-slate-400">
            {new Date(article.createdAt).toLocaleDateString()}
          </time>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0b2a6a] group-hover:text-[#f9bd0e]">
            Read blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch("/api/blogs", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load the latest insights.");
        }
        if (!data || !Array.isArray(data.blogs)) {
          throw new Error("The blog response was not in the expected format.");
        }
        setBlogs(data.blogs);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          console.error("Load latest insights error:", loadError);
          setBlogsError(loadError.message || "Unable to load the latest insights.");
        }
      } finally {
        if (!controller.signal.aborted) setBlogsLoading(false);
      }
    }

    loadBlogs();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(blogs.map((blog) => blog.category?.name).filter(Boolean)),
    ],
    [blogs],
  );

  const filtered = useMemo(() => {
    if (activeCategory === "All") return blogs;
    return blogs.filter((blog) => blog.category?.name === activeCategory);
  }, [activeCategory, blogs]);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to your actual newsletter provider / API route.
    setSubscribed(true);
    setEmail("");
  }

  return (
    <main className="bg-white">
      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-20 text-white lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div
          aria-hidden
          className={`${bebas.className} pointer-events-none absolute -bottom-8 left-0 select-none whitespace-nowrap text-[clamp(5rem,15vw,12rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.1)]`}
        >
          INSIGHTS
        </div>

        <div className="relative mx-auto max-w-[800px] px-6 text-center lg:px-10">
          <SectionLabel>Insights</SectionLabel>
          <h1
            className={`${bebas.className} mt-6 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.98]`}
          >
            Ideas for leaders who want{" "}
            <span className="text-[#f9bd0e]">
              clarity, influence and impact.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/75">
            Explore practical thinking on leadership, communication,
            storytelling, collaboration and Authority Quotient.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">
            From practical leadership ideas to real client experiences, our
            insights are designed to help you take something useful into your
            next conversation, meeting or decision.
          </p>
        </div>
      </section>

      {/* ───────────────────── FEATURED INSIGHT ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10 lg:py-24">
        <Link
          href={`/insights/${FEATURED_INSIGHT.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-slate-200 transition-shadow hover:shadow-[0_24px_60px_-20px_rgba(11,42,106,0.35)] lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0b2a6a] lg:aspect-auto">
            <Image
              src={FEATURED_INSIGHT.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0b2a6a]/70 via-transparent to-transparent lg:bg-gradient-to-r"
            />
          </div>

          <div className="flex flex-col justify-center bg-[#fffaea] p-8 lg:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0b2a6a] px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#f9bd0e]">
              <Gauge className="h-3.5 w-3.5" />
              Featured Insight
            </span>

            <h2
              className={`${bebas.className} mt-5 text-[clamp(1.75rem,4vw,3rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
            >
              {FEATURED_INSIGHT.title}
            </h2>
            <p className="mt-2 text-[15px] font-semibold text-[#0b2a6a]/70">
              {FEATURED_INSIGHT.subtitle}
            </p>

            <p
              className={`${newsreader.className} mt-5 text-[16px] leading-relaxed text-slate-600`}
            >
              {FEATURED_INSIGHT.excerpt}
            </p>

            <span className="mt-7 inline-flex w-fit items-center gap-2 text-[15px] font-bold text-[#0b2a6a] group-hover:text-[#f9bd0e]">
              Read the insight
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* ───────────────────── LATEST INSIGHTS ───────────────────── */}
      <section className="bg-[#f6f7fb] py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="mx-auto max-w-xl text-center">
            <SectionLabel>Latest Insights</SectionLabel>
            <h2
              className={`${bebas.className} mt-5 text-[clamp(2rem,4.5vw,3.25rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
            >
              Practical ideas for{" "}
              <span className="text-[#f9bd0e]">the moments that matter</span>
            </h2>
          </div>

          {/* Category filters */}
          <div
            role="group"
            aria-label="Filter by category"
            className="mt-10 flex flex-wrap justify-center gap-2.5"
          >
            {categories.map((cat) => {
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
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0b2a6a]/30 hover:text-[#0b2a6a]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {blogsLoading ? (
            <div
              className="mt-16 flex min-h-40 items-center justify-center gap-3 text-sm text-slate-500"
              role="status"
            >
              <Loader2 className="h-5 w-5 animate-spin text-[#0b2a6a]" />
              Loading latest insights...
            </div>
          ) : blogsError ? (
            <p
              className="mt-12 rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700"
              role="alert"
            >
              {blogsError}
            </p>
          ) : filtered.length === 0 ? (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f9bd0e]/15">
                <Lightbulb className="h-7 w-7 text-[#0b2a6a]" />
              </span>
              <p className="mt-4 text-[15px] text-slate-500">
                {activeCategory === "All"
                  ? "No blogs have been published yet."
                  : "No blogs in this category yet."}
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────── PRESENTATION SCIENCE NEWSLETTER ───────────────────── */}
      <section className="relative overflow-hidden bg-[#0b2a6a] py-20 text-white lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f9bd0e] text-[#0b2a6a]">
            <Mail className="h-6.5 w-6.5" />
          </span>
          <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-[#f9bd0e]">
            Presentation Science
          </p>
          <h2
            className={`${bebas.className} mt-2 text-[clamp(2rem,4.5vw,3.25rem)] uppercase leading-[0.98]`}
          >
            Practical thinking for{" "}
            <span className="text-[#f9bd0e]">better communication</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
            Get useful ideas on leadership, communication, presentations and
            storytelling delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscribed) setSubscribed(false);
              }}
              placeholder="Email address"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-[15px] text-white placeholder:text-white/40 focus:border-[#f9bd0e] focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40"
            />
            <button
              type="submit"
              className={`${bebas.className} shrink-0 rounded-xl bg-[#f9bd0e] px-8 py-3.5 text-xl uppercase tracking-wide text-[#0b2a6a] transition-colors hover:bg-white`}
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p
              role="status"
              className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300"
            >
              <CheckCircle2 className="h-4.5 w-4.5" />
              You&apos;re subscribed to Presentation Science.
            </p>
          )}
        </div>
      </section>

      {/* ───────────────────── AQ CTA ───────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[700px] px-6 text-center lg:px-10">
          <h2
            className={`${bebas.className} text-[clamp(2rem,4.5vw,3.25rem)] uppercase leading-[0.98] text-[#0b2a6a]`}
          >
            Want to understand your own{" "}
            <span className="text-[#f9bd0e]">Authority Quotient?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
            Take the 16-question AQ Assessment and discover your AQ profile.
          </p>
          <Link
            href="/authority-quotient/assessment"
            className={`${bebas.className} group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#0b2a6a] px-9 py-4 text-xl uppercase tracking-wide text-white transition-colors hover:bg-[#f9bd0e] hover:text-[#0b2a6a]`}
          >
            Find My AQ Score
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
