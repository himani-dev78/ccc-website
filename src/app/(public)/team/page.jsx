// import Image from "next/image";
// import Link from "next/link";
// import { Bebas_Neue } from "next/font/google";
// import {
//   Users,
//   PenLine,
//   Megaphone,
//   Target,
//   ListChecks,
//   Compass,
//   Mail,
//   ArrowLeft,
// } from "lucide-react";

// import {
//   FaLinkedin,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

// /**
//  * Palette: navy #0b2a6a · yellow #f9bd0e · white · black
//  * Swap PHOTO for the real headshot in /public/team/.
//  */
// const PHOTO = "/team/ayesha-chapman.jpg";

// const MEMBER = {
//   name: "Ayesha Chapman",
//   role: "CCC's Strategic Visionary and Chief Advisor",
//   intro:
//     "As a founding member of CCC, Ayesha Chapman brings a unique blend of marketing acumen and strategic insight to the company. She leads the charge in building and nurturing CCC's brand, ensuring its message resonates with the right audience.",
//   social: [
//     { label: "LinkedIn", href: "https://linkedin.com/in/", icon:  FaLinkedin },
//     { label: "Twitter", href: "https://twitter.com/", icon: FaTwitter },
//     { label: "Instagram", href: "https://instagram.com/", icon:  FaInstagram },
//     { label: "Email", href: "mailto:ayesha@cccforleaders.com", icon: Mail },
//   ],
//   marketing: {
//     heading:
//       "Ayesha's expertise extends beyond traditional marketing. She's a hands-on leader who excels at:",
//     items: [
//       {
//         icon: Users,
//         title: "Team Building",
//         text: "Assembling high-performing teams that deliver exceptional results.",
//       },
//       {
//         icon: PenLine,
//         title: "Content Creation",
//         text: "Crafting compelling copy that captures attention and drives engagement.",
//       },
//       {
//         icon: Megaphone,
//         title: "Digital Marketing",
//         text: "Leveraging online channels to expand CCC's reach and impact.",
//       },
//     ],
//   },
//   advisory: {
//     heading:
//       "Beyond her marketing prowess, Ayesha serves as Greg's trusted advisor, providing invaluable guidance on:",
//     items: [
//       {
//         icon: Target,
//         title: "Client Needs",
//         text: "Deeply understanding client motivations and desired outcomes.",
//       },
//       {
//         icon: ListChecks,
//         title: "Project Prioritization",
//         text: "Ensuring resources are focused on high-impact initiatives.",
//       },
//       {
//         icon: Compass,
//         title: "Strategic Decision-Making",
//         text: "Helping CCC navigate challenges and capitalize on opportunities.",
//       },
//     ],
//   },
//   closing:
//     "Ayesha's strategic vision and unwavering commitment to excellence have been instrumental in CCC's success. She's a driving force behind the company's mission to empower leaders and transform organizations.",
// };

// function SkillCard({ icon: Icon, title, text, index }) {
//   return (
//     <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:shadow-[0_16px_40px_-14px_rgba(11,42,106,0.3)]">
//       <span
//         aria-hidden
//         className={`${bebas.className} pointer-events-none absolute -right-2 -top-6 text-7xl text-[#0b2a6a]/[0.05]`}
//       >
//         {String(index).padStart(2, "0")}
//       </span>
//       <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b2a6a] text-[#f9bd0e] transition-colors group-hover:bg-[#f9bd0e] group-hover:text-[#0b2a6a]">
//         <Icon className="h-5.5 w-5.5" />
//       </span>
//       <h3 className="relative mt-5 text-[17px] font-bold text-[#0b2a6a]">
//         {title}
//       </h3>
//       <p className="relative mt-2 text-[14.5px] leading-relaxed text-slate-500">
//         {text}
//       </p>
//     </div>
//   );
// }

// export default function TeamMemberProfile() {
//   const m = MEMBER;

//   return (
//     <article className="bg-[#f6f7fb]">
//       {/* Back link */}
//       <div className="mx-auto max-w-[1280px] px-6 pt-8 lg:px-10">
//         <Link
//           href="/about"
//           className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0b2a6a] transition-colors hover:text-[#f9bd0e]"
//         >
//           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
//           Back to team
//         </Link>
//       </div>

