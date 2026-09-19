import Image from 'next/image'
import Section from '../ui/Section'
import { gallery } from '../../data/gallery'

/**
 * INSIDE AI MANTHAN — cinematic editorial gallery, art-wall treatment:
 *  - images rest softly blurred + desaturated (gallery veil); hover snaps
 *    them sharp — the “look closer” moment
 *  - 3D art-frame tilt on hover: perspective rotate + lift + deep shadow,
 *    like a canvas leaning off the wall
 *  - single quiet bottom gradient per card; tags/kickers de-noised
 *  - one ambient glow behind the header only; backdrop is a whisper
 *  - compact rhythm so the whole section reads in ~one viewport
 *  - motion: staggered keyframe entrance (.gallery-item), slow Ken Burns
 *    drift (.gallery-ambient), sheen sweep + glow pulse + underline wipe
 *    on hover — all keyframe-driven, reduced-motion safe (see index.css)
 *  - eye path: heading → featured (spans 7 cols, tall) → wide → smalls
 */

function Frame({ item, ratio, sizes, children, priority = false }) {
  return (
    <div
      className={`gallery-frame group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-obsidian-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_40px_-16px_rgba(0,0,0,0.75)] transition-all duration-[500ms] ease-out [transform-style:preserve-3d] will-change-transform hover:[transform:perspective(1100px)_rotateX(1.6deg)_rotateY(-2.2deg)_translateY(-6px)_scale(1.015)] hover:border-white/[0.18] hover:shadow-[0_36px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(139,92,246,0.14)] after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-white/[0.05] ${ratio}`}
    >
      {/* ambient layer — Ken Burns drift; image rests blurred, sharpens on hover */}
      <div className="gallery-ambient absolute inset-0">
        <Image
          alt={item.title}
          src={item.img}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover scale-[1.08] blur-[6px] saturate-[0.8] transition-[transform,filter] duration-[650ms] ease-out group-hover:scale-[1.045] group-hover:blur-[0px] group-hover:saturate-100"
        />
      </div>
      {/* cinematic grade: single bottom gradient + faint vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-950/15 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]" />
      {/* overlay content — lifts slightly on hover, riding the tilted plane */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 transition-transform duration-[400ms] ease-out group-hover:-translate-y-1.5">
        {children}
      </div>
    </div>
  )
}

function Meta({ tag, meta, tone = 'violet' }) {
  const toneCls =
    tone === 'cyan'
      ? 'bg-sky-500/15 border-sky-400/30 text-sky-200'
      : 'bg-brand-violet/25 border-brand-violet/50 text-white'
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className={`gallery-tag px-2 py-0.5 rounded border font-mono text-[9px] uppercase tracking-[0.14em] font-semibold backdrop-blur-sm ${toneCls}`}>
        {tag}
      </span>
      <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-zinc-400">
        {meta}
      </span>
    </div>
  )
}

export default function Gallery() {
  return (
    <Section id="gallery">
      {/* one quiet haze behind the header — nothing behind the photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 w-[560px] h-[300px] rounded-full bg-purple-800/[0.1] blur-[110px]"
      />

      {/* Header — centered, premium, compact */}
      <div className="relative text-center max-w-2xl mx-auto mb-7 sm:mb-9">
        <span className="text-[11px] font-mono font-medium tracking-[0.28em] text-brand-violet uppercase">
          Memories • Moments • Milestones
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
          Inside AI Manthan
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
          {gallery.body}
        </p>
      </div>

      {/* Editorial composition: featured dominates, supporting recedes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Featured — 7 cols, taller, first in reading order */}
        <div className="gallery-item md:col-span-7" style={{ '--gi': 0 }}>
          <Frame
            item={gallery.spotlight}
            ratio="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[380px]"
            sizes="(max-width: 768px) 100vw, 58vw"
            priority
          >
            <Meta tag={gallery.spotlight.tag} meta={gallery.spotlight.meta} />
            <h3 className="gallery-title inline-block text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {gallery.spotlight.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-300/90 mt-1.5 max-w-md leading-relaxed">
              {gallery.spotlight.body}
            </p>
          </Frame>
        </div>

        {/* Wide supporting — 5 cols, quieter */}
        <div className="gallery-item md:col-span-5" style={{ '--gi': 1 }}>
          <Frame
            item={gallery.wide}
            ratio="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[380px]"
            sizes="(max-width: 768px) 100vw, 40vw"
          >
            <Meta tag={gallery.wide.tag} meta={gallery.wide.meta} tone="cyan" />
            <h3 className="gallery-title inline-block text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {gallery.wide.title}
            </h3>
            <p className="text-[11px] text-zinc-300/80 mt-1 leading-relaxed line-clamp-2">
              {gallery.wide.body}
            </p>
          </Frame>
        </div>

        {/* Remaining moments — compact row, quietest tier */}
        {gallery.small.map((item, i) => (
          <div key={item.title} className="gallery-item md:col-span-4" style={{ '--gi': i + 2 }}>
            <Frame item={item} ratio="aspect-[16/10]" sizes="(max-width: 768px) 100vw, 30vw">
              <div className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-400 mb-1">
                {item.kicker}
              </div>
              <h4 className="gallery-title inline-block text-sm font-bold text-white tracking-tight leading-snug">
                {item.title}
              </h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                {item.body}
              </p>
            </Frame>
          </div>
        ))}
      </div>

      {/* Archive note — quiet, out of the way */}
      <p className="text-center text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600 mt-6">
        {gallery.badge}
      </p>
    </Section>
  )
}
