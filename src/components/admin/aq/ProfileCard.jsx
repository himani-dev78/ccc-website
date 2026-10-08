"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, ChevronDown, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { inputClass, labelClass } from "./aqEditorUtils";

export default function ProfileCard({
  profile,
  index,
  expanded,
  onToggle,
  onChange,
  onRemove,
  services,
  scoringMode,
  usage,
  hasIssue,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const image = await uploadImage(file, "aq");
      onChange({ imageUrl: image.url });
    } catch (error) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${hasIssue ? "border-amber-300" : "border-slate-200"}`}
    >
      <div className="flex items-center gap-2 pr-3">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b2a6a]/5 text-[#0b2a6a]">
            <Award size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#0b2a6a]">
              {profile.name || `Result profile ${index + 1}`}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">{profile.key || "no-key"}</code>
              {scoringMode === "points"
                ? `Scores ${profile.minScore === "" ? "?" : profile.minScore}–${profile.maxScore === "" ? "?" : profile.maxScore}`
                : `${usage} ${usage === 1 ? "answer" : "answers"} linked`}
              {hasIssue && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">Needs attention</span>
              )}
            </span>
          </span>
          <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete profile ${profile.name || index + 1}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {expanded && (
        <div className="grid gap-4 border-t border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Profile name</span>
            <input
              value={profile.name}
              onChange={(event) => onChange({ name: event.target.value })}
              className={inputClass}
              placeholder="The Connector"
              maxLength={120}
            />
          </label>
          <label>
            <span className={labelClass}>Key</span>
            <input
              value={profile.key}
              onChange={(event) => onChange({ key: event.target.value, keyTouched: true })}
              className={`${inputClass} font-mono`}
              placeholder="connector"
              maxLength={60}
            />
            <span className="mt-1 block text-xs text-slate-500">
              Used in Brevo and on stored leads. Avoid changing it once leads exist.
            </span>
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Headline</span>
            <input
              value={profile.headline}
              onChange={(event) => onChange({ headline: event.target.value })}
              className={inputClass}
              placeholder="You build authority through relationships"
              maxLength={300}
            />
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Description</span>
            <textarea
              value={profile.description}
              onChange={(event) => onChange({ description: event.target.value })}
              className={`${inputClass} min-h-28 resize-y`}
              placeholder="3–4 sentences. Shown on the result screen and in the result email."
            />
          </label>
          <label>
            <span className={labelClass}>Strengths (one per line)</span>
            <textarea
              value={profile.strengthsText}
              onChange={(event) => onChange({ strengthsText: event.target.value })}
              className={`${inputClass} min-h-28 resize-y`}
            />
          </label>
          <label>
            <span className={labelClass}>Watch-outs (one per line)</span>
            <textarea
              value={profile.watchOutsText}
              onChange={(event) => onChange({ watchOutsText: event.target.value })}
              className={`${inputClass} min-h-28 resize-y`}
            />
          </label>

          {scoringMode === "points" && (
            <>
              <label>
                <span className={labelClass}>Minimum score</span>
                <input
                  type="number"
                  step="any"
                  value={profile.minScore}
                  onChange={(event) => onChange({ minScore: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label>
                <span className={labelClass}>Maximum score</span>
                <input
                  type="number"
                  step="any"
                  value={profile.maxScore}
                  onChange={(event) => onChange({ maxScore: event.target.value })}
                  className={inputClass}
                />
              </label>
            </>
          )}

          <label className="sm:col-span-2">
            <span className={labelClass}>Recommended service</span>
            <select
              value={profile.recommendedService}
              onChange={(event) => onChange({ recommendedService: event.target.value })}
              className={inputClass}
            >
              <option value="">None</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2">
            <span className={labelClass}>Profile image (optional)</span>
            <div className="flex flex-wrap items-center gap-4">
              {profile.imageUrl ? (
                <div className="relative h-20 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={profile.imageUrl} alt="" fill sizes="128px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => onChange({ imageUrl: "" })}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 hover:text-red-600"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#0b2a6a] hover:border-[#f9bd0e]">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                {uploading ? "Uploading…" : profile.imageUrl ? "Replace image" : "Upload image"}
                <input type="file" accept="image/*" className="sr-only" onChange={handleImage} disabled={uploading} />
              </label>
            </div>
            {uploadError && <p className="mt-2 text-sm text-red-700">{uploadError}</p>}
          </div>
        </div>
      )}
    </article>
  );
}
