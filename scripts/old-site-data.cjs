// Content migrated from the old website (https://cccforleaders.com).
// Images were downloaded into /public (team/, clients/, testimonials/, portfolio/, about/).

const settings = {
  siteName: "Client Centered Consulting",
  tagline: "A Learning and Development Organization",
  newsletterTitle: "Presentation Science",
  phone: "(+91) 997-176-4792",
  email: "greg@cccforleaders.com",
  address: "Gurgaon, NCR, Mumbai, Cape Town - S.A.",
  facebook: "",
  linkedin: "https://www.linkedin.com/in/thisisgregchapman/",
  instagram: "",
  youtube: "",
};

const linkedin = (href) => [{ label: "LinkedIn", href, icon: "linkedin" }];

// Order matters: the site lists team members by createdAt ascending.
const team = [
  {
    name: "Greg Chapman",
    role: "Founder",
    photo: "/team/greg-chapman.jpg",
    social: linkedin("https://www.linkedin.com/in/thisisgregchapman/"),
    intro:
      "Greg Chapman is an executive consultant and coach who, for over 23 years, has transformed mid-level managers into influential leaders. He doesn’t believe in simply climbing the ladder; he believes in building your own. After 17 years in the NCR working for others, he forged his own path, establishing a base in Dehradun while leading a global team spanning the NCR, Mumbai, Cape Town, and Pretoria, South Africa.\n\nHis methods are a unique blend of 10,000+ hours of practical experience and a background as a Gestalt therapist, allowing him to not only connect with clients on a profound level but also to see their unstated needs and challenge their thinking.\n\nGreg’s approach transcends mere goal achievement; it’s about strategically positioning yourself within the intricate tapestry of power to embrace the authority and influence you’ve always wanted.",
    marketing: {
      heading:
        "Executive consultant and coach transforming mid-level managers in large and mid-cap companies into influential leaders.",
      items: [
        {
          icon: "pen-line",
          title: "Storytelling for business",
          text: "Craft compelling narratives that persuade and inspire action",
        },
        {
          icon: "target",
          title: "Mastering the Art of Subtle Influence",
          text: "Control the room, command attention, and get what you want",
        },
        {
          icon: "megaphone",
          title: "Strategic Communication & Persuasion",
          text: "Win arguments, achieve your goals, and get your ideas heard",
        },
      ],
    },
    advisory: {
      heading:
        "For ambitious leaders who seek to rise through the ranks. He doesn’t just help ambitious leaders like you; he crafts them, honing their skills in:",
      items: [
        {
          icon: "star",
          title: "Captivate & Influence Through Storytelling",
          text: "The art of persuasive storytelling, captivating audiences and subtly influencing their perspective",
        },
        {
          icon: "compass",
          title: "Mastering Power Dynamics in Corporations",
          text: "Deciphering the unspoken language of power dynamics, maneuvering through corporate labyrinths with anticipated precision.",
        },
        {
          icon: "users",
          title: "Steering Conversations for Collaborative Success",
          text: "Guiding conversations to achieve favorable outcomes, while maintaining genuine collaboration and respect for all parties",
        },
      ],
    },
    closing:
      "Greg’s clients don’t just value his ability to cut through the noise; they rely on his keen understanding of their deepest needs and his knack for delivering results that solidify their position. He facilitates only in areas where he has personal mastery, ensuring his insights are battle-tested.\n\nWhen he’s not shaping the leaders of tomorrow, you’ll find Greg exploring the world on his motorcycle, seeking new landscapes & unearthing hidden truths.",
  },
  {
    name: "Farheen Tarique",
    role: "Admin Head",
    photo: "/team/farheen-tarique.jpg",
    social: linkedin("https://www.linkedin.com/in/farheen-tarique"),
    intro:
      "Effective administrative support is crucial for smooth organizational operations. Farheen Tarique, Admin Head at CCC, provides comprehensive assistance that keeps things running seamlessly. She expertly manages complex schedules, coordinates travel arrangements, and meticulously prepares documents. Furthermore, Farheen liaises extensively with clients, ensuring positive interactions. Her oversight of invoicing processes guarantees financial transactions are handled efficiently. Farheen’s contributions enable the team to focus on their core responsibilities and achieve their objectives.",
  },
  {
    name: "Ayesha Chapman",
    role: "Strategic Advisor",
    photo: "/team/ayesha-chapman.jpg",
    social: [],
    intro:
      "As a founding member of CCC, Ayesha Chapman brings a unique blend of marketing acumen and strategic insight to the company. She leads the charge in building and nurturing CCC’s brand, ensuring its message resonates with the right audience. Ayesha’s expertise extends beyond traditional marketing. She’s a hands-on leader who excels at:",
    marketing: {
      heading: "",
      items: [
        {
          icon: "users",
          title: "Team Building",
          text: "Assembling high-performing teams that deliver exceptional results.",
        },
        {
          icon: "pen-line",
          title: "Content Creation",
          text: "Crafting compelling copy that captures attention and drives engagement.",
        },
        {
          icon: "megaphone",
          title: "Digital Marketing",
          text: "Leveraging online channels to expand CCC’s reach and impact.",
        },
      ],
    },
    advisory: {
      heading:
        "Beyond her marketing prowess, Ayesha serves as Greg’s trusted advisor, providing invaluable guidance on:",
      items: [
        {
          icon: "target",
          title: "Client Needs",
          text: "Deeply understanding client motivations and desired outcomes.",
        },
        {
          icon: "list-checks",
          title: "Project Prioritization",
          text: "Ensuring resources are focused on high-impact initiatives.",
        },
        {
          icon: "compass",
          title: "Strategic Decision-Making",
          text: "Helping CCC navigate challenges and capitalize on opportunities.",
        },
      ],
    },
    closing:
      "Ayesha’s strategic vision and unwavering commitment to excellence have been instrumental in CCC’s success. She’s a driving force behind the company’s mission to empower leaders and transform organizations.",
  },
  {
    name: "Kirsty Melmed",
    role: "Life Coach",
    photo: "/team/kirsty-melmed.jpg",
    social: linkedin("https://www.linkedin.com/in/kirsty-melmed-b5838a113/"),
    intro:
      "Reaching the partner level at a leading legal firm requires a significant shift in mindset and skillset.\n\nKirsty, a consultant at CCC, helped aspiring partners navigate this challenging transition. She guided them to embrace the entrepreneurial aspects of the role, such as business development and operating with greater autonomy.\n\nKirsty’s coaching empowered these individuals to overcome their fears, showcase their strengths, and confidently navigate the interview process. Ultimately, her support enabled them to secure partnerships and thrive in their new leadership positions.",
  },
  {
    name: "Jaipreet Singh",
    role: "Celebrity Coach PCC",
    photo: "/team/jaipreet-singh.jpg",
    social: linkedin("https://www.linkedin.com/in/jaipreet-singh-a142aa4b/"),
    intro:
      "Mid-level managers often excel at technical tasks, but struggle with the adaptive challenges of leading Gen Z.\n\nJaipreet, a facilitator at CCC, helped a group of managers navigate this complexity. He guided them to shift from a transactional to a transformative approach, understanding the deeper emotional and motivational needs of their team members.\n\nThis fostered genuine self-awareness and empowered the managers to connect with their teams on a deeper level, leading to increased motivation and improved performance.",
  },
  {
    name: "Bharat Babbar",
    role: "Theater Based Facilitator",
    photo: "/team/bharat-babbar.jpg",
    social: linkedin("https://www.linkedin.com/in/bharat-babbar-674490b6/"),
    intro:
      "A long-standing client approached CCC seeking a team synergy program to address underlying tensions and improve collaboration.\n\nBharat, a consultant known for his innovative use of theater and play methodologies, facilitated a transformative intervention. He skillfully brought hidden conflicts and assumptions to the surface, creating a safe space for authentic dialogue.\n\nThis process fostered deeper understanding and strengthened relationships within the team, earning Bharat personal recognition from the client for his impactful contribution.",
  },
  {
    name: "Andrew Matthews PCC",
    role: "Transactional Analyst Coach PCC",
    photo: "/team/andrew-matthews.jpg",
    social: linkedin("https://www.linkedin.com/in/ajmatthewssa/"),
    intro:
      "Senior counsels at a leading Indian legal firm, accustomed to operating within a hierarchical structure, faced a daunting transition to equity partnership. This shift demanded not only legal expertise but also entrepreneurial skills.\n\nAndrew, a consultant at CCC, empowered these senior counsels to embrace this new reality. He helped them navigate the complexities of operating without direct authority while taking responsibility for business development.\n\nThrough his coaching, they gained the confidence and skills to thrive as partners, contributing to a more dynamic and successful firm.",
  },
  {
    name: "Pooja Jain",
    role: "Assessment Centre Specialist",
    photo: "/team/pooja-jain.jpg",
    social: linkedin("https://www.linkedin.com/in/pooja-jain-pebs/"),
    intro:
      "A growing organization recognized the need to provide its employees with a clear path for career progression.\n\nPooja, a consultant at CCC with 15 years of experience in assessment centers, designed and implemented a robust program to address this challenge.\n\nThrough this initiative, employees gained valuable self-awareness and a concrete roadmap for reaching their career goals. The organization, in turn, identified top performers and integrated the assessment center into its recruitment process, ensuring a consistent pipeline of talent equipped for success.",
  },
  {
    name: "Raj Mehta",
    role: "Sales Performance Specialist",
    photo: "/team/raj-mehta.jpg",
    social: linkedin("https://www.linkedin.com/in/rajmehtarcs/"),
    intro:
      "A cybersecurity software company faced declining sales due to a shift in the market landscape.\n\nRaj, a consultant at CCC, helped them transform their sales culture. He commenced on a learning journey – upskilled their sales managers, coaching them in consultative selling and influencing key stakeholders, including top ranking government officials.\n\nThis shift in mindset empowered the team to compete differently, resulting in increased sales and mid market penetration – a strategic imperative, two secured conference presentations, and CEO support for expanding their client base.",
  },
  {
    name: "Surbhee Singh",
    role: "MCC Coach",
    photo: "/team/surbhee-singh.jpg",
    social: linkedin("https://www.linkedin.com/in/surbheesingh/"),
    intro:
      "Senior counsels at a leading Indian legal firm, despite their impressive legal expertise, often lacked the confidence and self-presentation skills needed to navigate the equity partnership selection process.\n\nSurbhee, a consultant at CCC, guided these individuals on a journey of self-discovery. She helped them articulate their unique value proposition, overcome limiting beliefs, and present themselves with clarity and impact.\n\nSurbhee’s coaching empowered them to successfully navigate the interview process and secure their roles as partners.",
  },
];

