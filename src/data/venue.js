const img = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`

export const venue = {
  eyebrow: 'Command Node',
  heading: 'Acropolis Arena — Manglia Square',
  body: 'Located at Manglia Square on the Indore–Ujjain corridor, Madhya Pradesh. The venue provides high-speed fiber backbones, uninterrupted power generators, 24/7 security, and ergonomic workstations for all 40 finalist teams.',
  mapImg: img(
    'AB6AXuA-xDqZzaZk_lMbKt0889Z2IKUaqsd6Y4bFi7WwXzLJb4SGb8eazcylouQiUWYkkbEOTIRhkK7RmSLP6I-U7FjBfQ70nKjkrVozXBXT5tslvqleMGKXWNURURoeNbSX7FeLGmCFznN74tmYj77lx5woyWq3IDuFwpEAFvM-tbFwCjAWBgUTyIzrH4ueQkL1HXhrHhKaM1AAztTSTwJj9onpAx760OBD9lz5aYFJ4vi2wkrq4eSgTh5B',
  ),
  coordinates: '22.7196° N, 75.8577° E',
  mapsHref:
    'https://maps.google.com/?q=Acropolis+Institute+of+Technology+and+Research+Manglia+Square+Indore',
  address:
    'Acropolis Institute of Technology & Research, Manglia Square, Indore, MP 452015',
  access: [
    'Airport Access: Devi Ahilyabai Holkar Airport (IDR) — 30 mins drive',
    'Train Access: Indore Railway Station (INDB) — 25 mins',
  ],
}

export const faq = {
  eyebrow: 'Common Questions',
  heading: 'Frequently Asked',
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
