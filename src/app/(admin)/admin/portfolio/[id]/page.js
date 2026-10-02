"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Briefcase,
  FileText,
  Layers,
  User,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function PortfolioDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const portfolioImages =
    portfolio && Array.isArray(portfolio.images) && portfolio.images.length
      ? portfolio.images
      : portfolio && portfolio.image
        ? [portfolio.image]
        : [];

  useEffect(() => {
    if (!id) return;

    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/portfolio/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch portfolio"
          );
        }

        setPortfolio(data.portfolio);
      } catch (error) {
        console.error("Fetch portfolio error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[#0b2a6a]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#0b2a6a]"
        >
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          <AlertCircle size={20} />
          {error}
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-8">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                href="/admin/portfolio"
                className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#0b2a6a]"
              >
                <ArrowLeft size={17} />
                Back to Portfolio
              </Link>

              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                  <Briefcase size={24} />
                </span>

                <div>
                  <span className="inline-flex items-center rounded-full bg-[#f9bd0e]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0b2a6a]">
                    Portfolio
                  </span>

                  <h1 className="mt-2 text-2xl font-bold text-[#0b2a6a] sm:text-3xl">
                    {portfolio.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    View complete portfolio details.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/admin/portfolio/edit/${portfolio._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
            >
              <Pencil size={17} />
              Edit Portfolio
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Portfolio Image */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {portfolioImages.length ? (
              <div className="grid gap-3 p-3 md:grid-cols-2">
                {portfolioImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100"
                  >
                    <img
                      src={image}
                      alt={`${portfolio.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-[21/9] w-full items-center justify-center bg-[#0b2a6a]">
                <Briefcase
                  size={60}
                  className="text-[#f9bd0e]"
                />
              </div>
            )}
          </section>

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                <Briefcase size={20} />
              </span>

              <div>
                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  Basic Information
                </h2>

                <p className="text-sm text-slate-500">
                  Portfolio and client information
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <FileText size={16} />
                  Title
                </div>

                <p className="mt-2 text-base font-medium text-[#0b2a6a]">
                  {portfolio.title}
                </p>
              </div>

              {/* Client */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <User size={16} />
                  Client
                </div>

                <p className="mt-2 text-base font-medium text-[#0b2a6a]">
                  {portfolio.client}
                </p>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Tag size={16} />
                  Category
                </div>

                <span className="mt-2 inline-flex rounded-full bg-[#f9bd0e]/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0b2a6a]">
                  {portfolio.category}
                </span>
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Layers size={16} />
                  Slug
                </div>

                <p className="mt-2 break-all text-sm text-slate-600">
                  {portfolio.slug}
                </p>
              </div>
            </div>
          </section>

          {/* Short Description */}
          {portfolio.shortDescription && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                  <FileText size={20} />
                </span>

                <div>
                  <h2 className="text-lg font-bold text-[#0b2a6a]">
                    Short Description
                  </h2>
                </div>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {portfolio.shortDescription}
              </p>
            </section>
          )}

          {/* Context */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                <Layers size={20} />
              </span>

              <div>
                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  Context
                </h2>

                <p className="text-sm text-slate-500">
                  Background and situation
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {portfolio.context}
            </p>
          </section>

          {/* Complexity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                <Briefcase size={20} />
              </span>

              <div>
                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  Complexity
                </h2>

                <p className="text-sm text-slate-500">
                  Challenge and requirements
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {portfolio.complexity}
            </p>
          </section>

          {/* Resolution */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
                <FileText size={20} />
              </span>

              <div>
                <h2 className="text-lg font-bold text-[#0b2a6a]">
                  Resolution
                </h2>

                <p className="text-sm text-slate-500">
                  Solution and impact
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {portfolio.resolution}
            </p>
          </section>

          {/* Public URL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#0b2a6a]">
              Public Case Study
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This is the URL visitors will use to view this
              portfolio.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-50 p-4">
              <p className="break-all text-sm font-medium text-[#0b2a6a]">
                /portfolio/{portfolio.slug}
              </p>

              <Link
                href={`/portfolio/${portfolio.slug}`}
                target="_blank"
                className="shrink-0 text-sm font-bold text-[#0b2a6a] hover:text-[#f9bd0e]"
              >
                Open Website →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}