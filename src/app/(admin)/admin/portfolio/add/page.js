"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "@/lib/uploadImage";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  Layers,
  ImagePlus,
  Trash2,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "CLIENT PARTNERING",
  "COACHING FOR LEADERS",
  "HIGH IMPACT COMMUNICATION",
  "I.D. & F.S.",
  "STORYTELLING FOR BUSINESS",
  "TEAM SYNERGY",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  title: "",
  slug: "",
  client: "",
  category: "",
  image: "",
  images: [],
  shortDescription: "",
  context: "",
  complexity: "",
  resolution: "",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e]">
          <Icon className="h-5 w-5" />
        </span>

        <div>
          <h2 className="text-lg font-bold text-[#0b2a6a]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0b2a6a]">
        {label}

        {required && (
          <span className="text-[#f9bd0e]"> *</span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] text-[#0b2a6a] placeholder:text-slate-400 transition focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40";

const textareaClass =
  "w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] leading-6 text-[#0b2a6a] placeholder:text-slate-400 transition focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40";

export default function AddPortfolioPage() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [imageError, setImageError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/portfolio/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        if (data.categories?.length) {
          setCategories(data.categories.map((category) => category.name));
        }
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    }

    fetchCategories();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTitleChange(e) {
    const title = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title,
      slug: createSlug(title),
    }));
  }

  async function handleImageSelection(event) {
    const input = event.currentTarget;
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/")
    );
    const oversized = validFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE
    );
    const allowedFiles = validFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE
    );
    const validationMessage = [
      validFiles.length !== files.length ? "Please select valid image files only." : "",
      oversized.length ? "Each image must be smaller than 5MB." : "",
    ].filter(Boolean).join(" ");

    if (!allowedFiles.length) {
      setImageError(validationMessage || "Select at least one valid image.");
      input.value = "";
      return;
    }

    try {
      setUploadingImages(true);
      setImageError("Uploading images to Cloudinary...");
      const uploaded = await Promise.all(
        allowedFiles.map((file) => uploadImage(file, "portfolio"))
      );
      const uploadedUrls = uploaded.map((image) => image.url);
      setFormData((prev) => {
        const nextImages = [...new Set([...prev.images, ...uploadedUrls])];
        return { ...prev, images: nextImages, image: nextImages[0] || "" };
      });
      setImageError(validationMessage);
    } catch (uploadError) {
      setImageError(uploadError.message || "Could not upload selected images.");
    } finally {
      setUploadingImages(false);
      input.value = "";
    }
  }

  function removeImage(index) {
    const nextImages = formData.images.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      images: nextImages,
      image: nextImages[0] || "",
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (uploadingImages) {
      setError("Wait for image uploads to finish before saving.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: formData.images,
          image: formData.image || formData.images[0] || "",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.message ||
            "Failed to create portfolio"
        );
        return;
      }

      setMessage(
        data?.message ||
          "Portfolio created successfully!"
      );

      setTimeout(() => {
        router.push("/admin/portfolio");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "Create portfolio error:",
        error
      );

      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-10">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-8">
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
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#0b2a6a]">
                Admin
              </span>

              <h1 className="mt-2 text-3xl font-bold text-[#0b2a6a]">
                Add Portfolio
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add a new case study to your portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div
            role="status"
            className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2
              size={18}
              className="shrink-0"
            />

            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle
              size={18}
              className="shrink-0"
            />

            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          {/* Basic Information */}
          <Section
            icon={Briefcase}
            title="Basic Information"
            subtitle="Add the basic information about this portfolio case study."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <Field
                label="Portfolio Title"
                required
              >
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Xceedance - High Impact Communication"
                  className={inputClass}
                  required
                />
              </Field>

              {/* Client */}
              <Field
                label="Client"
                required
              >
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="e.g. Xceedance"
                  className={inputClass}
                  required
                />
              </Field>

              {/* Category */}
              <Field
                label="Category"
                required
              >
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Slug */}
              <Field
                label="Slug"
                required
              >
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="xceedance-high-impact-communication"
                  className={inputClass}
                  required
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  This will be used in the public portfolio URL.
                </p>
              </Field>
            </div>
          </Section>

          {/* Image & Description */}
          <Section
            icon={ImageIcon}
            title="Image & Description"
            subtitle="Add the portfolio images and short introduction."
          >
            <Field label="Portfolio Images">
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                ref={imageInputRef}
                onChange={handleImageSelection}
              />

              {formData.images?.length ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {formData.images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={image}
                          alt={`Portfolio preview ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-red-500"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#0b2a6a] px-3 py-2 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a] hover:text-white"
                    >
                      <ImagePlus size={16} />
                      Add more images
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e]/10"
                >
                  <ImagePlus className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-semibold text-[#0b2a6a]">
                    Click to select images
                  </span>
                  <span className="text-xs text-slate-400">
                    PNG or JPG, up to 5MB each
                  </span>
                </button>
              )}

              {imageError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {imageError}
                </p>
              )}
            </Field>

            {/* Short Description */}
            <Field label="Short Description">
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Mastering the Art of Persuasive Communication"
                className={textareaClass}
              />
            </Field>
          </Section>

          {/* Case Study */}
          <Section
            icon={FileText}
            title="Case Study"
            subtitle="Describe the client challenge and how CCC addressed it."
          >
            {/* Context */}
            <Field
              label="Context"
              required
            >
              <textarea
                name="context"
                value={formData.context}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the situation or background of the client..."
                className={textareaClass}
                required
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Explain the client&apos;s situation and what was
                happening before the intervention.
              </p>
            </Field>

            {/* Complexity */}
            <Field
              label="Complexity"
              required
            >
              <textarea
                name="complexity"
                value={formData.complexity}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the challenge, complexity, or problem..."
                className={textareaClass}
                required
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Explain the key challenge the client needed
                to overcome.
              </p>
            </Field>

            {/* Resolution */}
            <Field
              label="Resolution"
              required
            >
              <textarea
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                rows={8}
                placeholder="Describe the solution, program, approach, and results..."
                className={textareaClass}
                required
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Explain how CCC addressed the challenge and
                the impact of the work.
              </p>
            </Field>
          </Section>

          {/* URL Preview */}
          <Section
            icon={Layers}
            title="Portfolio URL"
            subtitle="Preview how this case study will appear on the website."
          >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Public URL
              </p>

              <p className="mt-2 break-all text-sm font-medium text-[#0b2a6a]">
                /portfolio/
                {formData.slug || "your-portfolio-slug"}
              </p>
            </div>
          </Section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/portfolio"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2a6a] px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {uploadingImages
                ? "Uploading images..."
                : saving
                ? "Creating..."
                : "Create Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}