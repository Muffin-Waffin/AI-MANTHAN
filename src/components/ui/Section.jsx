/* eslint-disable react/prop-types */
export default function Section({ id, className = '', children, ...props }) {
  return (
    <section
      id={id}
      /* Full-width section, centered content — page background bleeds
         edge-to-edge while inner content stays in a roomy centered
         container (previous layout behaviour, with wider breakpoints). */
      className={`relative w-full py-20 sm:py-24 border-t border-white/[0.06] ${className}`}
      {...props}
    >
      <div className="site-container">{children}</div>
    </section>
  )
}

export function SectionHeaderRow({ heading, aside }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      {heading}
      {aside && <div className="text-xs font-mono text-zinc-500 shrink-0">{aside}</div>}
    </div>
  )
}
