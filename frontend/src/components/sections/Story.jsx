'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { story } from '../../data/site'

/**
 * 3D Tilt Image Component
 * Tilts dynamically with 3D perspective based on mouse cursor position.
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
      opacity: 0.3,
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
    <Section id="story" className="!py-24 sm:!py-32 lg:!py-40 min-h-[70vh] flex flex-col justify-center overflow-hidden !bg-[#06080d]" ref={sectionRef}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center gap-10 sm:gap-14 lg:gap-16">
        {/* Left Text Column */}
        <div
          className={`max-w-2xl transition-all duration-900 ease-out ${
            isVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-12'
          }`}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-semibold tracking-wider text-zinc-300 uppercase mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {story.eyebrow}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-white leading-[1.18]">
            The national arena where minds churn ideas into{' '}
            <span className="italic font-serif text-zinc-300">
              intelligence.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 mt-6 leading-relaxed font-sans max-w-xl">
            {story.body}
          </p>

          {/* Quick highlight points */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2 bg-[#090d14] border border-white/10 px-3.5 py-2 rounded-lg">
              <Icon name="bolt" className="text-sm text-white" />
              <span>24-Hour Offline Sprint</span>
            </div>
            <div className="flex items-center gap-2 bg-[#090d14] border border-white/10 px-3.5 py-2 rounded-lg">
              <Icon name="military_tech" className="text-sm text-white" />
              <span>9 AI Domains</span>
            </div>
            <div className="flex items-center gap-2 bg-[#090d14] border border-white/10 px-3.5 py-2 rounded-lg">
              <Icon name="location_on" className="text-sm text-white" />
              <span>AITR Indore</span>
            </div>
          </div>
        </div>

        {/* Right Rail — Logo & Quote */}
        <div
          className={`w-full flex flex-col gap-6 transition-all duration-1000 ease-out ${
            isVisible
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="relative w-full flex items-center justify-center p-4">
            <img
              src="/logos/aimathan-logo.png"
              alt="AI Manthan 2.0 — official event logo"
              width={1599}
              height={966}
              className="relative w-full max-w-[360px] sm:max-w-[440px] h-auto object-contain"
            />
          </div>

          <div className="bg-[#090d14] p-5 sm:p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-3.5">
              <Icon name="format_quote" className="text-zinc-500 text-2xl shrink-0 rotate-180 opacity-80" />
              <div>
                <div className="text-zinc-300 font-serif italic text-sm sm:text-base leading-snug">
                  {story.quote.text}
                </div>
                <div className="text-xs font-mono text-zinc-500 mt-2.5 font-semibold">
                  {story.quote.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
