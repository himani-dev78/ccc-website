"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    async function loadBlog() {
      try {
        const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load this blog.");
        setBlog(data.blog);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load this blog.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBlog();
    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-slate-500">
        <Loader2 className="animate-spin text-[#0b2a6a]" size={22} />
        Loading blog...
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#0b2a6a]">Blog unavailable</h1>
        <p role={error ? "alert" : undefined} className="mt-2 text-sm text-slate-500">
          {error || "This blog could not be found."}
        </p>
        <Link href="/blogs" className="mt-5 inline-flex items-center gap-2 font-semibold text-[#0b2a6a]">
          <ArrowLeft size={17} /> All blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-6 py-10 sm:py-16">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]">
          <ArrowLeft size={17} /> All blogs
        </Link>
        <time className="mt-8 block text-sm font-semibold uppercase tracking-wide text-slate-400">
          {new Date(blog.createdAt).toLocaleDateString()}
        </time>
        {blog.category?.name && (
          <span className="mt-3 inline-flex rounded-full bg-[#f9bd0e]/15 px-3 py-1 text-xs font-bold text-[#0b2a6a]">
            {blog.category.name}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0b2a6a] sm:text-5xl">
          {blog.title}
        </h1>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={blog.featuredImage}
            alt=""
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
        <div className="mt-9 whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
          {blog.content}
        </div>
        {blog.images?.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {blog.images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={image}
                  alt={`${blog.title} image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
