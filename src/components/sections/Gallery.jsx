import Image from 'next/image'
import Section from '../ui/Section'
import { gallery } from '../../data/gallery'

function GalleryCard({ item, minH = 'min-h-[280px]', children }) {
  return (
    <div
      className={`${minH} glass glass-hover sheen rounded-2xl overflow-hidden relative group flex flex-col justify-end`}
    >
      <Image
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-85 transition-all duration-650"
        src={item.img}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 45vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
      {children}
    </div>
  )
}

const kickerColors = {
  cyan: 'text-brand-cyan',
  violet: 'text-brand-violet',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
}

export default function Gallery() {
  return (
    <Section id="gallery">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
            {gallery.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            {gallery.heading}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl leading-relaxed">{gallery.body}</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
          {gallery.badge}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Spotlight — 7 cols */}
        <div className="md:col-span-7">
          <GalleryCard item={gallery.spotlight} minH="min-h-[340px]">
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="px-2 py-0.5 rounded bg-brand-violet/30 border border-brand-violet/50 text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
                  {gallery.spotlight.tag}
                </span>
                <span className="text-xs font-mono text-zinc-300">{gallery.spotlight.meta}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {gallery.spotlight.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-lg leading-relaxed">
                {gallery.spotlight.body}
              </p>
            </div>
          </GalleryCard>
        </div>

        {/* Wide — 5 cols */}
        <div className="md:col-span-5">
          <GalleryCard item={gallery.wide} minH="min-h-[340px]">
            <div className="relative z-10 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-mono text-[10px] uppercase tracking-wider font-semibold">
                  {gallery.wide.tag}
                </span>
                <span className="text-xs font-mono text-zinc-300">{gallery.wide.meta}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{gallery.wide.title}</h3>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">{gallery.wide.body}</p>
            </div>
          </GalleryCard>
        </div>

        {/* Bottom row — 4 cols each */}
        {gallery.small.map((item) => (
          <div className="md:col-span-4" key={item.title}>
            <GalleryCard item={item}>
              <div className="relative z-10 p-5">
                <div
                  className={`text-[10px] font-mono font-semibold mb-1 ${
                    kickerColors[item.kickerColor] || 'text-brand-violet'
                  }`}
                >
                  {item.kicker}
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{item.body}</p>
              </div>
            </GalleryCard>
          </div>
        ))}
      </div>
    </Section>
  )
}
