'use client'
import { useEffect, useRef } from 'react'

type FxType = 'electricity' | 'gravity' | 'waves' | 'optics' | 'thermo' | 'default'

export function detectFx(title: string): FxType {
  const t = title.toLowerCase()
  if (/elektr|tok|zarya|kondensator|rezistor|volt|amper/.test(t)) return 'electricity'
  if (/tortish|gravitatsiya|sayyora|orbit|massa|og.irlik/.test(t))  return 'gravity'
  if (/to.lqin|tebranish|mexanik|elastik|garmonik/.test(t))         return 'waves'
  if (/yorug.|optika|linza|prizma|sinish|nur/.test(t))              return 'optics'
  if (/issiqlik|temperatura|termodinamika|gaz|bug/.test(t))         return 'thermo'
  return 'default'
}

// ── Electricity: orbiting electrons + arcs ───────────────────────────────────
function drawElectricity(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2, cy = h / 2
  const electrons = 8

  // nucleus glow
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24)
  g.addColorStop(0, 'rgba(0,200,255,0.9)')
  g.addColorStop(0.4, 'rgba(0,100,255,0.4)')
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fill()

  // orbits + electrons
  for (let i = 0; i < 3; i++) {
    const rx = 55 + i * 35, ry = 22 + i * 12
    const tilt = (i * Math.PI) / 3
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(tilt)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(0,160,255,${0.15 + i * 0.05})`
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()

    // electron on orbit
    const angle = t * (1.2 + i * 0.4) + (i * Math.PI * 2) / 3
    const ex = cx + Math.cos(angle + tilt) * rx * Math.cos(tilt) - Math.sin(angle) * ry * Math.sin(tilt)
    const ey = cy + Math.cos(angle + tilt) * rx * Math.sin(tilt) + Math.sin(angle) * ry * Math.cos(tilt)
    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 6)
    eg.addColorStop(0, 'rgba(100,220,255,1)')
    eg.addColorStop(1, 'transparent')
    ctx.fillStyle = eg
    ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill()
  }

  // floating particles
  for (let i = 0; i < electrons; i++) {
    const angle = (i / electrons) * Math.PI * 2 + t * 0.3
    const r = 110 + Math.sin(t * 1.5 + i) * 30
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r * 0.4
    const a = 0.3 + 0.4 * Math.sin(t * 2 + i)
    ctx.fillStyle = `rgba(0,200,255,${a})`
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()

    // spark lines
    if (i % 2 === 0) {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x, y)
      ctx.strokeStyle = `rgba(0,150,255,${a * 0.3})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }
}

// ── Gravity: orbiting planets ─────────────────────────────────────────────────
function drawGravity(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2

  // sun glow
  const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
  sg.addColorStop(0, 'rgba(255,200,50,1)')
  sg.addColorStop(0.5, 'rgba(255,120,0,0.5)')
  sg.addColorStop(1, 'transparent')
  ctx.fillStyle = sg
  ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill()

  const planets = [
    { r: 55, speed: 1.0, size: 5, color: 'rgba(180,140,255,0.9)', trail: '#a080ff' },
    { r: 85, speed: 0.6, size: 7, color: 'rgba(100,200,255,0.9)', trail: '#40aaff' },
    { r: 120, speed: 0.35, size: 9, color: 'rgba(255,160,80,0.9)', trail: '#ff8040' },
  ]

  planets.forEach(({ r, speed, size, color, trail }) => {
    const angle = t * speed
    const px = cx + Math.cos(angle) * r
    const py = cy + Math.sin(angle) * r * 0.4

    // orbit ring
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.4, 0, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    // trail
    for (let j = 1; j <= 12; j++) {
      const ta = angle - j * 0.12
      const tx = cx + Math.cos(ta) * r
      const ty = cy + Math.sin(ta) * r * 0.4
      ctx.fillStyle = trail.replace(')', `,${0.35 - j * 0.025})`).replace('rgb', 'rgba')
      ctx.beginPath(); ctx.arc(tx, ty, size * (1 - j / 14), 0, Math.PI * 2); ctx.fill()
    }

    // planet
    const pg = ctx.createRadialGradient(px - size * 0.3, py - size * 0.3, 0, px, py, size)
    pg.addColorStop(0, 'white')
    pg.addColorStop(0.3, color)
    pg.addColorStop(1, 'transparent')
    ctx.fillStyle = pg
    ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill()
  })
}

