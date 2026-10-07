const img = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`

export const venue = {
  eyebrow: 'Command Node',
  heading: 'AITR — Mangliya Sadak',
  body: 'Located on Bypass Road at Mangliya Sadak, Indore, Madhya Pradesh. The venue provides high-speed fiber backbones, uninterrupted power generators, 24/7 security, and ergonomic workstations for all finalist teams.',
  mapImg: img(
    'AB6AXuA-xDqZzaZk_lMbKt0889Z2IKUaqsd6Y4bFi7WwXzLJb4SGb8eazcylouQiUWYkkbEOTIRhkK7RmSLP6I-U7FjBfQ70nKjkrVozXBXT5tslvqleMGKXWNURURoeNbSX7FeLGmCFznN74tmYj77lx5woyWq3IDuFwpEAFvM-tbFwCjAWBgUTyIzrH4ueQkL1HXhrHhKaM1AAztTSTwJj9onpAx760OBD9lz5aYFJ4vi2wkrq4eSgTh5B',
  ),
  coordinates: '22.7196° N, 75.8577° E',
  /* Google Maps embed — same verified venue query as mapsHref (no invented
     coordinates; Google resolves the place). Clicking the preview opens the
     full external navigation. */
  mapEmbedSrc:
    'https://www.google.com/maps?q=AITR+Institute+of+Technology+and+Research+Bypass+Road+Mangliya+Sadak+Indore&output=embed',
  mapsHref:
    'https://maps.google.com/?q=AITR+Institute+of+Technology+and+Research+Bypass+Road+Mangliya+Sadak+Indore',
  address:
    'Acroplis Institute of Technology & Research, Bypass Road, Mangliya Sadak, Indore, Madhya Pradesh 453771',
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
      q: 'Who can participate in AI-Manthan 2.0?',
      a: 'AI-Manthan 2.0 is open to students, developers, and change-makers from across India. Participants can register individually or form a team of 1 to 4 members.',
    },
    {
      q: 'What is the format of the hackathon?',
      a: 'The hackathon consists of two rounds. Round 1 is an online PPT/idea submission round. Shortlisted teams will advance to the 24-hour offline finale at Acropolis Institute of Technology and Research, Indore, where they will develop their proposed solutions into working prototypes.',
    },
    {
      q: 'What technologies or domains can we build our solution in?',
      a: 'The central theme is Artificial Intelligence & Emerging Technologies. Participants can build solutions across domains such as Healthcare, Women Safety, Smart Governance, Agriculture, Rural Education, Disaster Management, Smart Cities, Clean India, Career Development, Tourism, Food Redistribution, and Urban Monitoring.',
    },
    {
      q: 'What should shortlisted teams bring to the offline hackathon?',
      a: 'Participants must bring their own laptops and any required hardware. Any coding platform or development environment can be used, including tools such as VS Code, Sublime Text, and GitHub. Participants are also responsible for arranging their own travel.',
    },
    {
      q: 'Is accommodation and food provided during the 24-hour hackathon?',
      a: 'Yes. After paying the Round 2 participation fee, shortlisted teams will receive free accommodation, locker facilities, and meals including breakfast, lunch, and dinner throughout the hackathon. Participants only need to pay the Round 2 fee; there are no additional accommodation or food charges.',
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
      title: 'Student Coordinator',
      members: [
        { name: 'Adarsh Shrivastava', phone: '+91 8962457313' },
        { name: 'Urvashi Soni', phone: '+91 9406727779' },
      ],
    },
    {
      title: 'Sponsor Lead',
      members: [
        { name: 'Sponsor Lead', phone: '+91 XXXXXXXXXX' },
        { name: 'Partnerships Desk', phone: '+91 XXXXXXXXXX' },
      ],
    },
  ],
}
