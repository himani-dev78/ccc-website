"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Gauge, Loader2, RefreshCw, Search, Send, XCircle } from "lucide-react";

import AQAdminNav from "@/components/admin/aq/AQAdminNav";
import { inputClass } from "@/components/admin/aq/aqEditorUtils";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AQLeadsPage() {
  const [filters, setFilters] = useState({ q: "", profile: "", from: "", to: "", emailed: "", synced: "" });
  const [applied, setApplied] = useState(filters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState({});

  const query = new URLSearchParams(Object.entries(applied).filter(([, value]) => value)).toString();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/aq/leads?${query}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json().then((json) => ({ ok: r.ok, json })))
      .then(({ ok, json }) => {
        if (!ok) throw new Error(json?.message || "Unable to load leads.");
        setData(json);
        setError("");
      })
      .catch((loadError) => loadError.name !== "AbortError" && setError(loadError.message))
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [query]);

  function applyFilters(event) {
    event.preventDefault();
    if (JSON.stringify(filters) === JSON.stringify(applied)) return;
    setLoading(true);
    setApplied(filters);
  }

  async function resync(id) {
    setSyncing((s) => ({ ...s, [id]: true }));
    try {
      const response = await fetch(`/api/admin/aq/leads/${id}/resync`, { method: "POST" });
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.message || "Sync failed");
      setData((current) => ({
        ...current,
        leads: current.leads.map((l) => (l._id === id ? { ...l, syncedToEsp: true, syncedAt: json.syncedAt } : l)),
        summary: { ...current.summary, unsynced: Math.max(0, current.summary.unsynced - 1) },
      }));
    } catch (syncError) {
      window.alert(syncError.message);
    } finally {
      setSyncing((s) => ({ ...s, [id]: false }));
    }
  }

  // Brevo column only matters once some lead has been synced
  const showBrevo = Boolean(data?.leads?.some((l) => l.syncedToEsp));
  const profileNames = Object.fromEntries((data?.profiles || []).map((p) => [p.key, p.name]));
  const summary = data?.summary;
  const stats = summary
    ? [
        { label: "This month", value: summary.thisMonth },
        { label: "Last 7 days", value: summary.lastWeek },
        { label: "Awaiting result email", value: summary.awaitingEmail, note: `${summary.total} leads all time` },
        {
          label: "Most common profile",
          value: summary.topProfile ? summary.topProfile.name : "—",
          note: summary.topProfile ? `${summary.topProfile.count} leads` : "",
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0b2a6a] px-6 py-7 text-white shadow-sm sm:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f9bd0e] text-[#0b2a6a]">
            <Gauge size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-bold">AQ Leads</h1>
            <p className="mt-1 text-sm text-white/70">Everyone who completed the assessment and entered their email.</p>
          </div>
        </div>
        <a
          href={`/api/admin/aq/leads?${query}${query ? "&" : ""}format=csv`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#f9bd0e] px-4 py-2.5 text-sm font-bold text-[#0b2a6a] hover:bg-[#f5c93e]"
        >
          <Download size={16} /> Export CSV
        </a>
      </header>

      <AQAdminNav />

      {summary && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
              <p className="mt-1 truncate text-xl font-bold text-[#0b2a6a]">{stat.value}</p>
              {stat.note && <p className="text-xs text-slate-500">{stat.note}</p>}
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={applyFilters}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]"
      >
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Name, email or phone"
            className={`${inputClass} pl-9`}
          />
        </label>
        <select
          value={filters.profile}
          onChange={(e) => setFilters({ ...filters, profile: e.target.value })}
          className={inputClass}
          aria-label="Filter by profile"
        >
          <option value="">All profiles</option>
          {(data?.profiles || []).map((p) => (
            <option key={p.key} value={p.key}>
              {p.name}
            </option>
          ))}
        </select>
        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} className={inputClass} aria-label="From date" />
        <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} className={inputClass} aria-label="To date" />
        <select
          value={filters.emailed}
          onChange={(e) => setFilters({ ...filters, emailed: e.target.value })}
          className={inputClass}
          aria-label="Filter by result email"
        >
          <option value="">Any email status</option>
          <option value="no">Email not sent ({summary?.awaitingEmail ?? 0})</option>
          <option value="yes">Email sent</option>
        </select>
        <button type="submit" className="rounded-xl bg-[#0b2a6a] px-5 py-3 text-sm font-bold text-white hover:bg-[#153b87]">
          Apply
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && !data ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-[#0b2a6a]" size={20} /> Loading leads…
          </div>
        ) : data?.leads?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Result profile</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Result email</th>
                  {showBrevo && <th className="px-4 py-3 font-semibold">Brevo</th>}
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 ${loading ? "opacity-60" : ""}`}>
                {data.leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/aq/leads/${lead._id}`} className="font-semibold text-[#0b2a6a] hover:underline">
                        {lead.name}
                      </Link>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{lead.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#f9bd0e]/20 px-2.5 py-1 text-xs font-semibold text-[#0b2a6a]">
                        {profileNames[lead.resultProfileKey] || lead.resultProfileKey}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3">
                      {lead.resultEmailSentAt ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={15} /> Sent
                        </span>
                      ) : (
                        <Link
                          href={`/admin/aq/leads/${lead._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f9bd0e] px-2.5 py-1 text-xs font-bold text-[#0b2a6a] hover:bg-[#f5c93e]"
                        >
                          <Send size={13} /> Send result
                        </Link>
                      )}
                    </td>
                    {showBrevo && (
                    <td className="px-4 py-3">
                      {lead.syncedToEsp ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={15} /> Synced
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => resync(lead._id)}
                          disabled={syncing[lead._id]}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          {syncing[lead._id] ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                          {syncing[lead._id] ? "Syncing…" : "Not synced"}
                          {!syncing[lead._id] && <RefreshCw size={12} />}
                        </button>
                      )}
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            {query ? "No leads match these filters." : "No leads yet. They appear here when someone completes /assessment."}
          </p>
        )}
      </div>
    </div>
  );
}
