"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: yellow #f9bd0e · navy #062970 · white · black
 * Photos go in /public/team/. Set a real `linkedin` URL for each person —
 * hovering (or focusing, for keyboard users) a photo shows a "View LinkedIn" overlay.
 */
const TEAM = [
  {
    name: "Ayesha Chapman",
    role: "Strategic Advisor",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/ayesha-chapman",
  },
  {
    name: "Kirsty Melmed",
    role: "Life Coach",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/kirsty-melmed",
  },
  {
    name: "Jaipreet Singh",
    role: "Celebrity Coach PCC",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/jaipreet-singh",
  },
  {
    name: "Bharat Babbar",
    role: "Threater Based Facilitator",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/bharat-babbar",
  },
  {
    name: "Andrew Matthews PCC",
    role: "Transactional Analyst Coach PCC",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/andrew-matthews",
  },
  {
    name: "Pooja Jain",
    role: "Assessment Centre Specialist",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/pooja-jain",
  },
  {
    name: "Raj Mehta",
    role: "Sales Performance Specialist",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/raj-mehta",
  },
  {
    name: "Surbhee Singh",
    role: "MCC Coach",
    photo: "/Bharat.jpg",
    linkedin: "https://www.linkedin.com/in/surbhee-singh",
  },
];

function initials(name) {
  return name
    .replace(/PCC|PhD/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function Chevron({ dir }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 ${dir === "left" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9.5 9H13v1.7h.06c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.44 2.4 4.44 5.6V21H17v-5.6c0-1.3 0-3-1.85-3s-2.15 1.4-2.15 2.9V21H9.5z" />
    </svg>
  );
}

const arrowBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#062970] text-[#062970] transition-colors hover:bg-[#f9bd0e] hover:border-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062970] disabled:opacity-30 disabled:pointer-events-none";

export default function Team() {
  const count = TEAM.length;
  const [perView, setPerView] = useState(4);
  const [page, setPage] = useState(0);
  const touchX = useRef(null);

  const pages = Math.max(1, count - perView + 1);

  useEffect(() => {
    const sm = window.matchMedia("(min-width: 640px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const xl = window.matchMedia("(min-width: 1280px)");
    const update = () =>
      setPerView(xl.matches ? 4 : lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    [sm, lg, xl].forEach((mq) => mq.addEventListener("change", update));
    return () =>
      [sm, lg, xl].forEach((mq) => mq.removeEventListener("change", update));
  }, []);

  // Keep current page in range whenever perView changes
  useEffect(() => setPage((p) => Math.min(p, pages - 1)), [pages]);

  const goTo = useCallback(
    (i) => setPage(((i % pages) + pages) % pages),
    [pages],
  );

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Header row: title + description on the left, slider arrows top-right */}
        <div className="flex flex-col gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-block h-4 w-4 rotate-45 bg-[#f9bd0e]" />
              <h2
                className={`${bebas.className} text-4xl uppercase tracking-wide text-[#062970] md:text-5xl`}
              >
                Our Team
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-black/70 md:text-base">
              At CCC for Leaders,{" "}
              <span className="font-semibold text-black">our team</span> is the
              heart of everything we do. Composed of seasoned coaches,
              facilitators, and specialists, we bring together diverse expertise
              and a shared passion for helping individuals and organizations
              grow.
            </p>
          </div>

          {pages > 1 && (
            <div className="flex shrink-0 items-center gap-3 sm:pt-1">
              <button
                type="button"
                aria-label="Previous team members"
                onClick={() => goTo(page - 1)}
                className={arrowBtn}
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Next team members"
                onClick={() => goTo(page + 1)}
                className={arrowBtn}
              >
                <Chevron />
              </button>
            </div>
          )}
        </div>

        {/* Slider viewport */}
        <div
          className="-mx-3 mt-10 overflow-hidden"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) goTo(page + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] [--pv:1] [transform:translateX(calc(var(--i)*-100%/var(--pv)))] motion-reduce:duration-0 sm:[--pv:2] lg:[--pv:3] xl:[--pv:4]"
            style={{ "--i": page }}
          >
            {TEAM.map((m, i) => {
              const visible = i >= page && i < page + perView;
              return (
                <div
                  key={m.name}
                  aria-hidden={!visible}
                  className="shrink-0 basis-full px-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={visible ? 0 : -1}
                    aria-label={`${m.name} on LinkedIn`}
                    className="group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_24px_rgba(6,41,112,0.08)] transition-shadow hover:shadow-[0_12px_32px_rgba(6,41,112,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062970]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[#062970]">
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center text-3xl font-semibold uppercase text-white"
                      >
                        {initials(m.name)}
                      </span>
                      <Image
                        src={m.photo}
                        alt=""
                        fill
                        sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover / focus overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#062970]/0 text-white opacity-0 transition-all duration-300 group-hover:bg-[#062970]/80 group-hover:opacity-100 group-focus-visible:bg-[#062970]/80 group-focus-visible:opacity-100">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f9bd0e] text-black transition-transform duration-300 group-hover:scale-100 scale-90">
                          <LinkedInIcon />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          View LinkedIn
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p
                        className={`${bebas.className} text-xl uppercase tracking-wide text-black`}
                      >
                        {m.name}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-[#f9bd0e]">
                        {m.role}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === page}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062970] ${
                  i === page
                    ? "w-8 bg-[#f9bd0e]"
                    : "w-2 bg-black/15 hover:bg-black/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