// ── Waves: sinusoidal particle streams ───────────────────────────────────────
function drawWaves(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const layers = [
    { amp: 28, freq: 0.025, speed: 1.0, color: [0, 220, 180], offset: 0 },
    { amp: 18, freq: 0.04,  speed: 1.4, color: [0, 160, 255], offset: Math.PI / 2 },
    { amp: 12, freq: 0.06,  speed: 0.8, color: [120, 60, 255], offset: Math.PI },
  ]

  layers.forEach(({ amp, freq, speed, color, offset }) => {
    const [r, g, b] = color
    for (let x = 0; x < w; x += 6) {
      const y = h / 2 + Math.sin(x * freq + t * speed + offset) * amp
      const bright = 0.5 + 0.5 * Math.sin(x * freq + t * speed + offset)
      ctx.fillStyle = `rgba(${r},${g},${b},${0.5 + bright * 0.5})`
      const sz = 1.5 + bright * 2
      ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill()
    }
  })
}

// ── Optics: rainbow refraction ────────────────────────────────────────────────
function drawOptics(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  const rays = 200

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + t * 0.1
    const spread = 0.15 + Math.sin(t * 0.5 + i * 0.1) * 0.1
    const length = 40 + Math.sin(t + i * 0.5) * 20
    const hue = (i / rays) * 360
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
      cx + Math.cos(angle + spread) * length,
      cy + Math.sin(angle + spread) * length
    )
    ctx.strokeStyle = `hsla(${hue},100%,70%,0.4)`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // prism center
  const pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20)
  pg.addColorStop(0, 'rgba(255,255,255,0.9)')
  pg.addColorStop(1, 'transparent')
  ctx.fillStyle = pg
  ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill()
}

// ── Thermodynamics: heat particles ───────────────────────────────────────────
function drawThermo(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const count = 60
  for (let i = 0; i < count; i++) {
    const seed = i * 137.508
    const x = w * 0.1 + (w * 0.8 * ((seed * 7.3) % 1))
    const baseY = h * 0.8 - (h * 0.7 * ((seed * 3.1) % 1))
    const y = baseY - ((t * (30 + (seed % 20))) % (h * 0.9))
    const size = 1.5 + (seed % 3)
    const hue = 10 + (seed % 40)
    const a = 0.3 + 0.5 * ((seed * 5.7) % 1)
    ctx.fillStyle = `hsla(${hue},100%,65%,${a})`
    ctx.beginPath(); ctx.arc(x, (y + h) % h, size, 0, Math.PI * 2); ctx.fill()
  }
}

// ── Default: ambient cosmos ───────────────────────────────────────────────────
function drawDefault(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const count = 50
  for (let i = 0; i < count; i++) {
    const seed = i * 97.3
    const x = w * ((seed * 3.7) % 1)
    const y = h * ((seed * 5.1) % 1)
    const r = 1 + (seed % 2)
    const a = 0.2 + 0.6 * Math.abs(Math.sin(t * (0.5 + (seed % 1)) + seed))
    ctx.fillStyle = `rgba(120,160,255,${a})`
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
}

const DRAW_MAP: Record<FxType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  electricity: drawElectricity,
  gravity:     drawGravity,
  waves:       drawWaves,
  optics:      drawOptics,
  thermo:      drawThermo,
  default:     drawDefault,
}

interface TopicParticlesProps {
  type: FxType
  width?: number
  height?: number
  className?: string
}

export default function TopicParticles({ type, width = 260, height = 140, className }: TopicParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const t0 = performance.now()
    const draw = DRAW_MAP[type] ?? drawDefault

    const loop = () => {
      draw(ctx, canvas.width, canvas.height, (performance.now() - t0) / 1000)
      raf.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf.current)
  }, [type])

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      className={className}
      aria-hidden
    />
  )
}
