"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: yellow #f9bd0e · navy #062970 · white · black
 *
 * Each slide:
 *  - image  background photo (only used when SHOW_PHOTO is true)
 *  - video  (optional) plays muted + looped behind the overlay
 *  - logo   client logo shown in the card on the right (falls back to the
 *           client name in text if the file is missing / fails to load)
 *
 * SHOW_PHOTO: the design looks complete with the layered navy background
 * alone. Set to true to blend each slide's photo in underneath. If you use
 * an external image host, allow it in next.config.js first.
 */
const SHOW_PHOTO = false;

const SLIDES = [
  {
    eyebrow: "Client story",
    title: ["I.D. &", "Facilitation Skills"],
    tag: "#FACILITATION",
    label: "Facilitation",
    text: "Instructional design and facilitation that turns training into lasting behaviour change.",
    href: "/services/instructional-design",
    image: "https://picsum.photos/id/1074/1920/1080",
    video: null,
    logo: "/clients/tata-aig.png",
    logoAlt: "Tata AIG Insurance",
  },
  {
    eyebrow: "Featured program",
    title: ["Team", "Synergy"],
    tag: "#SYNERGY",
    label: "Synergy",
    text: "Help teams communicate, align and deliver together with practical, experience-led workshops.",
    href: "/services/team-synergy",
    image: "https://picsum.photos/id/1005/1920/1080",
    video: null,
    logo: "/clients/itc.png",
    logoAlt: "ITC",
  },
  {
    eyebrow: "Featured program",
    title: ["Storytelling", "for Business"],
    tag: "#STORYTELLING",
    label: "Storytelling",
    text: "Turn data and ideas into stories that people remember, believe and act on.",
    href: "/services/storytelling",
    image: "https://picsum.photos/id/1062/1920/1080",
    video: null,
    logo: "/clients/pwc.png",
    logoAlt: "PwC",
  },
];

const DURATION = 6000; // ms per slide

