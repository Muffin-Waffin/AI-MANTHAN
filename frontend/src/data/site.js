export const site = {
  title: 'AI मंथन',
  titleAccent: '2.0',
  subtitle: 'AITR • INDORE',
  description:
    "The flagship national AI hackathon at Acropolis Institute of Technology and Research, Indore — a 24-hour offline hackathon across 12 AI challenge domains.",
  email: 'aimanthan@acropolis.in',
  emergencyPhone: '+91 (0820) 2925555',
  coordinates: '22.7196° N, 75.8577° E',
  address:
    'Acropolis Institute of Technology and Research, Bypass Road, Mangliya Sadak, Indore, Madhya Pradesh 453771',
  links: {
    register: 'https://unstop.com/p/ai-manthan-2k26-acropolis-institute-of-technology-and-research-indore-1751106',
    whatsapp: 'https://whatsapp.com/channel/0029Vb87c3eDJ6GyyNKLgx0L',
    website: 'https://www.acropolis.in/',
    maps:
      'https://maps.google.com/?q=Acropolis+Institute+of+Technology+and+Research+Bypass+Road+Mangliya+Sadak+Indore',
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
    { label: 'Memories', href: '/#gallery' },
    { label: 'Prizes', href: '/#prizes' },
    { label: 'Mentors', href: '/#faculty' },
    { label: 'Sponsors', href: '/#partners' },
    { label: 'Venue & FAQ', href: '/#venue' },
  ],
  /* Previous-year (AI Manthan 1.0) headline statistics — historical only.
     Source: confirmed figures from the previous edition. */
  stats: [
    { value: '1,00,000+', label: 'Unstop Impressions', sublabel: 'National Reach', highlight: true, icon: 'visibility' },
    { value: '240+', label: 'Team Registrations', sublabel: 'Innovator Squads', icon: 'groups' },
    { value: '671+', label: 'Participants', sublabel: 'Active Builders', icon: 'person_play' },
    { value: '12+', label: 'States Represented', sublabel: 'Pan-India Footprint', icon: 'map' },
  ],
}

export const hero = {
  badge: ['AI मंथन 2.0', 'AITR • Indore'],
  headlineA: 'Build the Future',
  headlineB: 'with AI.',
  bodyStrong: null,
  body: "Flagship AI Hackathon bringing together builders, innovators and creators.",
  primaryCta: { label: 'Register Now', href: site.links.register, icon: 'rocket_launch' },
  secondaryCtas: [
    { label: 'Explore Tracks', href: '#tracks', icon: 'explore' },
  ],
  countdown: {
    caption: 'APPLICATION WINDOW CLOSING',
    dates: 'OCTOBER 31 - NOVEMBER 1, 2026 • 09:00 AM • AITR, INDORE',
    /** Real event start — countdown derives remaining time from this. */
    target: '2026-10-31T09:00:00+05:30',
  },
}

