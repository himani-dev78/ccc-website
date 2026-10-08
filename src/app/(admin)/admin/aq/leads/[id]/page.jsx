"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, Mail, Phone, XCircle } from "lucide-react";

import AQAdminNav from "@/components/admin/aq/AQAdminNav";
import { inputClass } from "@/components/admin/aq/aqEditorUtils";

const formatDateTime = (value) => new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function AQLeadDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const [note, setNote] = useState("");
  const [previewNote, setPreviewNote] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [sendMessage, setSendMessage] = useState(null); // { type: "ok" | "error", text }

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/aq/leads/${encodeURIComponent(id)}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json().then((json) => ({ ok: r.ok, json })))
      .then(({ ok, json }) => {
        if (!ok) throw new Error(json?.message || "Unable to load lead.");
        setData(json);
      })
      .catch((err) => err.name !== "AbortError" && setError(err.message));
    return () => controller.abort();
  }, [id]);

  // Email preview — refreshes shortly after the personal note stops changing
  useEffect(() => {
    const timer = setTimeout(() => setPreviewNote(note), 600);
    return () => clearTimeout(timer);
  }, [note]);

  useEffect(() => {
    const controller = new AbortController();
    const query = previewNote ? `?note=${encodeURIComponent(previewNote)}` : "";
    fetch(`/api/admin/aq/leads/${encodeURIComponent(id)}/email${query}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json().then((json) => ({ ok: r.ok, json })))
      .then(({ ok, json }) => {
        if (!ok) throw new Error(json?.message || "Unable to build the email.");
        setPreview(json);
        setPreviewError("");
      })
      .catch((err) => err.name !== "AbortError" && setPreviewError(err.message));
    return () => controller.abort();
  }, [id, previewNote]);

  const lead = data?.lead;
  const names = Object.fromEntries((data?.profiles || []).map((p) => [p.key, p.name]));
  const profileName = (key) => names[key] || key;
  const tally = Object.entries(lead?.scores || {}).sort((a, b) => b[1] - a[1]);
  const maxTally = Math.max(1, ...tally.map(([, count]) => count));

  function markSent(json) {
    setData((current) => ({
      ...current,
      lead: { ...current.lead, resultEmailSentAt: json.resultEmailSentAt, resultEmailSentCount: json.resultEmailSentCount },
    }));
  }

  async function markSentManually() {
    if (!window.confirm(`Mark the result email to ${lead.email} as sent?`)) return;
    const response = await fetch(`/api/admin/aq/leads/${encodeURIComponent(id)}/email`, { method: "PATCH" });
    const json = await response.json().catch(() => null);
    if (response.ok) {
      markSent(json);
      setSendMessage({ type: "ok", text: "Marked as sent." });
    } else {
      setSendMessage({ type: "error", text: json?.message || "Unable to update the lead." });
    }
  }

  const mailtoHref = preview
    ? `mailto:${encodeURIComponent(preview.to)}?subject=${encodeURIComponent(preview.subject)}&body=${encodeURIComponent(preview.text)}`
    : "#";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AQAdminNav />
      <Link href="/admin/aq/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b2a6a] hover:text-[#a77b00]">
        <ArrowLeft size={16} /> All leads
      </Link>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {!lead && !error && (
        <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
          <Loader2 className="animate-spin text-[#0b2a6a]" size={20} /> Loading lead…
        </div>
      )}

      {lead && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-[#0b2a6a]">{lead.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-[#0b2a6a]">
                <Mail size={14} /> {lead.email}
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-[#0b2a6a]">
                  <Phone size={14} /> {lead.phone}
                </a>
              )}
              {lead.company && <span>{lead.company}</span>}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Submitted {formatDateTime(lead.createdAt)}
              {lead.ipCountry ? ` · ${lead.ipCountry}` : ""}
              {lead.source ? ` · source: ${lead.source}` : ""}
              {lead.campaign ? ` · campaign: ${lead.campaign}` : ""}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#0b2a6a] p-4 text-white">
                <p className="text-xs uppercase tracking-wide text-white/60">Result profile</p>
                <p className="mt-1 text-lg font-bold text-[#f9bd0e]">{profileName(lead.resultProfileKey)}</p>
                {lead.secondaryProfileKey && <p className="text-xs text-white/70">Secondary: {profileName(lead.secondaryProfileKey)}</p>}
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">AQ score</p>
                <p className="mt-1 text-lg font-bold text-[#0b2a6a]">
                  {lead.maxScore ? `${lead.score} / ${lead.maxScore}` : lead.score || "—"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Result email</p>
                {lead.resultEmailSentAt ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={15} /> Sent {formatDateTime(lead.resultEmailSentAt)}
                    {lead.resultEmailSentCount > 1 ? ` (${lead.resultEmailSentCount}×)` : ""}
                  </p>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                    <XCircle size={15} /> Not sent yet
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Send the result email */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0b2a6a]">Result email</h2>
            <p className="mt-1 text-sm text-slate-500">
              Their score and detailed result, built from the profile in AQ settings. Add a personal note if you like.
            </p>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Personal note (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={2000}
                className={`${inputClass} min-h-24 resize-y`}
                placeholder="Replaces the default opening line: “Thank you for taking the Authority Quotient assessment. Here is your detailed result.”"
              />
            </label>

            {previewError ? (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{previewError}</p>
            ) : preview ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                  <p><span className="font-semibold">To:</span> {preview.to}</p>
                  <p><span className="font-semibold">Subject:</span> {preview.subject}</p>
                </div>
                <iframe title="Email preview" srcDoc={preview.html} sandbox="" className="h-[560px] w-full bg-[#f6f7fb]" />
              </div>
            ) : (
              <div className="mt-4 flex h-40 items-center justify-center text-sm text-slate-500">
                <Loader2 className="mr-2 animate-spin" size={16} /> Building preview…
              </div>
            )}

            {sendMessage && (
              <p
                role={sendMessage.type === "error" ? "alert" : "status"}
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  sendMessage.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {sendMessage.text}
              </p>
            )}

            <p className="mt-4 text-sm text-slate-500">
              “Open in my email app” starts a new email with this result filled in. After sending it, click “Mark as sent”.
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white hover:bg-[#153b87]"
              >
                <ExternalLink size={16} /> Open in my email app
              </a>
              <button
                type="button"
                onClick={markSentManually}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#0b2a6a] hover:bg-slate-50"
              >
                <CheckCircle2 size={16} /> {lead.resultEmailSentAt ? "Mark as sent again" : "Mark as sent"}
              </button>
            </div>
          </section>

          {tally.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0b2a6a]">Score breakdown</h2>
              <ul className="mt-4 space-y-3">
                {tally.map(([key, count]) => (
                  <li key={key}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{profileName(key)}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#f9bd0e]" style={{ width: `${(count / maxTally) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0b2a6a]">Answers</h2>
            <ol className="mt-4 divide-y divide-slate-100">
              {lead.answers.map((answer, index) => (
                <li key={index} className="py-3">
                  <p className="text-sm font-semibold text-[#0b2a6a]">
                    {index + 1}. {answer.prompt}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {answer.label}
                    {answer.profileKey && <span className="ml-2 text-xs text-slate-400">→ {profileName(answer.profileKey)}</span>}
                    {answer.points ? <span className="ml-2 text-xs text-slate-400">· {answer.points} pts</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
