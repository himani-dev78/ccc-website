"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, Newspaper } from "lucide-react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch("/api/blogs", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok)
          throw new Error(data?.message || "Unable to load blogs.");
        setBlogs(data.blogs || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load blogs.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBlogs();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      <section className="bg-[#0b2a6a] px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f9bd0e]">
            <Newspaper size={15} /> CCC for Leaders
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-6xl">Blogs</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Ideas, perspectives and practical guidance from our team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">
        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={22} />
            Loading blogs...
          </div>
        ) : error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </p>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Newspaper className="mx-auto text-slate-300" size={36} />
            <h2 className="mt-4 text-lg font-semibold text-[#0b2a6a]">
              No blog posts yet
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0b2a6a]/10">
                  <Image
                    src={blog.featuredImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <time className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </time>
                    <div>
                      {blog.category?.name && (
                        <span className="mt-3 inline-flex w-fit rounded-full bg-[#0b2a6a] px-3 py-1 text-xs font-bold text-[#fdfeff]">
                          {blog.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="mt-4 text-xl font-bold leading-snug text-[#0b2a6a]">
                    {blog.title}
                  </h2>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b2a6a] group-hover:text-[#a77b00]">
                    Read blog <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