const portfolioCategories = [
  "Team Synergy",
  "Client Partnering",
  "High Impact Communication",
  "Instructional Design & Facilitation",
  "Storytelling for Business",
  "Coaching for Leaders",
];

// Order matters: the site lists portfolio items by createdAt descending,
// so the first entry here is shown first.
const portfolio = [
  {
    title: "ITC – Team Synergy",
    slug: "itc-team-synergy",
    client: "ITC",
    category: "Team Synergy",
    image: "/clients/itc.png",
    shortDescription: "Beyond Surface Level: Fostering Authentic Team Connections",
    context:
      "Teams at ITC Tobacco, with cross-functional dependencies but reporting to different leaders, sought to improve collaboration and synergy.",
    complexity:
      "Conflicting priorities and a lack of direct communication created interpersonal friction and hindered productivity.",
    resolution:
      "CCC's team synergy workshop facilitated authentic, sometimes difficult, conversations, leading to a \"cleaning up\" of relationships, stronger bonds, and improved cross-functional collaboration.",
  },
  {
    title: "Accenture – Client Partnering",
    slug: "accenture-client-partnering",
    client: "Accenture",
    category: "Client Partnering",
    image: "/clients/accenture.png",
    shortDescription: "Design of business simulation for senior partners",
    context:
      "Accenture aimed to elevate the consulting skills of their global AVP population, who already possessed a strong foundation.",
    complexity:
      "Traditional training wouldn't suffice; a dynamic approach was needed to further hone their strategic thinking and problem-solving abilities.",
    resolution:
      "CCC designed a global business simulation, empowering AVPs to collaborate, develop innovative solutions, and generate real-world, actionable insights for Accenture.",
  },
  {
    title: "Xceedance – High Impact Communication",
    slug: "xceedance-high-impact-communication",
    client: "Xceedance",
    category: "High Impact Communication",
    image: "/portfolio/xceedance.jpg",
    shortDescription: "Mastering the Art of Persuasive Communication",
    context:
      "Xceedance's mid-managers, adept at operations and problem-solving, were poised for advancement.",
    complexity:
      "Their next career step demanded stronger communication skills to effectively engage with senior stakeholders and clients, presenting ideas with impact and navigating complex interactions.",
    resolution:
      "CCC's \"High Impact Communication\" program equipped them with advanced techniques in body language, concise messaging, and executive presence. The program empowered these managers to confidently influence decisions, build stronger relationships with clients and stakeholders, and cultivate a more impactful personal brand, driving both individual and organizational success.",
  },
  {
    title: "Tata AIG – I.D. & Facilitation Skills",
    slug: "tata-aig-i-d-facilitation-skills",
    client: "Tata AIG",
    category: "Instructional Design & Facilitation",
    image: "/portfolio/tata-aig.jpg",
    shortDescription: "Building Facilitation Expertise: Equipping Trainers for Success",
    context:
      "TATA AIG sought to empower their in-house trainers to design and deliver engaging training programs.",
    complexity:
      "Trainers needed to develop effective instructional design and facilitation skills to create impactful learning experiences.",
    resolution:
      "CCC's intensive 4-day program equipped TATA AIG trainers with practical skills and facilitated the development of engaging, workplace-relevant training modules.",
  },
  {
    title: "Sony – Storytelling for Business",
    slug: "sony-storytelling-for-business",
    client: "Sony",
    category: "Storytelling for Business",
    image: "/portfolio/sony.jpg",
    shortDescription: "From PhD to Presentation: Mastering the Art of Technical Storytelling",
    context:
      "Sony aimed to equip their leading R&D experts, many with PhDs, to effectively communicate complex technical information to non-expert audiences.",
    complexity:
      "Bridging the knowledge gap and translating highly technical concepts into clear, engaging narratives posed a significant challenge.",
    resolution:
      "CCC's intensive 4-day \"Storytelling for Business\" workshop empowered Sony's R&D leaders to craft compelling narratives, even learning to structure TED Talk-like presentations.",
  },
  {
    title: "Trilegal – Coaching for Leaders",
    slug: "trilegal-coaching-for-leaders",
    client: "Trilegal",
    category: "Coaching for Leaders",
    image: "/portfolio/trilegal.jpg",
    shortDescription: "Mastering Executive Presence: Communicating with Impact and Confidence",
    context:
      "Trilegal aimed to develop their high-potential employees, preparing them for leadership roles within the firm.",
    complexity:
      "Advancing to leadership positions required enhancing not just legal expertise, but also leadership, business development, and client relationship skills.",
    resolution:
      "CCC's comprehensive coaching program, spanning 3+ years, equipped these individuals with the necessary skills and strategies, with 90% of those promoted to leadership roles having been coached by CCC.",
  },
  {
    title: "PwC – Storytelling for Business",
    slug: "pwc-storytelling-for-business",
    client: "PwC",
    category: "Storytelling for Business",
    image: "/clients/pwc.png",
    shortDescription: "Elevating Consulting Expertise through Storytelling",
    context:
      "PwC sought to enhance the consulting skills and client engagement capabilities of their mid-level consultants across India.",
    complexity:
      "Elevating the performance of a large and dispersed consultant pool required a comprehensive and impactful training approach.",
    resolution:
      "CCC delivered pan-India workshops, equipping PwC consultants with advanced consulting skills and strategies for effective client interaction and project delivery.",
  },
];

