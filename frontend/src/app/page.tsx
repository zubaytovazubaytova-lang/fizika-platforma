'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  BookOpen, Zap, Bot, Trophy, ChevronRight,
  Play, Star, Users, CheckCircle, Smartphone,
} from 'lucide-react'

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0)
  const elRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = elRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0; const step = target / (duration / 16)
      const t = setInterval(() => {
        start += step
        if (start >= target) { setVal(target); clearInterval(t) }
        else setVal(Math.floor(start))
      }, 16)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return { val, elRef }
}

/* ── Shimmer button ── */
function ShimmerBtn({ children, href, className = '', onClick, style }: {
  children: React.ReactNode; href?: string; className?: string; onClick?: () => void; style?: React.CSSProperties
}) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    const rpl = document.createElement('span')
    Object.assign(rpl.style, {
      position: 'absolute', borderRadius: '50%',
      width: '120px', height: '120px',
      left: `${e.clientX - r.left - 60}px`, top: `${e.clientY - r.top - 60}px`,
      background: 'rgba(255,255,255,0.25)', transform: 'scale(0)',
      animation: 'ripple 0.55s ease-out forwards', pointerEvents: 'none',
    })
    btn.style.position = 'relative'; btn.style.overflow = 'hidden'
    btn.appendChild(rpl); setTimeout(() => rpl.remove(), 600)
    onClick?.()
  }
  const cls = `relative overflow-hidden inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 ${className}`
  if (href) return (
    <Link href={href} className={cls} style={style} onClick={handleClick as never}>{children}</Link>
  )
  return <button className={cls} style={style} onClick={handleClick}>{children}</button>
}

/* ── Grade card ── */
const GRADES = [
  { grade: '7-SINF',  subject: 'Mexanika',         desc: 'Harakat va kuchlar',     icon: '🧲', lessons: 24, progress: 45,  color: '#FF6B6B', id: 1 },
  { grade: '8-SINF',  subject: 'Termodinamika',    desc: 'Issiqlik va energiya',   icon: '🌡️', lessons: 18, progress: 20,  color: '#4ECDC4', id: 2 },
  { grade: '9-SINF',  subject: 'Elektromagnitizm', desc: 'Elektr va magnit',       icon: '⚡', lessons: 30, progress: 0,   color: '#45B7D1', id: 3 },
  { grade: '10-SINF', subject: 'Optika',           desc: "Yorug'lik va to'lqin",   icon: '🔭', lessons: 22, progress: 0,   color: '#96CEB4', id: 4 },
  { grade: '11-SINF', subject: 'Zamonaviy fizika', desc: 'Yadro va kvant',         icon: '⚛️', lessons: 28, progress: 0,   color: '#DDA0DD', id: 5 },
]

function GradeCard({ g, delay }: { g: typeof GRADES[0]; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="slide-up glass rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col gap-3"
      style={{
        animationDelay: `${delay}ms`,
        border: hov ? `1px solid ${g.color}55` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 30px ${g.color}22, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
        transform: hov ? 'translateY(-6px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className="text-xs font-bold tracking-widest" style={{ color: g.color }}>{g.grade}</span>
      <div className="text-3xl">{g.icon}</div>
      <div>
        <h3 className="font-bold text-white text-lg">{g.subject}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{g.desc} · {g.lessons} dars</p>
      </div>
      {g.progress > 0 ? (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{g.progress}% yakunlangan</span>
          </div>
          <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full fill-bar"
              style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }}
            />
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-500">Boshlanmagan</span>
      )}
    </div>
  )
}

/* ── Features ── */
const FEATURES = [
  { icon: BookOpen, title: 'Interaktiv darslar',   desc: '3D modellar va animatsiyalar bilan o\'rganing', color: '#00D4FF', bg: 'rgba(0,212,255,0.08)'    },
  { icon: Zap,      title: 'Aqlli testlar',         desc: 'Sizning bilimingizni moslashuvchan baholaydi', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)'  },
  { icon: Bot,      title: 'AI yordamchi',          desc: 'Har qanday savolga darhol javob oling',        color: '#FFB347', bg: 'rgba(255,179,71,0.08)'   },
  { icon: Trophy,   title: 'Yutuq va sertifikatlar',desc: 'Har bir bosqichni yakunlab, sertifikat oling', color: '#34D399', bg: 'rgba(52,211,153,0.08)'   },
]

