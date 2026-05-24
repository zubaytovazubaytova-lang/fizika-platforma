'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Clock, HelpCircle, Trophy, ChevronRight, Zap, Lock } from 'lucide-react'

interface TestItem {
  id: number; grade: number; topic: string; title: string
  questions: number; minutes: number; diff: string
  bestScore: number | null; attempts: number; isNew: boolean
}

const TESTS: TestItem[] = [
  { id: 1,  grade: 7,  topic: 'Kinematika',    title: "Kinematika asoslari",          questions: 15, minutes: 20, diff: 'easy',   bestScore: 87,  attempts: 3, isNew: false },
  { id: 2,  grade: 7,  topic: 'Dinamika',      title: "Nyuton qonunlari",             questions: 20, minutes: 25, diff: 'medium', bestScore: 72,  attempts: 2, isNew: false },
  { id: 3,  grade: 7,  topic: 'Energiya',      title: "Energiya saqlanish qonuni",    questions: 10, minutes: 15, diff: 'easy',   bestScore: null, attempts: 0, isNew: true  },
  { id: 4,  grade: 8,  topic: 'Termodinamika', title: "Ideal gaz qonunlari",          questions: 20, minutes: 30, diff: 'medium', bestScore: 65,  attempts: 1, isNew: false },
  { id: 5,  grade: 8,  topic: 'Issiqlik',      title: "Issiqlik o'tkazish",           questions: 15, minutes: 20, diff: 'medium', bestScore: null, attempts: 0, isNew: true  },
  { id: 6,  grade: 9,  topic: 'Elektr',        title: "Elektr toki va qarshilik",     questions: 25, minutes: 35, diff: 'hard',   bestScore: 58,  attempts: 4, isNew: false },
  { id: 7,  grade: 9,  topic: 'Elektr',        title: "Om qonuni va Kirxgof",         questions: 20, minutes: 30, diff: 'hard',   bestScore: null, attempts: 0, isNew: false },
  { id: 8,  grade: 9,  topic: 'Magnit',        title: "Magnit maydon va kuch",        questions: 18, minutes: 25, diff: 'hard',   bestScore: null, attempts: 0, isNew: true  },
  { id: 9,  grade: 10, topic: 'Optika',        title: "Geometrik optika",             questions: 20, minutes: 25, diff: 'medium', bestScore: 91,  attempts: 2, isNew: false },
  { id: 10, grade: 10, topic: 'To\'lqin',      title: "Interferensiya va difraksiya", questions: 15, minutes: 20, diff: 'hard',   bestScore: 45,  attempts: 3, isNew: false },
  { id: 11, grade: 11, topic: 'Yadro',         title: "Radioaktiv parchalanish",      questions: 20, minutes: 30, diff: 'hard',   bestScore: null, attempts: 0, isNew: true  },
  { id: 12, grade: 11, topic: 'Kvant',         title: "Kvant mexanikasi asoslari",    questions: 15, minutes: 25, diff: 'hard',   bestScore: null, attempts: 0, isNew: false },
]

