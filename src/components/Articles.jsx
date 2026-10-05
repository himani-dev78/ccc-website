/**
 * Shared Insights data.
 *
 * `featured` comes directly from CCC-BUILD-SPEC(1).
 * The six entries in `ARTICLES` are NEW topic ideas, not content extracted
 * from the spec — the document says the two existing articles aren't
 * available, so these are placeholders to build the page against. Swap in
 * real articles (and real cover images) as they're written.
 */

export const FEATURED_INSIGHT = {
  slug: "understanding-authority-quotient",
  category: "Authority Quotient",
  title: "Understanding Authority Quotient",
  subtitle: "How much authority do you actually command in the room?",
  excerpt:
    "Authority Quotient (AQ) is CCC for Leaders' framework for understanding how much authority a leader commands in a room — and how to raise it. As CCC's positioning develops around AQ, this insight explores the framework through practical leadership situations and applications.",
  image: "/insights/understanding-aq.jpg",
  readTime: "6 min read",
  // Spec requirement: AQ-themed articles must link back to /authority-quotient
  relatedLink: "/authority-quotient",
};

export const ARTICLES = [
  {
    slug: "what-is-authority-quotient",
    category: "Authority Quotient",
    title: "What Is Authority Quotient?",
    excerpt:
      "Authority isn't simply about seniority or having the right answer. Explore the idea behind Authority Quotient and what determines how your contribution is received in the room.",
    image: "/insights/what-is-aq.jpg",
    readTime: "5 min read",
    relatedLink: "/authority-quotient",
  },
  {
    slug: "expertise-isnt-the-same-as-authority",
    category: "Authority Quotient",
    title: "Expertise Isn't the Same as Authority",
    excerpt:
      "You can be highly knowledgeable and still struggle to move a conversation forward. Here's why expertise and authority are related — but not the same thing.",
    image: "/insights/expertise-vs-authority.jpg",
    readTime: "4 min read",
    relatedLink: "/authority-quotient",
  },
  {
    slug: "how-leaders-can-make-their-ideas-heard",
    category: "Leadership",
    title: "How Leaders Can Make Their Ideas Heard",
    excerpt:
      "The quality of an idea matters. So does how effectively you communicate it. Explore practical ways leaders can make their ideas clearer and more compelling.",
    image: "/insights/ideas-heard.jpg",
    readTime: "5 min read",
  },
  {
    slug: "role-of-storytelling-in-business-communication",
    category: "Storytelling",
    title: "The Role of Storytelling in Business Communication",
    excerpt:
      "Facts inform people. Stories can help them understand why those facts matter. Explore how business leaders can use storytelling to communicate ideas more effectively.",
    image: "/insights/storytelling-business.jpg",
    readTime: "6 min read",
  },
  {
    slug: "what-happens-to-your-authority-in-a-meeting",
    category: "Leadership",
    title: "What Happens to Your Authority in a Meeting?",
    excerpt:
      "Meetings are one of the clearest places to observe leadership in action. Look at the behaviours that shape how a leader's contribution is experienced by others.",
    image: "/insights/authority-in-meetings.jpg",
    readTime: "5 min read",
    relatedLink: "/authority-quotient",
  },
  {
    slug: "from-expertise-to-influence",
    category: "Authority Quotient",
    title: "From Expertise to Influence",
    excerpt:
      "Having expertise gives you something valuable to contribute. Influence determines what happens after you contribute it. Explore the connection between the two.",
    image: "/insights/expertise-to-influence.jpg",
    readTime: "4 min read",
    relatedLink: "/authority-quotient",
  },
];

// Spec doesn't prescribe a fixed list, so this stays simple and leaves room
// for future AQ-aligned content.
export const CATEGORIES = [
  "All",
  "Authority Quotient",
  "Leadership",
  "Communication",
  "Storytelling",
  "Team & Collaboration",
  "Workplace Learning",
];