//       {/* Hero */}
//       <header className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-14">
//         <div
//           aria-hidden
//           className={`${bebas.className} pointer-events-none absolute -top-6 right-0 select-none whitespace-nowrap text-[clamp(5rem,14vw,11rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(11,42,106,0.06)]`}
//         >
//           ADVISOR
//         </div>

//         <div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
//           {/* Portrait */}
//           <div className="relative mx-auto w-full max-w-sm lg:mx-0">
//             <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-[#f9bd0e]" />
//             <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#0b2a6a]">
//               <Image
//                 src={PHOTO}
//                 alt={m.name}
//                 fill
//                 sizes="(min-width: 1024px) 380px, 90vw"
//                 className="object-cover"
//               />
//             </div>

//             {/* Social handles — floating card */}
//             <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200 bg-white p-2 shadow-[0_12px_30px_-12px_rgba(11,42,106,0.35)]">
//               {m.social.map(({ label, href, icon: Icon }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={label}
//                   className="flex h-10 w-10 items-center justify-center rounded-full text-[#0b2a6a] transition-colors hover:bg-[#0b2a6a] hover:text-[#f9bd0e]"
//                 >
//                   <Icon className="h-4.5 w-4.5" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Name + role + intro */}
//           <div className="pt-6 lg:pt-0">
//             <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bd0e]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-[#0b2a6a]">
//               Leadership Team
//             </span>

//             <h1
//               className={`${bebas.className} mt-5 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.95] text-[#0b2a6a]`}
//             >
//               {m.name}
//             </h1>

//             <p className="mt-3 text-[15px] font-bold uppercase tracking-wide text-[#f9bd0e]">
//               {m.role}
//             </p>

//             <span className="mt-6 block h-1.5 w-20 rounded-full bg-[#f9bd0e]" />

//             <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-slate-600">
//               {m.intro}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Marketing expertise */}
//       <section className="mx-auto max-w-[1280px] px-6 pb-16 lg:px-10">
//         <p className="max-w-2xl text-[18px] font-semibold leading-snug text-[#0b2a6a]">
//           {m.marketing.heading}
//         </p>
//         <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {m.marketing.items.map((item, i) => (
//             <SkillCard key={item.title} index={i + 1} {...item} />
//           ))}
//         </div>
//       </section>

//       {/* Advisory role — dark band for contrast */}
//       <section className="relative overflow-hidden bg-[#0b2a6a] py-16 lg:py-20">
//         <div
//           aria-hidden
//           className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#f9bd0e]/10 blur-3xl"
//         />
//         <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
//           <p className="max-w-2xl text-[18px] font-semibold leading-snug text-white">
//             {m.advisory.heading}
//           </p>
//           <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {m.advisory.items.map((item, i) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={item.title}
//                   className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-all hover:-translate-y-1.5 hover:border-[#f9bd0e] hover:bg-white/[0.07]"
//                 >
//                   <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9bd0e] text-[#0b2a6a]">
//                     <Icon className="h-5.5 w-5.5" />
//                   </span>
//                   <h3 className="mt-5 text-[17px] font-bold text-white">
//                     {item.title}
//                   </h3>
//                   <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">
//                     {item.text}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Closing statement */}
//       <section className="mx-auto max-w-[900px] px-6 py-16 text-center lg:py-24">
//         <span
//           aria-hidden
//           className={`${bebas.className} block text-[6rem] leading-none text-[#f9bd0e]/30`}
//         >
//           &rdquo;
//         </span>
//         <p
//           className={`${bebas.className} -mt-8 text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.05] text-[#0b2a6a]`}
//         >
//           {m.closing}
//         </p>
//       </section>
//     </article>
//   );
// }

export default function TeamPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-slate-800">
      <h1 className="text-4xl font-bold text-[#0b2a6a]">Our Team</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        Meet the people behind our consulting, leadership, and communication
        work.
      </p>
    </main>
  );
}