/* ── AI Chat preview messages ── */
const CHAT = [
  { from: 'ai',   text: 'Salom! Men FizikaAI yordamchisiman. Fizika bo\'yicha qanday savolingiz bor? 🤔' },
  { from: 'user', text: 'Nyutonning ikkinchi qonunini tushuntira olasizmi?' },
  { from: 'ai',   text: 'Albatta! Nyutonning 2-qonuni: F = ma\n\nBu qonun aytadiki — jismga ta\'sir etuvchi kuch uning massasi va tezlanishi ko\'paytmasiga teng.' },
  { from: 'user', text: 'Rasm bilan ko\'rsatib bera olasizmi?' },
  { from: 'ai',   text: 'Albatta! Animatsiyali misolni ochmoqchiman... 🎯' },
]

/* ── Stars background (CSS) ── */
function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Stat item ── */
function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { val, elRef } = useCounter(target)
  return (
    <div ref={elRef} className="text-center">
      <div className="text-4xl font-black grad-cyan-purple">
        {val.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background image + aurora */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a2e] to-[#050510]">
          <img
            src="/hero-beruniy.png" alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.55) saturate(1.1)' }}
          />
          <div className="aurora-bg absolute inset-0 opacity-50" />
          <Stars />
          {/* Qorong'i overlay — matn o'qilishi uchun */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 pt-32">
          <div className="max-w-2xl slide-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              O'zbekiston №1 fizika platformasi
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight text-white mb-6">
              Fizikani{' '}
              <span className="grad-cyan-purple">yangicha</span>
              <br />o&apos;rgan, kashf et!
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              AI yordamchi, 3D animatsiyalar, interaktiv testlar — hammasi bir joyda.
              7-sinfdan kvant fizikasigacha.
            </p>
            <div className="flex flex-wrap gap-3">
              <ShimmerBtn
                href="/courses"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-base px-8 py-3.5"
                style={{ boxShadow: '0 0 30px rgba(0,212,255,0.4)' } as React.CSSProperties}
              >
                Bepul boshlash <ChevronRight className="h-4 w-4" />
              </ShimmerBtn>
              <ShimmerBtn
                href="/simulations"
                className="glass border border-white/10 text-base px-8 py-3.5"
              >
                <Play className="h-4 w-4 text-cyan-400" /> Demo ko&apos;rish
              </ShimmerBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRADE SELECTION ── */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Sinflar bo&apos;yicha</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-2">Sinf va mavzuingizni tanlang</h2>
          <p className="text-gray-400 mb-10">Har bir sinf uchun maxsus tayyorlangan darslar, animatsiyalar va interaktiv testlar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {GRADES.map((g, i) => <GradeCard key={g.id} g={g} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-10 neon-border-cyan">
          <div className="grid grid-cols-3 gap-8 divide-x divide-gray-800">
            <StatItem target={10000} suffix="+" label="foydalanuvchi" />
            <StatItem target={500}   suffix="+" label="darslar" />
            <StatItem target={98}    suffix="%" label="muvaffaqiyat" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Nima uchun FizikaAI?</h2>
          <p className="text-gray-400 text-center mb-12">Zamonaviy texnologiyalar bilan fizikani o&apos;rganish</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title}
                className={`slide-up glass rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                style={{ animationDelay: `${i * 100}ms`, border: `1px solid ${color}22` }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div className="slide-up">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">AI Yordamchi</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Sun&apos;iy intellekt —<br />
              <span className="grad-cyan-purple">shaxsiy o&apos;qituvchingiz</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Har qanday fizika savolingizga 24/7 javob oling. AI yordamchi sizning o&apos;qish uslubingizga moslashadi.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Har qanday mavzu bo\'yicha izoh so\'rang',
                'Masalalarni bosqichma-bosqich yeching',
                'Formula va kontsepsiyalarni tushunib oling',
                'Shaxsiy o\'quv rejasi tuzing',
                'O\'zbek va rus tillarida muloqot',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 flex-wrap">
              {['GPT-4 asosida', '24/7 faol', "O'zbek tilida"].map((b) => (
                <span key={b} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">{b}</span>
              ))}
            </div>
          </div>

          {/* Right: chat preview */}
          <div className="slide-up-d2">
            <div className="glass rounded-2xl p-4 neon-border-purple">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-lg">🤖</div>
                <div>
                  <p className="font-semibold text-white text-sm">FizikaAI Yordamchi</p>
                  <p className="text-xs text-gray-400">Sun&apos;iy intellekt asosida</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Faol
                </span>
              </div>
              {/* Messages */}
              <div className="space-y-3 max-h-64 overflow-hidden">
                {CHAT.map((m, i) => (
                  <div key={i} className={`bubble-in flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ animationDelay: `${i * 150}ms` }}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      m.from === 'user'
                        ? 'bg-blue-600/80 text-white rounded-br-sm'
                        : 'glass-blue text-gray-200 rounded-bl-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="mt-4 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-2.5 text-sm text-gray-400 neon-input"
                  placeholder="Savolingizni yozing..."
                  readOnly
                />
                <ShimmerBtn className="bg-gradient-to-r from-cyan-500 to-blue-600 !px-4 !py-2.5 text-sm">
                  ↑ Yuborish
                </ShimmerBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE APP ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="slide-up">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Mobil ilova</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Mobil ilovamiz bilan<br />har doim birga bo&apos;ling!
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "Darslarni istalgan joyda o'rganing",
                "O'zgarishlar va natijalarni kuzating",
                "AI yordamchi bilan savollar javob oling",
                "Offline rejimda ham foydalaning",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Google Play', icon: '▶', sub: 'YUKLAB OLISH' },
                { label: 'App Store',   icon: '🍎', sub: 'YUKLAB OLISH' },
              ].map((s) => (
                <button key={s.label}
                  className="flex items-center gap-3 glass rounded-xl px-5 py-3 border border-gray-700 hover:border-gray-500 transition-colors">
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">{s.sub}</p>
                    <p className="font-semibold text-white text-sm">{s.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center slide-up-d2">
            <div className="relative w-64 rounded-[2.5rem] glass border border-gray-700 p-3 shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(0,212,255,0.10)' }}>
              <div className="rounded-[2rem] bg-[#080820] overflow-hidden">
                {/* Status bar */}
                <div className="flex justify-between px-5 py-3 text-xs text-gray-400">
                  <span>FizikaAI</span>
                  <Smartphone className="h-3 w-3" />
                </div>
                {/* Content */}
                <div className="px-4 pb-5 space-y-3">
                  <p className="font-bold text-white text-sm">Salom, O&apos;quvchi! 👋</p>
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-cyan-400 font-bold mb-1">⚡ Davom etish</p>
                    <p className="text-white text-xs font-semibold">Nyutonning 1-qonuni</p>
                    <div className="mt-2 h-1 rounded-full bg-gray-700">
                      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">60% yakunlangan</p>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-green-400 font-bold mb-1">🏆 Test natijasi</p>
                    <p className="text-2xl font-black text-green-400 text-center">A&apos;lo!</p>
                    <p className="text-xl font-black text-green-400 text-center">90%</p>
                    <p className="text-xs text-gray-400 text-center mt-1">Kinematika testi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + desc */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 ro
                unded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">⚛️</div>
                <span className="font-black text-white text-lg">Fizika <span className="text-cyan-400">AI</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Fizikani o&apos;rganish uchun eng yaxshi platforma. Bilim ol, kashf et va kelajakka qadam qo&apos;y!
              </p>
              <div className="flex gap-2 mt-4">
                {['→', '▶', '📷', '💬'].map((ic, i) => (
                  <button key={i} className="h-8 w-8 glass rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-gray-600 border border-gray-800 transition-colors">
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="font-bold text-white mb-4">Navigatsiya</h4>
              <ul className="space-y-2">
                {['Bosh sahifa','Kurslar','Testlar','AI Yordamchi','Biz haqimizda'].map((l) => (
                  <li key={l}><Link href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Yordam */}
            <div>
              <h4 className="font-bold text-white mb-4">Yordam</h4>
              <ul className="space-y-2">
                {['FAQ','Qo\'llanma','Aloqa','Maxfiylik siyosati','Foydalanish shartlari'].map((l) => (
                  <li key={l}><Link href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Aloqa + newsletter */}
            <div>
              <h4 className="font-bold text-white mb-4">Aloqa</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-400"><span>📞</span> +998 90 123 45 67</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><span>✉</span> info@fizikaai.uz</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><span>📍</span> Toshkent, O&apos;zbekiston</li>
              </ul>
              <p className="text-xs font-bold text-white mb-2">Yangiliklardan xabardor bo&apos;ling</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-white placeholder-gray-500 neon-input"
                  placeholder="Email manzilingiz..."
                />
                <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-white">
                  Obuna
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">© 2024 FizikaAI. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-3">
              {['→','▶','📷','💬'].map((ic, i) => (
                <button key={i} className="h-7 w-7 glass rounded-md flex items-center justify-center text-xs text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 transition-colors">{ic}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
