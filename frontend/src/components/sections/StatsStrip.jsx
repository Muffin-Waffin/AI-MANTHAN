import { StatStrip } from './Hero'

/**
 * Previous Year Stats — standalone HUD strip rendered between the Hero
 * and the Story (about) section. Kept as its own section so the Hero
 * itself ends at the countdown + scroll cue.
 */
export default function StatsStrip() {
  return (
    <section id="stats" className="relative w-full overflow-x-clip py-10 sm:py-12">
      <div className="site-container">
        <StatStrip />
      </div>
    </section>
  )
}
