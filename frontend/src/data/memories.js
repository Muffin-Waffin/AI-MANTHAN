/* ── PAST AI MANTHAN — EVENT MEMORIES ────────────────────────────────
   Data-driven experience: featured memory → moments → innovation →
   teams → mentorship → finale → previous-year stats → achievements.

   EXTENSIBILITY: drop future images/videos into the arrays below (or
   into /public/media) and they render automatically — no component
   redesign needed. Media MUST come from real event sources; nothing
   is fabricated here. Today the only verified real media available in
   the project is the official logo + hero video, so image collections
   start EMPTY and the UI shows tasteful placeholder states.

   Achievements mirror the confirmed previous-year statistics — no
   invented numbers. */

const img = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`

export const memories = {
  eyebrow: 'Legacy • 2023 → 2025',
  heading: 'PAST AI MANTHAN',
  subheading: 'Event Memories',
  body: 'Moments, minds and milestones from previous editions of the national AI hackathon at Acropolis, Indore.',

  /* Featured memory (hero slot) */
  featured: {
    img: '/pastaimathan/IMG_20251109_173152427 (1).jpg.jpeg',
    video: '',
    tag: 'Grand Finale 2025',
    meta: 'Acropolis Arena • Indore',
    title: 'Where the Churning Began',
    body: 'The arena floor, midnight builds, and final presentations — AI Manthan previous editions in action.',
  },

  /* Themed collections populated with authentic past edition photos */
  collections: [
    {
      id: 'moments',
      title: 'Event Moments',
      icon: 'photo_library',
      accent: 'azure',
      items: [
        {
          img: '/pastaimathan/image.png',
          title: 'Opening Ceremony & Keynote',
          body: 'Welcoming 600+ builders to the national AI Hackathon arena.',
        },
        {
          img: '/pastaimathan/image copy.png',
          title: 'Hackathon Arena Floor',
          body: 'Teams setting up workstations for the 36-hour sprint.',
        },
      ],
    },
    {
      id: 'innovation',
      title: 'Innovation & Code',
      icon: 'lightbulb',
      accent: 'amber',
      items: [
        {
          img: '/pastaimathan/image copy 2.png',
          title: 'Deep Tech & AI Prototyping',
          body: 'Building multimodal ML models and autonomous agents.',
        },
        {
          img: '/pastaimathan/image copy 3.png',
          title: 'Midnight Coding Sessions',
          body: 'Late night problem solving, coffee, and rapid iteration.',
        },
      ],
    },
    {
      id: 'teams',
      title: 'Builder Teams',
      icon: 'groups',
      accent: 'azure',
      items: [
        {
          img: '/pastaimathan/image copy 4.png',
          title: 'Collaborative Squads',
          body: 'Cross-functional student teams working together.',
        },
        {
          img: '/pastaimathan/image copy 5.png',
          title: 'Brainstorming & Architecture',
          body: 'Mapping system designs and AI pipeline workflows.',
        },
      ],
    },
    {
      id: 'mentorship',
      title: 'Mentorship & Finale',
      icon: 'psychology',
      accent: 'pink',
      items: [
        {
          img: '/pastaimathan/image copy 6.png',
          title: 'Jury Evaluation',
          body: 'Industry experts and mentors reviewing live prototypes.',
        },
        {
          img: '/pastaimathan/image copy 7.png',
          title: 'Award Ceremony & Celebrations',
          body: 'Honoring top innovators and winning project teams.',
        },
      ],
    },
  ],

  /* Previous-year statistics — confirmed figures only. */
  stats: [
    { value: '94,751+', label: 'Unstop Impressions' },
    { value: '240', label: 'Team Registrations' },
    { value: '671', label: 'Participants' },
    { value: '129', label: 'Round 1 Idea Submissions' },
    { value: '37', label: 'Teams Qualified Offline' },
    { value: '144', label: 'Offline Evaluation Attendees' },
    { value: '12', label: 'States Represented' },
    { value: '482 / 188', label: 'Male / Female Participants' },
    { value: '₹1,03,000', label: 'Previous-Year Prize Pool' },
  ],

  /* Regional breakdown (source wording preserved as supplied). */
  regionNote:
    'Previous edition saw participation across Madhya Pradesh — including 18 teams from Madhya Pradesh and 28 teams from Indore.',

  /* Achievements / highlights — historical, confirmed. */
  achievements: [
    {
      icon: 'public',
      title: 'National Reach',
      body: 'Participation from 12 states across India in a single edition.',
    },
    {
      icon: 'trending_up',
      title: '94,751+ Impressions',
      body: 'Overwhelming response on Unstop during the application window.',
    },
    {
      icon: 'groups',
      title: '671 Builders',
      body: '240 registered teams, 671 individual participants on the platform.',
    },
    {
      icon: 'flag',
      title: '129 Ideas → 37 Finalists',
      body: '129 teams submitted ideas in Round 1; 37 advanced to the offline round.',
    },
    {
      icon: 'diversity_3',
      title: '188 Women Builders',
      body: '482 male and 188 female participants — a growing, inclusive arena.',
    },
    {
      icon: 'emoji_events',
      title: '₹1,03,000 Prize Pool',
      body: 'Awarded across winners and special categories at the previous finale.',
    },
  ],
}
