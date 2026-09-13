export const prizes = {
  eyebrow: 'Incentives & Grants',
  heading: 'The Prize Vault',
  body: 'Transparent, non-dilutive cash rewards, compute credits, and fast-track founder intros.',
  podium: [
    {
      place: '02',
      title: 'First Runner Up',
      amount: '₹60,000',
      body: 'Direct cash grant + hardware dev-kits + $2,500 AWS credit bundle.',
      perk: 'TROPHY • INCUBATION PASS',
      ring: 'zinc',
    },
    {
      place: null, // champion — trophy icon instead of number
      title: 'Grand Champion',
      amount: '₹1,00,000',
      body: 'Unrestricted cash prize, fast-track seed syndicate pitch with partner VCs, and sponsored incubation space.',
      perk: 'CHAMPIONSHIP CUP + VC DEMO SLOTS',
      ring: 'violet',
      champion: true,
    },
    {
      place: '03',
      title: 'Second Runner Up',
      amount: '₹40,000',
      body: 'Direct cash prize + vector cloud tier subscriptions + swag vault kit.',
      perk: 'CERTIFICATE • SWAG CRATE',
      ring: 'amber',
    },
  ],
  bounties: [
    {
      icon: 'smart_toy',
      color: 'cyan',
      label: 'Special Bounty',
      title: 'Best Agent Architecture',
      amount: '₹15,000 Grant',
    },
    {
      icon: 'palette',
      color: 'pink',
      label: 'Special Bounty',
      title: 'Craft UI & UX Precision',
      amount: '₹10,000 Grant',
    },
    {
      icon: 'female',
      color: 'emerald',
      label: 'Special Bounty',
      title: 'Women in Tech Spotlight',
      amount: '₹15,000 Grant',
    },
  ],
}

export const cta = {
  badge: 'APPLICATION STAGE 01 IS OPEN',
  heading: 'Ready to build software that creates a lasting ripple?',
  body: 'Apply on Unstop. Free entry, verified certificates for all participants, and 36 hours of high-velocity creation at Acropolis, Indore.',
  primary: { label: 'Register Team on Unstop', href: 'https://unstop.com/p/ai-manthan-2026-acropolis-hackathon-1506313', icon: 'rocket_launch' },
  secondary: { label: 'Join WhatsApp Community', href: 'https://whatsapp.com/channel/0029Vb87c3eDJ6GyyNKLgx0L', icon: 'forum' },
  footnotes: ['ZERO REGISTRATION FEES', '36-HOUR OFFLINE CRUCIBLE', '₹2,00,000+ BOUNTY POOL'],
}
