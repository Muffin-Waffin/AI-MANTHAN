/* Challenge tracks — each track owns a bounty and a set of Round-1
   problem statements. The Tracks section renders a sidebar of tracks
   on the left and a pager through this file's `statements` on the right. */

export const tracks = [
  {
    id: 'healthcare',
    number: 'TRACK 01',
    label: 'Healthcare',
    icon: 'medical_services',
    bounty: '₹40,000',
    accent: 'violet',
    blurb: 'Edge intelligence for public-health visibility.',
    statements: [
      {
        sdg: { n: 3, label: 'Good Health and Well-being', color: '#4c9f38' },
        title: 'The Vanishing Dose — Detecting Medication Non-Adherence Without Asking',
        description:
          'A patient may be prescribed the right medication, yet treatment can fail because doses are missed, taken at the wrong time, or stopped altogether. In practice, clinicians often have very little visibility into what happens between prescription and the next appointment. Pharmacy refills, prescription changes, symptom patterns, wearable data, and follow-up records may each reveal small clues, but these signals are rarely considered together. Design a system that can identify patterns suggesting medication non-adherence from indirect, routinely available healthcare signals — reasoning from changes and inconsistencies across available information, distinguishing temporary irregularities from meaningful patterns, and communicating uncertainty clearly. The goal is to help healthcare professionals identify when a treatment may not be working because of how it is being taken, without automatically assuming a patient is non-compliant.',
      },
      {
        sdg: { n: 3, label: 'Good Health and Well-being', color: '#4c9f38' },
        title: 'Cold Chain Sentinels — Vaccine Integrity on the Last Mile',
        description:
          'Vaccines routinely lose potency in transit across tier-2/3 geographies where cold-chain telemetry is sparse or non-existent. Build a low-bandwidth monitoring layer that fuses intermittent IoT temperature pings, transit timestamps, and route metadata to predict the probability that a batch arriving at a rural PHN center is still viable — and surfaces a simple trust score to the district health officer before the dose reaches a patient.',
      },
    ],
  },
  {
    id: 'disaster',
    number: 'TRACK 02',
    label: 'Disaster Resilience',
    icon: 'emergency',
    bounty: '₹35,000',
    accent: 'emerald',
    blurb: 'Communication fabrics that survive catastrophe.',
    statements: [
      {
        sdg: { n: 11, label: 'Sustainable Cities & Communities', color: '#fd9d24' },
        title: 'Blackout Mesh — Ad-hoc Networks When Everything Fails',
        description:
          'When a flood or earthquake takes out telecom backhauls, power grids, and satellite uplinks simultaneously, the first 72 hours run on rumor. Architect a peer-to-peer ad-hoc communication fabric that hops over LoRa/BLE capable consumer devices, syncs via CRDTs once any node touches the internet, and gives relief coordinators a live, offline-first picture of shelter needs, missing persons, and safe routes — no infrastructure required.',
      },
      {
        sdg: { n: 13, label: 'Climate Action', color: '#3f7e44' },
        title: 'Hyperlocal Deluge — Street-Level Flood Forecasting',
        description:
          'City-wide alerts arrive too late and too vague. Combine open IMD nowcast feeds, drainage-network maps, and crowdsourced water-level photos (with a lightweight CV depth estimator) to predict which gully, chowk, or underpass floods first in the next 3 hours — and push actionable re-routes to commuters and municipal crews.',
      },
    ],
  },
  {
    id: 'zk',
    number: 'TRACK 03',
    label: 'Cybersecurity',
    icon: 'fingerprint',
    bounty: '₹45,000',
    accent: 'cyan',
    blurb: 'Zero-knowledge proofs for real AI systems.',
    statements: [
      {
        sdg: { n: 9, label: 'Industry, Innovation and Infrastructure', color: '#fd6925' },
        title: 'Verifiable Inference — Prove the Model Without Revealing It',
        description:
          'Hospitals and banks want the outputs of powerful AI models, but providers refuse to publish proprietary weights while auditors refuse to trust black boxes. Implement zero-knowledge cryptographic proofs for deep neural model execution — guaranteeing weights, training lineage, and deterministic outputs without disclosing sensitive parameters. Tooling around EZKL / Halo2 / ONNX runtimes is fair game; bonus points for a live demo verifying a vision model under 30 seconds.',
      },
      {
        sdg: { n: 16, label: 'Peace, Justice and Strong Institutions', color: '#00689d' },
        title: 'Deepfake Proof — Cryptographic Media Attestation',
        description:
          'Election seasons drown in synthetic media. Design an attestation pipeline that cryptographically signs capture-time metadata on phones, verifies edit history end-to-end, and lets any citizen scan a QR to see what is original versus generated — privacy-preserving, censorship-resistant, and fast enough for newsroom fact-check desks.',
      },
    ],
  },
  {
    id: 'governance',
    number: 'TRACK 04',
    label: 'Smart Governance',
    icon: 'account_balance',
    bounty: '₹30,000',
    accent: 'violet',
    blurb: 'Transparent, verifiable civic infrastructure.',
    statements: [
      {
        sdg: { n: 16, label: 'Peace, Justice and Strong Institutions', color: '#00689d' },
        title: 'Immutable Civic State — Public Money on a Public Ledger',
        description:
          'Municipal budgets leak value at every opaque handoff. Build verifiable public ledgers for ward-level spending: autonomous tender-dispute arbitration with cryptoeconomic incentives, citizen participation protocols with quadratic voting, and an auditor dashboard that traces every rupee from sanction to street-level asset — tamper-evident by construction.',
      },
      {
        sdg: { n: 11, label: 'Sustainable Cities & Communities', color: '#fd9d24' },
        title: 'The Silent Petition — Issue-to-Action Civic Engine',
        description:
          'Citizens report potholes, broken lights, and water leaks into portals that go nowhere. Engineer a triage engine that clusters geo-tagged complaints, verifies severity from photo evidence, auto-escalates by accountability rules, and publishes resolution SLAs on a public dashboard — turning civic noise into a pressure system officials cannot ignore.',
      },
    ],
  },
  {
    id: 'microfinance',
    number: 'TRACK 05',
    label: 'Microfinance',
    icon: 'payments',
    bounty: '₹30,000',
    accent: 'pink',
    blurb: 'Reputation engines for the unbanked economy.',
    statements: [
      {
        sdg: { n: 1, label: 'No Poverty', color: '#e5243b' },
        title: 'Algorithmic Trust — Credit Signals Without Credit History',
        description:
          'Street vendors and micro-merchants run on cash and UPI, invisible to bureaus. Engineer alternative reputation engines from transactional SMS graphs, utility footfall, and UPI receipt patterns — privacy-preserving, explainable to the lender, and fair to the vendor. Deliver a risk score that a cooperative bank can actually underwrite against.',
      },
      {
        sdg: { n: 8, label: 'Decent Work and Economic Growth', color: '#a21942' },
        title: 'Sanchay Circles — Community Savings on Autopilot',
        description:
          'Self-help groups run chit funds and savings circles on paper registers and trust. Design a lightweight, offline-capable platform that digitizes contribution ledgers, predicts default risk from group behavior, automates payouts, and gives every member a portable savings reputation — usable by facilitators with basic smartphones.',
      },
    ],
  },
  {
    id: 'open',
    number: 'TRACK 06',
    label: 'Culture & Community',
    icon: 'auto_awesome',
    bounty: '₹20,000',
    accent: 'amber',
    blurb: 'Moonshot wildcard — build what moves you.',
    statements: [
      {
        sdg: { n: 4, label: 'Quality Education', color: '#c5192d' },
        title: 'Heritage Sound — Archiving Dying Voices with AI',
        description:
          'Hundreds of subcontinental dialects are one generation from silence. Archive endangered speech and indigenous acoustic narratives using open-weight diffusion audio synthesizers, speech LLMs, and few-shot voice preservation — building a living museum that can speak back. Open Science principles apply: datasets and models must remain public.',
      },
      {
        sdg: { n: 10, label: 'Reduced Inequalities', color: '#dd1367' },
        title: 'Open Wildcard — The Breakthrough Clause',
        description:
          'Got a frontier idea that does not fit any box — an accessibility invention, a scientific tool, a civic game-changer? This slot is yours. Pitch the problem-solution fit, ship a working slice in Round 1, and convince the jury it deserves the wildcard bounty. Constrained only by ambition and ethics.',
      },
    ],
  },
]

/* Kept for compatibility with any legacy consumer. */
export const trackFilters = tracks.map((t) => ({ id: t.id, label: t.label }))
