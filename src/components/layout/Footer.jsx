"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const defaultSettings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  phone: "+91 99717 64792",
  email: "clientcenteredconsulting@gmail.com",
  address: "India",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  newsletterTitle: "Presentation Science",
};

const socialIcons = {
  facebook:
    "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.25-1.5 1.55-1.5h1.65V3.44A22 22 0 0 0 14.3 3.3c-2.4 0-4.05 1.47-4.05 4.15v2.35H7.5V13h2.75v8h3.25Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z",
  instagram:
    "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5-2.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10 15V9l5.2 3-5.2 3Z",
};

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();

        if (response.ok && data.settings) {
          setSettings({ ...defaultSettings, ...data.settings });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }

    fetchSettings();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("done");
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact-us" },
  ];

  const socialLinks = Object.entries(socialIcons)
    .filter(([key]) => settings[key] && settings[key].trim())
    .map(([key, path]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      href: settings[key],
      path,
    }));

  return (
    <footer className="relative overflow-hidden bg-[#0a142d] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f9bd0e] to-transparent" />
      <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#f9bd0e]/10 blur-3xl" />
      <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-[#1e3a8a]/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 xl:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_0.9fr_1.1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9bd0e] text-lg font-black text-[#0b2a6a]">
                CC
              </span>
              <div>
                <p className="text-lg font-black uppercase tracking-[0.18em] text-[#f9bd0e]">
                  {settings.siteName || "Client Centered Consulting"}
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-300">
              {settings.tagline || "A Learning and Development Organization"}
            </p>

            <div className="mt-6 rounded-2xl border border-[#f9bd0e]/30 bg-[#f9bd0e]/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f9bd0e]">
                {settings.newsletterTitle || "Presentation Science"}
              </p>
              <form
                onSubmit={onSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "done") setStatus("idle");
                  }}
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-[#f9bd0e] focus:outline-none focus:ring-2 focus:ring-[#f9bd0e]/30"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#f9bd0e] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#0b2a6a] transition hover:bg-[#f7d14d]"
                >
                  Subscribe
                </button>
              </form>

              <p className="mt-3 min-h-5 text-xs text-[#f9bd0e]" role="status">
                {status === "done" ? "Thanks! You are on the list." : ""}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#f9bd0e]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 transition hover:text-[#f9bd0e]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#f9bd0e]">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="transition hover:text-[#f9bd0e]"
                >
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="transition hover:text-[#f9bd0e]"
                >
                  {settings.email}
                </a>
              </li>
              <li>{settings.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#f9bd0e]">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center self-start rounded-full border border-[#f9bd0e]/40 bg-[#f9bd0e]/10 px-4 py-2 font-semibold text-[#f9bd0e] transition hover:bg-[#f9bd0e] hover:text-[#0b2a6a]"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
