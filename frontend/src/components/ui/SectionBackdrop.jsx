const layers = {
  churn: (
    <>
      <div className="absolute left-1/2 top-1/2 h-[880px] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15] blur-[80px] animate-churn-spin bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,168,255,0.9)_70deg,transparent_150deg,rgba(56,189,248,0.7)_215deg,transparent_290deg,rgba(0,240,255,0.55)_335deg,transparent_360deg)]" />
      <div className="absolute left-[10%] top-[12%] h-64 w-64 rounded-full bg-brand-cyan/20 blur-[100px] animate-float-y" />
      <div className="absolute right-[8%] bottom-[10%] h-72 w-72 rounded-full bg-brand-cyan/15 blur-[110px] animate-float-y [animation-delay:2.6s]" />
    </>
  ),
  circuit: (
    <>
      <div className="absolute left-[14%] top-[18%] h-56 w-56 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="absolute left-[42%] bottom-[12%] h-52 w-52 rounded-full bg-emerald-500/15 blur-[100px]" />
      <div className="absolute right-[28%] top-[8%] h-48 w-48 rounded-full bg-sky-500/20 blur-[100px]" />
      <div className="absolute right-[6%] bottom-[20%] h-56 w-56 rounded-full bg-pink-500/15 blur-[100px]" />
    </>
  ),
  ripple: (
    <>
      <div className="absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan/15 blur-[110px]" />
    </>
  ),
  bokeh: (
    <>
      {[
        ['bg-brand-cyan/25', 'left-[8%] top-[14%] h-44 w-44', 0],
        ['bg-brand-cyan/20', 'right-[10%] top-[26%] h-40 w-40', 1.6],
        ['bg-amber-400/20', 'left-[44%] top-[52%] h-36 w-36', 3.1],
        ['bg-pink-500/20', 'right-[28%] bottom-[8%] h-48 w-48', 4.4],
        ['bg-emerald-400/15', 'left-[20%] bottom-[14%] h-32 w-32', 5.7],
      ].map(([c, p, d]) => (
        <div
          key={p}
          className={`absolute rounded-full blur-[90px] ${c} ${p} animate-float-y`}
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </>
  ),
  spotlight: (
    <>
      <div className="absolute inset-x-0 -top-6 h-[75%]">
        <div className="absolute left-[32%] top-0 h-full w-40 -translate-x-1/2">
          <div className="h-full w-full bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent blur-2xl animate-beam-sway" />
        </div>
        <div className="absolute left-1/2 top-0 h-full w-48 -translate-x-1/2">
          <div className="h-full w-full bg-gradient-to-b from-brand-cyan/25 via-brand-cyan/5 to-transparent blur-2xl animate-beam-sway [animation-delay:1.2s]" />
        </div>
        <div className="absolute left-[68%] top-0 h-full w-40 -translate-x-1/2">
          <div className="h-full w-full bg-gradient-to-b from-brand-cyan/20 via-brand-cyan/5 to-transparent blur-2xl animate-beam-sway [animation-delay:2.3s]" />
        </div>
      </div>
      <div className="absolute left-1/2 bottom-[4%] h-72 w-[580px] -translate-x-1/2 rounded-full bg-brand-cyan/15 blur-[110px]" />
    </>
  ),
  aurora: (
    <>
      <div className="absolute inset-x-[-18%] top-[16%] h-60 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent blur-[80px] animate-float-y" />
      <div className="absolute inset-x-[-12%] top-[56%] h-52 bg-gradient-to-r from-transparent via-brand-cyan/15 to-transparent blur-[80px] animate-float-y [animation-delay:2.8s]" />
    </>
  ),
  pillars: (
    <>
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-cyan/10 to-transparent blur-2xl" />
      <div className="absolute right-[12%] bottom-[16%] h-56 w-56 rounded-full bg-brand-cyan/[0.12] blur-[100px]" />
    </>
  ),
  flow: (
    <>
      <div className="absolute top-[20%] -left-1/4 h-44 w-3/5 rounded-full bg-gradient-to-r from-transparent via-brand-cyan/[0.12] to-transparent blur-[70px] animate-drift-x" />
      <div className="absolute bottom-[16%] -right-1/4 h-44 w-3/5 rounded-full bg-gradient-to-r from-transparent via-brand-cyan/[0.12] to-transparent blur-[70px] animate-drift-x [animation-delay:3s]" />
    </>
  ),
  topo: (
    <>
      <div className="absolute left-[34%] top-[38%] h-64 w-64 rounded-full bg-brand-cyan/10 blur-[100px]" />
    </>
  ),
}

export default function SectionBackdrop({ variant }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-24 -bottom-24 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 mask-fade-b">{layers[variant]}</div>
    </div>
  )
}