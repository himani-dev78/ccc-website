"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Edit, Loader2, Newspaper, Plus, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch(
          `/api/admin/blogs?page=${page}&limit=${PAGE_SIZE}`,
          { signal: controller.signal },
        );
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load blogs.");
        setBlogs(data.blogs || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(Math.max(1, data.pagination?.totalPages || 1));
        setError("");
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load blogs.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/blog-categories", {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load categories.");
        }
        setCategories(data.categories || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load categories.");
        }
      }
    }

    loadBlogs();
    loadCategories();
    return () => controller.abort();
  }, [page]);

  async function handleAddCategory(event) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    try {
      setSavingCategory(true);
      setError("");
      const response = await fetch("/api/admin/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to add category.");
      setCategories((current) =>
        [...current, data.category].sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
      );
      setCategoryName("");
    } catch (categoryError) {
      setError(categoryError.message || "Unable to add category.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(category) {
    try {
      setDeletingCategoryId(category._id);
      setError("");
      const response = await fetch(`/api/admin/blog-categories/${category._id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to delete category.");
      setCategories((current) => current.filter((item) => item._id !== category._id));
    } catch (categoryError) {
      setError(categoryError.message || "Unable to delete category.");
    } finally {
      setDeletingCategoryId("");
    }
  }

  async function handleDelete(blog) {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;

    try {
      setDeletingId(blog._id);
      const response = await fetch(`/api/admin/blogs/${blog._id}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to delete blog.");

      const isLastRowOnPage = blogs.length === 1 && page > 1;
      if (isLastRowOnPage) {
        setPage((current) => current - 1);
      } else {
        const remaining = blogs.filter((item) => item._id !== blog._id);
        setBlogs(remaining);
        setTotal((current) => Math.max(0, current - 1));
        if (remaining.length === 0) setTotalPages(1);
      }
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete blog.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Newspaper className="text-[#0b2a6a]" size={25} />
            <h1 className="text-2xl font-bold text-[#0b2a6a]">Blogs</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Manage website articles, headings and images.</p>
        </div>
        <Link
          href="/admin/blogs/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#153b87]"
        >
          <Plus size={18} />
          Add Blog
        </Link>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0b2a6a]">Blog categories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add categories here, then select one when creating or editing a blog.
          </p>
        </div>
        <form onSubmit={handleAddCategory} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="new-blog-category" className="sr-only">New category name</label>
          <input
            id="new-blog-category"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40 sm:max-w-md"
            placeholder="Category name"
            required
          />
          <button
            type="submit"
            disabled={savingCategory}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#153b87] disabled:opacity-60"
          >
            {savingCategory ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add category
          </button>
        </form>
        {categories.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category._id} className="inline-flex items-center gap-2 rounded-full border border-[#0b2a6a]/10 bg-[#0b2a6a]/5 px-3 py-2 text-sm font-medium text-[#0b2a6a]">
                {category.name}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={deletingCategoryId === category._id}
                  aria-label={`Delete ${category.name} category`}
                  className="text-slate-500 hover:text-red-600 disabled:opacity-50"
                >
                  {deletingCategoryId === category._id
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No categories have been added yet.</p>
        )}
      </section>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={22} />
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <Newspaper className="text-slate-300" size={38} />
            <h2 className="mt-4 text-lg font-semibold text-[#0b2a6a]">No blogs yet</h2>
            <p className="mt-1 text-sm text-slate-500">Create a blog to publish it on your website.</p>
            <Link href="/admin/blogs/add" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a]">
              <Plus size={17} /> Add your first blog
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Blog</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Published</th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="border-b last:border-0 hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image src={blog.featuredImage} alt="" fill sizes="80px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#0b2a6a]">{blog.title}</p>
                            <Link href={`/blogs/${blog.slug}`} target="_blank" className="mt-1 block truncate text-xs text-slate-400 hover:text-[#0b2a6a]">
                              /blogs/{blog.slug}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#f9bd0e]/15 px-3 py-1 text-xs font-semibold text-[#0b2a6a]">
                          {blog.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/blogs/${blog._id}`)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#0b2a6a] hover:bg-slate-50"
                            aria-label={`Edit ${blog.title}`}
                          >
                            <Edit size={15} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog)}
                            disabled={deletingId === blog._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Delete ${blog.title}`}
                          >
                            {deletingId === blog._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} blogs
              </p>
              <nav aria-label="Blog pages" className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#0b2a6a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span aria-current="page" className="px-2 text-sm font-semibold text-[#0b2a6a]">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#0b2a6a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
