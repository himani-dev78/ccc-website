/**
 * Shared case study data.
 *
 * Only `client`, `title`, `category` and `shortDescription` come directly
 * from CCC-BUILD-SPEC(1). The deeper fields (challenge/approach/outcome,
 * clientQuote, metrics) are intentionally left empty — the spec names the
 * seven engagements but does not supply the actual narrative, so nothing
 * here is invented. Fill these in once CCC provides the real copy.
 *
 * image: add real client logos to /public/clients/ and point each entry
 * at its file, e.g. "/clients/itc.png".
 */
export const CASE_STUDIES = [
  {
    slug: "itc-team-synergy",
    client: "ITC",
    title: "Team Synergy",
    category: "Team Synergy",
    image: "/clients/itc.png",
    shortDescription:
      "Building stronger collaboration and more effective ways of working together.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [], // e.g. { label: "...", value: "..." } — only add once supplied
  },
  {
    slug: "accenture-client-partnering",
    client: "Accenture",
    title: "Client Partnering",
    category: "Client Partnering",
    image: "/clients/accenture.png",
    shortDescription:
      "Developing the skills and behaviours that help build stronger client relationships and partnerships.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
  {
    slug: "xceedance-high-impact-communication",
    client: "Xceedance",
    title: "High Impact Communication",
    category: "Communication",
    image: "/clients/xceedance.png",
    shortDescription:
      "Helping professionals communicate with greater clarity, confidence and impact.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
  {
    slug: "tata-aig-instructional-design-facilitation",
    client: "Tata AIG",
    title: "Instructional Design & Facilitation Skills",
    category: "Instructional Design & Facilitation",
    image: "/clients/tata-aig.png",
    shortDescription:
      "Strengthening the ability to design and facilitate effective learning experiences.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
  {
    slug: "sony-storytelling-for-business",
    client: "Sony",
    title: "Storytelling for Business",
    category: "Storytelling",
    image: "/clients/sony.png",
    shortDescription:
      "Helping professionals turn ideas and information into compelling business stories.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
  {
    slug: "trilegal-coaching-for-leaders",
    client: "Trilegal",
    title: "Coaching for Leaders",
    category: "Leadership Coaching",
    image: "/clients/trilegal.png",
    shortDescription:
      "Supporting leaders through coaching to strengthen their leadership capability.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
  {
    slug: "pwc-storytelling-for-business",
    client: "PwC",
    title: "Storytelling for Business",
    category: "Storytelling",
    image: "/clients/pwc.png",
    shortDescription:
      "Using storytelling to help professionals communicate ideas more effectively.",
    challenge: "",
    approach: "",
    outcome: "",
    clientQuote: "",
    metrics: [],
  },
];

// Filter chips for the Work index page, in spec order.
export const CATEGORIES = [
  "All",
  "Team Synergy",
  "Communication",
  "Storytelling",
  "Client Partnering",
  "Leadership Coaching",
  "Instructional Design & Facilitation",
];

export function getCaseStudyBySlug(slug) {
  return CASE_STUDIES.find((cs) => cs.slug === slug) || null;
}
