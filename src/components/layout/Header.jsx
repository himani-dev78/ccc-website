"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Palette
 *  primary  #f9bd0e  (yellow)
 *  navy     #062970
 *  white    #ffffff
 *  black    #000000
 *
 * NAV rules:
 *  - item WITH `links`  -> dropdown
 *  - item WITHOUT `links` (just `href`) -> plain link, no chevron
 */
const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    links: [
      { label: "Our Team", href: "#" },
      { label: "Our Client", href: "#" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Team Synergy", href: "#" },
      { label: "Ace Your Meetings", href: "#" },
      { label: "Networking Conversations", href: "#" },
      { label: "Brand You", href: "#" },
      { label: "Storytelling for Business", href: "#" },
      { label: "Instructional Design & Facilitation", href: "#" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
];

const itemBase =
  "flex items-center gap-2 rounded-full px-4 py-2 text-[16px] font-medium text-white transition-colors hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]";

function Chevron({ open = false }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function Logo() {
  return (
    <a
      href="/"
      className="flex items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
      aria-label="Client Centered Consulting home"
    >
      <Image
        src="/ccc-new-logo-rev3.png"
        alt="Client Centered Consulting"
        width={180}
        height={60}
        priority
        className="h-auto w-[180px] object-contain"
      />
    </a>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-t-2 border-t-[#f9bd0e] border-b border-b-white/10 bg-[#062970] font-sans">
      <div className="mx-auto flex h-[100px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-10">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 pl-4">
            {NAV.map((item) => {
              // Plain link (no dropdown)
              if (!item.links?.length) {
                return (
                  <li key={item.label}>
                    <a href={item.href} className={itemBase}>
                      {item.label}
                    </a>
                  </li>
                );
              }

              // Dropdown
              const open = openMenu === item.label;
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    onKeyDown={(e) => e.key === "Escape" && setOpenMenu(null)}
                    className={`${itemBase} ${
                      open ? "bg-[#f9bd0e] text-black" : ""
                    }`}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>

                  {open && (
                    <div className="absolute left-0 top-full z-50 pt-2">
                      <ul className="min-w-[240px] overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
                        {item.links.map((l) => (
                          <li key={l.label}>
                            <a
                              href={l.href}
                              className="block rounded-xl px-4 py-2.5 text-[15px] text-black transition-colors hover:bg-[#f9bd0e] focus-visible:bg-[#f9bd0e] focus-visible:outline-none"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-[#f9bd0e] hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e] sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          </button>

          <span className="hidden h-8 w-px bg-white/20 md:block" aria-hidden />

          <a
            href="#"
            className="hidden items-center gap-1.5 rounded text-[16px] font-medium text-white hover:underline hover:decoration-[#f9bd0e] hover:decoration-2 hover:underline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e] md:flex"
          >
            Shop
            <svg
              viewBox="0 0 12 12"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3.5 8.5 8.5 3.5M4 3.5h4.5V8" />
            </svg>
          </a>

          <a
            href="#"
            className="group hidden items-center gap-3 rounded-full bg-[#f9bd0e] px-6 py-4 text-[16px] font-bold leading-none text-black transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
          >
            Talk to us
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
            </svg>
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f9bd0e] text-black lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-white/10 bg-[#062970] px-6 pb-6 lg:hidden"
        >
          {NAV.map((item) =>
            !item.links?.length ? (
              <a
                key={item.label}
                href={item.href}
                className="block border-b border-white/10 py-4 text-[17px] font-medium text-white"
              >
                {item.label}
              </a>
            ) : (
              <details
                key={item.label}
                className="group border-b border-white/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[17px] font-medium text-white">
                  {item.label}
                  <span className="transition-transform group-open:rotate-180">
                    <Chevron />
                  </span>
                </summary>
                <ul className="pb-3">
                  {item.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="block py-2 pl-3 text-white/85">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )
          )}
          <a
            href="#"
            className="mt-5 flex items-center justify-center rounded-full bg-[#f9bd0e] py-4 font-bold text-black"
          >
            Talk to us
          </a>
        </nav>
      )}
    </header>
  );
}