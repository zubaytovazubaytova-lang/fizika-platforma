'use client'
import { useState, useEffect } from 'react'

// Deterministik seed — server va client bir xil qiymat beradi
function s(n: number, range: number, offset = 0): number {
  return (((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) * 0.5) * range + offset
}

const STARS = Array.from({ length: 72 }, (_, i) => ({
  x:        s(i,        100),
  y:        s(i + 72,   100),
  size:     s(i + 144,  2.2, 0.6),
  delay:    s(i + 216,  6),
  duration: s(i + 288,  3, 2),
  opacity:  s(i + 360,  0.55, 0.15),
}))

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x:        s(i,        96, 2),
  size:     s(i + 100,  5,  2),
  delay:    s(i + 200,  12),
  duration: s(i + 300,  14, 10),
  hue:      [200, 260, 170, 45, 320][i % 5],
  opacity:  s(i + 400,  0.5, 0.2),
}))

const FORMULAS = [
  { text: 'E = mc²',      x: 8,  y: 22, size: 18, delay: 0 },
  { text: 'F = ma',       x: 78, y: 12, size: 15, delay: -4 },
  { text: 'λ = v/f',      x: 55, y: 72, size: 14, delay: -8 },
  { text: 'ΔE = hf',      x: 18, y: 62, size: 16, delay: -2 },
  { text: 'P = mv',       x: 88, y: 48, size: 13, delay: -6 },
  { text: 'W = Fd',       x: 40, y: 18, size: 14, delay: -10 },
  { text: '∇ × B = μ₀J',  x: 70, y: 85, size: 12, delay: -3 },
  { text: 'v₀ + at',      x: 28, y: 88, size: 13, delay: -7 },
]

const ATOMS = [
  { x: 8,  y: 12, r: 42, color: '#60a5fa', delay: 0,   dur: 18 },
  { x: 86, y: 18, r: 52, color: '#a78bfa', delay: -5,  dur: 22 },
  { x: 6,  y: 72, r: 35, color: '#34d399', delay: -10, dur: 16 },
  { x: 88, y: 68, r: 48, color: '#fbbf24', delay: -3,  dur: 20 },
  { x: 50, y: 90, r: 38, color: '#f472b6', delay: -8,  dur: 19 },
]

