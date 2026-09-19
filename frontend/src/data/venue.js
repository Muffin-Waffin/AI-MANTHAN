const img = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`

export const venue = {
  eyebrow: 'Command Node',
  heading: 'Acropolis Arena — Manglaya Sadak',
  body: 'Located on Bypass Road at Manglaya Square, Indore, Madhya Pradesh. The venue provides high-speed fiber backbones, uninterrupted power generators, 24/7 security, and ergonomic workstations for all 40 finalist teams.',
  mapImg: img(
    'AB6AXuA-xDqZzaZk_lMbKt0889Z2IKUaqsd6Y4bFi7WwXzLJb4SGb8eazcylouQiUWYkkbEOTIRhkK7RmSLP6I-U7FjBfQ70nKjkrVozXBXT5tslvqleMGKXWNURURoeNbSX7FeLGmCFznN74tmYj77lx5woyWq3IDuFwpEAFvM-tbFwCjAWBgUTyIzrH4ueQkL1HXhrHhKaM1AAztTSTwJj9onpAx760OBD9lz5aYFJ4vi2wkrq4eSgTh5B',
  ),
  coordinates: '22.7196° N, 75.8577° E',
  mapsHref:
    'https://maps.google.com/?q=Acropolis+Institute+of+Technology+and+Research+Bypass+Road+Manglaya+Sadak+Indore',
  address:
    'Acropolis Institute of Technology & Research, Bypass Road, Square, Manglaya Sadak, Indore, Madhya Pradesh 453771',
  access: [
    'Airport Access: Devi Ahilyabai Holkar Airport (IDR) — 30 mins drive',
    'Train Access: Indore Railway Station (INDB) — 25 mins',
  ],
}

export const faq = {
  eyebrow: 'Common Questions',
  heading: 'Frequently Asked',
  sub: 'Quick answers to the things participants usually want to know.',
  items: [
    {
      q: 'Is there any registration fee for participants?',
      a: 'No. Phase 1 (technical ideation deck and prototype submission) is 100% free for every squad nationwide. Only shortlisted teams selected for the offline Grand Finale at Acropolis, Indore are hosted on campus with lodging and meals provided.',
    },
    {
      q: 'What compute resources and sandbox environments are provided?',
      a: 'Finalists receive dedicated cloud GPU compute credits through our sponsor alliance (AWS, Pinecone, and Anthropic). Acropolis Arena also provides redundant 1Gbps wired backbones and high-density power at every team table.',
    },
    {
      q: 'Who owns the intellectual property built during the hackathon?',
      a: 'You retain 100% ownership of your intellectual property, code, repositories, and models. Neither Acropolis Institute of Technology & Research nor the sponsors take any equity, claim, or proprietary license over your inventions.',
    },
    {
      q: 'Is accommodation arranged for outstation teams?',
      a: 'Yes. Acropolis provides clean hostel rooms, cafeteria dining, 24/7 security, and medical support on campus for all verified outstation finalist participants throughout October 14–16.',
    },
    {
      q: 'What is the team size policy? Can we participate across universities?',
      a: 'Teams can consist of 2 to 4 members. Inter-college and multidisciplinary collaborations (e.g. computer science combined with industrial design or biotechnology) are warmly encouraged.',
    },
  ],
}

/* ── On-ground help contacts (opened from "Phone directory" button) ──
   NOTE: placeholder numbers — replace with the real coordinator details. */
export const phoneDirectory = {
  eyebrow: 'On-ground Help',
  heading: 'Phone Directory',
  groups: [
    {
      title: 'Student Council',
      members: [
        { name: 'Student Council Lead', phone: '+91 98765 43210' },
        { name: 'Volunteer Desk', phone: '+91 98765 54321' },
      ],
    },
    {
      title: 'Dev Team',
      members: [
        { name: 'Dev Team Lead', phone: '+91 98765 65432' },
        { name: 'Platform Support', phone: '+91 98765 76543' },
      ],
    },
    {
      title: 'PR & Admin',
      members: [
        { name: 'PR & Admin Lead', phone: '+91 98765 87654' },
        { name: 'Media Desk', phone: '+91 98765 98765' },
      ],
    },
    {
      title: 'Sponsorship',
      members: [
        { name: 'Sponsorship Lead', phone: '+91 98765 12345' },
        { name: 'Partnerships Desk', phone: '+91 98765 23456' },
      ],
    },
  ],
}