export const story = {
  eyebrow: 'Introduction — What is AI मंथन 2.0?',
  heading: 'The national arena where minds churn ideas into intelligence.',
  body: 'AI-मंथन 2.0 is a National-Level Hackathon where innovation meets Artificial Intelligence and Emerging Technologies. Bringing together creative minds, developers, and problem-solvers from across India, the hackathon challenges participants to turn real-world problems into impactful, working solutions. Experience an intense 24-hour offline hackathon filled with expert mentorship, collaboration, rapid prototyping, and hands-on innovation. Bring your ideas. Build boldly. Create an impact.',
  quote: {
    text: '“मंथन — the sacred churning of ideas. What emerges is intelligence.”',
    author: '— Team AI मंथन, AITR Indore',
  },
  pillars: [
    {
      icon: 'speed',
      color: 'azure',
      title: 'Zero-Lag Gigabit Sandbox',
      body: 'Dedicated high-throughput campus lines and sponsor GPU cluster access so your compute pipeline never throttles during crunch time.',
      footnote: 'Dedicated 10Gbps line at arena',
    },
    {
      icon: 'coffee',
      color: 'amber',
      title: '24/7 Fuel & Resting Pods',
      body: "Continuous catered meals, specialty cold brews, snack bars, and silent resting quarters hosted inside the AITR campus at Mangliya Sadak.",
      footnote: 'All accommodations covered',
    },
    {
      icon: 'psychology',
      color: 'azure',
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
  { name: 'Coming Soon', sub: '', tone: 'dark', tracking: 'wide' },
  { name: 'Coming Soon', tone: 'sky', bold: true },
  { name: 'Coming Soon', tone: 'green', bold: true },
  { name: 'Coming Soon', sub: '', tone: 'red', script: true },
]

/* Gold tier — placeholder tiles for now; swap in the confirmed names,
   taglines and tones once the gold sponsors are finalised. */
export const goldSponsors = [
  { name: 'Coming Soon', tone: 'dark', bold: true },
  { name: 'Coming Soon', tone: 'sky', bold: true },
  { name: 'Coming Soon', tone: 'green', bold: true },
  { name: 'Coming Soon', tone: 'orange', bold: true },
  { name: 'Coming Soon', tone: 'azure', bold: true },
]

export const partnerRows = [
  {
    direction: 'left',
    duration: '30s',
    items: [
      { name: 'Coming Soon', tone: 'orange', bold: true },
      { name: 'Coming Soon', tone: 'azure', bold: true },
      { name: 'Coming Soon', tone: 'dark' },
      { name: 'Coming Soon', tone: 'dark', bold: true },
      { name: 'Coming Soon', tone: 'azure', bold: true },
      { name: 'Coming Soon', tone: 'sky', bold: true },
      { name: 'Coming Soon', tone: 'red' },
      { name: 'Coming Soon', tone: 'orange', script: true },
    ],
  },
  {
    direction: 'right',
    duration: '42s',
    items: [
      { name: 'Coming Soon', tone: 'orange', bold: true },
      { name: 'Coming Soon', tone: 'dark', bold: true },
      { name: 'Coming Soon', tone: 'sky', bold: true },
      { name: 'Coming Soon', tone: 'green' },
      { name: 'Coming Soon', tone: 'dark', bold: true },
      { name: 'Coming Soon', tone: 'azure', bold: true },
      { name: 'Coming Soon', tone: 'red', bold: true },
      { name: 'Coming Soon', tone: 'dark' },
      { name: 'Coming Soon', tone: 'sky', bold: true },
      { name: 'Coming Soon', tone: 'green', bold: true },
      { name: 'Coming Soon', tone: 'azure' },
      { name: 'Coming Soon', tone: 'dark', bold: true },
      { name: 'Coming Soon', tone: 'red' },
      { name: 'Coming Soon', tone: 'sky', bold: true },
      { name: 'Coming Soon', tone: 'orange', bold: true },
    ],
  },
]

/* ── Footer (ref: Manipal-hackathon-style band) ─────────────────────
   Brand left • address center • Rulebook / Meet the Team right,
   with a giant clipped watermark behind the whole band. */
export const footer = {
  brand: site.title,
  brandAccent: site.titleAccent,
  watermark: 'AI मंथन 2.0',
  address: site.address,
  legal: '© 2026 AI मंथन 2.0 • Acropolis Institute of Technology and Research. All rights reserved.',
  meta: ['Organized by Team AI-Manthan, AITR', 'Built with craft'],
}

/* ── Official Rulebook (opened from the footer "Rulebook" button) ── */
export const rulebook = {
  version: 'AI मंथन 2.0 • ROUND 1 → GRAND FINALE',
  sections: [
    {
      title: 'Eligibility & Teams',
      icon: 'groups',
      rules: [
        'AI-Manthan 2.0 is open to students, developers, and change-makers from across India.',
        'Teams may consist of 1 to 4 members.',
        'Each participant should be registered as part of only one team.',
        'Cross-college and interdisciplinary teams are welcome.',
      ],
    },
    {
      title: 'Round 1 — Idea Submission',
      icon: 'flag',
      rules: [
        'Round 1 is an online PPT/idea submission round.',
        'Each team must submit one PPT/PPTX/PDF presenting their proposed solution.',
        'The idea must address a relevant problem statement/domain under the theme Artificial Intelligence & Emerging Technologies.',
        'The official PPT format and problem statements will be shared with registered participants.',
        'Submissions must be made within the announced deadline. Late submissions may not be considered.',
      ],
    },
    {
      title: 'What Your PPT Should Cover',
      icon: 'description',
      rules: [
        'Problem Statement — What problem are you solving?',
        'Proposed Solution — How does your solution address it?',
        'Innovation — What makes your approach different?',
        'Technology — What technologies, AI/ML methods, or tools will be used?',
        'Feasibility — Can the solution realistically be developed and deployed?',
        'Impact — Who benefits from the solution and what impact can it create?',
        'Future Scope — How can the solution be scaled or improved?',
      ],
    },
    {
      title: 'Originality & Intellectual Property',
      icon: 'copyright',
      rules: [
        'All submitted ideas and content must be original and should not infringe upon another person\'s or organization\'s intellectual property.',
        'Plagiarism, copied ideas presented as original, or unauthorized use of copyrighted material may lead to disqualification.',
        'Teams are responsible for ensuring that any third-party assets, datasets, APIs, models, libraries, or resources used in their proposed solution are appropriately permitted and acknowledged.',
        'Participants retain ownership of their original ideas and work, subject to any applicable third-party licenses.',
      ],
    },
    {
      title: 'Responsible Use of AI',
      icon: 'smart_toy',
      rules: [
        'AI tools may be used for ideation, research, content assistance, or technical exploration, where appropriate.',
        'Teams must understand and take responsibility for everything included in their submission.',
        'AI-generated content should not be presented as original human work when it incorporates someone else\'s copyrighted or proprietary material.',
        'Teams should be able to explain their proposed technical approach and use of AI if asked by the organizers or judges.',
      ],
    },
    {
      title: 'Code of Conduct',
      icon: 'shield',
      rules: [
        'All participants are expected to maintain respectful and professional conduct.',
        'Treat fellow participants, organizers, mentors, and judges with respect.',
        'Avoid harassment, discrimination, abusive behavior, or disruptive conduct.',
        'Follow all instructions and communications issued by the organizing team.',
        'Any serious violation may result in disqualification from the hackathon.',
      ],
    },
    {
      title: 'Submission Integrity',
      icon: 'verified',
      rules: [
        'Each team is responsible for submitting the correct and final version of its presentation.',
        'Teams should verify their files before submission.',
        'Once the submission deadline has passed, changes may not be accepted.',
        'False information or deliberate misrepresentation of a project may result in disqualification.',
      ],
    },
    {
      title: 'Shortlisting for Round 2',
      icon: 'emoji_events',
      rules: [
        'Based on the Round 1 evaluation, selected teams will be invited to participate in the 24-hour offline finale at Acropolis Institute of Technology and Research, Indore.',
        'Shortlisted teams will receive further instructions regarding Round 2, including venue details, reporting requirements, and participation formalities.',
        'Participation in Round 2 is subject to the applicable Round 2 team fee communicated by the organizers.',
      ],
    },
    {
      title: 'Organizer\'s Rights',
      icon: 'gavel',
      rules: [
        'The organizers reserve the right to modify event schedules, guidelines, or procedures when necessary.',
        'The organizers may disqualify submissions that violate the hackathon rules or compromise the fairness and integrity of the competition.',
        'Decisions of the organizing and judging panel shall be final and binding.',
      ],
    },
  ],
}
