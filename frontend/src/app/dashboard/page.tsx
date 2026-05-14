'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import {
  Home, BookOpen, Zap, Bot, Trophy, Heart,
  Settings, LogOut, Star, TrendingUp, Clock,
} from 'lucide-react'
import clsx from 'clsx'

/* ── Counter hook ── */
function useCounter(target: number, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      let cur = 0; const step = target / 60
      const t = setInterval(() => {
        cur += step
        if (cur >= target) { setVal(target); clearInterval(t) }
        else setVal(Math.floor(cur))
      }, 16)
      return () => clearInterval(t)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, delay])
  return val
}

/* ── Sidebar nav items ── */
const NAV = [
  { icon: Home,     label: 'Bosh sahifa', href: '/dashboard', active: true  },
  { icon: BookOpen, label: 'Kurslar',     href: '/courses',  active: false  },
  { icon: Zap,      label: 'Testlar',     href: '/tests',    active: false  },
  { icon: Bot,      label: 'AI Yordamchi',href: '/ai-tutor', active: false  },
  { icon: Trophy,   label: 'Yutuqlarim',  href: '/profile',  active: false  },
  { icon: Heart,    label: 'Sevimlilar',  href: '/profile',  active: false  },
]
const NAV_BOTTOM = [
  { icon: Settings, label: 'Sozlamalar', href: '/profile/settings' },
]

/* ── Progress bar ── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 400); return () => clearTimeout(t) }, [pct])
  return (
    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ label, value, sub, color, icon }: {
  label: string; value: string | number; sub: string; color: string; icon: string
}) {
  return (
    <div className="glass rounded-2xl p-5" style={{ border: `1px solid ${color}22` }}>
      <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">{label}</p>
      <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 flex items-center gap-1"><span>{icon}</span>{sub}</p>
    </div>
  )
}

/* ── Quick test ── */
const TESTS = [
  { title: 'Kinematika test',       meta: '10 savol · 15 daqiqa · O\'rta daraja', icon: '📐', color: '#00D4FF' },
  { title: 'Dinamika — mini test',  meta: '5 savol · 8 daqiqa · Oson',            icon: '⚡', color: '#8B5CF6' },
  { title: 'Optika — keng qamrovli',meta: '30 savol · 45 daqiqa · Qiyin',        icon: '🔭', color: '#FFB347' },
]

