export const site = {
  title: 'AI Manthan 2026',
  subtitle: 'Acropolis • Indore',
  description:
    "The flagship national AI hackathon at Acropolis Institute of Technology & Research, Indore — 36 hours of relentless engineering.",
  email: 'aimanthan@acropolis.in',
  emergencyPhone: '+91 (0820) 2925555',
  coordinates: '22.7196° N, 75.8577° E',
  address:
    'Acropolis Institute of Technology & Research, Manglia Square, Indore, MP 452015',
  links: {
    register: 'https://unstop.com/p/ai-manthan-2026-acropolis-hackathon-1506313',
    whatsapp: 'https://whatsapp.com/channel/0029Vb87c3eDJ6GyyNKLgx0L',
    website: 'https://www.acropolis.in/',
    maps:
      'https://maps.google.com/?q=Acropolis+Institute+of+Technology+and+Research+Manglia+Square+Indore',
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
    { label: 'Overview', href: '/#overview' },
    { label: 'Intro', href: '/#story' },
    { label: 'Tracks', href: '/#tracks' },
    { label: 'Timeline', href: '/#timeline' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Prizes', href: '/#prizes' },
    { label: 'Faculty', href: '/#faculty' },
    { label: 'Leadership', href: '/#team' },
    { label: 'Sponsors', href: '/#partners' },
    { label: 'Venue & FAQ', href: '/#venue' },
  ],
  stats: [
    { value: '36 Hours', label: 'Non-stop sprint on campus' },
    { value: '800+ Teams', label: 'Nationwide applicants' },
    { value: '100+ Colleges', label: 'IITs, NITs, BITS & IIITs' },
    { value: '₹2,00,000+', label: 'Cash grants & sponsor bounties' },
  ],
}

export const hero = {
  badge: ['AI Manthan ’26 Flagship Hackathon', 'Acropolis • Indore'],
  headlineA: 'Where small sparks cause',
  headlineB: 'massive ripples.',
  bodyStrong: '36 hours of relentless engineering at Acropolis, Indore.',
  body:    "The flagship national AI hackathon bringing together 1,500+ frontier builders, researchers, and designers to architect the next generation of software.",
  primaryCta: { label: 'Register on Unstop', href: site.links.register, icon: 'terminal' },
  secondaryCtas: [
    { label: 'Explore Past Sprints', href: '#gallery', icon: 'photo_library' },
    { label: site.community.cta, href: site.community.href, icon: site.community.icon },
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

   sponsors    → 4 large static cards (title sponsors)
   partnerRows → 3 marquee rows, opposite directions (1&3 →left, 2 →right)

   Every item supports an optional `logo` path — drop the brand's PNG/SVG
   into `frontend/public/logos/` and set `logo: '/logos/kimirica.png'`.
   Without a logo the card renders a styled text wordmark instead.
   Names below are from the confirmed reference board. */
export const sponsors = [
  { name: 'KIMIRICA', sub: 'THOUGHTFUL SELF-CARE', tone: 'dark', tracking: 'wide' },
  { name: 'TAP ONN', tone: 'sky', bold: true },
  { name: 'carragreen', tone: 'green', bold: true },
  { name: 'Shri Agrawal', sub: 'SWEETS & NAMKEEN • INDORE | DUBAI', tone: 'red', script: true },
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
    duration: '36s',
    items: [
      { name: 'Startup India', tone: 'orange', bold: true },
      { name: 'MSME', tone: 'dark', bold: true },
      { name: 'CIE IIITH', tone: 'sky', bold: true },
      { name: 'ValuEnable', tone: 'green' },
      { name: 'Stanplus', tone: 'dark', bold: true },
      { name: 'T-Hub', tone: 'violet', bold: true },
      { name: 'CIIE.CO', tone: 'red', bold: true },
      { name: 'IIMA CIIE', tone: 'dark' },
    ],
  },
  {
    direction: 'left',
    duration: '27s',
    items: [
      { name: 'NSR CEL', tone: 'orange', bold: true },
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

export const footer = {
  mission:
    'Flagship national AI hackathon organized at Acropolis Institute of Technology & Research, Indore. Uniting developers, designers, and systems architects to build high-impact deterministic software.',
  columns: [
    {
      title: 'Hackathon Arenas',
      links: [
        { label: 'The Vanishing Dose (Healthcare)', href: '#tracks' },
        { label: 'Blackout Mesh (Disaster Resilience)', href: '#tracks' },
        { label: 'Verifiable Inference (Applied ZK)', href: '#tracks' },
        { label: 'Civic Ledgers & Microfinance', href: '#tracks' },
        { label: 'Heritage Sound & Moonshots', href: '#tracks' },
      ],
    },
    {
      title: 'Participant Resources',
      links: [
        { label: 'Past Hackathons Gallery', href: '#gallery' },
        { label: 'Faculty Advisory', href: '#faculty' },
        { label: 'Student Leadership', href: '#team' },
        { label: 'Unstop Portal', href: site.links.register, external: true },
        { label: 'Acropolis Institute', href: site.links.website, external: true },
        { label: 'Campus Travel & Accommodation', href: '#venue' },
      ],
    },
  ],
  contact: {
    org: 'AI Manthan • Acropolis, Indore',
    address: 'Acropolis Institute of Technology & Research, Manglia Square, MP 452015',
    email: site.email,
    node: 'Node: 22.7196° N, 75.8577° E',
  },
  legal: '© 2026 AI Manthan • Acropolis Institute of Technology & Research. All rights reserved.',
  meta: ['Organized by Acropolis', 'Built with craft'],
}
