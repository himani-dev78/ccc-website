"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

/**
 * Palette: yellow #f9bd0e · navy #062970 · white · black
 *
 * - Wrap a phrase in *asterisks* to highlight it (navy italic).
 * - Avatars go in /public/testimonials/. If a photo is missing, initials show instead.
 * - Cards per screen: 1 (mobile) · 2 (tablet) · 3 (desktop).
 *   The slider only moves when there are MORE testimonials than fit on screen,
 *   so add more entries below and the desktop version will slide too.
 */
const DELAY = 2000; // ms between auto-slides

function Stars({ rating = 5 }) {
  const score = Math.min(5, Math.max(1, Number(rating) || 5));

  return (
    <div
      className="mb-5 flex gap-1 text-[#f9bd0e]"
      role="img"
      aria-label={`${score} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < score ? "opacity-100" : "opacity-25"}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="m10 1.5 2.5 5.4 5.9.7-4.4 4 1.2 5.8L10 14.5 4.8 17.4 6 11.6l-4.4-4 5.9-.7z" />
        </svg>
      ))}
    </div>
  );
}

function Highlighted({ text }) {
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic text-[#062970]">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function initials(name) {
  return name
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

const arrowBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-[#062970] transition-colors hover:border-[#f9bd0e] hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062970]";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [hovered, setHovered] = useState(false);
  const [keyFocus, setKeyFocus] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        const data = await response.json();

        if (response.ok && Array.isArray(data.testimonials)) {
          setItems(data.testimonials);
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      }
    }

    fetchTestimonials();
  }, []);

  const count = items.length;
  const pages = Math.max(1, count - perView + 1);
  const page = Math.min(index, pages - 1);
  const paused = hovered || keyFocus;

  // Keep JS in sync with the CSS breakpoints (md = 768px, lg = 1024px)
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerView(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  const goTo = useCallback(
    (i) => setIndex(((i % pages) + pages) % pages),
    [pages],
  );

  // Autoplay (only when there is something to slide; pauses on hover / keyboard focus)
  useEffect(() => {
    if (pages <= 1 || paused) return;
    const t = setTimeout(() => goTo(page + 1), DELAY);
    return () => clearTimeout(t);
  }, [page, pages, paused, goTo]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") goTo(page + 1);
    if (e.key === "ArrowLeft") goTo(page - 1);
  };

  if (!items.length) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Testimonials"
      tabIndex={pages > 1 ? 0 : -1}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setKeyFocus(true)}
      onBlur={() => setKeyFocus(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(page + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      className="w-full bg-white py-16 outline-none md:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Heading with side lines */}
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-black/10" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#062970]">
            Testimonials
          </h2>
          <span className="h-px flex-1 bg-black/10" />
        </div>
        <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-[#f9bd0e]" />

        {/* Viewport */}
        <div className="-mx-3 mt-10 overflow-hidden py-6">
          <div
            className="flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] [--pv:1] [transform:translateX(calc(var(--i)*-100%/var(--pv)))] motion-reduce:duration-0 md:[--pv:2] lg:[--pv:3]"
            style={{ "--i": page }}
          >
            {items.map((t, i) => {
              const visible = i >= page && i < page + perView;
              return (
                <div
                  key={t._id || `${t.name}-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!visible}
                  className="flex basis-full shrink-0 px-3 md:basis-1/2 lg:basis-1/3"
                >
                  <article className="flex w-full flex-col rounded-[20px] border border-black/[0.06] bg-white p-8 shadow-[0_8px_30px_rgba(6,41,112,0.08)] md:p-10">
                    <Stars rating={t.rating} />

                    <blockquote
                      className={`${lora.className} flex-1 border-l-[3px] border-[#f9bd0e] pl-6 text-[18px] leading-[1.7] text-black/85 md:text-[19px]`}
                    >
                      <p>
                        <Highlighted text={t.text} />
                      </p>
                    </blockquote>

                    <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6">
                      <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-full bg-[#062970] ring-2 ring-[#f9bd0e]/70">
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center text-lg font-semibold uppercase text-white"
                        >
                          {initials(t.name)}
                        </span>
                        {t.photo ? (
                          <Image
                            src={t.photo}
                            alt=""
                            fill
                            sizes="70px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[17px] font-semibold text-[#062970]">
                          {t.name}
                        </p>
                        <p className="text-[15px] leading-snug text-black/60">
                          {t.role}
                        </p>
                        <p className="text-[15px] leading-snug text-black/60">
                          {t.org}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls (hidden when nothing to slide) */}
        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => goTo(page - 1)}
              className={arrowBtn}
            >
              <Chevron dir="left" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === page}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#062970] ${
                    i === page
                      ? "w-8 bg-[#f9bd0e]"
                      : "w-6 bg-black/15 hover:bg-black/30"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => goTo(page + 1)}
              className={arrowBtn}
            >
              <Chevron />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