const AURORA = [
  { x: -5,  y: -10, w: 55,  h: 50,  color: '79,70,229',  opacity: 0.28, dur: 22, delay: 0,   anim: 'ab-blob1' },
  { x: 60,  y: -15, w: 60,  h: 55,  color: '6,182,212',  opacity: 0.22, dur: 28, delay: -8,  anim: 'ab-blob2' },
  { x: -10, y: 55,  w: 50,  h: 45,  color: '139,92,246', opacity: 0.24, dur: 25, delay: -4,  anim: 'ab-blob3' },
  { x: 65,  y: 50,  w: 55,  h: 48,  color: '13,148,136', opacity: 0.18, dur: 30, delay: -12, anim: 'ab-blob4' },
  { x: 30,  y: 30,  w: 45,  h: 42,  color: '245,158,11', opacity: 0.14, dur: 20, delay: -6,  anim: 'ab-blob5' },
]

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none"
      style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
        // Asosiy fon — to'q ko'k-indigo, QORA EMAS
        background: 'linear-gradient(145deg, #060c24 0%, #0b1648 25%, #07112e 55%, #0c0a38 80%, #070d26 100%)',
      }}
    >
      {/* ── Aurora bloblari ── */}
      {AURORA.map((a, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${a.x}%`, top: `${a.y}%`,
            width: `${a.w}vw`, height: `${a.h}vh`,
            background: `radial-gradient(ellipse, rgba(${a.color},${a.opacity}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: `${a.anim} ${a.dur}s ease-in-out ${a.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* ── Gradient overlay (chuqurlik) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.08) 0%, transparent 50%)',
      }} />

      {/* ── Yulduzlar ── */}
      {STARS.map((st, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${st.x}%`, top: `${st.y}%`,
            width: `${st.size}px`, height: `${st.size}px`,
            borderRadius: '50%',
            background: `rgba(255,255,255,${st.opacity})`,
            animation: `ab-star ${st.duration}s ${st.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── Suzuvchi zarrachalar ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`, bottom: '-5%',
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: `hsla(${p.hue}, 80%, 65%, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 80%, 65%, 0.5)`,
            animation: `ab-particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}

      {/* ── Atom strukturalari ── */}
      {ATOMS.map((atom, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${atom.x}%`, top: `${atom.y}%`,
            width: `${atom.r * 2.4}px`, height: `${atom.r * 2.4}px`,
            animation: `ab-atom-float ${atom.dur}s ${atom.delay}s ease-in-out infinite`,
            opacity: 0.22,
          }}
        >
          {/* Markaziy yadro */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: `${atom.r * 0.28}px`, height: `${atom.r * 0.28}px`,
            borderRadius: '50%',
            background: atom.color,
            boxShadow: `0 0 ${atom.r * 0.4}px ${atom.color}`,
          }} />
          {/* Orbital halqa 1 */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: `${atom.r * 2}px`, height: `${atom.r * 0.7}px`,
            border: `1.5px solid ${atom.color}`,
            borderRadius: '50%',
            transform: 'translate(-50%,-50%)',
            animation: `ab-orbit ${atom.dur * 0.6}s linear infinite`,
          }}>
            <div style={{
              position: 'absolute', top: '-3px', left: '50%',
              width: '6px', height: '6px', borderRadius: '50%',
              background: atom.color, transform: 'translateX(-50%)',
            }} />
          </div>
          {/* Orbital halqa 2 */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: `${atom.r * 2}px`, height: `${atom.r * 0.7}px`,
            border: `1.5px solid ${atom.color}`,
            borderRadius: '50%',
            transform: 'translate(-50%,-50%) rotate(60deg)',
            animation: `ab-orbit-rev ${atom.dur * 0.8}s linear infinite`,
          }}>
            <div style={{
              position: 'absolute', top: '-3px', right: '20%',
              width: '5px', height: '5px', borderRadius: '50%',
              background: atom.color, opacity: 0.8,
            }} />
          </div>
          {/* Orbital halqa 3 */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: `${atom.r * 2}px`, height: `${atom.r * 0.7}px`,
            border: `1.5px solid ${atom.color}`,
            borderRadius: '50%',
            transform: 'translate(-50%,-50%) rotate(-60deg)',
            animation: `ab-orbit ${atom.dur}s linear infinite`,
          }}>
            <div style={{
              position: 'absolute', bottom: '-3px', left: '25%',
              width: '5px', height: '5px', borderRadius: '50%',
              background: atom.color, opacity: 0.7,
            }} />
          </div>
        </div>
      ))}

      {/* ── Fizika formulalari (juda sust) ── */}
      {FORMULAS.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${f.x}%`, top: `${f.y}%`,
            fontSize: `${f.size}px`,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'rgba(180,200,255,0.09)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            animation: `ab-formula ${16 + i * 3}s ${f.delay}s ease-in-out infinite`,
          }}
        >
          {f.text}
        </div>
      ))}

      {/* ── SVG to'lqin chiziqlari ── */}
      <svg
        style={{ position: 'absolute', bottom: '8%', left: 0, width: '100%', opacity: 0.08 }}
        viewBox="0 0 1440 80" preserveAspectRatio="none"
      >
        <path
          d="M0,40 C180,10 360,70 540,40 C720,10 900,70 1080,40 C1260,10 1380,60 1440,40"
          fill="none" stroke="#60a5fa" strokeWidth="2"
          strokeDasharray="8 4"
          style={{ animation: 'ab-wave 6s linear infinite' }}
        />
        <path
          d="M0,55 C200,25 400,80 600,50 C800,20 1000,75 1200,50 C1350,30 1420,65 1440,55"
          fill="none" stroke="#a78bfa" strokeWidth="1.5"
          strokeDasharray="6 6"
          style={{ animation: 'ab-wave 9s linear infinite reverse' }}
        />
      </svg>

      {/* ── Pastki gradient ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, rgba(4,6,22,0.6) 0%, transparent 100%)',
      }} />
    </div>
  )
}
