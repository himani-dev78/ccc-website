"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const defaultSettings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  phone: "(+91) 997-176-4792",
  email: "greg@cccforleaders.com",
  address: "Gurgaon, NCR, Mumbai, Cape Town - S.A.",
  facebook: "",
  linkedin: "https://www.linkedin.com/in/thisisgregchapman/",
  instagram: "",
  youtube: "",
};

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Blogs", href: "/blogs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Authority Quotient", href: "/aq" },
  { label: "Contact Us", href: "/contact-us" },
];

const homeSectionLinks = [
  { label: "Our team", href: "/#home-team" },
  { label: "Our services", href: "/#home-services" },
  { label: "Testimonials", href: "/#home-testimonials" },
  { label: "Our clients", href: "/#home-clients" },
];

const socialPaths = {
  facebook:
    "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.25-1.5 1.55-1.5h1.65V3.44A22 22 0 0 0 14.3 3.3c-2.4 0-4.05 1.47-4.05 4.15v2.35H7.5V13h2.75v8h3.25Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z",
  instagram:
    "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5-2.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8ZM10 15V9l5.2 3-5.2 3Z",
};

const columnHeading =
  "mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f9bd0e]";
const footerLink =
  "group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-[#f9bd0e]";

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings() {
      try {
        const response = await fetch("/api/settings", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load footer settings.");
        }
        if (data?.settings) setSettings({ ...defaultSettings, ...data.settings });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load footer settings error:", error);
        }
      }
    }

    async function loadServices() {
      try {
        const response = await fetch("/api/services", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load footer services.");
        }
        if (!Array.isArray(data?.services)) {
          throw new Error("The services response was not in the expected format.");
        }
        setServices(data.services);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load footer services error:", error);
        }
      }
    }

    loadSettings();
    loadServices();
    return () => controller.abort();
  }, []);

  const socialLinks = Object.entries(socialPaths)
    .filter(([key]) => settings[key]?.trim())
    .map(([key, path]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      href: settings[key],
      path,
    }));

  return (
    <footer className="relative overflow-hidden bg-[#071735] text-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0b2a6a] via-[#f9bd0e] to-[#0b2a6a]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#f9bd0e]/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-6 pt-14 lg:px-10 lg:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              
              className="inline-flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
            >
              <Image
                src="/ccc-new-logo-rev3.png"
                alt={settings.siteName}
                width={250}
                height={88}
                className="h-auto w-[210px] object-contain object-left"
              />
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              {settings.tagline}
            </p>
          </div>

          <Link
            href="/contact-us"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#f9bd0e] px-6 py-3.5 text-sm font-bold text-[#0b2a6a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Talk to our team
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-10 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:py-12">
          <nav aria-label="Footer pages">
            <h2 className={columnHeading}>Explore</h2>
            <ul className="space-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link className={footerLink} href={link.href}>
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <h2 className={columnHeading}>Services</h2>
            <ul className="space-y-3">
              <li>
                <Link className={footerLink} href="/services">
                  All services
                </Link>
              </li>
              {services.map((service) => (
                <li key={service._id || service.slug}>
                  <Link className={footerLink} href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Homepage sections">
            <h2 className={columnHeading}>On the homepage</h2>
            <ul className="space-y-3">
              {homeSectionLinks.map((link) => (
                <li key={link.href}>
                  <Link className={footerLink} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className={columnHeading}>Get in touch</h2>
            <ul className="space-y-4 text-sm text-slate-300">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-start gap-3 transition-colors hover:text-[#f9bd0e]"
                >
                  <Phone size={17} className="mt-0.5 shrink-0 text-[#f9bd0e]" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-start gap-3 transition-colors hover:text-[#f9bd0e]"
                >
                  <Mail size={17} className="mt-0.5 shrink-0 text-[#f9bd0e]" />
                  <span className="break-all">{settings.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#f9bd0e]" />
                <span>{settings.address}</span>
              </li>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Follow CCC
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {socialLinks.map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-200 transition hover:border-[#f9bd0e] hover:bg-[#f9bd0e] hover:text-[#0b2a6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 font-semibold text-slate-300 transition hover:text-[#f9bd0e]"
          >
            Back to top
            <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
