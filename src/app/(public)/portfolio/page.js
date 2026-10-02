"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Loader2,
  AlertCircle,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "ALL",
  "CLIENT PARTNERING",
  "COACHING FOR LEADERS",
  "HIGH IMPACT COMMUNICATION",
  "I.D. & F.S.",
  "STORYTELLING FOR BUSINESS",
  "TEAM SYNERGY",
];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/portfolio/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch categories"
          );
        }

        if (data.categories?.length) {
          setCategories(["ALL", ...data.categories.map((category) => category.name)]);
        }
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    }

    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/portfolio");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch portfolio"
          );
        }

        setPortfolio(data.portfolio || []);
      } catch (error) {
        console.error("Fetch portfolio error:", error);

        setError(
          error.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
    fetchPortfolio();
  }, []);

  const filteredPortfolio = useMemo(() => {
    if (activeCategory === "ALL") {
      return portfolio;
    }

    return portfolio.filter(
      (item) => item.category === activeCategory
    );
  }, [portfolio, activeCategory]);

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0b2a6a]">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f9bd0e] text-[#0b2a6a]">
            <Briefcase size={26} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#f9bd0e]">
            Our Portfolio
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Some Works from Our Portfolio
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Explore how Client Centered Consulting helps
            organizations and leaders create meaningful impact
            through communication, leadership, collaboration,
            and professional development.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => {
              const isActive =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`
                    rounded-full border px-4 py-2.5
                    text-xs font-bold uppercase
                    tracking-wide transition sm:px-5
                    sm:text-sm
                    ${
                      isActive
                        ? "border-[#0b2a6a] bg-[#0b2a6a] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#f9bd0e] hover:bg-[#f9bd0e]/10 hover:text-[#0b2a6a]"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={34}
                className="animate-spin text-[#0b2a6a]"
              />

              <p className="text-sm text-slate-500">
                Loading portfolio...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            <AlertCircle
              size={22}
              className="shrink-0"
            />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredPortfolio.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-center">
              <Briefcase
                size={42}
                className="text-slate-400"
              />

              <h2 className="mt-4 text-xl font-bold text-[#0b2a6a]">
                No portfolio available
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no portfolio items in
                this category.
              </p>
            </div>
          )}

        {/* Portfolio Grid */}
        {!loading &&
          !error &&
          filteredPortfolio.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPortfolio.map((item) => (
                <article
                  key={item._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {(item.images?.[0] || item.image) ? (
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0b2a6a]">
                        <Briefcase
                          size={48}
                          className="text-[#f9bd0e]"
                        />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#0b2a6a] shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f9bd0e]">
                      {item.client}
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-7 text-[#0b2a6a]">
                      {item.title}
                    </h2>

                    {item.shortDescription && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.shortDescription}
                      </p>
                    )}

                    <div className="mt-6">
                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0b2a6a] transition hover:text-[#f9bd0e]"
                      >
                        View Case Study
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}