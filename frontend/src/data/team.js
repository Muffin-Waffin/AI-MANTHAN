/* ── Community Organizing Team (dedicated /team page) ────────────────
   Structure mirrors the Manipal reference: grouped rosters with mono
   pixel-style headings, portrait cards (3:4 photo), name + Instagram &
   LinkedIn icons below, cyan neon border on hover.

   Photos: drop portraits into `frontend/public/team/` and reference
   them as `/team/<file>.jpg`. Without a photo the card falls back to a
   gradient monogram, so the page never looks broken.

   Socials: instagram/linkedin are optional — omit and the icon hides. */

export const teamPage = {
  eyebrow: 'THE HUMANS BEHIND THE CHURNING',
  heading: 'Meet the Team',
  body: 'The community organizing crew powering AI Manthan 2.0 — core leads, technical, SMGD, outreach and the volunteer corps that keeps the arena alive for 24 straight hours.',
}

export const teamGroups = [
  {
    id: 'leads',
    title: 'CORE TEAM',
    members: [
      {
        name: 'Kavya Sharma',
        role: 'Lead Convener',
        photo: '', // /team/kavya.jpg
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Rohan Hegde',
        role: 'Technical Architect',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Tanvi Nair',
        role: 'Head of Experience',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'emerald',
      },
      {
        name: 'Aditya Kamath',
        role: 'Sponsorship & Grants',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'amber',
      },
    ],
  },
  {
    id: 'technical',
    title: 'TECHNICAL TEAM',
    members: [
      {
        name: 'Prakhar Agrawal',
        role: 'Platform Engineer',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Lakshay Singla',
        role: 'Judge Ops & Infra',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Pragun Kakar',
        role: 'DevOps & Sandboxes',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'emerald',
      },
      {
        name: 'Manav Mehta',
        role: 'Scoring Dashboards',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'amber',
      },
    ],
  },
  {
    id: 'smgd',
    title: 'SMGD TEAM',
    members: [
      {
        name: 'Dipankar Banerjee',
        role: 'Social Media Lead',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'pink',
      },
      {
        name: 'Tharun Adithyan',
        role: 'Design & Brand',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Aditya Vyass',
        role: 'Graphics & Motion',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
    ],
  },
  {
    id: 'outreach',
    title: 'OUTREACH & VOLUNTEERS',
    members: [
      {
        name: 'Ananya Bhaskar',
        role: 'College Outreach',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'emerald',
      },
      {
        name: 'Kshitij Verma',
        role: 'Campus Ops',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Sarah Gupta',
        role: 'Volunteer Corps',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'amber',
      },
      {
        name: 'Nikhil Shrivastav',
        role: 'Hospitality Desk',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
      {
        name: 'Viha Daglia',
        role: 'Participant Welfare',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'pink',
      },
      {
        name: 'Shriya Pargi',
        role: 'Logistics & Travel',
        photo: '',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        accent: 'azure',
      },
    ],
  },
]

export const teamAccents = {
  azure: 'from-brand-cyan/35 via-sky-700/15 to-transparent text-brand-cyan',
  cyan: 'from-brand-cyan/35 via-sky-700/15 to-transparent text-brand-cyan',
  emerald: 'from-emerald-500/35 via-teal-600/15 to-transparent text-emerald-400',
  amber: 'from-amber-500/35 via-orange-600/15 to-transparent text-amber-400',
  pink: 'from-pink-500/35 via-rose-600/15 to-transparent text-pink-400',
}
