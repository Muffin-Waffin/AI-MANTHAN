'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { story } from '../../data/site'

const textTone = {
  azure: 'text-brand-cyan',
  cyan: 'text-brand-cyan',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  pink: 'text-pink-400',
}

/**
 * 3D Tilt Image Component
 * Tilts dynamically with 3D perspective based on mouse cursor position
 * and renders a realistic ambient glare follow effect.
 */
function TiltImage({ src, alt, width, height, className }) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = -((y - centerY) / centerY) * 18
    const rotateY = ((x - centerX) / centerX) * 18

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`)
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.4,
    })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer transition-transform duration-200 ease-out"
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Ambient glowing aura behind logo */}
      <div
        aria-hidden="true"
        className="absolute inset-4 bg-cyan-500/25 blur-[65px] rounded-full pointer-events-none"
      />
      {/* Dynamic 3D glare shine */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, ${glarePos.opacity}), transparent 65%)`,
        }}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  )
}

function PillarCard({ pillar, index, isVisible }) {
  return (
    <div
      className={`glass glass-hover sheen p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col justify-between group/pillar transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-12 blur-sm'
      }`}
      style={{ transitionDelay: `${250 + index * 120}ms` }}
    >
      <div>
        <div
          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-2.5 sm:mb-4 transition-all duration-500 group-hover/pillar:scale-110 group-hover/pillar:border-cyan-400/40 ${
            textTone[pillar.color] || 'text-brand-cyan'
          }`}
        >
          <Icon name={pillar.icon} className="text-[18px] sm:text-[22px]" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">{pillar.title}</h3>
        <p className="text-[10px] sm:text-xs text-zinc-400 mt-1.5 sm:mt-2 leading-relaxed">{pillar.body}</p>
      </div>
      <div className="mt-3 sm:mt-3.5 pt-2 sm:pt-3 border-t border-white/[0.05] font-mono text-[9px] sm:text-[11px] text-zinc-500">
        {pillar.footnote}
      </div>
    </div>
  )
}

export default function Story() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Section id="story" className="!py-10 sm:!py-12 overflow-hidden" ref={sectionRef}>
      <SectionBackdrop variant="churn" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-start gap-6 sm:gap-8 lg:gap-8 mb-8 sm:mb-10">
        {/* Left Text Column — Reveal from Left */}
        <div
          className={`max-w-2xl pl-[3%] transition-all duration-900 ease-out ${
            isVisible
              ? 'opacity-100 translate-x-0 filter-none'
              : 'opacity-0 -translate-x-16 blur-sm'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider text-brand-cyan uppercase">
            {story.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-1.5 leading-tight">
            {story.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 mt-2 sm:mt-3 leading-relaxed">{story.body}</p>
        </div>

        {/* Right Rail — Center Zoom Reveal + 3D Cursor Tilt Parallax */}
        <div
          className={`w-full flex flex-col gap-3 sm:gap-4 transition-all duration-1000 ease-out ${
            isVisible
              ? 'opacity-100 scale-100 filter-none'
              : 'opacity-0 scale-75 blur-md'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="relative w-full flex items-center justify-center">
            <TiltImage
              src="/logos/aimathan-logo.png"
              alt="AI Manthan 2.0 — official event logo"
              width={1599}
              height={966}
              className="relative w-full max-w-[460px] h-auto object-contain drop-shadow-[0_0_50px_rgba(0,240,255,0.5)]"
            />
          </div>
          <div className="glass p-3 sm:p-3.5 rounded-xl text-[10px] sm:text-xs font-mono text-zinc-400">
            <div className="text-zinc-200 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{story.quote.text}</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">{story.quote.author}</div>
          </div>
        </div>
      </div>

      {/* Bottom 4 Pillar Cards — Reveal from Bottom with Stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {story.pillars.map((pillar, idx) => (
          <PillarCard key={pillar.title} pillar={pillar} index={idx} isVisible={isVisible} />
        ))}
      </div>
    </Section>
  )
}