const DIFF_CFG: Record<string,{ label: string; color: string; bg: string }> = {
  easy:   { label: 'Oson',   color: '#34D399', bg: '#34D39918' },
  medium: { label: "O'rta",  color: '#FFB347', bg: '#FFB34718' },
  hard:   { label: 'Qiyin',  color: '#EF4444', bg: '#EF444418' },
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-gray-600">—</span>
  const color = score >= 80 ? '#34D399' : score >= 60 ? '#FFB347' : '#EF4444'
  return (
    <div className="flex items-center gap-1">
      <Trophy className="h-3.5 w-3.5" style={{ color }} />
      <span className="text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  )
}

function TestCard({ t }: { t: TestItem }) {
  const [hov, setHov] = useState(false)
  const diff = DIFF_CFG[t.diff]
  const hasAttempt = t.bestScore !== null

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300"
      style={{
        background: hov ? 'rgba(12,12,35,0.9)' : 'rgba(8,8,25,0.7)',
        border: `1px solid ${hov ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? '0 0 24px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-lg px-2.5 py-1 text-xs font-bold text-cyan-300"
            style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)' }}>
            {t.grade}-sinf
          </span>
          <span className="rounded-lg px-2.5 py-1 text-xs text-gray-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {t.topic}
          </span>
          {t.isNew && (
            <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>NEW</span>
          )}
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}30` }}>
          {diff.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white leading-snug">{t.title}</h3>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="text-sm font-bold">{t.questions}</span>
          </div>
          <p className="text-xs text-gray-600">savol</p>
        </div>
        <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.12)' }}>
          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-0.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-sm font-bold">{t.minutes}</span>
          </div>
          <p className="text-xs text-gray-600">daqiqa</p>
        </div>
        <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)' }}>
          <div className="flex justify-center mb-0.5">
            <ScoreBadge score={t.bestScore} />
          </div>
          <p className="text-xs text-gray-600">{t.attempts > 0 ? `${t.attempts}x` : 'yangi'}</p>
        </div>
      </div>

      {/* Best score bar */}
      {hasAttempt && (
        <div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${t.bestScore}%`,
                background: t.bestScore! >= 80 ? 'linear-gradient(90deg,#34D399,#10b981)'
                  : t.bestScore! >= 60 ? 'linear-gradient(90deg,#FFB347,#f59e0b)'
                  : 'linear-gradient(90deg,#EF4444,#dc2626)',
              }} />
          </div>
        </div>
      )}

      {/* Action */}
      <Link href={`/tests/${t.id}`}
        className="relative overflow-hidden flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-sm text-white transition-all"
        style={{
          background: hov ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(0,212,255,0.12)',
          border: '1px solid rgba(0,212,255,0.25)',
          boxShadow: hov ? '0 0 20px rgba(0,212,255,0.3)' : 'none',
        }}>
        <span className={hov ? 'shimmer absolute inset-0' : ''} />
        {hasAttempt ? (
          <><Zap className="h-4 w-4" /> Qayta boshlash</>
        ) : (
          <><Zap className="h-4 w-4" /> Boshlash</>
        )}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default function TestsPage() {
  const [grade,  setGrade]  = useState(0)
  const [diff,   setDiff]   = useState('')
  const [search, setSearch] = useState('')
  const [tab,    setTab]    = useState<'all'|'new'|'done'>('all')

  const filtered = TESTS.filter((t) => {
    if (grade && t.grade !== grade) return false
    if (diff   && t.diff  !== diff)  return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.topic.toLowerCase().includes(search.toLowerCase())) return false
    if (tab === 'new'  && t.attempts > 0) return false
    if (tab === 'done' && t.attempts === 0) return false
    return true
  })

  const total  = TESTS.length
  const done   = TESTS.filter((t) => t.attempts > 0).length
  const passed = TESTS.filter((t) => (t.bestScore ?? 0) >= 70).length

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 slide-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Bilim sinovi</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Testlar</h1>
          <p className="text-gray-400">Fizika bilimingizni sinab ko&apos;ring</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4 slide-up-d1">
          {[
            { label: 'Jami test', value: total, color: '#8B5CF6' },
            { label: 'Topshirilgan', value: done, color: '#00D4FF' },
            { label: "O'tilgan (≥70%)", value: passed, color: '#34D399' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(8,8,25,0.7)', border: `1px solid ${color}20`, backdropFilter: 'blur(12px)' }}>
              <div className="text-2xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3 slide-up-d2">
          {/* Search */}
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Test yoki mavzu qidirish..."
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 neon-input"
            style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(255,255,255,0.1)' }} />

          <div className="flex flex-wrap gap-2">
            {/* Grade */}
            {[0,7,8,9,10,11].map((g) => (
              <button key={g} onClick={() => setGrade(g)}
                className="rounded-xl px-3.5 py-2 text-xs font-bold transition-all"
                style={{
                  background: grade===g ? 'rgba(0,212,255,0.15)' : 'rgba(8,8,25,0.7)',
                  border: `1px solid ${grade===g ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: grade===g ? '#00D4FF' : '#6b7280',
                }}>
                {g === 0 ? 'Barcha sinf' : `${g}-sinf`}
              </button>
            ))}

            <div className="w-px bg-gray-800" />

            {/* Difficulty */}
            {['','easy','medium','hard'].map((d) => (
              <button key={d} onClick={() => setDiff(d)}
                className="rounded-xl px-3.5 py-2 text-xs font-bold transition-all"
                style={{
                  background: diff===d ? `${DIFF_CFG[d]?.bg ?? 'rgba(0,212,255,0.15)'}` : 'rgba(8,8,25,0.7)',
                  border: `1px solid ${diff===d ? (DIFF_CFG[d]?.color ?? '#00D4FF')+'50' : 'rgba(255,255,255,0.08)'}`,
                  color: diff===d ? (DIFF_CFG[d]?.color ?? '#00D4FF') : '#6b7280',
                }}>
                {d === '' ? 'Barcha daraja' : DIFF_CFG[d]?.label}
              </button>
            ))}
          </div>

          {/* Tab */}
          <div className="flex rounded-xl p-1 gap-1"
            style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
            {([['all',"Barchasi"],['new','Yangi'],['done',"O'tilgan"]] as [typeof tab, string][]).map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)}
                className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: tab===t ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: tab===t ? '#a78bfa' : '#6b7280',
                  border: `1px solid ${tab===t ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => <TestCard key={t.id} t={t} />)}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <Lock className="mx-auto mb-3 h-10 w-10 text-gray-700" />
            <p className="text-gray-500">Test topilmadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
