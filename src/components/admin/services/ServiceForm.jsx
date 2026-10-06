"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0b2a6a] placeholder:text-slate-400 focus:border-[#f9bd0e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/40";

function makeSlug(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const emptyForm = {
  title: "",
  slug: "",
  heroImage: "",
  intro: "",
  audienceHeading: "Who should attend?",
  audienceText: "",
  outcomesHeading: "Program outcomes",
  outcomesText: "",
  sections: [],
};

function parseLines(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0b2a6a]">{label}</span>
      {children}
    </label>
  );
}

export default function ServiceForm({ serviceId }) {
  const router = useRouter();
  const imageInput = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;
    const controller = new AbortController();

    async function loadService() {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || "Unable to load service.");
        const service = data.service;
        setForm({
          title: service.title || "",
          slug: service.slug || "",
          heroImage: service.heroImage || "",
          intro: service.intro || "",
          audienceHeading: service.audienceHeading || "Who should attend?",
          audienceText: (service.audience || []).join("\n"),
          outcomesHeading: service.outcomesHeading || "Program outcomes",
          outcomesText: (service.outcomes || []).join("\n"),
          sections: service.sections || [],
        });
        setSlugEdited(true);
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load service.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadService();
    return () => controller.abort();
  }, [serviceId]);

  async function handleImage(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image file smaller than 5MB.");
      input.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      const image = await uploadImage(file, "services");
      setForm((current) => ({ ...current, heroImage: image.url }));
    } catch (uploadError) {
      setError(uploadError.message || "Could not upload service image.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  function updateSection(sectionIndex, changes) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...changes } : section,
      ),
    }));
  }

  function updateFeature(sectionIndex, featureIndex, changes) {
    const features = form.sections[sectionIndex].features.map((feature, index) =>
      index === featureIndex ? { ...feature, ...changes } : feature,
    );
    updateSection(sectionIndex, { features });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      slug: form.slug,
      heroImage: form.heroImage,
      intro: form.intro,
      audienceHeading: form.audienceHeading,
      audience: parseLines(form.audienceText),
      outcomesHeading: form.outcomesHeading,
      outcomes: parseLines(form.outcomesText),
      sections: form.sections,
    };

    try {
      const response = await fetch(
        serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services",
        {
          method: serviceId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to save service.");
      router.push("/admin/services");
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "Unable to save service.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#0b2a6a]" /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b2a6a]">
          <ArrowLeft size={17} /> Back to Services
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#0b2a6a]">{serviceId ? "Edit Service" : "Add Service"}</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the service page and its content on the website.</p>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#0b2a6a]">Service overview</h2>
          <Field label="Service title">
            <input
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({ ...current, title, slug: slugEdited ? current.slug : makeSlug(title) }));
              }}
              className={inputClass}
              placeholder="e.g. High Performing Teams"
              required
            />
          </Field>
          <Field label="Page URL">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#f9bd0e]">
              <span className="whitespace-nowrap pl-4 text-sm text-slate-400">/services/</span>
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setForm((current) => ({ ...current, slug: makeSlug(event.target.value) }));
                }}
                className="w-full rounded-r-xl bg-transparent px-2 py-3 text-sm text-[#0b2a6a] outline-none"
                required
              />
            </div>
          </Field>
          <Field label="Introduction">
            <textarea
              value={form.intro}
              onChange={(event) => setForm((current) => ({ ...current, intro: event.target.value }))}
              className={`${inputClass} min-h-28 resize-y leading-6`}
              placeholder="Describe the service and who it helps."
              required
            />
          </Field>
          <Field label="Hero image (optional)">
            {form.heroImage && (
              <div className="relative mb-3 aspect-[16/9] max-w-xl overflow-hidden rounded-xl bg-slate-100">
                <Image src={form.heroImage} alt="Service hero preview" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
              </div>
            )}
            <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0b2a6a]/15 px-4 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a]/5">
              <ImagePlus size={18} /> {form.heroImage ? "Replace image" : "Upload image"}
              <input ref={imageInput} type="file" accept="image/*" onChange={handleImage} className="sr-only" />
            </span>
          </Field>
        </section>

        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0b2a6a]">Who should attend?</h2>
            <Field label="Section heading">
              <input value={form.audienceHeading} onChange={(event) => setForm((current) => ({ ...current, audienceHeading: event.target.value }))} className={inputClass} />
            </Field>
            <Field label="List (one item per line)">
              <textarea value={form.audienceText} onChange={(event) => setForm((current) => ({ ...current, audienceText: event.target.value }))} className={`${inputClass} min-h-40 resize-y`} placeholder={"Teams working in silos\nTeams going through transitions"} />
            </Field>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0b2a6a]">Program outcomes</h2>
            <Field label="Section heading">
              <input value={form.outcomesHeading} onChange={(event) => setForm((current) => ({ ...current, outcomesHeading: event.target.value }))} className={inputClass} />
            </Field>
            <Field label="List (one item per line)">
              <textarea value={form.outcomesText} onChange={(event) => setForm((current) => ({ ...current, outcomesText: event.target.value }))} className={`${inputClass} min-h-40 resize-y`} placeholder={"Improved collaboration\nIncreased trust"} />
            </Field>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#0b2a6a]">Page content sections</h2>
              <p className="mt-1 text-sm text-slate-500">Add headings, descriptions and feature blocks.</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, sections: [...current.sections, { title: "", subtitle: "", description: "", features: [] }] }))}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0b2a6a]/15 px-4 py-2.5 text-sm font-semibold text-[#0b2a6a] hover:bg-[#0b2a6a]/5"
            >
              <Plus size={16} /> Add section
            </button>
          </div>

          {form.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0b2a6a]">Section {sectionIndex + 1}</h3>
                <button type="button" onClick={() => setForm((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== sectionIndex) }))} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Remove section ${sectionIndex + 1}`}>
                  <Trash2 size={17} />
                </button>
              </div>
              <Field label="Section heading">
                <input value={section.title} onChange={(event) => updateSection(sectionIndex, { title: event.target.value })} className={inputClass} required />
              </Field>
              <Field label="Subheading / highlighted line">
                <input value={section.subtitle} onChange={(event) => updateSection(sectionIndex, { subtitle: event.target.value })} className={inputClass} />
              </Field>
              <Field label="Description">
                <textarea value={section.description} onChange={(event) => updateSection(sectionIndex, { description: event.target.value })} className={`${inputClass} min-h-24 resize-y`} />
              </Field>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#0b2a6a]">Feature blocks</h4>
                  <button type="button" onClick={() => updateSection(sectionIndex, { features: [...section.features, { title: "", text: "" }] })} className="inline-flex items-center gap-1 text-sm font-semibold text-[#0b2a6a]">
                    <Plus size={15} /> Add feature
                  </button>
                </div>
                {section.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_2fr_auto]">
                    <input aria-label={`Feature ${featureIndex + 1} heading`} value={feature.title} onChange={(event) => updateFeature(sectionIndex, featureIndex, { title: event.target.value })} className={inputClass} placeholder="Feature heading" />
                    <textarea aria-label={`Feature ${featureIndex + 1} description`} value={feature.text} onChange={(event) => updateFeature(sectionIndex, featureIndex, { text: event.target.value })} className={`${inputClass} min-h-12 resize-y`} placeholder="Feature description" />
                    <button type="button" onClick={() => updateSection(sectionIndex, { features: section.features.filter((_, index) => index !== featureIndex) })} className="justify-self-end rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Remove feature ${featureIndex + 1}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/admin/services" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153b87] disabled:opacity-60">
            {saving || uploading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {uploading ? "Uploading..." : saving ? "Saving..." : serviceId ? "Save changes" : "Create service"}
          </button>
        </div>
      </form>
    </div>
  );
}
