'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ScrollRocket Component — Responsive Mobile-Optimized Flying Rocket
 * - Sized for mobile screens (w-9 h-12 on mobile, w-14 h-18 on desktop).
 * - Compact text trail ("AI मंथन 2.0") scaled for mobile display.
 * - Responsive waypoints bounded safely within mobile screen margins.
 * - Buttery smooth inertial scroll lerp.
 */

const BASE_WAYPOINTS = [
  { progress: 0.00, mobileX: 78, desktopX: 88, y: 22 }, // Hero top right (safely below mobile header)
  { progress: 0.16, mobileX: 18, desktopX: 10, y: 30 }, // Story / About top left
  { progress: 0.35, mobileX: 78, desktopX: 88, y: 42 }, // Tracks top right
  { progress: 0.52, mobileX: 18, desktopX: 10, y: 54 }, // Timeline / Gallery top left
  { progress: 0.70, mobileX: 78, desktopX: 88, y: 66 }, // Prizes / Mentors top right
  { progress: 0.86, mobileX: 18, desktopX: 10, y: 78 }, // Partners top left
  { progress: 1.00, mobileX: 75, desktopX: 84, y: 86 }, // Footer bottom right
]

const TRAIL_PHRASES = [
  'AI मंथन 2.0',
  'AI MANTHAN 2.0',
  'AI मंथन 2.0',
]

