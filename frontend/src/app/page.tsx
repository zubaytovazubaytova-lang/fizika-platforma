'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ─── Auth: token bo'lsa dashboard ga redirect ─────────────────── */
function useAuthRedirect() {
  const router = useRouter()
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fizika-auth') ?? sessionStorage.getItem('fizika-auth')
      const token = raw ? JSON.parse(raw)?.state?.accessToken : null
      if (token) router.replace('/dashboard')
    } catch { /* ignore */ }
  }, [router])
}

/* ─── Typewriter — bir marta yozib, ekranda qoladi ─────────────── */
function useTypewriterOnce(text: string, speed = 55, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, speed)
      return () => clearInterval(iv)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])
  return { displayed, done }
}


/* ─── AnimCounter ───────────────────────────────────────────────── */
function AnimCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      let cur = 0; const step = to / (2000 / 16)
      const iv = setInterval(() => {
        cur += step
        if (cur >= to) { setN(to); clearInterval(iv) }
        else setN(Math.floor(cur))
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>
}


/* ─── Atom SVG ──────────────────────────────────────────────────── */
function AtomSVG({ size = 100, label }: { size?: number; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <radialGradient id="nucGrad" cx="38%" cy="34%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <filter id="atomGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Ring 1 — 0° */}
      <g>
        <ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1.4" opacity="0.8" />
        <circle cx="94" cy="50" r="5" fill="#60a5fa" filter="url(#atomGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Ring 2 — 60° */}
      <g transform="rotate(60 50 50)">
        <ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#7c3aed" strokeWidth="1.4" opacity="0.8" />
        <circle cx="6" cy="50" r="4.5" fill="#a78bfa" filter="url(#atomGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3.1s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Ring 3 — 120° */}
      <g transform="rotate(120 50 50)">
        <ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#f59e0b" strokeWidth="1.4" opacity="0.8" />
        <circle cx="94" cy="50" r="4.5" fill="#fbbf24" filter="url(#atomGlow)">
          <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="2.7s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Nucleus */}
      <circle cx="50" cy="50" r="12" fill="url(#nucGrad)" filter="url(#atomGlow)" />
      {label && (
        <text x="50" y="54" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="system-ui,sans-serif">
          {label}
        </text>
      )}
    </svg>
  )
}