export default function DashboardPage() {
  const router = useRouter()
  const user   = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const initialized = useAuthStore((s) => s.initialized)

  useEffect(() => {
    if (initialized && !user) router.replace('/login')
  }, [initialized, user, router])

  const testCount = useCounter(12, 300)
  const trophy    = useCounter(5,  500)
  const score     = useCounter(850, 700)

  if (!user) return null

  const handleLogout = async () => { await logout(); router.push('/') }

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-gray-800/50 bg-[#07071a]/80 backdrop-blur">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm">⚛️</div>
            <span className="font-black text-white">Fizika <span className="text-cyan-400">AI</span></span>
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              {(user.first_name?.[0] ?? user.username[0]).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-cyan-500/15 text-cyan-400 neon-border-cyan'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              )}
              style={active ? { boxShadow: '0 0 12px rgba(0,212,255,0.15)' } : {}}
            >
              <Icon className="h-4 w-4 shrink-0" /> {label}
            </Link>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-4 border-t border-gray-800/50 space-y-1">
          {NAV_BOTTOM.map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-800/60 hover:text-white transition-all">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-all">
            <LogOut className="h-4 w-4" /> Chiqish
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="slide-up">
            <h1 className="text-2xl font-black text-white">
              Salom, {user.first_name || user.username}! 👋
            </h1>
            <p className="text-gray-400 mt-1">Bugun yangi narsalarni o&apos;rganish uchun ajoyib kun!</p>
          </div>
          <div className="flex gap-2 slide-up-d1">
            <Link href="/ai-tutor"
              className="flex items-center gap-1.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400"
              style={{ boxShadow: '0 0 12px rgba(52,211,153,0.15)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> AI faol
            </Link>
            <Link href="/courses"
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white"
              style={{ boxShadow: '0 0 20px rgba(0,212,255,0.25)' }}>
              <span className="shimmer absolute inset-0" />
              + Yangi dars
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="O'rganilgan kurs" value="Mexanika" sub="7-sinf · 45%"   color="#00D4FF" icon="📚" />
          <StatCard label="O'tgan testlar"   value={testCount} sub="↑ Yaxshi natija" color="#8B5CF6" icon="✅" />
          <StatCard label="Yutuqlar"          value={trophy}    sub="🏅 Sertifikatlar" color="#FFB347" icon="🏆" />
          <StatCard label="Umumiy ball"       value={score}     sub="↑ Ajoyib!"        color="#34D399" icon="⭐" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Continue learning */}
          <div className="glass rounded-2xl p-6 slide-up-d2">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> Davom etish
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Nyutonning 1-qonuni', meta: '7-sinf · Mexanika',      pct: 60, color: '#00D4FF', icon: '🧲' },
                { title: 'Elektr toki',          meta: '9-sinf · Elektromagnitizm', pct: 25, color: '#8B5CF6', icon: '⚡' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${item.color}15` }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{item.meta}</p>
                    <ProgressBar pct={item.pct} color={`linear-gradient(90deg, ${item.color}, ${item.color}88)`} />
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: item.color }}>{item.pct}%</span>
                </div>
              ))}
            </div>
            <Link href="/courses"
              className="relative mt-5 w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-bold text-white text-center flex justify-center"
              style={{ boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}>
              <span className="shimmer absolute inset-0" />
              Davom etish →
            </Link>
          </div>

          {/* Quick tests */}
          <div className="glass rounded-2xl p-6 slide-up-d3">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⚡</span> Tezkor test
            </h2>
            <div className="space-y-3">
              {TESTS.map((t) => (
                <div key={t.title} className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-800/40 transition-colors">
                  <div className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-base"
                    style={{ background: `${t.color}15` }}>
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.meta}</p>
                  </div>
                  <Link href="/tests"
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${t.color}cc, ${t.color}88)`,
                      boxShadow: `0 0 12px ${t.color}33`,
                    }}>
                    Boshlash
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="glass rounded-2xl p-6 slide-up-d3">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" /> So&apos;nggi faollik
            </h2>
            <div className="space-y-3">
              {[
                { text: 'Mexanika testini topshirdingiz',      score: '+45 ball', time: '2 soat oldin',  color: '#22c55e' },
                { text: 'Nyutonning 2-qonunini o\'rgandingiz', score: '+10 ball', time: '1 kun oldin',   color: '#00D4FF' },
                { text: 'Kinematika testida yutuq oldingiz',   score: '🏆 Badge', time: '2 kun oldin',   color: '#FFB347' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color }} />
                  <p className="flex-1 text-sm text-gray-300 truncate">{a.text}</p>
                  <span className="shrink-0 text-xs font-bold" style={{ color: a.color }}>{a.score}</span>
                  <span className="shrink-0 text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass rounded-2xl p-6 slide-up-d4">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" /> Yutuqlar
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🏆', label: 'Birinchi test',  earned: true  },
                { icon: '⚡', label: 'Tez javob',       earned: true  },
                { icon: '🎯', label: '100% natija',     earned: true  },
                { icon: '📚', label: '10 dars',         earned: true  },
                { icon: '🌟', label: 'Haftaning eng yaxshisi', earned: false },
                { icon: '💎', label: 'Ekspert',         earned: false },
              ].map((a) => (
                <div key={a.label}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 rounded-xl p-3 text-center',
                    a.earned ? 'glass neon-border-gold' : 'bg-gray-900/40 opacity-40'
                  )}>
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs text-gray-400 leading-tight">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
