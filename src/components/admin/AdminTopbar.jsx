"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  User,
  ChevronDown,
  Menu,
  Settings,
  UserCircle,
  Mail,
} from "lucide-react";

export default function AdminTopbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);

  // Close the dropdown on outside click or Escape — it previously stayed
  // open until the same button was clicked again.
  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setProfileOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    async function fetchNotifications() {
      const currentRequest = ++requestId;
      try {
        const response = await fetch("/api/admin/contacts/unread", {
          cache: "no-store",
        });
        const data = await response.json();

        if (active && currentRequest === requestId && response.ok) {
          setNotifications(data.contacts || []);
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.error("Fetch message notifications error:", error);
      }
    }

    function handleReadMessage() {
      setNotifications([]);
      setUnreadCount(0);
      fetchNotifications();
    }

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 15000);
    window.addEventListener("admin-contact-read", handleReadMessage);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("admin-contact-read", handleReadMessage);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#0b2a6a] transition hover:bg-[#f9bd0e]/15 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#0b2a6a]">Admin Dashboard</h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your website
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label={`${unreadCount} unread messages`}
            aria-expanded={notificationsOpen}
            className="relative rounded-full p-2.5 text-[#0b2a6a] transition hover:bg-[#f9bd0e]/15"
          >
            <Bell size={21} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-[#0b2a6a]">New messages</p>
                <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length ? (
                  notifications.map((contact) => (
                    <Link
                      key={contact._id}
                      href={`/admin/contacts?message=${contact._id}`}
                      onClick={() => setNotificationsOpen(false)}
                      className="block border-b border-slate-100 px-4 py-3 transition hover:bg-amber-50"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-[#0b2a6a]">
                        <Mail size={15} className="shrink-0 text-amber-600" />
                        <span className="truncate">{contact.name}</span>
                      </span>
                      <span className="mt-1 block truncate pl-[23px] text-xs text-slate-500">
                        {contact.subject || contact.message}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-slate-500">
                    You’re all caught up.
                  </p>
                )}
              </div>
              <Link
                href="/admin/contacts"
                onClick={() => setNotificationsOpen(false)}
                className="block bg-slate-50 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#0b2a6a] hover:bg-slate-100"
              >
                Open message inbox
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-2 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#f9bd0e]/15"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b2a6a] text-[#f9bd0e]">
              <User size={18} />
            </div>

            {/* Admin name */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[#0b2a6a]">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-[0_16px_40px_-12px_rgba(11,42,106,0.3)]"
            >
              <button
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#0b2a6a] transition hover:bg-[#f9bd0e]/10"
              >
                <UserCircle size={17} className="text-slate-400" />
                Profile
              </button>
              <Link
                role="menuitem"
                href="/admin/settings"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#0b2a6a] transition hover:bg-[#f9bd0e]/10"
              >
                <Settings size={17} className="text-slate-400" />
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
