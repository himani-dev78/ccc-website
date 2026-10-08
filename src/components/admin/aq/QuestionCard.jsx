"use client";

import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { MAX_OPTIONS, MIN_OPTIONS, inputClass, labelClass, newOption } from "./aqEditorUtils";

export default function QuestionCard({
  question,
  index,
  total,
  expanded,
  onToggle,
  onChange,
  onRemove,
  onMove,
  profiles,
  scoringMode,
  hasIssue,
  dragHandlers,
}) {
  const number = String(index + 1).padStart(2, "0");

  function updateOption(optionIndex, changes) {
    onChange({
      options: question.options.map((option, i) => (i === optionIndex ? { ...option, ...changes } : option)),
    });
  }

  return (
    <article
      {...dragHandlers}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        hasIssue ? "border-amber-300" : "border-slate-200"
      } ${question.published ? "" : "opacity-70"}`}
    >
      <div className="flex items-center gap-1 pr-3">
        <span
          className="hidden cursor-grab self-stretch px-2 text-slate-300 hover:text-slate-500 sm:flex sm:items-center"
          title="Drag to reorder"
          aria-hidden="true"
        >
          <GripVertical size={18} />
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 py-4 pl-4 text-left sm:pl-0"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f9bd0e]/20 text-sm font-bold text-[#0b2a6a]">
            {number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#0b2a6a]">
              {question.prompt.trim() || `Question ${index + 1}`}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {question.options.length} options
              {!question.published && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">Hidden</span>
              )}
              {hasIssue && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">Needs attention</span>
              )}
            </span>
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0b2a6a] disabled:opacity-30"
          aria-label={`Move question ${index + 1} up`}
        >
          <ArrowUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0b2a6a] disabled:opacity-30"
          aria-label={`Move question ${index + 1} down`}
        >
          <ArrowDown size={16} />
        </button>
        <button
          type="button"
          onClick={() => onChange({ published: !question.published })}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0b2a6a]"
          aria-label={question.published ? `Hide question ${index + 1}` : `Publish question ${index + 1}`}
          title={question.published ? "Published — click to hide" : "Hidden — click to publish"}
        >
          {question.published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete question ${index + 1}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-5 border-t border-slate-100 bg-slate-50/70 p-5">
          <label className="block">
            <span className={labelClass}>Question</span>
            <textarea
              value={question.prompt}
              onChange={(event) => onChange({ prompt: event.target.value })}
              className={`${inputClass} min-h-20 resize-y`}
              placeholder="In a meeting, are you more likely to…"
              maxLength={500}
            />
          </label>

          <div className="space-y-3">
            <p className={labelClass}>
              Answer options <span className="font-normal normal-case tracking-normal">({MIN_OPTIONS}–{MAX_OPTIONS})</span>
            </p>
            {question.options.map((option, optionIndex) => (
              <div
                key={option._cid}
                className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_190px_90px_36px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                <input
                  value={option.label}
                  onChange={(event) => updateOption(optionIndex, { label: event.target.value })}
                  className={inputClass}
                  placeholder={`Option ${optionIndex + 1}`}
                  aria-label={`Option ${optionIndex + 1} label`}
                  maxLength={300}
                />
                <select
                  value={option.profileKey}
                  onChange={(event) => updateOption(optionIndex, { profileKey: event.target.value })}
                  className={`${inputClass} ${scoringMode === "profile" && !option.profileKey ? "border-amber-300" : ""}`}
                  aria-label={`Profile for option ${optionIndex + 1}`}
                >
                  <option value="">{scoringMode === "profile" ? "Choose profile…" : "No profile"}</option>
                  {profiles.map((profile) => (
                    <option key={profile._cid} value={profile.key} disabled={!profile.key}>
                      {profile.name || profile.key || "Untitled profile"}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="any"
                  value={option.points}
                  onChange={(event) => updateOption(optionIndex, { points: event.target.value })}
                  className={inputClass}
                  aria-label={`Points for option ${optionIndex + 1}`}
                  title="Points (optional unless scoring by score bands)"
                />
                <button
                  type="button"
                  disabled={question.options.length <= MIN_OPTIONS}
                  onClick={() => onChange({ options: question.options.filter((_, i) => i !== optionIndex) })}
                  className="justify-self-end rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Remove option ${optionIndex + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="hidden px-1 text-xs text-slate-400 sm:grid sm:grid-cols-[1fr_190px_90px_36px] sm:gap-2">
              <span>Label shown to the visitor</span>
              <span>Counts towards profile</span>
              <span>Points</span>
            </div>
            {question.options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={() => onChange({ options: [...question.options, newOption()] })}
                className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]"
              >
                <Plus size={15} /> Add option
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
