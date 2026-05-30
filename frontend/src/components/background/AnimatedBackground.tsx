'use client'
import { useState, useEffect } from 'react'

function s(n: number, range: number, offset = 0): number {
  return (((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) * 0.5) * range + offset
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: s(i, 100), y: s(i + 80, 100),
  size: s(i + 160, 2.4, 0.5),
  delay: s(i + 240, 6),
  duration: s(i + 320, 3, 2),
  opacity: s(i + 400, 0.6, 0.1),
}))

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: s(i, 96, 2),
  size: s(i + 100, 4, 2),
  delay: s(i + 200, 12),
  duration: s(i + 300, 14, 10),
  hue: [260, 280, 250, 290, 270][i % 5],
  opacity: s(i + 400, 0.4, 0.15),
}))

const FORMULAS = [
  { text: 'E = mc²',     x: 7,  y: 20, size: 17, delay: 0   },
  { text: 'F = ma',      x: 80, y: 11, size: 14, delay: -4  },
  { text: 'λ = v/f',     x: 55, y: 70, size: 13, delay: -8  },
  { text: 'ΔE = hf',     x: 16, y: 60, size: 15, delay: -2  },
  { text: 'P = mv',      x: 89, y: 46, size: 12, delay: -6  },
  { text: 'W = Fd',      x: 40, y: 17, size: 13, delay: -10 },
  { text: '∇×B = μ₀J',  x: 68, y: 83, size: 11, delay: -3  },
  { text: 'v₀ + at',     x: 26, y: 86, size: 12, delay: -7  },
]

const AURORA = [
  { x: -5,  y: -12, w: 55, h: 50, color: '124,58,237',  opacity: 0.22, dur: 22, delay: 0,   anim: 'ab-blob1' },
  { x: 58,  y: -16, w: 60, h: 55, color: '109,40,217',  opacity: 0.18, dur: 28, delay: -8,  anim: 'ab-blob2' },
  { x: -10, y: 52,  w: 52, h: 48, color: '139,92,246',  opacity: 0.20, dur: 25, delay: -4,  anim: 'ab-blob3' },
  { x: 63,  y: 48,  w: 54, h: 50, color: '79,70,229',   opacity: 0.14, dur: 30, delay: -12, anim: 'ab-blob4' },
  { x: 30,  y: 28,  w: 46, h: 44, color: '167,139,250', opacity: 0.10, dur: 20, delay: -6,  anim: 'ab-blob5' },
]

const ATOMS = [
  { x: 7,  y: 10, r: 44, color: '#7c3aed', delay: 0,   dur: 18 },
  { x: 88, y: 16, r: 54, color: '#a855f7', delay: -5,  dur: 22 },
  { x: 5,  y: 70, r: 38, color: '#8b5cf6', delay: -10, dur: 16 },
  { x: 87, y: 66, r: 50, color: '#6d28d9', delay: -3,  dur: 20 },
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
        background: 'linear-gradient(145deg, #0c0c1e 0%, #14122e 25%, #0e0d26 55%, #16133a 80%, #0c0c1e 100%)',
      }}
    >
      {/* ── Aurora bloblari ── */}
      {AURORA.map((a, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${a.x}%`, top: `${a.y}%`,
          width: `${a.w}vw`, height: `${a.h}vh`,
          background: `radial-gradient(ellipse, rgba(${a.color},${a.opacity}) 0%, transparent 70%)`,
          filter: 'blur(65px)',
          animation: `${a.anim} ${a.dur}s ease-in-out ${a.delay}s infinite`,
          willChange: 'transform',
        }} />
      ))}

      {/* ── Gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(109,40,217,0.07) 0%, transparent 50%)',
      }} />

      {/* ── Nozik grid ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
      }} />

      {/* ── Yulduzlar ── */}
      {STARS.map((st, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${st.x}%`, top: `${st.y}%`,
          width: `${st.size}px`, height: `${st.size}px`,
          borderRadius: '50%',
          background: `rgba(255,255,255,${st.opacity})`,
          animation: `ab-star ${st.duration}s ${st.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* ── Suzuvchi zarrachalar ── */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`, bottom: '-5%',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          background: `hsla(${p.hue}, 75%, 65%, ${p.opacity})`,
          boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 75%, 65%, 0.45)`,
          animation: `ab-particle ${p.duration}s ${p.delay}s linear infinite`,
        }} />
      ))}

      {/* ── Atom strukturalari ── */}
      {ATOMS.map((atom, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${atom.x}%`, top: `${atom.y}%`,
          width: `${atom.r * 2.4}px`, height: `${atom.r * 2.4}px`,
          animation: `ab-atom-float ${atom.dur}s ${atom.delay}s ease-in-out infinite`,
          opacity: 0.18,
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: `${atom.r * 0.28}px`, height: `${atom.r * 0.28}px`,
            borderRadius: '50%', background: atom.color,
            boxShadow: `0 0 ${atom.r * 0.4}px ${atom.color}`,
          }} />
          {[0, 60, -60].map((deg, j) => (
            <div key={j} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: `${atom.r * 2}px`, height: `${atom.r * 0.7}px`,
              border: `1.5px solid ${atom.color}`,
              borderRadius: '50%',
              transform: `translate(-50%,-50%) rotate(${deg}deg)`,
              animation: `${j % 2 === 0 ? 'ab-orbit' : 'ab-orbit-rev'} ${atom.dur * (0.6 + j * 0.2)}s linear infinite`,
            }}>
              <div style={{
                position: 'absolute', top: '-3px', left: '50%',
                width: '5px', height: '5px', borderRadius: '50%',
                background: atom.color, transform: 'translateX(-50%)',
              }} />
            </div>
          ))}
        </div>
      ))}

      {/* ── Formulalar ── */}
      {FORMULAS.map((f, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${f.x}%`, top: `${f.y}%`,
          fontSize: `${f.size}px`,
          fontFamily: 'monospace', fontWeight: 700,
          color: 'rgba(167,139,250,0.08)',
          whiteSpace: 'nowrap', userSelect: 'none',
          animation: `ab-formula ${16 + i * 3}s ${f.delay}s ease-in-out infinite`,
        }}>{f.text}</div>
      ))}

      {/* ── SVG to'lqin ── */}
      <svg style={{ position:'absolute', bottom:'8%', left:0, width:'100%', opacity:0.07 }}
        viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C180,10 360,70 540,40 C720,10 900,70 1080,40 C1260,10 1380,60 1440,40"
          fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="8 4"
          style={{ animation:'ab-wave 6s linear infinite' }} />
        <path d="M0,55 C200,25 400,80 600,50 C800,20 1000,75 1200,50 C1350,30 1420,65 1440,55"
          fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="6 6"
          style={{ animation:'ab-wave 9s linear infinite reverse' }} />
      </svg>

      {/* ── Pastki gradient ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: 'linear-gradient(to top, rgba(12,12,30,0.55) 0%, transparent 100%)',
      }} />
    </div>
  )
}
