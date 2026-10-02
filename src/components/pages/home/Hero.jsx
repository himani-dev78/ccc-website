"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

/**
 * Palette: yellow #f9bd0e · navy #062970 · white · black
 *
 * Each slide:
 *  - image  (required) background image, also the video poster/fallback
 *  - video  (optional) plays muted + looped behind the overlay
 *  - logo   (optional) client logo shown in the card on the right
 *
 * DUMMY IMAGES: picsum.photos placeholders for now — swap `image` for your
 * real files in /public once you have them, e.g. "/hero/slide-1.jpg".
 * Using an external host? Add it to next.config.js first (see note below).
 */
const SLIDES = [
  {
    eyebrow: "Client story",
    title: ["I.D. &", "Facilitation Skills"],
    tag: "#FACILITATION",
    text: "Instructional design and facilitation that turns training into lasting behaviour change.",
    href: "/services/instructional-design",
    image: "https://picsum.photos/id/1074/1920/1080",
    video: null,
    logo: null,
    logoAlt: "",
  },
  {
    eyebrow: "Featured program",
    title: ["Team", "Synergy"],
    tag: "#SYNERGY",
    text: "Help teams communicate, align and deliver together with practical, experience-led workshops.",
    href: "/services/team-synergy",
    image: "https://picsum.photos/id/1005/1920/1080",
    video: null,
    logo: null,
    logoAlt: "",
  },
  {
    eyebrow: "Featured program",
    title: ["Storytelling", "for Business"],
    tag: "#STORYTELLING",
    text: "Turn data and ideas into stories that people remember, believe and act on.",
    href: "/services/storytelling",
    image: "https://picsum.photos/id/1062/1920/1080",
    video: null,
    logo: null,
    logoAlt: "",
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
      className="relative h-[calc(100svh_-_100px)] max-h-[860px] min-h-[600px] w-full overflow-hidden  outline-none"
    >
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
            {/* Background media with slow Ken Burns zoom while active */}
            <div
              className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
                active && !reduced ? "scale-110" : "scale-100"
              }`}
            >
              {/* <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              /> */}
            </div>
            {active && s.video && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={s.video}
                poster={s.image}
                autoPlay
                muted
                loop
                playsInline
              />
            )}

            {/* Dark navy scrim for contrast, stronger on the left where text sits */}
            <div className="absolute inset-0 " />
            <div className="absolute inset-0  " />

            {/* Ghost outline hashtag */}
            <span
              aria-hidden
              className={`${bebas.className} pointer-events-none absolute -bottom-4 left-6 select-none whitespace-nowrap text-[clamp(6rem,18vw,17rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(249,189,14,0.18)] lg:left-10`}
            >
              {s.tag}
            </span>

            {/* Content */}
            <div className="relative mx-auto grid h-full max-w-[1440px] items-center gap-8 px-6 pb-28 pt-8 lg:grid-cols-[1.25fr_1fr] lg:px-10">
              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full bg-[#f9bd0e] px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-black ${reveal(
                    "delay-100",
                  )}`}
                >
                  {s.eyebrow}
                </span>

                <h2
                  className={`${bebas.className} mt-5 text-[clamp(3.5rem,8vw,7.5rem)] uppercase leading-[0.95] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] ${reveal(
                    "delay-200",
                  )}`}
                >
                  <span className="block text-black">{s.title[0]}</span>
                  <span className="block text-[#f9bd0e]">{s.title[1]}</span>
                </h2>

                <span
                  className={`mt-6 block h-1.5 w-24 rounded-full bg-[#f9bd0e] ${reveal(
                    "delay-300",
                  )}`}
                />

                <p
                  className={`mt-6 max-w-xl text-[17px] leading-relaxed text-white/85 ${reveal(
                    "delay-[400ms]",
                  )}`}
                >
                  {s.text}
                </p>

                <a
                  href={s.href}
                  tabIndex={active ? 0 : -1}
                  className={`${bebas.className} group mt-8 inline-flex items-center gap-3 border-2 border-[#f9bd0e] bg-[#f9bd0e]/95 px-8 py-4 text-xl uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-[#f9bd0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${reveal(
                    "delay-500",
                  )}`}
                >
                  Explore more
                  <span className="transition-transform group-hover:translate-x-1">
                    <Arrow />
                  </span>
                </a>
              </div>

              {/* Client logo card */}
              {s.logo && (
                <div
                  className={`hidden justify-self-center lg:block ${reveal(
                    "delay-300",
                  )}`}
                >
                  <div className="rounded-3xl bg-white p-10 shadow-[14px_14px_0_#f9bd0e]">
                    <Image
                      src={s.logo}
                      alt={s.logoAlt}
                      width={280}
                      height={160}
                      className="h-40 w-[280px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-[1440px] items-center gap-4 px-6 lg:px-10">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-[#f9bd0e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
        >
          <Arrow />
        </button>

        <div className="ml-2 flex max-w-md flex-1 items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.tag}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bd0e]"
            >
              {i === index && (
                <div
                  ref={bar}
                  className={`h-full rounded-full bg-[#f9bd0e] ${
                    reduced ? "w-full" : "w-0"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        <span
          className={`${bebas.className} ml-2 text-xl tracking-wider text-white`}
        >
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/40">
            {" "}
            / {String(count).padStart(2, "0")}
          </span>
        </span>
      </div>
    </section>
  );
}
