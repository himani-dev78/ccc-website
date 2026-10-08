"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Users } from "lucide-react";

const links = [
  { href: "/admin/aq", label: "Questions & profiles", icon: ClipboardList, exact: true },
  { href: "/admin/aq/leads", label: "Leads", icon: Users },
];

export default function AQAdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="AQ admin" className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
              active ? "bg-[#0b2a6a] text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
