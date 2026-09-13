export default function Section({ id, className = '', children }) {
  return (
    <section
      id={id}
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06] ${className}`}
    >
      {children}
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
