import { domains } from '@/data/tracks'
import ProblemStatementsClient from './ProblemStatementsClient'

/* ── PROBLEM STATEMENTS — dedicated, data-driven page ────────────────
   Renders the 12 confirmed domains from data/tracks.js. Real problem
   statements are NOT provided yet — nothing is fabricated. When PS
   content is added to a domain's `statements` array in data/tracks.js,
   it renders here automatically (no component change needed).

   A domain with zero statements shows a quiet "announcing soon" note;
   a domain with statements lists each one as a full card. */

export const metadata = {
  title: 'Problem Statements — 12 Challenge Domains',
  description:
    'The 12 confirmed problem domains of AI Manthan 2.0 — from healthcare and women safety to smart cities and clean India. Official problem statements drop here.',
}

export default function ProblemStatementsPage() {
  const totalPS = domains.reduce((n, d) => n + d.statements.length, 0)

  return <ProblemStatementsClient totalPS={totalPS} domains={domains} />
}