function Arrow({ dir = "right" }) {
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
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/* Logo with a graceful text fallback so a missing file never shows a broken image */
function LogoImage({ src, alt, width, height, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`${bebas.className} flex items-center justify-center text-center text-4xl uppercase tracking-wide text-[#062970]`}
        style={{ width, height }}
      >
        {alt}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const elapsed = useRef(0);
  const bar = useRef(null);
  const touchX = useRef(null);

  const count = SLIDES.length;
  const paused = hovered || focused;

  const goTo = useCallback(
    (i) => {
      elapsed.current = 0;
      if (bar.current) bar.current.style.width = "0%";
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  // Respect "reduce motion"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Autoplay: timer only advances while NOT hovered/focused
  useEffect(() => {
    if (paused || reduced) return;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      elapsed.current += Math.min(now - last, 100);
      last = now;
      if (bar.current) {
        bar.current.style.width = `${Math.min(
          (elapsed.current / DURATION) * 100,
          100,
        )}%`;
      }
      if (elapsed.current >= DURATION) {
        goTo(index + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduced, index, goTo]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured programs"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      className="relative isolate min-h-[680px] w-full overflow-hidden bg-[linear-gradient(135deg,#041a47_0%,#062970_50%,#0a3688_100%)] text-white outline-none lg:h-[calc(100svh_-_100px)] lg:max-h-[860px] lg:min-h-[620px]"
    >
      {/* Float animation for the logo card, disabled for reduced-motion users */}
      <style>{`
        @keyframes ccc-float {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-12px) rotate(-1.5deg); }
        }
        .ccc-float { animation: ccc-float 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ccc-float { animation: none; transform: rotate(-1.5deg); }
        }
      `}</style>

      {/* ───────── Static layered background (shared by all slides) ───────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)",
          }}
        />
        {/* Glows */}
        <div className="absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#f9bd0e]/10 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#2f6bff]/25 blur-3xl" />
        {/* Diagonal yellow slash on the far right */}
        <div className="absolute -right-24 bottom-0 hidden h-[120%] w-40 origin-bottom-right -skew-x-12 bg-gradient-to-b from-[#f9bd0e]/0 via-[#f9bd0e]/20 to-[#f9bd0e]/50 lg:block" />
        {/* Concentric ring */}
        <div className="absolute -bottom-40 left-1/3 hidden h-[34rem] w-[34rem] rounded-full border-[60px] border-white/[0.03] lg:block" />
      </div>

      {SLIDES.map((s, i) => {
        const active = i === index;
        const reveal = (delay) =>
          `transition-all duration-700 ${delay} ${
            active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`;

        return (
          <div
            key={s.tag}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* Optional background photo, blended into the navy */}
            {SHOW_PHOTO && (
              <div
                className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
                  active && !reduced ? "scale-110" : "scale-100"
                }`}
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover opacity-30 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#041a47] via-[#062970]/85 to-[#062970]/40" />
              </div>
            )}

            {active && s.video && (
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                src={s.video}
                poster={s.image}
                autoPlay
                muted
                loop
                playsInline
              />
            )}

            {/* Ghost outline hashtag */}
            <span
              aria-hidden
              className={`${bebas.className} pointer-events-none absolute -bottom-4 left-4 select-none whitespace-nowrap text-[clamp(5rem,18vw,17rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.16)] sm:left-6 lg:left-10`}
            >
              {s.tag}
            </span>

            {/* Content */}
            <div className="relative mx-auto grid h-full max-w-[1440px] items-center gap-10 px-6 pb-36 pt-12 sm:pt-14 lg:grid-cols-[1.25fr_1fr] lg:px-10 lg:pb-32 lg:pt-8">
              <div>
                {/* Mobile-only compact client logo chip */}
                <div
                  className={`mb-5 inline-flex h-14 items-center rounded-xl bg-white px-4 shadow-[5px_5px_0_#f9bd0e] lg:hidden ${reveal(
                    "delay-100",
                  )}`}
                >
                  <LogoImage
                    src={s.logo}
                    alt={s.logoAlt}
                    width={110}
                    height={36}
                    className="h-9 w-auto max-w-[110px] object-contain"
                  />
                </div>

                <div className="block">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full bg-[#f9bd0e] px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-black shadow-[0_8px_24px_-8px_rgba(249,189,14,0.7)] ${reveal(
                      "delay-100",
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                    {s.eyebrow}
                  </span>
                </div>

                <h2
                  className={`${bebas.className} mt-5 text-[clamp(2.9rem,8vw,7.5rem)] uppercase leading-[0.95] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] ${reveal(
                    "delay-200",
                  )}`}
                >
                  <span className="block text-white">{s.title[0]}</span>
                  <span className="block bg-gradient-to-r from-[#f9bd0e] to-[#ffd95a] bg-clip-text text-transparent">
                    {s.title[1]}
                  </span>
                </h2>

                <span
                  className={`mt-6 block h-1.5 w-24 rounded-full bg-gradient-to-r from-[#f9bd0e] to-transparent ${reveal(
                    "delay-300",
                  )}`}
                />

                <p
                  className={`mt-6 max-w-xl text-[16px] leading-relaxed text-white/85 sm:text-[17px] ${reveal(
                    "delay-[400ms]",
                  )}`}
                >
                  {s.text}
                </p>

                <div
                  className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 ${reveal(
                    "delay-500",
                  )}`}
                >
                  <a
                    href={s.href}
                    tabIndex={active ? 0 : -1}
                    className={`${bebas.className} group inline-flex items-center gap-3 rounded-full bg-[#f9bd0e] px-8 py-4 text-xl uppercase tracking-wide text-black shadow-[0_14px_30px_-12px_rgba(249,189,14,0.8)] transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                  >
                    Explore more
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#f9bd0e] transition-transform group-hover:translate-x-1">
                      <Arrow />
                    </span>
                  </a>

                  <a
                    href="/contact-us"
                    tabIndex={active ? 0 : -1}
                    className="text-[15px] font-semibold text-white underline decoration-[#f9bd0e] decoration-2 underline-offset-8 transition-colors hover:text-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
                  >
                    Talk to us
                  </a>
                </div>
              </div>

              {/* Client logo card (desktop) */}
              <div
                className={`hidden justify-self-center lg:block ${reveal(
                  "delay-300",
                )}`}
              >
                <div className="relative">
                  {/* Decorative rings */}
                  <div
                    aria-hidden
                    className="absolute -inset-8 rounded-[3rem] border border-[#f9bd0e]/30"
                  />
                  <div
                    aria-hidden
                    className="absolute -inset-16 rounded-[4rem] border border-white/10"
                  />

                  <div className="ccc-float relative rounded-3xl bg-white p-10 shadow-[14px_14px_0_#f9bd0e]">
                    <span className="absolute -top-3 left-8 rounded-full bg-[#062970] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bd0e] ring-2 ring-white">
                      Trusted by
                    </span>
                    <LogoImage
                      src={s.logo}
                      alt={s.logoAlt}
                      width={280}
                      height={160}
                      className="h-40 w-[280px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ───────── Controls ───────── */}
      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto max-w-[1440px] px-6 sm:bottom-8 lg:px-10">
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#041a47]/50 p-2 pr-5 backdrop-blur-md sm:gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
          >
            <Arrow />
          </button>

          <div className="ml-1 flex flex-1 items-end gap-3 sm:gap-4">
            {SLIDES.map((s, i) => (
              <button
                key={s.tag}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.label}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className="group flex min-w-0 flex-1 flex-col gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9bd0e]"
              >
                <span
                  className={`hidden truncate text-[11px] font-bold uppercase tracking-[0.16em] transition-colors sm:block ${
                    i === index
                      ? "text-[#f9bd0e]"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} &middot; {s.label}
                </span>
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  {i === index && (
                    <span
                      ref={bar}
                      className={`block h-full rounded-full bg-[#f9bd0e] ${
                        reduced ? "w-full" : "w-0"
                      }`}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <span
            className={`${bebas.className} hidden text-xl tracking-wider text-white sm:block`}
          >
            {String(index + 1).padStart(2, "0")}
            <span className="text-white/40">
              {" "}
              / {String(count).padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
