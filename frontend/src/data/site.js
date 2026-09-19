export const site = {
  title: 'AI MANTHAN',
  titleAccent: '2K26',
  subtitle: 'ACROPOLIS • INDORE',
  description:
    "The flagship national AI hackathon at Acropolis Institute of Technology & Research, Indore — 36 hours of relentless engineering.",
  email: 'aimanthan@acropolis.in',
  emergencyPhone: '+91 (0820) 2925555',
  coordinates: '22.7196° N, 75.8577° E',
  address:
    'Acropolis Institute of Technology & Research, Bypass Road, Square, Manglaya Sadak, Indore, Madhya Pradesh 453771',
  links: {
    register: 'https://unstop.com/p/ai-manthan-2026-acropolis-hackathon-1506313',
    whatsapp: 'https://whatsapp.com/channel/0029Vb87c3eDJ6GyyNKLgx0L',
    website: 'https://www.acropolis.in/',
    maps:
      'https://maps.google.com/?q=Acropolis+Institute+of+Technology+and+Research+Bypass+Road+Manglaya+Sadak+Indore',
  },
  /* WhatsApp community — single source for all community references */
  community: {
    label: 'WhatsApp Community',
    short: 'WhatsApp',
    cta: 'Join WhatsApp Community',
    icon: 'forum',
    href: 'https://whatsapp.com/channel/0029Vb87c3eDJ6GyyNKLgx0L',
  },
  nav: [
    { label: 'Home', href: '/#overview' },
    { label: 'About', href: '/#story' },
    { label: 'Tracks', href: '/#tracks' },
    { label: 'Timeline', href: '/#timeline' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Prizes', href: '/#prizes' },
    { label: 'Faculty', href: '/#faculty' },
    { label: 'Sponsors', href: '/#partners' },
    { label: 'Venue & FAQ', href: '/#venue' },
    { label: 'Contact', href: '/#contact' },
  ],
  stats: [
    { value: '36', label: 'Hours' },
    { value: '800+', label: 'Registered Teams' },
    { value: '100+', label: 'Colleges' },
    { value: '₹2L+', label: 'Prize Pool', highlight: true },
  ],
}

export const hero = {
  badge: ['AI Manthan 2K26', 'Acropolis • Indore'],
  headlineA: 'Build the Future',
  headlineB: 'with AI.',
  bodyStrong: null,
  body: "India's flagship AI Hackathon bringing together builders, innovators and creators.",
  primaryCta: { label: 'Register Now', href: site.links.register, icon: 'rocket_launch' },
  secondaryCtas: [
    { label: 'Explore Tracks', href: '#tracks', icon: 'explore' },
  ],
  countdown: {
    caption: 'APPLICATION WINDOW CLOSING',
    dates: 'OCTOBER 14-16, 2026 • ACROPOLIS, INDORE',
    /** Real event start — countdown derives remaining time from this. */
    target: '2026-10-14T09:00:00+05:30',
  },
}

export const story = {
  eyebrow: 'Introduction — What is AI Manthan?',
  heading: 'The national arena where minds churn ideas into intelligence.',
  body: 'AI Manthan is the flagship annual hackathon of Acropolis Institute of Technology & Research, Indore — a 36-hour national arena where 1,500+ builders, researchers, and designers from 100+ colleges converge to architect the next generation of intelligent software. "Manthan" — the ancient churning that yields amrit — is our metaphor: teams churn through problem statements across AI, blockchain, and frontier web, mentored by faculty and industry experts, to surface workable solutions by dawn on day three.',
  quote: {
    text: '“Manthan — the sacred churning of ideas. What emerges is intelligence.”',
    author: '— Team AI Manthan, Acropolis Indore',
  },
  pillars: [
    {
      icon: 'speed',
      color: 'cyan',
      title: 'Zero-Lag Gigabit Sandbox',
      body: 'Dedicated high-throughput campus lines and sponsor GPU cluster access so your compute pipeline never throttles during crunch time.',
      footnote: 'Dedicated 10Gbps line at arena',
    },
    {
      icon: 'coffee',
      color: 'amber',
      title: '24/7 Fuel & Resting Pods',
      body: "Continuous catered meals, specialty cold brews, snack bars, and silent sleeping quarters hosted inside the Acropolis Arena at Manglia Square.",
      footnote: 'All accommodations covered',
    },
    {
      icon: 'psychology',
      color: 'violet',
      title: 'Faculty & Founder Mentors',
      body: 'Real-time architectural feedback from seasoned researchers, systems engineers, and founders actively shipping frontier software.',
      footnote: '1-on-1 sprint round check-ins',
    },
    {
      icon: 'rocket_launch',
      color: 'emerald',
      title: 'Seed Stage Pitching',
      body: 'Top teams get fast-track intros to prominent venture networks, accelerator cohorts, and angel syndicates to turn hacks into companies.',
      footnote: 'Direct VC demo day slots',
    },
  ],
}

/* ── Sponsors & Partners (reference: black section, white brand cards) ──

   Sponsors are split into two tiers, stacked vertically:
     platinumSponsors → moving marquee row of 4 large landscape cards
     goldSponsors     → moving marquee row of 5 compact 230×123 cards
   partnerRows → 2 marquee rows, opposite directions (1 →left, 2 →right)

   Every item supports an optional `logo` path — drop the brand's PNG/SVG
   into `frontend/public/logos/` and set `logo: '/logos/kimirica.png'`.
   Without a logo the card renders a styled text wordmark instead.
   Names below are from the confirmed reference board. */
export const platinumSponsors = [
  { name: 'KIMIRICA', sub: 'THOUGHTFUL SELF-CARE', tone: 'dark', tracking: 'wide' },
  { name: 'TAP ONN', tone: 'sky', bold: true },
  { name: 'carragreen', tone: 'green', bold: true },
  { name: 'Shri Agrawal', sub: 'SWEETS & NAMKEEN • INDORE | DUBAI', tone: 'red', script: true },
]

/* Gold tier — placeholder tiles for now; swap in the confirmed names,
   taglines and tones once the gold sponsors are finalised. */
export const goldSponsors = [
  { name: 'Gold Sponsor 1', tone: 'dark', bold: true },
  { name: 'Gold Sponsor 2', tone: 'sky', bold: true },
  { name: 'Gold Sponsor 3', tone: 'green', bold: true },
  { name: 'Gold Sponsor 4', tone: 'orange', bold: true },
  { name: 'Gold Sponsor 5', tone: 'violet', bold: true },
]

export const partnerRows = [
  {
    direction: 'left',
    duration: '30s',
    items: [
      { name: 'NSRCEL', tone: 'orange', bold: true },
      { name: 'Startup MP', tone: 'violet', bold: true },
      { name: 'MP Startup', tone: 'dark' },
      { name: 'Campus Fund', tone: 'dark', bold: true },
      { name: 'StartLabs', tone: 'violet', bold: true },
      { name: 'WE Hub', tone: 'sky', bold: true },
      { name: 'A Startup', tone: 'red' },
      { name: 'Enrich', tone: 'orange', script: true },
    ],
  },
  {
    direction: 'right',
    duration: '42s',
    items: [
      { name: 'Startup India', tone: 'orange', bold: true },
      { name: 'MSME', tone: 'dark', bold: true },
      { name: 'CIE IIITH', tone: 'sky', bold: true },
      { name: 'ValuEnable', tone: 'green' },
      { name: 'Stanplus', tone: 'dark', bold: true },
      { name: 'T-Hub', tone: 'violet', bold: true },
      { name: 'CIIE.CO', tone: 'red', bold: true },
      { name: 'IIMA CIIE', tone: 'dark' },
      { name: 'iCreate', tone: 'sky', bold: true },
      { name: 'Villgro', tone: 'green', bold: true },
      { name: 'Startup Bengalu', tone: 'violet' },
      { name: 'K-tech', tone: 'dark', bold: true },
      { name: 'FabIndo', tone: 'red' },
      { name: 'NIdhi', tone: 'sky', bold: true },
      { name: 'AIM', tone: 'orange', bold: true },
    ],
  },
]

/* ── Footer (ref: Manipal-hackathon-style band) ─────────────────────
   Brand left • address center • Rulebook / Meet the Team right,
   with a giant clipped watermark behind the whole band. */
export const footer = {
  brand: site.title,
  brandAccent: site.titleAccent,
  watermark: 'AI MANTHAN 2K26',
  address: site.address,
  legal: '© 2026 AI Manthan • Acropolis Institute of Technology & Research. All rights reserved.',
  meta: ['Organized by Acropolis', 'Built with craft'],
}

/* ── Official Rulebook (opened from the footer "Rulebook" button) ── */
export const rulebook = {
  version: 'AI MANTHAN 2K26 • ROUND 1 → GRAND FINALE',
  sections: [
    {
      title: 'Eligibility & Teams',
      icon: 'groups',
      rules: [
        'Open to students from any recognized university or institute. Teams must have 2–4 members; inter-college and multidisciplinary squads are welcome.',
        'Every member must hold a valid college ID and complete registration individually before Sep 15, 23:59 IST.',
        'A participant may belong to exactly one team — duplicate entries are disqualified without notice.',
      ],
    },
    {
      title: 'Rounds & Format',
      icon: 'flag',
      rules: [
        'Round 1 (online): submit your idea deck + prototype link. Free to enter — no fee for Phase 1.',
        'Round 2 (Oct 14–16): a 36-hour offline build sprint at Acropolis Arena, Indore. Shortlisted teams get campus lodging and meals.',
        'Round 1 results drop Oct 1 along with the Round 2 guidelines — read them before you arrive.',
      ],
    },
    {
      title: 'Judging Rubric',
      icon: 'grading',
      rules: [
        'Technical Depth — 40%: architecture quality, correctness, and intelligent use of AI.',
        'Innovation — 30%: originality and strength of the problem-solution fit.',
        'Execution — 20%: working demo, completeness, and polish within the time limit.',
        'Pitch — 10%: clarity, storytelling, and live demo delivery to the jury.',
      ],
    },
    {
      title: 'Code of Conduct',
      icon: 'shield',
      rules: [
        'All code and assets must be built during the event. Pre-built repositories or plagiarised work lead to immediate disqualification.',
        'Be respectful to mentors, judges, volunteers, and fellow builders — harassment of any kind ends your run.',
        'Open-source libraries and public APIs are allowed, but must be declared in your final submission.',
      ],
    },
    {
      title: 'IP & Ownership',
      icon: 'copyright',
      rules: [
        'Teams retain 100% ownership of the code, models, and IP they build during the hackathon.',
        'Neither Acropolis Institute of Technology & Research nor the sponsors claim any equity, claim, or license over your inventions.',
      ],
    },
  ],
}
