"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Mail,
  Settings,
  MessageSquareQuote,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Messages", href: "/admin/contacts", icon: Mail },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0b2a6a]/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col bg-[#0b2a6a] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f9bd0e] text-sm font-extrabold text-[#0b2a6a]">
              CC
            </span>
            <span className="text-[15px] font-bold tracking-wide text-white">
              CCC ADMIN
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`
                  group relative flex items-center gap-3 rounded-xl
                  px-4 py-3 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-[#f9bd0e] text-[#0b2a6a]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {/* Active indicator tab */}
                <span
                  aria-hidden
                  className={`absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#f9bd0e] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon
                  size={19}
                  className={
                    isActive
                      ? "text-[#0b2a6a]"
                      : "text-white/50 group-hover:text-[#f9bd0e]"
                  }
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-xl
              px-4 py-3 text-sm font-medium
              text-white/70 transition-colors
              hover:bg-red-500/15 hover:text-red-300
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]
            "
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