const testimonials = [
  {
    name: "Siddhartha Srivastava",
    role: "Sr Manager, HR Shared Service",
    org: "Ericsson",
    photo: "/testimonials/siddhartha-srivastava.jpg",
    text: "Greg’s unique training methods enrich the corporate ecosystem, offering impactful takeaways by deeply understanding client needs, challenges, and values to deliver tailored leadership and behavioral solutions.",
  },
  {
    name: "Shibu Warrier",
    role: "Chief Human Resources Officer",
    org: "NRB Bearings",
    photo: "/testimonials/shibu-warrier.jpg",
    text: "Greg effectively tailored OD interventions for L&T Finance, earning outstanding feedback by aligning content with business needs and guiding participants to apply theoretical concepts through systematic coaching.",
  },
  {
    name: "Rakhee Gupta",
    role: "Human Resource Business Partner",
    org: "",
    photo: "/testimonials/rakhee-gupta.jpg",
    text: "Greg’s engaging Management Development Program combined real-life scenarios with tailored content, fostering mindful leadership and positive workplace interactions, while aligning with our business goals and challenges.",
  },
  {
    name: "Deep Bhandari",
    role: "Consultant and Executive Coach",
    org: "Innovara Inc.",
    photo: "/testimonials/deep-bhandari.jpg",
    text: "Greg’s solution-focused workshop reshaped my mindset, addressing learning gaps, enhancing performance, and maximizing returns by effectively tackling business challenges and shortening the learning curve.",
  },
  {
    name: "Srinivasan K",
    role: "Principal Training Specialist",
    org: "India Medtronic P Ltd.",
    photo: "/testimonials/srinivasan-k.jpg",
    text: "My ID training takeaways included the ADDIE model, Bloom's Taxonomy, PSMART objectives, Root Cause and Audience Analysis, the Session Wheel, and HLD/LLD approaches for goal-aligned training.",
  },
  {
    name: "Rakesh D. Negi",
    role: "Sr. Vice President – Business Operations",
    org: "FCM Travel",
    photo: "/testimonials/rakesh-negi.jpg",
    text: "Greg’s 3-day Synergy Lab built trust, enhanced teamwork, and managed change during restructuring, enabling superior coordination and helping our team adapt, thrive, and carve a new growth trajectory.",
  },
];

