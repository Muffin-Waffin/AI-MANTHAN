const img = (id) => `https://lh3.googleusercontent.com/aida-public/${id}`

/**
 * Unified people directory — powers the home #faculty carousels and
 * /faculty/[slug] profile pages.
 *
 * group: 'jury'     → Industry Jury (pink accent)
 *        'mentors'  → Hackathon Mentors (violet accent)
 *        'faculty'  → Faculty Advisory & Leadership (cyan accent)
 *
 * Every member gets a full profile page; cards all share one design and
 * all link through with "View Profile".
 */
export const peopleDirectory = [
  /* ---------------- Industry Jury (4) ---------------- */
  {
    slug: 'arjun-mehta',
    group: 'jury',
    name: 'Arjun Mehta',
    role: 'Staff Systems Eng',
    title: 'AWS Distributed Labs',
    bio: 'Specializes in fault-tolerant asynchronous state engines, consensus protocols, and low-latency message streaming.',
    tag: 'Distributed Systems',
    img: img(
      'AB6AXuBqGAOHpZzNMhSw-WzZA3mkMywyYUGfLCHX6Es7ZfrkWyVSh05VloBNUbqd__t2YLfh4gI92n52NXyRa9AGIEAYZzeMnrRL9pOb0sIhaKlVUqZ9eYTapnCQVIxiDXTwJdxkezfqb5WNAAL-0di148jHm93ZjzIUDj2h-XzWN7rWjHsisS2pdBk_c5g4ZALZtxeKa1qYtgFVS8KK1wIMP98ZoknqsZgobOkMpF6KLnfxhXZZ_pyRKpEB',
    ),
    quote:
      '“Consensus is easy until the network lies to you. Judge the fallback paths, not the happy path.”',
    motto: ['Fault', 'Tolerant', 'Thinking'],
    location: 'Bengaluru, Karnataka',
    badge: 'Jury Panel',
    hackathons: '9+ Hackathons Judged',
    linkedin: 'https://linkedin.com',
    email: 'arjun.mehta@acropolis.in',
    about:
      'Arjun Mehta is a Staff Systems Engineer at AWS Distributed Labs and a veteran judge of systems-heavy hackathons. At AI Manthan he evaluates consensus correctness, failure-mode handling, and message-stream architecture under load.',
    expertise: ['Distributed Consensus', 'Streaming Systems', 'Failure-mode Engineering', 'Low-latency Networking'],
    stats: [
      { value: '12+', label: 'Years in Systems' },
      { value: '30+', label: 'Systems Audits' },
      { value: '9+', label: 'Hackathons Judged' },
    ],
    education: [
      { degree: 'M.Tech. in Computer Science', school: 'IIT Bombay, 2012' },
      { degree: 'B.E. in Computer Science', school: 'NITK Surathkal, 2010' },
    ],
    notableWork: [
      'Designed the AI Manthan live stress-test judging rig.',
      'Maintains an open-source chaos-engineering toolkit.',
      'Speaker on quorum design at three systems conferences.',
    ],
  },
  {
    slug: 'tara-deshmukh',
    group: 'jury',
    name: 'Dr. Tara Deshmukh',
    role: 'Research Scientist',
    title: 'Anthropic Labs',
    bio: 'Pioneering interpretability algorithms, safety bounds in neural decoders, and autonomous LLM agent execution primitives.',
    tag: 'Autonomous Agents',
    img: img(
      'AB6AXuDeAXHRhyLQa6L-XNfs-T2Dd6f-K7e24CjjGtSbxXd5hvkG4YZK1Oc5HN0YrUA-SePX3tdYOyXTUjOKM9BDTq-x1tkTfCFvEFqV1qJ1lQRaEGU8VeqCmYJrRlSvFPKJbGMEeoD948EdWFTdWkuXEyreP-c2r0mw4T_xN9-pli62jltvoR5xUUzNk0uDYD68F3n7x4NxDGbm_j1ZAzEAwPEYWO6zNPfUZ0fsO2aHdT5b9mprOlTAZGkb',
    ),
    quote: '“An agent is only as trustworthy as its worst unmonitored decision.”',
    motto: ['Interpret', 'Align', 'Advance'],
    location: 'Pune, Maharashtra',
    badge: 'Jury Panel',
    hackathons: '6+ Hackathons Judged',
    linkedin: 'https://linkedin.com',
    email: 'tara.deshmukh@acropolis.in',
    about:
      'Dr. Tara Deshmukh is a Research Scientist at Anthropic Labs working on interpretability and safe agent execution. On the AI Manthan jury she probes model evaluation rigor, safety boundaries, and the honesty of benchmark claims.',
    expertise: ['Interpretability', 'LLM Agents', 'Safety Bounds', 'Neural Decoders'],
    stats: [
      { value: '10+', label: 'Years in Research' },
      { value: '25+', label: 'Publications' },
      { value: '6+', label: 'Hackathons Judged' },
    ],
    education: [
      { degree: 'Ph.D. in Machine Learning', school: 'IIT Delhi, 2015' },
      { degree: 'M.Sc. in Statistics', school: 'ISI Kolkata, 2011' },
    ],
    notableWork: [
      'Authored the agent-safety judging rubric used at AI Manthan.',
      'Research featured at two top-tier ML conferences.',
      'Mentors women-in-AI cohorts across India.',
    ],
  },
  {
    slug: 'vikram-rao',
    group: 'jury',
    name: 'Vikram Rao',
    role: 'Co-founder & CTO',
    title: 'Aegis Protocol (YC S23)',
    bio: 'Built zero-knowledge rollup infrastructure verifying millions in daily transactions. Evaluates cryptographic integrity.',
    tag: 'Applied ZK & Circom',
    img: img(
      'AB6AXuBqPpuGWibfX7cFGDGd3GPytcVAfpMAYGnT8WIsv0UYqJjRMSMRDZXPnuQmV2-wMrNeBKsNEjyhNa85T76vTSPupYFkdOONepyEhS98wggzQYX036IcrV2orivRe3z0ATL5e-yTGi4m8DmRMi-KJeq1tL5cEHlJ04ScDnuZmhMLDO_OzlkR5k-dzcToz-z4fwGFMy2368BrygnMv-nve9ncEAtRKFy5qKaNFpGGM59eMya5V6PQMi-E',
    ),
    quote: '“Trust the math, verify the circuit, and never ship an unconstrained proof.”',
    motto: ['Prove', 'Verify', 'Ship'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Jury Panel',
    hackathons: '7+ Hackathons Judged',
    linkedin: 'https://linkedin.com',
    email: 'vikram.rao@acropolis.in',
    about:
      'Vikram Rao co-founded Aegis Protocol (YC S23) and built zero-knowledge rollup infrastructure that verifies millions in daily transactions. On the jury he scrutinizes cryptographic integrity, circuit design, and on-chain claim honesty.',
    expertise: ['Zero-Knowledge Proofs', 'Rollup Infrastructure', 'Circom Circuits', 'Protocol Design'],
    stats: [
      { value: '9+', label: 'Years in Web3' },
      { value: '2M+', label: 'Daily Tx Verified' },
      { value: '7+', label: 'Hackathons Judged' },
    ],
    education: [
      { degree: 'M.S. in Cryptography', school: 'ETH Zurich, 2016' },
      { degree: 'B.Tech. in CSE', school: 'IIT Madras, 2014' },
    ],
    notableWork: [
      'YC-backed ZK infrastructure serving production traffic.',
      'Runs the applied-ZK workshop track at AI Manthan.',
      'Open-sourced two widely-used circom libraries.',
    ],
  },
  {
    slug: 'ananya-joshi',
    group: 'jury',
    name: 'Ananya Joshi',
    role: 'Head of Product AI',
    title: 'CareMesh AI',
    bio: 'Directs clinical informatics models, edge health compliance standards, and time-series diagnosis pipelines in India.',
    tag: 'Clinical IoT / FHIR',
    img: img(
      'AB6AXuDihmperSDWY0wqFN8i8XXb7L5k2fvrCnwtJrgCEZvdIVMrQ_Xdhk5KLVMa6g8X6NPsuqD4AYtF-ECiJPjNGRdp4gLiHF9yFluISDoskAbWsXb-1mm7Hf-B1duUMnGyAg385f3mqOft94LlIwQ9JwSYjVOWJKjiB4ueGWA9nqRDaTzuqMZ0QxQLt9VTi2eXabwzMl0GmUWxFm2KRMplEF3U4PANfvGWkOZkRQLzMakvTFNXvJlpuorW',
    ),
    quote: '“In healthcare AI, a false positive costs time; a false negative costs lives. Judge accordingly.”',
    motto: ['Diagnose', 'Design', 'Deliver'],
    location: 'Mumbai, Maharashtra',
    badge: 'Jury Panel',
    hackathons: '5+ Hackathons Judged',
    linkedin: 'https://linkedin.com',
    email: 'ananya.joshi@acropolis.in',
    about:
      'Ananya Joshi heads Product AI at CareMesh AI, directing clinical informatics models and edge health compliance. On the jury she evaluates healthcare-track rigor — patient-safety framing, FHIR compliance, and diagnostic honesty.',
    expertise: ['Clinical Informatics', 'FHIR Standards', 'Time-series Diagnosis', 'Edge Health AI'],
    stats: [
      { value: '11+', label: 'Years in Health AI' },
      { value: '3+', label: 'CE-marked Products' },
      { value: '5+', label: 'Hackathons Judged' },
    ],
    education: [
      { degree: 'M.S. in Biomedical Informatics', school: 'Stanford University, 2014' },
      { degree: 'B.Tech. in ECE', school: 'VIT Vellore, 2011' },
    ],
    notableWork: [
      'Shipped clinical decision-support used in 40+ hospitals.',
      'Defined the health-track evaluation rubric at AI Manthan.',
      'Advisor to two digital-health startups.',
    ],
  },

  /* ---------------- Hackathon Mentors (4) ---------------- */
  {
    slug: 'amit-sharma',
    group: 'mentors',
    name: 'Dr. Amit Sharma',
    role: 'Mentor',
    title: 'Professor, Computer Science',
    bio: 'Specializes in AI, Machine Learning and Innovation in Education.',
    tag: 'AI / ML',
    img: img(
      'AB6AXuBUjCSarjZDv74k1l2G95qPBls4ukWaPhDuldL9UbTN0EPjocko8WdqWEUQbP-5qh5nZEXt02yVONjJ_OxYmE1wKJ9NQQ8vJuzy3kHH8Oe4h7kXGdpNvaVOe2J_57pXrNKSC0HRfzKzwsJmf860VsaOYaQbiApIcgYbHSJUzQwC91wBPdvCPsoxx72HnUWA1MWf3WaQqEUOVIuBtqNG_tszvXemRfg516qpwIasvmD2Wvi9NYoWnjbd',
    ),
    quote:
      '“Great ideas come from curious minds. My goal is to help you turn curiosity into meaningful solutions.”',
    motto: ['Ideas', 'Build', 'Futures'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Faculty Mentor',
    hackathons: '5+ Hackathons Mentored',
    linkedin: 'https://linkedin.com',
    email: 'amit.sharma@acropolis.in',
    about:
      'Dr. Amit Sharma is a Professor in the Department of Computer Science at Acropolis Institute of Technology & Research. With over 15 years of experience in academia and research, he has been actively involved in advancing Artificial Intelligence, Machine Learning and their real-world applications. He is passionate about mentoring students, fostering innovation, and building solutions that create a lasting social impact.',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Natural Language Processing', 'Computer Vision', 'Innovation in Education'],
    stats: [
      { value: '15+', label: 'Years in Academia' },
      { value: '50+', label: 'Research Papers' },
      { value: '10+', label: 'Funded Projects' },
    ],
    education: [
      { degree: 'Ph.D. in Computer Science', school: 'IIT Delhi, 2010' },
      { degree: 'M.Tech. in Computer Science', school: 'NIT Trichy, 2005' },
      { degree: 'B.E. in Information Technology', school: 'Delhi University, 2003' },
    ],
    notableWork: [
      'Published 50+ research papers in reputed journals and conferences.',
      'Led AI-based projects in healthcare, education and smart cities.',
      'Mentored multiple student teams in national and international hackathons.',
      "Recipient of 'Young Researcher Award' (2015).",
    ],
  },
  {
    slug: 'priya-nair',
    group: 'mentors',
    name: 'Dr. Priya Nair',
    role: 'Mentor',
    title: 'Professor, Data Science',
    bio: 'Focuses on Data Analytics, Social Impact and Technology for Good.',
    tag: 'Data for Good',
    img: img(
      'AB6AXuBwctNzpkKQ5RE_0xfgalRddDU7RY1pUJCLFveWEr1NCqnAD4l3m2ccJR1nBFJMKXLEJ1BlzTNNwTMZi31x9UbWgI2MsAlh0quqigAMCUGb8SvSYtqZeumTI1RfycoiEXnTtMrh_NJPFSL_x-cBQ3ZprmqNFtxgPo2XGZWsQ3e_GaTGWxo1RTMD1PhK0th6-Y25W96EKw5N9E2yizN3AEd3QS0PxgU2TZ9ynSMuDi9vapocqplF0Rga',
    ),
    quote: '“Data is a mirror. Mentorship teaches you how to look into it honestly.”',
    motto: ['Mentor', 'Motivate', 'Make It Happen'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Faculty Mentor',
    hackathons: '7+ Hackathons Mentored',
    linkedin: 'https://linkedin.com',
    email: 'priya.nair@acropolis.in',
    about:
      'Dr. Priya Nair is a Professor of Data Science at Acropolis Institute of Technology & Research. She focuses on data analytics for social impact — public health dashboards, civic data pipelines, and education analytics. Her mentoring philosophy pairs rigorous statistics with product empathy.',
    expertise: ['Data Analytics', 'Public Health Dashboards', 'Civic Data Pipelines', 'Education Analytics', 'Statistical Modeling'],
    stats: [
      { value: '14+', label: 'Years in Academia' },
      { value: '40+', label: 'Research Papers' },
      { value: '8+', label: 'Govt Data Projects' },
    ],
    education: [
      { degree: 'Ph.D. in Statistics', school: 'ISI Kolkata, 2011' },
      { degree: 'M.Sc. in Applied Statistics', school: 'Univ. of Hyderabad, 2006' },
    ],
    notableWork: [
      'Built the state-level public health analytics dashboard adopted by two districts.',
      'Runs the data-for-good student collective on campus.',
      'Mentored prize-winning teams across three AI Manthan editions.',
    ],
  },
  {
    slug: 'sameer-khan',
    group: 'mentors',
    name: 'Dr. Sameer Khan',
    role: 'Mentor',
    title: 'Professor, Civil Engineering',
    bio: 'Expertise in Smart Infrastructure, Sustainability and Urban Innovation.',
    tag: 'Smart Infra',
    img: img(
      'AB6AXuC80yXZBu6hLsky7AKqTUSFPv36LqjIdXZ0OebiGB7Ag9mbWij12vKOx8lBtsJ_oT7Zejyhx5SLjWiEJf4E1Gzmh40VJMKRw13gsYBQBuWUAz1CcDnscRoqmCeP9BBF8VvyWs76a-ESz6iS-6HD8v1i2xAMZO4RMF3sVK3VcQlpDCLPHTajunCe6tA8MLczrz8vb-kCLAwiSS8BViTqOWsUXktqIVKZIVfJqUiL7ocCewQqAk17xsjr',
    ),
    quote: '“Infrastructure is software with concrete delays. Design accordingly.”',
    motto: ['Guidance', 'to', 'Greatness'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Faculty Mentor',
    hackathons: '6+ Hackathons Mentored',
    linkedin: 'https://linkedin.com',
    email: 'sameer.khan@acropolis.in',
    about:
      'Dr. Sameer Khan is a Professor of Civil Engineering at Acropolis Institute of Technology & Research specializing in smart infrastructure and urban innovation. He mentors teams building digital-twin, sensor-monitoring, and resilience tooling for the built environment.',
    expertise: ['Smart Infrastructure', 'Digital Twins', 'Urban Innovation', 'Structural Health Monitoring'],
    stats: [
      { value: '16+', label: 'Years in Academia' },
      { value: '35+', label: 'Publications' },
      { value: '7+', label: 'Infra Projects' },
    ],
    education: [
      { degree: 'Ph.D. in Civil Engineering', school: 'IIT Kanpur, 2009' },
      { degree: 'M.Tech. in Structures', school: 'IIT Roorkee, 2004' },
    ],
    notableWork: [
      'Deployed structural health monitoring on two campus bridges.',
      'Judges the disaster-resilience track mentoring pods at AI Manthan.',
      'Advises the smart-city cell of the municipal corporation.',
    ],
  },
  {
    slug: 'rohan-kulkarni',
    group: 'mentors',
    name: 'Prof. Rohan Kulkarni',
    role: 'Speaker',
    title: 'Assistant Professor, Mechanical',
    bio: 'Research interests in Sustainable Design and Smart Manufacturing.',
    tag: 'Sustainable Design',
    img: img(
      'AB6AXuC0MuEXEMZvuIZCybUCfHhOTzJVgKYWNgCIPvp-4Pp8Mb-y7xHyJx5z6dJ5g88n6TN31OcIPWwxnFQTnEGCqap9tnU-OUsvIl8nIgbCLWxm1yKJw__5dZGesfH76vu2sUh1182CFAhMNmK_je0uNHs0lA0pUfsjeceje2wra7AxddNa4M4YMZ5vxVU5M5psquKd_SjI17z_t_dEHGKF00lmqieXWKZ0zxa6VSD7Ci6045CuU8O40ScH',
    ),
    quote: '“The best engineering talks are the ones that leave you restless to build.”',
    motto: ['Innovate', 'Solve', 'Impact'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Keynote Speaker',
    hackathons: '6+ Keynotes Delivered',
    linkedin: 'https://linkedin.com',
    email: 'rohan.kulkarni@acropolis.in',
    about:
      'Prof. Rohan Kulkarni teaches Mechanical Engineering at Acropolis Institute of Technology & Research with research interests in sustainable design and smart manufacturing. He opens AI Manthan with a keynote on building for constraint — frugal engineering lessons from the factory floor.',
    expertise: ['Sustainable Design', 'Smart Manufacturing', 'CAD/CAM Systems', 'Rapid Prototyping'],
    stats: [
      { value: '10+', label: 'Years Teaching' },
      { value: '20+', label: 'Conference Talks' },
      { value: '4+', label: 'Design Patents' },
    ],
    education: [
      { degree: 'Ph.D. in Mechanical Engineering', school: 'IIT Madras, 2014' },
      { degree: 'M.Tech. in Manufacturing', school: 'NIT Surathkal, 2009' },
    ],
    notableWork: [
      'Keynoted the AI Manthan opening ceremony for three consecutive years.',
      'Established the campus rapid-prototyping lab used by finalists.',
      'Consults for two manufacturing firms on shop-floor digitization.',
    ],
  },

  /* ---------------- Faculty Advisory & Leadership (3) ---------------- */
  {
    slug: 'anil-rana',
    group: 'faculty',
    name: 'Cdr. (Dr.) Anil Rana',
    role: 'Chief Patron',
    title: 'Director, Acropolis Institute of Technology & Research',
    initials: 'AR',
    bio: 'Championing cutting-edge research incubations, industry partnerships, and engineering excellence across the Acropolis Group of Institutions.',
    tag: 'Directorate',
    footerTag: 'ACROPOLIS INDORE',
    bullets: ['Former Indian Navy Commander', 'Senior Member IEEE'],
    quote: '“Institutions do not build engineers. Curiosity, discipline, and opportunity do.”',
    motto: ['Lead', 'Serve', 'Elevate'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Chief Patron',
    hackathons: 'Patron since AI Manthan 2023',
    email: 'director@acropolis.in',
    about:
      'Cdr. (Dr.) Anil Rana is the Director of Acropolis Institute of Technology & Research, championing cutting-edge research incubations, industry partnerships, and engineering excellence across the Acropolis Group of Institutions. A former Indian Navy Commander and Senior Member IEEE, he brings institutional rigor to the AI Manthan platform.',
    expertise: ['Research Incubation', 'Industry Partnerships', 'Academic Governance', 'IEEE Standards'],
    stats: [
      { value: '30+', label: 'Years of Leadership' },
      { value: '15+', label: 'MoUs Signed' },
      { value: '3+', label: 'Incubators Launched' },
    ],
    education: [
      { degree: 'Ph.D. in Engineering', school: 'DAVV, Indore' },
      { degree: 'M.Tech.', school: 'IIT Delhi' },
    ],
    notableWork: [
      'Scaled MAHE research incubations to national prominence.',
      'Secured frontier-technology sponsorships for AI Manthan 2026.',
      'Institutionalized the 36-hour offline finale format.',
    ],
  },
  {
    slug: 'srikanth-prabhu',
    group: 'faculty',
    name: 'Dr. Srikanth Prabhu',
    role: 'Faculty Advisor, AI Manthan',
    title: 'Professor, Dept. of CS & Engg.',
    initials: 'SM',
    bio: 'Guiding technical judging rubrics, computational infrastructure, and research validation pipelines for collegiate hackathon finalists.',
    tag: 'Dept. of CSE',
    footerTag: 'FACULTY CONVENER',
    bullets: ['Research: High-Performance Biometrics', '50+ Peer-Reviewed Publications'],
    quote: '“A judging rubric is a promise: that every team is measured by the same ruler.”',
    motto: ['Measure', 'Validate', 'Publish'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Faculty Advisor',
    hackathons: 'Advisor since AI Manthan 2023',
    email: 'srikanth.prabhu@acropolis.in',
    about:
      'Dr. Srikanth Prabhu is a Professor in the Department of Computer Science & Engineering at Acropolis Institute of Technology & Research. He guides the technical judging rubrics, computational infrastructure, and research validation pipelines that keep AI Manthan judging fair and reproducible.',
    expertise: ['High-Performance Biometrics', 'Judging Rubrics', 'Research Validation', 'Computational Infrastructure'],
    stats: [
      { value: '20+', label: 'Years Teaching' },
      { value: '50+', label: 'Publications' },
      { value: '12+', label: 'Funded Projects' },
    ],
    education: [
      { degree: 'Ph.D. in Computer Science', school: 'DAVV, Indore' },
      { degree: 'M.E. in CSE', school: 'NITK Surathkal' },
    ],
    notableWork: [
      'Authored the AI Manthan technical judging rubric v1–v4.',
      'Runs the biometrics research lab at Acropolis Institute of Technology & Research.',
      'Convener of the faculty evaluation board.',
    ],
  },
  {
    slug: 'balakrishna-maddodi',
    group: 'faculty',
    name: 'Dr. Balakrishna Maddodi',
    role: 'Staff Advisor, AI Manthan',
    title: 'Associate Professor, Acropolis Institute of Technology & Research',
    initials: 'BV',
    bio: 'Overseeing institutional protocols, inter-collegiate logistics, national accreditation standards, and campus hospitality safety frameworks.',
    tag: 'Student Welfare',
    footerTag: "AI MANTHAN '26",
    bullets: ['Convenor: AI Manthan Technical Fest', 'Student Affairs & Welfare Directorate'],
    quote: '“Great events feel effortless because someone obsessed over every failure mode.”',
    motto: ['Plan', 'Protect', 'Deliver'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Staff Advisor',
    hackathons: 'Convenor, AI Manthan 2026',
    email: 'balakrishna.m@acropolis.in',
    about:
      'Dr. Balakrishna Maddodi is an Associate Professor at Acropolis Institute of Technology & Research and the Staff Advisor for AI Manthan. He oversees institutional protocols, inter-collegiate logistics, accreditation standards, and the hospitality-safety framework that hosts 40 finalist teams.',
    expertise: ['Event Protocols', 'Accreditation Standards', 'Logistics Planning', 'Campus Safety'],
    stats: [
      { value: '18+', label: 'Years at MAHE' },
      { value: '10+', label: 'AI Manthan Editions' },
      { value: '40+', label: 'Teams Hosted' },
    ],
    education: [
      { degree: 'Ph.D. in Engineering', school: 'DAVV, Indore' },
      { degree: 'M.Tech.', school: 'NIT Karnataka' },
    ],
    notableWork: [
      'Convened four national-scale AI Manthan editions.',
      'Designed the 24/7 rest-pod and hospitality framework.',
      'Leads inter-collegiate accreditation compliance.',
    ],
  },

  /* ---------------- Additional Speakers/Jury from earlier mock (2) ---------------- */
  {
    slug: 'anjali-rao',
    group: 'mentors',
    name: 'Dr. Anjali Rao',
    role: 'Speaker',
    title: 'Associate Professor, Biotechnology',
    bio: 'Works on Biotech Innovation, Research Mentoring and Startup Incubation.',
    tag: 'Deep Science',
    img: img(
      'AB6AXuCO91LtalH_mN6VbKLfG4yJe-aSNAEdd6IKylQD9U3eUiQNg8fdXOEHIed7nPXfnSyaa6f57mKqp14OzYh17sWBQsWBWpbIYOr0vC2CX5LB701fXPtkxl0WkIGRoRq7e8aSFttyEP7p177jnLDfWWvjMAeQurJMrpAWJ9na_9bik9oetPacl1-Sk-ee69QdAi63tGncx5wZIUp3M9QOBP7rCdHUsPN8OKCgbVC8i7Bs5_iuxdSt8O3u',
    ),
    quote: '“Biology teaches patience; startups teach urgency. Build where they meet.”',
    motto: ['Learn', 'Create', 'Grow'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Guest Speaker',
    hackathons: '4+ Fireside Chats',
    linkedin: 'https://linkedin.com',
    email: 'anjali.rao@acropolis.in',
    about:
      'Dr. Anjali Rao is an Associate Professor of Biotechnology at Acropolis Institute of Technology & Research working at the intersection of biotech innovation and startup incubation. At AI Manthan she hosts the fireside chat on deep-science ventures and research commercialization.',
    expertise: ['Biotech Innovation', 'Research Commercialization', 'Startup Incubation', 'Lab-to-Market Strategy'],
    stats: [
      { value: '11+', label: 'Years in Research' },
      { value: '25+', label: 'Publications' },
      { value: '3+', label: 'Startups Incubated' },
    ],
    education: [
      { degree: 'Ph.D. in Biotechnology', school: 'IIT Bombay, 2013' },
      { degree: 'M.Sc. in Biotechnology', school: 'PU Chandigarh, 2008' },
    ],
    notableWork: [
      'Leads the campus biotech incubation cell.',
      'Hosted the AI Manthan deep-science fireside series since 2023.',
      'Advises healthcare-ai student ventures.',
    ],
  },
  {
    slug: 'karan-verma',
    group: 'jury',
    name: 'Prof. Karan Verma',
    role: 'Jury',
    title: 'Assistant Professor, Information Technology',
    bio: 'Passionate about Open Source, Cloud Computing and Student Innovation.',
    tag: 'Open Source / Cloud',
    img: img(
      'AB6AXuBVVkzm-ae9M1DOokNzOfCAuIw-5LK1yhPV55vXzisQBWYKO7a2tsD9K6iziEvFgDnSnvd8RdxoGHecc6gNRw2c73QaQ6Aoy8gbTYlABexkJ-ulvKKIZfdQKukk2b6J0A5RYUI0WaDpY08dgQjjRj9ZzObfnb8Xp8TotHMSCPrD_i_5bTk55uj9UjAW7wWxIWe6SZrtm5NFwtAf1oRIAYrAR3ABitB8M14oasVUgerzLLau0P79kod3',
    ),
    quote: '“Show me your commit history and I will tell you how the demo will go.”',
    motto: ['Bold', 'Ideas', 'Brighter Tomorrows'],
    location: 'Indore, Madhya Pradesh',
    badge: 'Jury Panel',
    hackathons: '9+ Hackathons Judged',
    linkedin: 'https://linkedin.com',
    email: 'karan.verma@acropolis.in',
    about:
      'Prof. Karan Verma is an Assistant Professor of Information Technology at Acropolis Institute of Technology & Research. A long-time open-source maintainer, he judges cloud architecture, code quality, and operational readiness on the AI Manthan jury panel.',
    expertise: ['Open Source', 'Cloud Computing', 'DevOps Pipelines', 'Distributed Systems'],
    stats: [
      { value: '9+', label: 'Years Teaching' },
      { value: '2k+', label: 'OSS Contributions' },
      { value: '5+', label: 'Maintainer Roles' },
    ],
    education: [
      { degree: 'Ph.D. in Information Technology', school: 'NITK Surathkal, 2016' },
      { degree: 'M.S. in Software Systems', school: 'BITS Pilani, 2010' },
    ],
    notableWork: [
      'Maintains widely-used open-source DevOps tooling.',
      'Introduced the live code-review judging format at AI Manthan.',
      'Coaches student teams for GSoC every year.',
    ],
  },
]

export const facultyDirectory = peopleDirectory

export function getPersonBySlug(slug) {
  return peopleDirectory.find((f) => f.slug === slug)
}

export const peopleByGroup = (group) => peopleDirectory.filter((f) => f.group === group)
