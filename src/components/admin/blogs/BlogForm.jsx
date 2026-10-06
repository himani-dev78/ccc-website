"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40";

function makeSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const galleryInput = useRef(null);
  const previewUrls = useRef(new Set());
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    featuredImage: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(Boolean(blogId));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [pendingGallery, setPendingGallery] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/blog-categories", {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load blog categories.");
        }
        setCategories(data.categories || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load blog categories.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    },
    [],
  );

  useEffect(() => {
    if (!blogId) return;
    const controller = new AbortController();

    async function loadBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${blogId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load blog.");

        setForm({
          title: data.blog.title || "",
          slug: data.blog.slug || "",
          content: data.blog.content || "",
          category: data.blog.category?._id || data.blog.category || "",
          featuredImage: data.blog.featuredImage || "",
          images: data.blog.images || [],
        });
        setSlugEdited(true);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load blog.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingBlog(false);
      }
    }

    loadBlog();
    return () => controller.abort();
  }, [blogId]);

  async function uploadSelected(file) {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Select a valid image file.");
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Each image must be smaller than 5MB.");
    }
    const uploaded = await uploadImage(file, "blogs");
    return uploaded.url;
  }

  function createLocalPreview(file) {
    const url = URL.createObjectURL(file);
    previewUrls.current.add(url);
    return url;
  }

  function revokeLocalPreview(url) {
    if (previewUrls.current.delete(url)) URL.revokeObjectURL(url);
  }

  async function handleFeaturedImage(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setError("");
    const localPreview = createLocalPreview(file);
    setFeaturedPreview(localPreview);

    try {
      setUploading(true);
      const featuredImage = await uploadSelected(file);
      setForm((current) => ({ ...current, featuredImage }));
      setFeaturedPreview(featuredImage);
      revokeLocalPreview(localPreview);
    } catch (uploadError) {
      setError(uploadError.message || "Could not upload featured image.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function handleGalleryImages(event) {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    setError("");
    const previews = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      url: createLocalPreview(file),
      status: "uploading",
    }));
    setPendingGallery((current) => [...current, ...previews]);

    try {
      setUploading(true);
      const results = await Promise.allSettled(files.map(uploadSelected));
      const uploadedImages = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      const failedIndexes = results
        .map((result, index) => (result.status === "rejected" ? index : -1))
        .filter((index) => index !== -1);

      setForm((current) => ({
        ...current,
        images: [...new Set([...current.images, ...uploadedImages])],
      }));
      const failedIds = new Set(failedIndexes.map((index) => previews[index].id));
      setPendingGallery((current) =>
        current
          .filter((preview) => failedIds.has(preview.id))
          .map((preview) => ({ ...preview, status: "failed" })),
      );
      previews.forEach((preview, index) => {
        if (!failedIds.has(preview.id)) revokeLocalPreview(preview.url);
      });

      if (failedIndexes.length) {
        const firstFailure = results[failedIndexes[0]];
        setError(
          `${failedIndexes.length} image${failedIndexes.length === 1 ? "" : "s"} could not be uploaded. ${
            firstFailure.reason?.message || "Please select them again to retry."
          }`,
        );
      }
    } catch (uploadError) {
      setError(uploadError.message || "Could not upload selected images.");
      setPendingGallery((current) =>
        current.filter((preview) => !previews.some((item) => item.id === preview.id)),
      );
      previews.forEach((preview) => revokeLocalPreview(preview.url));
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (uploading) {
      setError("Wait for image uploads to finish before saving.");
      return;
    }
    if (!form.featuredImage) {
      setError("Upload a featured image before saving.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        blogId ? `/api/admin/blogs/${blogId}` : "/api/admin/blogs",
        {
          method: blogId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to save blog.");
      router.push("/admin/blogs");
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "Unable to save blog.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingBlog) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#0b2a6a]" />
        <span className="sr-only">Loading blog</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b2a6a]"
        >
          <ArrowLeft size={17} />
          Back to Blogs
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#0b2a6a]">
          {blogId ? "Edit Blog" : "Add Blog"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a heading, article content, a featured image, and optional gallery images.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label htmlFor="blog-title" className="mb-2 block text-sm font-semibold text-[#0b2a6a]">
              Blog heading
            </label>
            <input
              id="blog-title"
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({
                  ...current,
                  title,
                  slug: slugEdited ? current.slug : makeSlug(title),
                }));
              }}
              className={inputClass}
              placeholder="Enter the blog heading"
              required
            />
          </div>

          <div>
            <label htmlFor="blog-slug" className="mb-2 block text-sm font-semibold text-[#0b2a6a]">
              Page URL
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#f9bd0e]">
              <span className="whitespace-nowrap pl-4 text-sm text-slate-400">/blogs/</span>
              <input
                id="blog-slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setForm((current) => ({ ...current, slug: makeSlug(event.target.value) }));
                }}
                className="w-full rounded-r-xl bg-transparent px-2 py-3 text-sm text-[#0b2a6a] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="blog-category" className="mb-2 block text-sm font-semibold text-[#0b2a6a]">
              Blog category
            </label>
            <select
              id="blog-category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className={inputClass}
              required
              disabled={loadingCategories || categories.length === 0}
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "Choose a category"}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {!loadingCategories && categories.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                Add a category from the Blogs management page before creating a blog.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="blog-content" className="mb-2 block text-sm font-semibold text-[#0b2a6a]">
              Blog content
            </label>
            <textarea
              id="blog-content"
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              className={`${inputClass} min-h-72 resize-y leading-7`}
              placeholder="Write your blog content here..."
              required
            />
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-bold text-[#0b2a6a]">Featured image</h2>
            <p className="mt-1 text-sm text-slate-500">Choose the main image shown on the blog card.</p>
          </div>
          {(featuredPreview || form.featuredImage) && (
            <div className="relative aspect-[16/9] max-w-xl overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={featuredPreview || form.featuredImage}
                alt="Featured blog preview"
                fill
                unoptimized={Boolean(featuredPreview?.startsWith("blob:"))}
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0b2a6a]/15 px-4 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a]/5">
            <ImagePlus size={18} />
            {form.featuredImage ? "Replace featured image" : "Upload featured image"}
            <input type="file" accept="image/*" onChange={handleFeaturedImage} className="sr-only" />
          </label>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-bold text-[#0b2a6a]">Additional images</h2>
            <p className="mt-1 text-sm text-slate-500">Add any number of supporting images to the article.</p>
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.images.map((image, index) => (
                <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <Image src={image} alt={`Blog gallery image ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 shadow hover:bg-white"
                    aria-label={`Remove gallery image ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {pendingGallery.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pendingGallery.map((preview, index) => (
                <div
                  key={preview.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-amber-200 bg-slate-100"
                >
                  <Image
                    src={preview.url}
                    alt={`Selected image awaiting upload ${index + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1.5 text-center text-xs font-medium text-white">
                    {preview.status === "uploading"
                      ? "Uploading..."
                      : "Upload failed — select again to retry"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      revokeLocalPreview(preview.url);
                      setPendingGallery((current) =>
                        current.filter((item) => item.id !== preview.id),
                      );
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 shadow hover:bg-white"
                    aria-label={`Remove selected image ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0b2a6a]/15 px-4 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a]/5">
            <ImagePlus size={18} />
            Add gallery images
            <input ref={galleryInput} type="file" accept="image/*" multiple onChange={handleGalleryImages} className="sr-only" />
          </label>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {uploading && <span className="mr-auto text-sm text-slate-500">Uploading images...</span>}
          <Link href="/admin/blogs" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153b87] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {saving ? "Saving..." : blogId ? "Save changes" : "Publish blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
