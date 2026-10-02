
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function PortfolioDetailPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const portfolioImages =
    portfolio && Array.isArray(portfolio.images) && portfolio.images.length
      ? portfolio.images
      : portfolio && portfolio.image
        ? [portfolio.image]
        : [];

  const slug =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).pop()
      : "";

  useEffect(() => {
    if (!slug) return;

    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/portfolio/${slug}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch portfolio"
          );
        }

        setPortfolio(data.portfolio);
      } catch (error) {
        console.error(
          "Fetch portfolio error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={36}
              className="animate-spin text-[#0b2a6a]"
            />

            <p className="text-sm text-gray-500">
              Loading case study...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={32}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-gray-900">
            Portfolio Not Found
          </h1>

          <p className="mt-2 max-w-md text-gray-500">
            {error ||
              "The portfolio case study you are looking for does not exist."}
          </p>

          <Link
            href="/portfolio"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0b2a6a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
          >
            <ArrowLeft size={17} />
            Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-[#0b2a6a]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-[#f9bd0e]"
          >
            <ArrowLeft size={17} />
            Back to Portfolio
          </Link>

          <div className="mt-10 max-w-4xl">
            {/* Category */}
            {portfolio.category && (
              <span className="inline-flex rounded-full bg-[#f9bd0e] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0b2a6a]">
                {portfolio.category}
              </span>
            )}

            {/* Title */}
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {portfolio.title}
            </h1>

            {/* Short Description */}
            {portfolio.shortDescription && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
                {portfolio.shortDescription}
              </p>
            )}

            {/* Client */}
            {portfolio.client && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#f9bd0e]">
                  Client
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {portfolio.client}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {portfolioImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10 md:pt-14">
          <div className="grid gap-4 md:grid-cols-2">
            {portfolioImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-2xl bg-gray-100"
              >
                <img
                  src={image}
                  alt={`${portfolio.title} ${index + 1}`}
                  className="h-[280px] w-full object-cover md:h-[500px] lg:h-[600px]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Case Study Content */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        <div className="space-y-16">
          {/* Context */}
          {portfolio.context && (
            <article>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#f9bd0e]" />

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0b2a6a]">
                  Context
                </p>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-900 md:text-3xl">
                Understanding the Situation
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600 md:text-lg">
                {portfolio.context}
              </p>
            </article>
          )}

          {/* Complexity */}
          {portfolio.complexity && (
            <article>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#f9bd0e]" />

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0b2a6a]">
                  Complexity
                </p>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-900 md:text-3xl">
                The Challenge
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600 md:text-lg">
                {portfolio.complexity}
              </p>
            </article>
          )}

          {/* Resolution */}
          {portfolio.resolution && (
            <article>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#f9bd0e]" />

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0b2a6a]">
                  Resolution
                </p>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-900 md:text-3xl">
                The Solution
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600 md:text-lg">
                {portfolio.resolution}
              </p>
            </article>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center md:px-10 md:py-20">
          <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Explore More Case Studies
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Discover more of our work and the impact we
            create for our clients.
          </p>

          <Link
            href="/portfolio"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0b2a6a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
          >
            <ArrowLeft size={17} />
            View All Portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
