"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  Mail,
  MessageSquareQuote,
  RefreshCw,
  Users,
} from "lucide-react";

const summaryCards = [
  { key: "team", label: "Team members", href: "/admin/team", icon: Users, color: "bg-emerald-50 text-emerald-700" },
  { key: "portfolio", label: "Portfolio projects", href: "/admin/portfolio", icon: BriefcaseBusiness, color: "bg-sky-50 text-sky-700" },
  { key: "contacts", label: "Contact messages", href: "/admin/contacts", icon: Mail, color: "bg-amber-50 text-amber-700" },
  { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, color: "bg-rose-50 text-rose-700" },
];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load dashboard data");
      }

      setOverview(data.overview);
    } catch (loadError) {
      setError(loadError.message || "Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not load dashboard data");
        }
        return data.overview;
      })
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load dashboard data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-[#0b2a6a] px-6 py-7 text-white sm:px-9 sm:py-9">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/5" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f9bd0e]">Workspace overview</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">Good to see you.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Review your website content and the latest messages in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={loadOverview}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Website totals">
        {summaryCards.map(({ key, label, href, icon: Icon, color }) => (
          <Link
            key={key}
            href={href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0b2a6a]/20 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon size={20} />
              </span>
              <ArrowUpRight size={18} className="text-slate-300 transition group-hover:text-[#0b2a6a]" />
            </div>
            <p className="mt-6 text-3xl font-black text-[#0b2a6a]">
              {loading ? "—" : overview?.[key] ?? 0}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Inbox</p>
              <h2 className="mt-1 text-xl font-black text-[#0b2a6a]">Recent messages</h2>
            </div>
            <Link href="/admin/contacts" className="text-sm font-bold text-[#0b2a6a] hover:text-amber-600">
              Open inbox
            </Link>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {loading ? (
              <p className="py-6 text-sm text-slate-500">Loading recent messages...</p>
            ) : overview?.recentContacts?.length ? (
              overview.recentContacts.map((contact) => (
                <Link key={contact._id} href="/admin/contacts" className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#0b2a6a]">{contact.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">{contact.subject || contact.message}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </time>
                </Link>
              ))
            ) : (
              <p className="py-6 text-sm text-slate-500">No contact messages yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9bd0e]/20 text-[#0b2a6a]">
              <Activity size={19} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Shortcuts</p>
              <h2 className="text-xl font-black text-[#0b2a6a]">Manage content</h2>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {[
              ["Add team member", "/admin/team/add", Users],
              ["Add portfolio project", "/admin/portfolio/add", BriefcaseBusiness],
              ["Manage testimonials", "/admin/testimonials", MessageSquareQuote],
              ["View contact messages", "/admin/contacts", Mail],
            ].map(([label, href, Icon]) => (
              <Link key={href} href={href} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#0b2a6a]">
                <span className="flex items-center gap-3"><Icon size={17} className="text-[#0b2a6a]" />{label}</span>
                <ArrowUpRight size={16} className="text-slate-400" />
              </Link>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
            <Clock3 size={14} /> Counts reflect the latest refresh.
          </p>
        </div>
      </section>
    </div>
  );
}