/* ─── CSS Pendulum ──────────────────────────────────────────────── */
function PendulumAnim() {
  return (
    <div style={{ position: 'relative', width: 160, height: 210, display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 8, left: '50%', width: 16, height: 16, borderRadius: '50%', background: '#475569', transform: 'translateX(-50%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 16, left: '50%', transformOrigin: '0 0', animation: 'pendulumSwing 2.4s ease-in-out infinite', marginLeft: -1 }}>
        <div style={{ width: 2, height: 130, background: 'linear-gradient(180deg,#475569,#7c3aed)' }} />
        <div style={{
          width: 44, height: 44, borderRadius: '50%', marginLeft: -21, marginTop: -2,
          background: 'radial-gradient(circle at 35% 32%, #93c5fd, #1d4ed8)',
          boxShadow: '0 0 24px rgba(96,165,250,0.9), 0 0 48px rgba(59,130,246,0.4)',
        }} />
      </div>
      {/* Shadow */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 6, borderRadius: '50%', background: 'rgba(96,165,250,0.2)', animation: 'pendulumShadow 2.4s ease-in-out infinite' }} />
    </div>
  )
}

/* ─── Chat Bubbles ──────────────────────────────────────────────── */
function ChatAnim() {
  const [step, setStep] = useState(0)
  useEffect(() => { const iv = setInterval(() => setStep(s => (s + 1) % 4), 2200); return () => clearInterval(iv) }, [])
  const msgs = [
    { role: 'u', t: "Nyuton qonuni nima?" },
    { role: 'a', t: "F = ma — kuch, massa va tezlanish." },
    { role: 'u', t: "Misol berasizmi?" },
    { role: 'a', t: "2 kg, 3 m/s² → F = 6 N ✓" },
  ]
  return (
    <div style={{ width: 270 }}>
      {msgs.slice(0, step + 1).map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'u' ? 'flex-end' : 'flex-start', marginBottom: 10, animation: 'chatIn 0.35s ease' }}>
          <div style={{
            maxWidth: '82%', padding: '9px 14px', fontSize: 13, lineHeight: 1.45,
            borderRadius: m.role === 'u' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: m.role === 'u' ? 'rgba(59,130,246,0.25)' : 'rgba(124,58,237,0.2)',
            border: `1px solid ${m.role === 'u' ? 'rgba(59,130,246,0.4)' : 'rgba(124,58,237,0.4)'}`,
            color: '#e2e8f0',
          }}>
            {m.t}
          </div>
        </div>
      ))}
      {step < 4 && (
        <div style={{ display: 'flex', gap: 4, paddingLeft: 4 }}>
          {[0, 150, 300].map(d => (
            <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: `typing 1s ${d}ms ease-in-out infinite` }} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Quiz Anim ─────────────────────────────────────────────────── */
function QuizAnim() {
  const [qi, setQi] = useState(0)
  useEffect(() => { const iv = setInterval(() => setQi(i => (i + 1) % 3), 2800); return () => clearInterval(iv) }, [])
  const qs = [
    { q: "F = ma da 'a' nima?", opts: ['Massa', 'Tezlanish', 'Tezlik'], ans: 1 },
    { q: "Yorug'lik tezligi?", opts: ['300 000 km/s', '150 000 km/s', '3 000 km/s'], ans: 0 },
    { q: "E = mc² — kim kashf etgan?", opts: ['Nyuton', 'Faradey', 'Einstein'], ans: 2 },
  ]
  const cur = qs[qi]
  return (
    <div style={{ width: 280, background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 20, padding: '24px 20px' }}>
      <div style={{ color: '#34d399', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Savol {qi + 1} / 3</div>
      <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 16, lineHeight: 1.5, minHeight: 42 }}>{cur.q}</div>
      {cur.opts.map((o, i) => (
        <div key={i} style={{
          padding: '8px 12px', borderRadius: 10, marginBottom: 7, fontSize: 13, cursor: 'default',
          background: i === cur.ans ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${i === cur.ans ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.07)'}`,
          color: i === cur.ans ? '#34d399' : '#94a3b8',
          transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${i === cur.ans ? '#34d399' : '#374151'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, color: '#34d399' }}>
            {i === cur.ans ? '✓' : ''}
          </span>
          {o}
        </div>
      ))}
    </div>
  )
}


/* ─── Badge ─────────────────────────────────────────────────────── */
function Badge({ text, color }: { text: string; color: string }) {
  return (
    <div className="lg-badge" style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3, color, marginBottom: 16, padding: '5px 14px', borderColor: `${color}50` }}>
      {text}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  LANDING PAGE  — horizontal slides                             */
/* ═══════════════════════════════════════════════════════════════ */
const TOTAL = 7
const LS_KEY = 'fizika-slide'

export default function LandingPage() {
  useAuthRedirect()
  const { displayed: typed, done: typeDone } = useTypewriterOnce('Fizikani yangicha his qiling')
  const [vis,   setVis]   = useState(false)
  const [slide, setSlide] = useState(0)
  const lock = useRef(false)

  useEffect(() => { setVis(true) }, [])

  /* ── Restore from localStorage ── */
  useEffect(() => {
    try {
      const n = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
      if (!isNaN(n) && n >= 0 && n < TOTAL) setSlide(n)
    } catch {}
  }, [])

  /* ── Persist to localStorage ── */
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, String(slide)) } catch {}
  }, [slide])

  /* ── Navigation ── */
  const go = useCallback((d: 1 | -1) => {
    if (lock.current) return
    lock.current = true
    setSlide(s => Math.max(0, Math.min(TOTAL - 1, s + d)))
    setTimeout(() => { lock.current = false }, 680)
  }, [])

  const goTo = useCallback((i: number) => {
    if (lock.current) return
    lock.current = true
    setSlide(Math.max(0, Math.min(TOTAL - 1, i)))
    setTimeout(() => { lock.current = false }, 680)
  }, [])

  /* ── Keyboard ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); go(1) }
      if (['ArrowLeft',  'ArrowUp'].includes(e.key))         { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go])

  /* ── Wheel ── */
  useEffect(() => {
    const h = (e: WheelEvent) => {
      e.preventDefault()
      go(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1)
    }
    window.addEventListener('wheel', h, { passive: false })
    return () => window.removeEventListener('wheel', h)
  }, [go])

  /* ── Touch ── */
  const tx = useRef(0); const ty = useRef(0)

  return (
    <>
      {/* ── Global CSS ── */}
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0c0c1e}
        @keyframes pendulumSwing{0%,100%{transform:rotate(-32deg)}50%{transform:rotate(32deg)}}
        @keyframes pendulumShadow{0%,100%{transform:translateX(-80%) scaleX(0.5);opacity:0.4}50%{transform:translateX(80%) scaleX(1.2);opacity:0.15}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(180deg)}}
        @keyframes glow{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.55;transform:scale(1.12)}}
        @keyframes ringCW{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ringCCW{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes pulsate{0%,100%{box-shadow:0 0 24px rgba(124,58,237,.6),0 0 48px rgba(109,40,217,.3)}50%{box-shadow:0 0 56px rgba(124,58,237,1),0 0 100px rgba(109,40,217,.6)}}
        @keyframes chatIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes typing{0%,80%,100%{transform:scale(1);opacity:.4}40%{transform:scale(1.4);opacity:1}}
        @keyframes zoomBg{0%,100%{transform:scale(1) translateX(0)}33%{transform:scale(1.06) translateX(-12px)}66%{transform:scale(1.09) translateX(12px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes scrollDot{0%{transform:translateY(0);opacity:1}80%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:0}}
        @keyframes chevron{0%,100%{opacity:0;transform:rotate(45deg) translate(-4px,-4px)}50%{opacity:1;transform:rotate(45deg) translate(0,0)}}
        /* ── Gradient text CSS classes (inline style conflict yo'qotish) ── */
        .gt-title{background-image:linear-gradient(135deg,#f1f5f9 10%,#c4b5fd 50%,#60a5fa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-gold{background-image:linear-gradient(135deg,#fde68a 0%,#f59e0b 40%,#fbbf24 70%,#fde68a 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;filter:drop-shadow(0 0 20px rgba(245,158,11,.5))}
        .gt-shior{background-image:linear-gradient(90deg,#f59e0b,#a78bfa,#60a5fa,#f59e0b);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite}
        .gt-scroll{background-image:linear-gradient(90deg,#f59e0b,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 8px rgba(245,158,11,.7))}
        .gt-nav{background-image:linear-gradient(90deg,#7c3aed,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-sec-blue{background-image:linear-gradient(90deg,#60a5fa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-sec-purple{background-image:linear-gradient(90deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-sec-gold{background-image:linear-gradient(90deg,#f59e0b,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-sec-green{background-image:linear-gradient(90deg,#34d399,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-sec-sci{background-image:linear-gradient(90deg,#a78bfa,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-cta{background-image:linear-gradient(135deg,white 20%,#a78bfa 60%,#60a5fa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-counter{-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-stats-blue{background-image:linear-gradient(135deg,#3b82f6,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-stats-purple{background-image:linear-gradient(135deg,#7c3aed,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-stats-gold{background-image:linear-gradient(135deg,#f59e0b,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-stats-green{background-image:linear-gradient(135deg,#34d399,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-c-gold{background-image:linear-gradient(135deg,#f59e0b,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-c-blue{background-image:linear-gradient(135deg,#60a5fa,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-c-green{background-image:linear-gradient(135deg,#34d399,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-c-purple{background-image:linear-gradient(135deg,#a78bfa,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gt-c-orange{background-image:linear-gradient(135deg,#f97316,white);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cursor-span{animation:blink 1s step-end infinite;color:#a78bfa;-webkit-text-fill-color:#a78bfa}
        .atom-hover:hover>svg{filter:drop-shadow(0 0 14px #f59e0b) drop-shadow(0 0 28px rgba(124,58,237,.7))}

        /* ════ LIQUID GLASS ════ */
        /* Base glass */
        .lg{
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border-radius:50px;
          transition:transform .22s ease,box-shadow .22s ease,filter .22s ease;
        }
        /* Tugmalar */
        .lg-btn{
          background:linear-gradient(160deg,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0.04) 100%);
          border:1px solid rgba(255,255,255,0.22);
          box-shadow:0 8px 32px rgba(0,0,0,0.45),inset 0 2px 0 rgba(255,255,255,0.28),inset 0 -2px 0 rgba(0,0,0,0.28),0 0 0 1px rgba(255,255,255,0.06);
          color:white;cursor:pointer;font-weight:700;
        }
        .lg-btn:hover{transform:translateY(-4px) scale(1.02);filter:brightness(1.18);box-shadow:0 16px 48px rgba(0,0,0,0.55),inset 0 2px 0 rgba(255,255,255,0.35),inset 0 -2px 0 rgba(0,0,0,0.3),0 0 32px rgba(124,58,237,.4)}
        .lg-btn:active{transform:translateY(-1px) scale(0.99)}
        /* Primary (binafsha-ko'k) */
        .lg-primary{
          background:linear-gradient(160deg,rgba(124,58,237,0.55) 0%,rgba(59,130,246,0.45) 100%);
          border:1px solid rgba(124,58,237,0.55);
          box-shadow:0 8px 36px rgba(124,58,237,0.4),inset 0 2px 0 rgba(167,139,250,0.4),inset 0 -2px 0 rgba(0,0,0,0.3);
        }
        .lg-primary:hover{box-shadow:0 16px 56px rgba(124,58,237,0.6),inset 0 2px 0 rgba(167,139,250,0.5),0 0 60px rgba(124,58,237,.5)!important}
        /* Secondary (shaffof) */
        .lg-secondary{
          background:linear-gradient(160deg,rgba(255,255,255,0.09) 0%,rgba(255,255,255,0.03) 100%);
          border:1px solid rgba(255,255,255,0.2);
          box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 2px 0 rgba(255,255,255,0.2),inset 0 -2px 0 rgba(0,0,0,0.2);
        }
        /* Kartochkalar */
        .lg-card{
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          background:linear-gradient(145deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.02) 100%);
          border:1px solid rgba(255,255,255,0.12);
          box-shadow:0 8px 32px rgba(0,0,0,0.35),inset 0 2px 0 rgba(255,255,255,0.15),inset 0 -1px 0 rgba(0,0,0,0.2);
          border-radius:20px;
          transition:transform .3s ease,box-shadow .3s ease;
        }
        .lg-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 24px 60px rgba(0,0,0,0.5),inset 0 2px 0 rgba(255,255,255,0.2)}
        /* Rangli kartochkalar */
        .lg-card-blue{background:linear-gradient(145deg,rgba(59,130,246,.22) 0%,rgba(96,165,250,.08) 100%);border:1px solid rgba(96,165,250,.35);box-shadow:0 8px 32px rgba(59,130,246,.2),inset 0 2px 0 rgba(96,165,250,.3),inset 0 -1px 0 rgba(0,0,0,.3)}
        .lg-card-purple{background:linear-gradient(145deg,rgba(124,58,237,.22) 0%,rgba(167,139,250,.08) 100%);border:1px solid rgba(124,58,237,.4);box-shadow:0 8px 32px rgba(124,58,237,.2),inset 0 2px 0 rgba(167,139,250,.3),inset 0 -1px 0 rgba(0,0,0,.3)}
        .lg-card-green{background:linear-gradient(145deg,rgba(52,211,153,.18) 0%,rgba(16,185,129,.06) 100%);border:1px solid rgba(52,211,153,.35);box-shadow:0 8px 32px rgba(52,211,153,.15),inset 0 2px 0 rgba(52,211,153,.25),inset 0 -1px 0 rgba(0,0,0,.3)}
        .lg-card-gold{background:linear-gradient(145deg,rgba(245,158,11,.2) 0%,rgba(251,191,36,.06) 100%);border:1px solid rgba(245,158,11,.35);box-shadow:0 8px 32px rgba(245,158,11,.18),inset 0 2px 0 rgba(251,191,36,.3),inset 0 -1px 0 rgba(0,0,0,.3)}
        .lg-card-red{background:linear-gradient(145deg,rgba(239,68,68,.18) 0%,rgba(248,113,113,.06) 100%);border:1px solid rgba(239,68,68,.35);box-shadow:0 8px 32px rgba(239,68,68,.15),inset 0 2px 0 rgba(248,113,113,.25)}
        .lg-card-orange{background:linear-gradient(145deg,rgba(249,115,22,.18) 0%,rgba(251,146,60,.06) 100%);border:1px solid rgba(249,115,22,.35);box-shadow:0 8px 32px rgba(249,115,22,.15),inset 0 2px 0 rgba(251,146,60,.25)}
        /* Statistika */
        .lg-stat{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:linear-gradient(145deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.02) 100%);border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 32px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.14),inset 0 -1px 0 rgba(0,0,0,.2);border-radius:24px;padding:32px 20px;text-align:center;transition:transform .3s,box-shadow .3s}
        .lg-stat:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.45),inset 0 2px 0 rgba(255,255,255,.18)}
        /* Nav glass */
        .lg-nav{backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);background:rgba(5,5,16,0.65);border-bottom:1px solid rgba(255,255,255,0.09);box-shadow:0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.08)}
        /* Badge glass */
        .lg-badge{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);box-shadow:inset 0 1px 0 rgba(255,255,255,0.2),0 4px 12px rgba(0,0,0,0.25);border-radius:20px}

        .card-hover{transition:transform .35s,box-shadow .35s}
        .card-hover:hover{transform:translateY(-10px) scale(1.03);box-shadow:0 24px 64px rgba(124,58,237,.3)!important}
        .btn-primary{transition:transform .2s,box-shadow .2s}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(124,58,237,.6)!important}
        @media(max-width:768px){
          .two-col{flex-direction:column!important;gap:40px!important}
          .two-col-rev{flex-direction:column!important;gap:40px!important}
          .hero-h1{font-size:clamp(34px,9vw,60px)!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="lg-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(124,58,237,0.22)', boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.06), inset 0 -1px 0 rgba(124,58,237,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 16px rgba(124,58,237,.55)' }}>⚛️</div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 19, letterSpacing: -0.5, fontFamily: "'Space Grotesk', sans-serif" }}>
            Fizika <span className="gt-nav">AI</span>
          </span>
        </div>
        {/* Login tugmalari */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
            Kirish
          </Link>
          <Link href="/register" style={{ textDecoration: 'none', color: 'white', fontSize: 14, fontWeight: 700, padding: '8px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 16px rgba(124,58,237,0.4)', transition: 'all 0.2s' }}>
            Ro&apos;yxat
          </Link>
          {/* Atom login icon */}
          <Link href="/login" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} className="atom-hover">
            <div style={{ cursor: 'pointer', position: 'relative' }}>
              <AtomSVG size={52} label="→" />
            </div>
          </Link>
        </div>
      </nav>

      {/* ── HORIZONTAL SLIDES ────────────────────────────────────── */}
      <div
        style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 10 }}
        onTouchStart={e => { tx.current = e.touches[0].clientX; ty.current = e.touches[0].clientY }}
        onTouchEnd={e => {
          const dx = tx.current - e.changedTouches[0].clientX
          const dy = ty.current - e.changedTouches[0].clientY
          if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 45) go(dx > 0 ? 1 : -1)
        }}
      >
        {/* Strip */}
        <div style={{
          display: 'flex', height: '100%',
          width: `${TOTAL * 100}vw`,
          transform: `translateX(calc(-${slide} * 100vw))`,
          transition: 'transform 0.65s cubic-bezier(0.77,0,0.18,1)',
          willChange: 'transform',
        }}>

          {/* ── SLIDE 0: Hero ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#0c0c1e 0%,#141230 45%,#1a1540 75%,#0e0c2a 100%)' }}>
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px 24px', maxWidth: 900, width: '100%' }}>
              <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(-20px)', transition: 'all 1s ease 0s', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg,transparent,#f59e0b)' }} />
                  <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7 }}>Xush kelibsiz</span>
                  <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg,#f59e0b,transparent)' }} />
                </div>
                <div className="gt-gold" style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.1 }}>
                  Assalomu Alaykum!&nbsp;👋
                </div>
              </div>
              <h1 className="hero-h1 gt-title" style={{ fontSize: 'clamp(40px,6.5vw,76px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 24, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(32px)', transition: 'all .9s ease .2s', minHeight: '1.2em' }}>
                {typed}<span className="cursor-span" style={{ visibility: typeDone ? 'hidden' : 'visible' }}>|</span>
              </h1>
              <p className="gt-shior" style={{ fontSize: 'clamp(15px,2vw,20px)', marginBottom: 40, fontStyle: 'italic', opacity: typeDone ? 1 : 0, transform: typeDone ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 1s ease, transform 1s ease' }}>
                &quot;Har bir savol — yangi kashfiyotning boshlanishi&quot;
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, animation: 'float 5s ease-in-out infinite', opacity: vis ? 1 : 0, transition: 'opacity .9s ease .5s' }}>
                <AtomSVG size={150} />
              </div>
              {/* Right-arrow indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, animation: 'float 2.2s ease-in-out infinite' }}>
                <span className="gt-scroll" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase' }}>Oldinga suring</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRight: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', transform: 'rotate(-45deg)', boxShadow: '2px 2px 6px rgba(245,158,11,0.5)', animation: `chevron 1.4s ${i * 180}ms ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SLIDE 1: 3D Simulatsiyalar ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(180deg,#0d0b24 0%,#13112e 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 40px' }}>
              <div className="two-col" style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(59,130,246,.18),transparent)', animation: 'glow 3.5s ease-in-out infinite' }} />
                    <PendulumAnim />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Badge text="3D SIMULATSIYALAR" color="#3b82f6" />
                  <h2 style={{ fontSize: 'clamp(26px,3.8vw,46px)', fontWeight: 900, color: 'white', lineHeight: 1.18, marginBottom: 18 }}>🔬 3D Interaktiv<br /><span className="gt-sec-blue">Simulatsiyalar</span></h2>
                  <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>100+ fizika hodisasini real vaqtda 3D muhitda kuzating, o&apos;zgartiring va tushunib oling.</p>
                  <div style={{ display: 'flex', gap: 36 }}>
                    {[{ n: 100, s: '+', l: 'Simulatsiya', c: '#f59e0b' }, { n: 5, s: ' soha', l: "Bo'lim", c: '#60a5fa' }].map(x => (
                      <div key={x.l} style={{ textAlign: 'center' }}>
                        <div className="gt-counter" style={{ fontSize: 38, fontWeight: 900, backgroundImage: `linear-gradient(135deg,${x.c},white)` }}><AnimCounter to={x.n} suffix={x.s} /></div>
                        <div style={{ color: '#64748b', fontSize: 12, marginTop: 3 }}>{x.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SLIDE 2: AI Tutor ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(180deg,#13112e 0%,#1c1645 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 40px' }}>
              <div className="two-col-rev" style={{ display: 'flex', alignItems: 'center', gap: 72, flexDirection: 'row-reverse' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.22)', borderRadius: 22, padding: '28px 24px', boxShadow: '0 0 50px rgba(124,58,237,.14)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(124,58,237,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                      <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>AI Fizika O&apos;qituvchisi</span>
                    </div>
                    <ChatAnim />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Badge text="AI O'QITUVCHI" color="#7c3aed" />
                  <h2 style={{ fontSize: 'clamp(26px,3.8vw,46px)', fontWeight: 900, color: 'white', lineHeight: 1.18, marginBottom: 18 }}>🤖 Sun&apos;iy intellekt<br /><span className="gt-sec-purple">o&apos;qituvchingiz</span></h2>
                  <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>Claude AI yordamida 24/7 savollaringizga javob oling. Har qanday fizika masalasini bosqichma-bosqich tushuntiramiz.</p>
                  {['⚡ Real vaqtda javob', '📐 Formulalar bilan tushuntirish', "🌍 O'zbek tilida", '🔢 Masala yechimlari'].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#cbd5e1', fontSize: 15 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SLIDE 3: Kurslar ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(145deg,#0e0c25 0%,#151238 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 40px' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Badge text="KURSLAR" color="#f59e0b" />
                <h2 style={{ fontSize: 'clamp(26px,3.8vw,46px)', fontWeight: 900, color: 'white' }}>📚 <span className="gt-sec-gold">500+ dars va mashqlar</span></h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 18 }}>
                {[
                  { icon: '⚙️', name: 'Mexanika', n: 120, c: '#3b82f6', p: 88 },
                  { icon: '⚡', name: 'Elektr va Magnit', n: 95, c: '#7c3aed', p: 72 },
                  { icon: '🌊', name: "To'lqin va Optika", n: 80, c: '#f59e0b', p: 60 },
                  { icon: '🔥', name: 'Termodinamika', n: 75, c: '#ef4444', p: 55 },
                  { icon: '⚛️', name: 'Kvant Fizika', n: 65, c: '#34d399', p: 45 },
                  { icon: '🌌', name: 'Nisbiylik', n: 40, c: '#f97316', p: 28 },
                ].map(x => (
                  <div key={x.name} className="lg-card" style={{ borderColor: 'rgba(255,255,255,0.15)', padding: '20px 16px', background: 'rgba(10,15,40,0.55)' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{x.icon}</div>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: 14, marginBottom: 4 }}>{x.name}</div>
                    <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 12 }}>{x.n} ta dars</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 4, width: `${x.p}%`, background: `linear-gradient(90deg,${x.c},${x.c}aa)`, boxShadow: `0 0 8px ${x.c}80` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SLIDE 4: Testlar ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(180deg,#10102a 0%,#0e0c25 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 40px' }}>
              <div className="two-col" style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><QuizAnim /></div>
                <div style={{ flex: 1 }}>
                  <Badge text="TESTLAR" color="#34d399" />
                  <h2 style={{ fontSize: 'clamp(26px,3.8vw,46px)', fontWeight: 900, color: 'white', lineHeight: 1.18, marginBottom: 18 }}>✅ Bilimingizni<br /><span className="gt-sec-green">sinab ko&apos;ring</span></h2>
                  <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>1000+ test savoli bilan bilimingizni baholang. Zaif tomonlarni aniqlab, maqsadli o&apos;qing.</p>
                  <div style={{ display: 'flex', gap: 32 }}>
                    {[{ n: 1000, s: '+', l: 'Savol', c: '#34d399' }, { n: 98, s: '%', l: "To'g'ri javob", c: '#60a5fa' }].map(x => (
                      <div key={x.l}>
                        <div className="gt-counter" style={{ fontSize: 36, fontWeight: 900, backgroundImage: `linear-gradient(135deg,${x.c},white)` }}><AnimCounter to={x.n} suffix={x.s} /></div>
                        <div style={{ color: '#64748b', fontSize: 12, marginTop: 3 }}>{x.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SLIDE 5: Kashfiyotlar ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(180deg,#13112e 0%,#1e1848 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 40px' }}>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <Badge text="KASHFIYOTLAR" color="#a78bfa" />
                <h2 style={{ fontSize: 'clamp(26px,3.8vw,46px)', fontWeight: 900, color: 'white' }}>🔭 Fizika tarixi va <span className="gt-sec-sci">buyuk olimlar</span></h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { name: 'Galiley', y: '1564–1642', e: '🔭', c: '#f59e0b', f: 'Teleskop, erkin tushish' },
                  { name: 'Nyuton',  y: '1643–1727', e: '🍎', c: '#3b82f6', f: 'Tortishish, F=ma' },
                  { name: 'Einstein',y: '1879–1955', e: '⚛️', c: '#7c3aed', f: 'E=mc², nisbiylik' },
                  { name: 'Faradey', y: '1791–1867', e: '⚡', c: '#34d399', f: 'Elektromagnit induksiya' },
                  { name: 'Kyuri',   y: '1867–1934', e: '☢️', c: '#f97316', f: 'Radioaktivlik' },
                ].map(s => (
                  <div key={s.name} className="lg-card" style={{ textAlign: 'center', padding: '28px 20px', borderRadius: 22, borderColor: `${s.c}35`, width: 165, background: `linear-gradient(145deg,${s.c}18 0%,${s.c}06 100%)` }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 14px', background: `radial-gradient(circle,${s.c}30,${s.c}08)`, border: `2px solid ${s.c}50`, boxShadow: `0 0 16px ${s.c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, animation: 'floatSlow 6s ease-in-out infinite' }}>{s.e}</div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: 15, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>{s.y}</div>
                    <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.45 }}>{s.f}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SLIDE 6: Statistika + CTA ── */}
          <div style={{ width: '100vw', flexShrink: 0, height: '100%', overflowY: 'auto', background: 'linear-gradient(180deg,#0c0c1e 0%,#0d0535 100%)', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
              <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 900, color: 'white', marginBottom: 36 }}>Raqamlarda platforma</h2>
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginBottom: 56 }}>
                {[
                  { n: 10000, s: '+', l: "O'quvchi",    e: '👥', c: '#3b82f6' },
                  { n: 500,   s: '+', l: 'Dars',         e: '📚', c: '#7c3aed' },
                  { n: 100,   s: '+', l: 'Simulatsiya',  e: '🔬', c: '#f59e0b' },
                  { n: 98,    s: '%', l: 'Muvaffaqiyat', e: '✅', c: '#34d399' },
                ].map(x => (
                  <div key={x.l} className="lg-stat" style={{ borderColor: `${x.c}30`, background: `linear-gradient(145deg,${x.c}14 0%,${x.c}04 100%)`, boxShadow: `0 8px 32px ${x.c}20,inset 0 2px 0 ${x.c}30` }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{x.e}</div>
                    <div className="gt-counter" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, backgroundImage: `linear-gradient(135deg,${x.c},white)`, lineHeight: 1 }}><AnimCounter to={x.n} suffix={x.s} /></div>
                    <div style={{ color: '#64748b', fontWeight: 700, fontSize: 13, marginTop: 6 }}>{x.l}</div>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}><AtomSVG size={110} /></div>
                <h2 style={{ fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 900, marginBottom: 14, lineHeight: 1.1 }}>Hoziroq boshlang!</h2>
                <p style={{ color: '#64748b', fontSize: 17, marginBottom: 28, lineHeight: 1.6 }}>Fizika olamiga yangicha ko&apos;z bilan qarang — minglab o&apos;quvchilar allaqachon boshlagan</p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                  <Link href="/register" style={{ textDecoration: 'none' }}>
                    <button className="lg lg-btn lg-primary" style={{ padding: '16px 48px', fontSize: 18, fontWeight: 900, border: 'none', animation: 'pulsate 3.5s ease-in-out infinite' }}>🚀 Bepul ro&apos;yxatdan o&apos;ting</button>
                  </Link>
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <button className="lg lg-btn lg-secondary" style={{ padding: '16px 48px', fontSize: 18, fontWeight: 800 }}>Kirish</button>
                  </Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                  {["✓ Bepul ro'yxatdan o'tish", '✓ Kredit karta talab qilinmaydi', '✓ Istalgan vaqt bekor qilish'].map(t => (
                    <span key={t} style={{ color: '#475569', fontSize: 13 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>{/* /strip */}
      </div>{/* /slide-container */}

      {/* ── Nav dots ── */}
      <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 300, alignItems: 'center', padding: '8px 16px', borderRadius: 30, background: 'rgba(6,2,26,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(124,58,237,0.2)' }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: slide === i ? 28 : 7, height: 7, borderRadius: 4,
            background: slide === i ? 'linear-gradient(90deg,#a78bfa,#7c3aed)' : 'rgba(255,255,255,0.18)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.3s ease', outline: 'none',
            boxShadow: slide === i ? '0 0 10px rgba(124,58,237,0.6)' : 'none',
          }} />
        ))}
      </div>

      {/* ── Prev arrow ── */}
      {slide > 0 && (
        <button onClick={() => go(-1)} style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(6,2,26,0.75)', border: '1px solid rgba(124,58,237,0.3)', color: 'rgba(167,139,250,0.9)', fontSize: 22, cursor: 'pointer', zIndex: 300, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}>‹</button>
      )}

      {/* ── Next arrow ── */}
      {slide < TOTAL - 1 && (
        <button onClick={() => go(1)} style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(6,2,26,0.75)', border: '1px solid rgba(124,58,237,0.3)', color: 'rgba(167,139,250,0.9)', fontSize: 22, cursor: 'pointer', zIndex: 300, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}>›</button>
      )}
    </>
  )
}
