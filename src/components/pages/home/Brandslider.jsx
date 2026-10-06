import Image from "next/image";
import Link from "next/link";

/**
 * Logo marquee (white theme, black logos, auto-scroll, pauses on hover).
 * Put transparent PNG/SVG logos in /public/clients/
 * `brightness-0` turns any logo solid black, so white-on-dark logos work too.
 */
const BRANDS = [
  { name: "Accenture", logo: "/a-1024x269.png" },
  { name: "Xceedance", logo: "/Airtel-logo-1024x365.png" },
  { name: "Sony", logo: "/ccc-new-logo-rev3.png" },
  { name: "PwC", logo: "/PWC.png" },
  { name: "Airtel", logo: "/Xceedance-rev-logo.png" },
  { name: "Tata AIG Life", logo: "/TATA-AIG.png" },
];

// Repeat so one "half" is wider than a big screen, then render it twice for a seamless loop
const ROW = [...BRANDS, ...BRANDS];

function Row({ hidden = false }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center ${hidden ? "brand-dup" : ""}`}
    >
      {ROW.map((b, i) => (
        <li
          key={`${b.name}-${i}`}
          className="flex h-24 w-[200px] shrink-0 items-center justify-center px-6 md:w-[240px] md:px-8"
        >
          <Image
            src={b.logo}
            alt={hidden ? "" : b.name}
            width={180}
            height={72}
            className="h-14 w-auto max-w-full object-contain opacity-80 brightness-0 transition-opacity duration-300 hover:opacity-100"
          />
        </li>
      ))}
    </ul>
  );
}

export default function BrandSlider() {
  return (
    <section
      id="home-clients"
      aria-label="Brands we've collaborated with"
      className="brand-marquee scroll-mt-24 w-full bg-white py-16 md:py-20"
    >
      <style>{`
        @keyframes brand-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .brand-track { animation: brand-marquee 40s linear infinite; }
        .brand-marquee:hover .brand-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .brand-track { animation: none; flex-wrap: wrap; justify-content: center; width: auto; }
          .brand-dup { display: none; }
        }
      `}</style>

      <h2 className="mx-auto max-w-4xl px-6 text-center text-xl font-bold leading-snug text-black md:text-2xl">
        Brands we&rsquo;ve collaborated with
      </h2>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="brand-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 bg-[#f9bd0e] px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#062970] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062970]"
        >
          Explore our work
        </Link>
      </div>
    </section>
  );
}