export default function ScrollRocket() {
  const canvasRef = useRef(null)
  const rocketRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)

  const posRef = useRef({
    x: 0,
    y: 0,
    angle: 220,
    speed: 0,
  })

  const particlesRef = useRef([])
  const textParticlesRef = useRef([])
  const phraseIndexRef = useRef(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const isMobile = () => window.innerWidth < 640

    const getWaypoints = () => {
      const mobile = isMobile()
      return BASE_WAYPOINTS.map((w) => ({
        progress: w.progress,
        x: mobile ? w.mobileX : w.desktopX,
        y: w.y,
      }))
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Initial position based on screen width
    const waypoints = getWaypoints()
    const initX = (waypoints[0].x / 100) * window.innerWidth
    const initY = (waypoints[0].y / 100) * window.innerHeight
    posRef.current.x = initX
    posRef.current.y = initY

    let targetX = initX
    let targetY = initY
    let lastScrollY = window.scrollY
    let frameCounter = 0
    let lastEmitFrame = -100

    const computeTargetFromScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / docHeight))
      const currentWaypoints = getWaypoints()

      let segmentIdx = 0
      for (let i = 0; i < currentWaypoints.length - 1; i++) {
        if (scrollProgress >= currentWaypoints[i].progress && scrollProgress <= currentWaypoints[i + 1].progress) {
          segmentIdx = i
          break
        }
        if (i === currentWaypoints.length - 2 && scrollProgress > currentWaypoints[i + 1].progress) {
          segmentIdx = i
        }
      }

      const p1 = currentWaypoints[segmentIdx]
      const p2 = currentWaypoints[segmentIdx + 1] || p1
      const segSpan = p2.progress - p1.progress || 1
      const t = Math.min(1, Math.max(0, (scrollProgress - p1.progress) / segSpan))

      // Silky smooth cubic easing
      const smoothT = t * t * (3 - 2 * t)

      const vw = window.innerWidth
      const vh = window.innerHeight

      targetX = (p1.x + (p2.x - p1.x) * smoothT) * (vw / 100)
      targetY = (p1.y + (p2.y - p1.y) * smoothT) * (vh / 100)
    }

    const onScroll = () => {
      computeTargetFromScroll()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    computeTargetFromScroll()

    // Animation Loop
    let animationFrameId
    let prevTime = performance.now()

    const loop = (currentTime) => {
      frameCounter++
      const dt = Math.min((currentTime - prevTime) / 1000, 0.1)
      prevTime = currentTime

      const pos = posRef.current
      const dx = targetX - pos.x
      const dy = targetY - pos.y
      const dist = Math.hypot(dx, dy)

      // Buttery smooth inertial lerp factor (0.055)
      const lerpSpeed = 0.055
      const nextX = pos.x + dx * lerpSpeed
      const nextY = pos.y + dy * lerpSpeed

      // Smooth angle interpolation curve
      if (dist > 1.0) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        let dAngle = targetAngle - pos.angle
        while (dAngle < -180) dAngle += 360
        while (dAngle > 180) dAngle -= 360
        pos.angle += dAngle * 0.08
      }

      const moveSpeed = Math.hypot(nextX - pos.x, nextY - pos.y)
      pos.x = nextX
      pos.y = nextY
      pos.speed = moveSpeed

      // Update rocket DOM transform
      if (rocketRef.current) {
        rocketRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px) translate(-50%, -50%) rotate(${pos.angle}deg)`
      }

      // Nozzle tail offset scaled per device width
      const mobileDevice = isMobile()
      const rad = (pos.angle - 90) * (Math.PI / 180)
      const tailOffset = mobileDevice ? 16 : 24
      const thrusterX = pos.x - Math.cos(rad) * tailOffset
      const thrusterY = pos.y - Math.sin(rad) * tailOffset

      const isScrolling = Math.abs(window.scrollY - lastScrollY) > 0.5
      lastScrollY = window.scrollY

      // 1. Soft Smoke Puffs (scaled down on mobile)
      const spawnCount = isScrolling ? 2 : 1
      for (let i = 0; i < spawnCount; i++) {
        const spreadAngle = rad + (Math.random() - 0.5) * 0.4 + Math.PI
        const speed = (mobileDevice ? 0.5 : 0.8) + Math.random() * 1.2
        particlesRef.current.push({
          x: thrusterX,
          y: thrusterY,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed,
          radius: mobileDevice ? 2 : 3,
          maxRadius: mobileDevice ? 8 + Math.random() * 4 : 12 + Math.random() * 6,
          opacity: 0.4 + Math.random() * 0.2,
          life: 0,
          maxLife: mobileDevice ? 22 + Math.random() * 8 : 28 + Math.random() * 10,
          isCyan: Math.random() > 0.4,
        })
      }

      // 2. Mobile-Scaled Text Emission (Well-Spaced, NO Overlap)
      const minInterval = isScrolling ? (mobileDevice ? 24 : 20) : (mobileDevice ? 32 : 28)
      if (frameCounter - lastEmitFrame >= minInterval) {
        lastEmitFrame = frameCounter
        const phrase = TRAIL_PHRASES[phraseIndexRef.current % TRAIL_PHRASES.length]
        phraseIndexRef.current++

        const shootAngle = rad + (Math.random() - 0.5) * 0.15 + Math.PI
        const speed = (mobileDevice ? 1.8 : 2.4) + Math.random() * 0.8

        textParticlesRef.current.push({
          x: thrusterX,
          y: thrusterY,
          vx: Math.cos(shootAngle) * speed,
          vy: Math.sin(shootAngle) * speed,
          text: phrase,
          fontSize: mobileDevice ? 7.5 : 12,
          maxFontSize: mobileDevice ? 10.5 : 14,
          opacity: 1.0,
          life: 0,
          maxLife: mobileDevice ? 40 : 48,
          rotation: (Math.random() - 0.5) * 8,
        })
      }

      // Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // A) Render Smoke Particles
      const remainingParticles = []
      for (const p of particlesRef.current) {
        p.life++
        if (p.life >= p.maxLife) continue

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.94
        p.vy *= 0.94

        const lifeProgress = p.life / p.maxLife
        const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.sin(lifeProgress * Math.PI)
        const currentOpacity = p.opacity * (1 - lifeProgress)

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.1, currentRadius), 0, Math.PI * 2)

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0.1, currentRadius))
        if (p.isCyan) {
          grad.addColorStop(0, `rgba(0, 230, 255, ${currentOpacity * 0.55})`)
          grad.addColorStop(0.5, `rgba(0, 160, 230, ${currentOpacity * 0.2})`)
          grad.addColorStop(1, `rgba(0, 100, 180, 0)`)
        } else {
          grad.addColorStop(0, `rgba(245, 250, 255, ${currentOpacity * 0.5})`)
          grad.addColorStop(0.5, `rgba(180, 215, 240, ${currentOpacity * 0.18})`)
          grad.addColorStop(1, `rgba(80, 120, 160, 0)`)
        }

        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()

        remainingParticles.push(p)
      }
      particlesRef.current = remainingParticles

      // B) Render Compact Mobile Text Banners
      const remainingTextParticles = []
      for (const tp of textParticlesRef.current) {
        tp.life++
        if (tp.life >= tp.maxLife) continue

        tp.x += tp.vx
        tp.y += tp.vy
        tp.vx *= 0.96
        tp.vy *= 0.96

        const lifeProgress = tp.life / tp.maxLife
        const currentOpacity = tp.opacity * Math.sin((1 - lifeProgress) * Math.PI)
        const currentSize = tp.fontSize + (tp.maxFontSize - tp.fontSize) * (lifeProgress * 0.4)

        ctx.save()
        ctx.translate(tp.x, tp.y)
        ctx.rotate((tp.rotation * Math.PI) / 180)

        // Neon Glow
        ctx.shadowColor = '#00f0ff'
        ctx.shadowBlur = mobileDevice ? 6 : 10

        ctx.font = `900 ${currentSize}px system-ui, -apple-system, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Cyan stroke border for crisp outline
        ctx.strokeStyle = `rgba(0, 240, 255, ${currentOpacity})`
        ctx.lineWidth = mobileDevice ? 2 : 2.5
        ctx.strokeText(tp.text, 0, 0)

        // Bright white text fill
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx.fillText(tp.text, 0, 0)

        ctx.restore()

        remainingTextParticles.push(tp)
      }
      textParticlesRef.current = remainingTextParticles

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', onScroll)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isMounted])

  if (!isMounted) return null

  return (
    <>
      {/* Smoke & AI Trail Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30"
      />

      {/* Dynamic Rocket Object */}
      <div
        ref={rocketRef}
        className="fixed top-0 left-0 z-40 pointer-events-none transition-transform duration-75 ease-out select-none"
        style={{
          transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0px) translate(-50%, -50%) rotate(${posRef.current.angle}deg)`,
          willChange: 'transform',
        }}
      >
        {/* Compact Responsive Rocket Container */}
        <div className="relative w-9 h-12 sm:w-14 sm:h-18 flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          {/* Subtle Thruster Exhaust Flame */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-3 sm:w-2 sm:h-4 bg-gradient-to-b from-cyan-200 via-cyan-400 to-transparent rounded-full opacity-80" />

          {/* Sleek Rocket Fuselage SVG */}
          <svg
            viewBox="0 0 120 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a2336" />
                <stop offset="40%" stopColor="#0c121e" />
                <stop offset="100%" stopColor="#05080f" />
              </linearGradient>

              <linearGradient id="cyanStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#00d8ff" />
                <stop offset="100%" stopColor="#0088ff" />
              </linearGradient>

              <linearGradient id="glassVisor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.95)" />
                <stop offset="60%" stopColor="rgba(0, 140, 230, 0.6)" />
                <stop offset="100%" stopColor="rgba(4, 12, 24, 0.9)" />
              </linearGradient>

              <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#0a1424" />
              </linearGradient>
            </defs>

            {/* Outer Thruster Wings */}
            <path
              d="M 22 95 L 4 125 L 28 120 Z"
              fill="url(#finGrad)"
              stroke="#00f0ff"
              strokeWidth="2"
            />
            <path
              d="M 98 95 L 116 125 L 92 120 Z"
              fill="url(#finGrad)"
              stroke="#00f0ff"
              strokeWidth="2"
            />

            {/* Rear Thruster Engine Nozzle */}
            <rect
              x="45"
              y="126"
              width="30"
              height="14"
              rx="4"
              fill="#101826"
              stroke="#00f0ff"
              strokeWidth="2"
            />

            {/* Main Rocket Aerodynamic Fuselage */}
            <path
              d="M 60 6 C 82 32, 92 74, 92 122 L 28 122 C 28 74, 38 32, 60 6 Z"
              fill="url(#rocketBodyGrad)"
              stroke="url(#cyanStroke)"
              strokeWidth="3"
            />

            {/* Center Panel Line */}
            <path d="M 60 6 L 60 122" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5 4" />

            {/* Cockpit Visor Window */}
            <ellipse
              cx="60"
              cy="48"
              rx="16"
              ry="20"
              fill="url(#glassVisor)"
              stroke="#00f0ff"
              strokeWidth="2.2"
            />

            {/* High Contrast AI MANTHAN 2.0 Insignia Badge */}
            <g transform="translate(60, 94)">
              <rect
                x="-28"
                y="-13"
                width="56"
                height="26"
                rx="6"
                fill="#050812"
                stroke="#00f0ff"
                strokeWidth="1.8"
              />
              <text
                x="0"
                y="-1"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="7.5"
                fontWeight="900"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                AI MANTHAN
              </text>
              <text
                x="0"
                y="9"
                textAnchor="middle"
                fill="#00f0ff"
                fontSize="7"
                fontWeight="900"
                fontFamily="sans-serif"
                letterSpacing="1.2"
              >
                2.0
              </text>
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}