const services = [
  {
    title: "Team Synergy",
    slug: "team-synergy",
    heroImage: "/s1-805x472.png",
    intro:
      "Is your team struggling with communication breakdowns, lack of trust, or a sense of disconnect? This program goes beyond superficial team-building exercises to help you build a truly cohesive unit.",
    audience: [
      "Teams working in silos",
      "Teams going through M&A",
      "Teams experiencing transitions",
      "Organizations improving employee engagement",
    ],
    outcomes: [
      "Improved collaboration",
      "Increased trust",
      "Stronger conflict resolution",
      "Shared vision and goals",
      "Open and constructive feedback",
    ],
    sections: [
      {
        title: "Forge a high-performing team through authentic connection",
        subtitle: "Working as a team – our evolutionary niche",
        features: [
          { title: "Build genuine connections", text: "Move beyond surface-level interactions and foster authentic relationships." },
          { title: "Foster empathy", text: "Actively learn and understand each other's unique working styles." },
          { title: "Embrace productive conflict", text: "Develop the skills to navigate and resolve disagreements constructively and thoughtfully." },
          { title: "Develop a shared vision", text: "Collaboratively create a compelling vision for the team's future and align individual goals." },
          { title: "Create a culture of feedback", text: "Create and maintain a psychologically safe space for openly giving and thoughtfully receiving feedback." },
        ],
      },
    ],
  },
  {
    title: "Ace Your Meetings",
    slug: "ace-your-meetings",
    heroImage: "",
    intro:
      "Take control yet be inclusive. What do you do when a stakeholder pushes back? This program helps you confidently overcome this – quickly building credibility, even in the face of opposition.",
    audience: [
      "Experts becoming leaders",
      "SMEs in client-facing roles",
      "Technical specialists explaining to non-experts",
      "Individual contributors in strategic roles",
    ],
    outcomes: [
      "Command attention in meetings",
      "Design impactful agendas",
      "Leverage biases ethically",
      "Structure meetings for clarity",
    ],
    sections: [
      {
        title: "Is your next promotion hiding in your meetings?",
        subtitle: "We serve the best work",
        features: [
          { title: "Build instant credibility", text: "Master the art of subtle yet strategic control to guide clients effectively and confidently." },
          { title: "Build presence", text: "Demonstrate presence in meetings even when you’re not the primary speaker." },
          { title: "Confront positively", text: "Confidently stand up for your idea when it gets challenged or shot down." },
          { title: "The art of giving advice", text: "Techniques for conveying complex topics simply, challenging the client's thinking constructively, and presenting your options strategically." },
          { title: "Rebuild trust with a stakeholder", text: "Anticipate and address objections proactively." },
        ],
      },
    ],
  },
  {
    title: "Networking Conversations",
    slug: "networking-conversations",
    heroImage: "",
    intro:
      "Networking can be intimidating, especially for introverts or first time leaders. Building genuine connections with high-net-worth individuals or senior leaders requires confidence, strategy, and the right communication tools. Our program equips you with the skills to master persuasive networking conversations, build rapport, and turn those connections into future collaborations.",
    audience: [
      "Aspiring leaders",
      "Introverts and socially anxious professionals",
      "Business development and sales professionals",
    ],
    outcomes: [
      "Network confidently with HNIs",
      "Make a strong first impression",
      "Small talk for introverts",
      "Craft follow-ups for the future",
    ],
    sections: [
      {
        title: "Small talk is a big skill",
        subtitle: "We serve the best work",
        features: [
          { title: "Build a foundation for persuasion", text: "Get over your fear of talking to HNIs with our process." },
          { title: "Craft a persuasive introduction", text: "Establish trust and build credibility instantly, and spark curiosity so the other person genuinely wants to engage." },
          { title: "Networking conversation strategies", text: "Keep the conversation flowing after the first few moments." },
          { title: "Navigate networking conversations", text: "Even introverts can master small talk with our framework – and learn how to exit at the right time gracefully." },
          { title: "Deliver a persuasive close", text: "Turn conversations into connections with compelling follow-up messages that lead to future collaborations." },
        ],
      },
    ],
  },
  {
    title: "Brand You",
    slug: "brand-you",
    heroImage: "/s1-805x472.png",
    intro:
      "You work hard, deliver on time, and offer a great product. But in today’s competitive market, that’s not enough to stand out… You need a strong personal brand to differentiate yourself and achieve your goals. Our program provides the blueprint to build a Brand You that amplifies your impact and sets you apart.",
    audience: [
      "Aspiring leaders",
      "Entrepreneurs & business owners",
      "Introverted leaders",
      "Women in leadership",
    ],
    outcomes: [
      "Develop a narrative that showcases your expertise",
      "Confidently articulate your ideas",
      "Learn to command attention",
    ],
    sections: [
      {
        title: "Don’t let hard work be your only differentiator",
        subtitle: "We serve the best work",
        features: [
          { title: "Define your brand essence", text: "Identify your unique strengths, values, and passions, and define how you want to be perceived." },
          { title: "Communicate your brand narrative", text: "Showcase your expertise and values – elegantly and strategically." },
          { title: "Establish your brand presence", text: "Refine your communication style to demonstrate power yet remain inclusive." },
          { title: "Champion your brand", text: "Advocate for your ideas and stand your ground when challenged. Influence and persuade others, even without formal authority." },
        ],
      },
    ],
  },
  {
    title: "Storytelling for Business",
    slug: "storytellingforbusiness",
    heroImage: "/s1-805x472.png",
    intro:
      "Captivate your audience and influence key stakeholders with the power of storytelling. This program transforms subject matter experts into compelling communicators, equipping them to craft impactful narratives for presentations, pitches, and crucial conversations.",
    audience: [
      "People leaders",
      "Key account managers",
      "Sales & marketing professionals",
      "Technical specialists",
      "Project managers",
    ],
    outcomes: [
      "Create compelling narratives from data",
      "Apply storytelling techniques to influence stakeholders",
      "Use storytelling to find common ground in challenging situations",
      "Craft narratives that mobilize towards a shared vision",
    ],
    sections: [
      {
        title: "The indicator of a story well told is that it inspires a story from the listener",
        subtitle: "We serve the best work",
        features: [
          { title: "Command the boardroom", text: "Tailor your stories to C-suite audiences and boardroom dynamics, use the principles of persuasion to build your presence, and transform technical material into simple-to-understand narratives." },
          { title: "Overcome data overwhelm", text: "Humanize data with story to make it memorable, use storytelling to create patterns and insights, and transform data into compelling visuals – not just with charts but with story." },
          { title: "Win clients with story power", text: "Craft persuasive narratives that tap into what the client cares about most, inspire trust, and differentiate your offerings." },
          { title: "Ignite team action", text: "Unite teams with a shared narrative and empower them to share compelling ideas through storytelling." },
        ],
      },
    ],
  },
  {
    title: "Instructional Design & Facilitation",
    slug: "instructional-design-and-facilitation",
    heroImage: "/s1-805x472.png",
    intro:
      "Frustrated with training programs that fall flat? It’s not your fault. Most training ignores how people actually learn. This program is different. We’ll show you how to design training that’s intuitive, engaging, and gets results.",
    audience: [
      "L&D professionals",
      "Trainers",
      "Anyone who wants to improve their training",
    ],
    outcomes: [
      "Increased learner engagement",
      "Training aligned with business goals",
      "Demonstrable behavior change",
    ],
    sections: [
      {
        title: "Apart from marriage, facilitation is the easiest thing to get wrong",
        subtitle: "We serve the best work",
        features: [
          { title: "Understand how people learn", text: "Gain insights into cognitive psychology and learning principles to design more effective training." },
          { title: "Design intuitive learning experiences", text: "Create training materials that are easy to understand, use, and navigate." },
          { title: "Facilitate engaging sessions", text: "Master facilitation techniques to create a dynamic and interactive learning environment that keeps participants engaged." },
          { title: "Manage difficult participants", text: "Learn positive confrontation strategies to manage challenging behaviors and create a productive learning environment." },
          { title: "Provide effective feedback", text: "Learn how to give feedback that supports learning, motivates learners, and drives improvement." },
          { title: "Measure training impact", text: "Evaluate the effectiveness of your training and demonstrate its value to the organization with clear metrics." },
          { title: "Spark \"Aha!\" moments", text: "Learn the science of creating those breakthrough learning moments that lead to lasting change." },
        ],
      },
    ],
  },
];

module.exports = {
  settings,
  team,
  portfolioCategories,
  portfolio,
  testimonials,
  services,
};
