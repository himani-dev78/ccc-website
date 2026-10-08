"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    href: "/about-us",
  },
  {
    label: "Team",
    href: "/team",
  },
  {
    label: "Insights",
    href: "/insights",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
  {
    label: "Services",
    href: "/services",
    links: [],
  },
  { label: "Portfolio", href: "/portfolio" },
];

// Underline-on-hover, same treatment as the "Authority Quotient" link —
// replaces the old pill-background hover.
const itemBase =
  "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium 2xl:px-4 2xl:text-[16px] text-black underline-offset-8 decoration-2 decoration-transparent transition-colors hover:text-[#f9bd0e] hover:underline hover:decoration-[#f9bd0e] focus-visible:text-[#f9bd0e] focus-visible:underline focus-visible:decoration-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]";

// Used when a trigger/link needs to stay "active" (open dropdown) without
// the solid yellow pill fighting the underline style.
const itemActive = "text-[#f9bd0e] underline decoration-[#f9bd0e]";

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
    <Link
      href="/"
      className="flex items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
      aria-label="Client Centered Consulting home"
    >
      <Image
        src="/ccc-logo-black-text.png"
        alt="Client Centered Consulting"
        width={180}
        height={60}
        priority
        className="h-auto w-[130px] object-contain sm:w-[160px] 2xl:w-[180px]"
        style={{ height: "auto" }}
      />
    </Link>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [services, setServices] = useState([]);
  const navItems = NAV.map((item) =>
    item.label === "Services"
      ? {
          ...item,
          links: services.map((service) => ({
            label: service.title,
            href: `/services/${service.slug}`,
          })),
        }
      : item,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch("/api/services", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to load services navigation.",
          );
        }
        if (!data || !Array.isArray(data.services)) {
          throw new Error(
            "The services response was not in the expected format.",
          );
        }
        setServices(data.services);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load services navigation error:", error);
        }
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-t-2 border-t-[#f9bd0e] border-b border-b-white/10 bg-[#ffffff] font-sans">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[84px] sm:px-6 xl:h-[100px] xl:gap-6 xl:px-10">
        <Logo />

        {/* Desktop nav — only from xl, where all items fit on one line */}
        <nav aria-label="Main" className="hidden flex-1 xl:block">
          <ul className="flex items-center gap-0.5 pl-2 2xl:gap-1 2xl:pl-4">
            {navItems.map((item) => {
              // Plain link (no dropdown)
              if (!item.links?.length) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={itemBase}>
                      {item.label}
                    </Link>
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
                    className={`${itemBase} ${open ? itemActive : ""}`}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>

                  {open && (
                    <div className="absolute left-0 top-full z-50 pt-2">
                      <ul className="min-w-[240px] overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
                        {item.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              href={l.href}
                              onClick={() => setOpenMenu(null)}
                              className="block rounded-xl px-4 py-2.5 text-[15px] text-[#000000] underline-offset-4 decoration-2 decoration-transparent transition-colors hover:text-[#062970] hover:underline hover:decoration-[#f9bd0e] focus-visible:text-[#062970] focus-visible:underline focus-visible:decoration-[#f9bd0e] focus-visible:outline-none"
                            >
                              {l.label}
                            </Link>
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
        <div className="flex shrink-0 items-center gap-3 xl:gap-4">
          {/* <button
            type="button"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/25 text-black transition-colors hover:border-[#f9bd0e] hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e] sm:flex"
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
          </button> */}

          <span className="hidden h-8 w-px bg-white/20 xl:block" aria-hidden />

          <Link
            href="/aq"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded text-[15px] font-medium 2xl:text-[16px] text-[#000000] underline-offset-8 decoration-2  transition-colors  underline decoration-[#f9bd0e] focus-visible:text-[#f9bd0e] focus-visible:underline focus-visible:decoration-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e] xl:flex"
          >
            Authority Quotient
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
          </Link>

          <Link
            href="/contact-us"
            className="group hidden items-center gap-3 whitespace-nowrap rounded-full bg-[#f9bd0e] px-5 py-3.5 text-[15px] font-bold leading-none 2xl:px-6 2xl:py-4 2xl:text-[16px] text-black transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
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
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f9bd0e] text-black xl:hidden"
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
          onClick={(event) => event.target.closest("a") && setMobileOpen(false)}
          className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#062970] px-4 pb-6 sm:max-h-[calc(100dvh-84px)] sm:px-6 xl:hidden"
        >
          {[...navItems, { label: "Authority Quotient", href: "/aq" }].map((item) =>
            !item.links?.length ? (
              <Link
                key={item.label}
                href={item.href}
                className="block border-b border-white/10 py-4 text-[17px] font-medium text-white underline-offset-4 decoration-2 decoration-transparent transition-colors hover:text-[#f9bd0e] hover:underline hover:decoration-[#f9bd0e]"
              >
                {item.label}
              </Link>
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
                      <Link
                        href={l.href}
                        className="block py-2.5 pl-3 text-white/85 underline-offset-4 decoration-2 decoration-transparent transition-colors hover:text-[#f9bd0e] hover:underline hover:decoration-[#f9bd0e]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ),
          )}
          <Link
            href="/contact-us"
            className="mt-5 flex items-center justify-center rounded-full bg-[#f9bd0e] py-4 font-bold text-black"
          >
            Talk to us
          </Link>
        </nav>
      )}
    </header>
  );
}
