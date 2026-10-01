'use client'

import { useEffect, useRef } from 'react'

/**
 * Ambient global background — sparkle dust + shooting stars + aurora orbs.
 * (The binary-rain video is scoped to the Hero/overview section only.)
 * Sparkles: mouse-reactive drift + phase-offset twinkle. Shooting stars:
 * occasional meteors streaking down-left with a fading trail.
 */
function useSparkles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let frame

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const COUNT = 90
    const mouse = { x: width / 2, y: height / 2 }
    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    const sparkles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.02,
      cyan: Math.random() > 0.35,
    }))

    /* shooting stars — spawn every 5–8s, streak down-left, fade out */
    const meteors = []
    let lastSpawn = 0

    function render(t) {
      ctx.clearRect(0, 0, width, height)
      const offX = (mouse.x - width / 2) * 0.02
      const offY = (mouse.y - height / 2) * 0.02

      /* calm-sky cadence: one meteor roughly every 9.5–13.5s */
      if (t - lastSpawn > 9500 + Math.random() * 4000) {
        lastSpawn = t
        meteors.push({
          x: width * 0.15 + Math.random() * width * 0.75,
          y: -40,
          vx: -(2.2 + Math.random() * 1.6),
          vy: 2.6 + Math.random() * 1.4,
          life: 1,
        })
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx
        m.y += m.vy
        m.life -= 0.011
        if (m.life <= 0 || m.y > height + 60) {
          meteors.splice(i, 1)
          continue
        }
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 15, m.y - m.vy * 15)
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * m.life})`)
        grad.addColorStop(0.4, `rgba(103, 232, 249, ${0.4 * m.life})`)
        grad.addColorStop(1, 'rgba(103, 232, 249, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 15, m.y - m.vy * 15)
        ctx.stroke()
      }

      for (const s of sparkles) {
        s.x += s.vx * s.z
        s.y += s.vy * s.z
        if (s.x < 0) s.x = width
        if (s.x > width) s.x = 0
        if (s.y < 0) s.y = height
        if (s.y > height) s.y = 0

        const tw = 0.25 + 0.75 * Math.abs(Math.sin(s.phase + t * s.speed))
        const px = s.x + offX * s.z
        const py = s.y + offY * s.z

        ctx.beginPath()
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2)
        ctx.fillStyle = s.cyan
          ? `rgba(103, 232, 249, ${0.55 * tw})`
          : `rgba(56, 189, 248, ${0.5 * tw})`
        ctx.fill()

        if (s.r > 1.5 && tw > 0.75) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * tw})`
          ctx.lineWidth = 0.6
          const len = s.r * 3.2
          ctx.beginPath()
          ctx.moveTo(px - len, py)
          ctx.lineTo(px + len, py)
          ctx.moveTo(px, py - len)
          ctx.lineTo(px, py + len)
          ctx.stroke()
        }
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])
}

export default function ParticleBackground() {
  const canvasRef = useSparkles()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      {/* Fixed corner sparkle — sits in the bottom-left where the dev badge
          used to render. Twinkles slowly, matching the ambient dust. */}
      <span
        aria-hidden="true"
        className="corner-sparkle absolute bottom-5 left-5 text-zinc-500/40"
      >
        <span className="material-symbols-outlined select-none text-[22px]">star_4pt</span>
      </span>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full h-[540px] bg-gradient-to-b from-brand-cyan/15 via-transparent to-transparent blur-[120px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian-950/30 to-obsidian-950 pointer-events-none"></div>
    </div>
  )
}
