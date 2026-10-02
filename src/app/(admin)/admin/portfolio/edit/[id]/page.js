
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { uploadImage } from "@/lib/uploadImage";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  AlertCircle,
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

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [formData, setFormData] = useState({
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
  });

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageInputRef = useRef(null);

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

        const portfolio = data.portfolio;

        const images = Array.isArray(portfolio.images) && portfolio.images.length
          ? portfolio.images
          : portfolio.image
            ? [portfolio.image]
            : [];

        setFormData({
          title: portfolio.title || "",
          slug: portfolio.slug || "",
          client: portfolio.client || "",
          category: portfolio.category || "",
          image: images[0] || "",
          images,
          shortDescription:
            portfolio.shortDescription || "",
          context: portfolio.context || "",
          complexity: portfolio.complexity || "",
          resolution: portfolio.resolution || "",
        });
      } catch (error) {
        console.error(
          "Fetch portfolio error:",
          error
        );

        setError(
          error.message ||
            "Failed to load portfolio"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTitleChange(event) {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: createSlug(value),
    }));
  }

  async function handleImageSelection(event) {
    const input = event.currentTarget;
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    const oversized = validFiles.filter((file) => file.size > MAX_IMAGE_SIZE);
    const allowedFiles = validFiles.filter((file) => file.size <= MAX_IMAGE_SIZE);
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (uploadingImages) {
      setError("Wait for image uploads to finish before saving.");
      return;
    }

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.client.trim() ||
      !formData.category ||
      !formData.context.trim() ||
      !formData.complexity.trim() ||
      !formData.resolution.trim()
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/portfolio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            images: formData.images,
            image: formData.image || formData.images[0] || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update portfolio"
        );
      }

      setSuccess(
        "Portfolio updated successfully."
      );

      setTimeout(() => {
        router.push("/admin/portfolio");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(
        "Update portfolio error:",
        error
      );

      setError(
        error.message ||
          "Failed to update portfolio"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-[#0b2a6a]"
          />

          <p className="text-sm text-gray-500">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/portfolio"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0b2a6a]"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Portfolio
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the details of this portfolio case
            study.
          </p>
        </div>

        <Link
          href={`/portfolio/${formData.slug}`}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ExternalLink size={17} />
          View Public Page
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Main information about this portfolio case
            study.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Xceedance - High Impact Communication"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug <span className="text-red-500">*</span>
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                placeholder="xceedance-high-impact-communication"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />

              <p className="mt-1.5 text-xs text-gray-500">
                This is used in the public URL.
              </p>
            </div>

            {/* Client */}
            <div>
              <label
                htmlFor="client"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Client <span className="text-red-500">*</span>
              </label>

              <input
                id="client"
                name="client"
                type="text"
                value={formData.client}
                onChange={handleChange}
                placeholder="e.g. Xceedance"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category <span className="text-red-500">*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              >
                <option value="">
                  Select category
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
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Portfolio Images
              </label>

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

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#0b2a6a] px-3 py-2 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a] hover:text-white"
                  >
                    <ImagePlus size={16} />
                    Add more images
                  </button>
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
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="shortDescription"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Short Description
              </label>

              <input
                id="shortDescription"
                name="shortDescription"
                type="text"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="e.g. Mastering the Art of Persuasive Communication"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Image Preview
            </h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src={formData.image}
                alt={formData.title || "Portfolio preview"}
                className="h-64 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Case Study */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Case Study
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add the detailed information that will appear
            on the public case study page.
          </p>

          <div className="mt-6 space-y-5">
            {/* Context */}
            <div>
              <label
                htmlFor="context"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Context <span className="text-red-500">*</span>
              </label>

              <textarea
                id="context"
                name="context"
                rows={5}
                value={formData.context}
                onChange={handleChange}
                placeholder="Describe the background or situation..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>

            {/* Complexity */}
            <div>
              <label
                htmlFor="complexity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Complexity <span className="text-red-500">*</span>
              </label>

              <textarea
                id="complexity"
                name="complexity"
                rows={5}
                value={formData.complexity}
                onChange={handleChange}
                placeholder="Explain the challenge or complexity..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>

            {/* Resolution */}
            <div>
              <label
                htmlFor="resolution"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Resolution <span className="text-red-500">*</span>
              </label>

              <textarea
                id="resolution"
                name="resolution"
                rows={7}
                value={formData.resolution}
                onChange={handleChange}
                placeholder="Describe the solution and outcome..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#0b2a6a] focus:ring-2 focus:ring-[#0b2a6a]/10"
              />
            </div>
          </div>
        </div>

        {/* Public URL */}
        {formData.slug && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Public URL
            </p>

            <p className="mt-1 break-all text-sm font-medium text-blue-900">
              /portfolio/{formData.slug}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingImages}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b2a6a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingImages ? (
              "Uploading images..."
            ) : saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Portfolio
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}