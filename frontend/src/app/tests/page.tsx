'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, HelpCircle, Trophy, ChevronRight, Zap, Lock, BookOpen, GraduationCap, Search, Award, FlaskConical, ChevronLeft, Loader2 } from 'lucide-react'
import { testsApi } from '@/lib/api'

// ─── Turlar ─────────────────────────────────────────────────────────────────

interface TestItem {
  id: number; topic: string; title: string
  questions: number; minutes: number; diff: string
  bestScore: number | null; attempts: number; isNew: boolean
}

// API dan keladigan quiz format
interface ApiQuiz {
  id: number
  title: string
  description: string
  grade: number | null
  time_limit_minutes: number
  pass_score: number
  question_count: number
}

// API quizni TestItem ga aylantirish
function apiQuizToTestItem(q: ApiQuiz): TestItem {
  const qcount = q.question_count
  const diff = qcount >= 15 ? (qcount >= 20 ? 'hard' : 'medium') : 'easy'
  const topic = q.description.split(':')[0]?.replace(/^[IVXLC]+\s*bob/i, '').trim() || q.title.split(' ')[0]
  return {
    id: q.id,
    topic: topic || 'Fizika',
    title: q.title,
    questions: qcount,
    minutes: q.time_limit_minutes || Math.ceil(qcount * 1.5),
    diff,
    bestScore: null,
    attempts: 0,
    isNew: true,
  }
}

// ─── Statik ma'lumotlar (8-11 sinf va abituriyentlar) ───────────────────────

const STATIC_GRADE_TESTS: Record<number, TestItem[]> = {
  8: [
    { id: 101, topic: 'Termodinamika', title: 'Ideal gaz qonunlari',      questions: 20, minutes: 30, diff: 'medium', bestScore: null, attempts: 0, isNew: true },
    { id: 102, topic: 'Issiqlik',      title: "Issiqlik o'tkazish",       questions: 15, minutes: 20, diff: 'medium', bestScore: null, attempts: 0, isNew: true },
    { id: 103, topic: 'Agregat',       title: "Agregat holat o'tishlari", questions: 12, minutes: 18, diff: 'easy',   bestScore: null, attempts: 0, isNew: true },
  ],
  9: [
    { id: 201, topic: 'Elektr',  title: 'Elektr toki va qarshilik',  questions: 25, minutes: 35, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
    { id: 202, topic: 'Elektr',  title: 'Om qonuni va Kirxgof',      questions: 20, minutes: 30, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
    { id: 203, topic: 'Magnit',  title: 'Magnit maydon va kuch',     questions: 18, minutes: 25, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
  ],
  10: [
    { id: 301, topic: 'Optika',       title: 'Geometrik optika',             questions: 20, minutes: 25, diff: 'medium', bestScore: null, attempts: 0, isNew: true },
    { id: 302, topic: "To'lqin",      title: 'Interferensiya va difraksiya', questions: 15, minutes: 20, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
    { id: 303, topic: 'Elektromagnit',title: 'Elektromagnit induksiya',      questions: 18, minutes: 28, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
  ],
  11: [
    { id: 401, topic: 'Yadro',      title: 'Radioaktiv parchalanish',       questions: 20, minutes: 30, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
    { id: 402, topic: 'Kvant',      title: 'Kvant mexanikasi asoslari',     questions: 15, minutes: 25, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
    { id: 403, topic: 'Nisbiylik',  title: "Maxsus nisbiylik nazariyasi",   questions: 12, minutes: 20, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
  ],
}

const MILLIY_TESTS: TestItem[] = [
  { id: 501, topic: 'Mexanika',        title: "Milliy sertifikat — Mexanika bo'limi",       questions: 20, minutes: 30, diff: 'medium', bestScore: null, attempts: 0, isNew: true },
  { id: 502, topic: 'Termodinamika',   title: "Milliy sertifikat — Termodinamika bo'limi",  questions: 20, minutes: 30, diff: 'medium', bestScore: null, attempts: 0, isNew: true },
  { id: 503, topic: 'Elektrodinamika', title: "Milliy sertifikat — Elektr va magnit",       questions: 20, minutes: 30, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
  { id: 504, topic: 'Aralash',         title: "Milliy sertifikat — 1-variant (to'liq)",     questions: 30, minutes: 50, diff: 'hard',   bestScore: null, attempts: 0, isNew: true },
]

const DTM_TESTS: TestItem[] = [
  { id: 601, topic: 'Mexanika',        title: "DTM — Mexanika (chuqur)",                  questions: 30, minutes: 45, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
  { id: 602, topic: 'Termodinamika',   title: "DTM — Termodinamika va molekulyar fizika", questions: 25, minutes: 40, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
  { id: 603, topic: 'Elektrodinamika', title: "DTM — Elektrodinamika",                    questions: 30, minutes: 45, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
  { id: 604, topic: 'Aralash',         title: "DTM simulyator — 1-variant (30 savol)",    questions: 30, minutes: 45, diff: 'hard', bestScore: null, attempts: 0, isNew: true },
]

const GRADE_INFO: Record<number, { topics: string[]; color: string; count: number }> = {
  7:  { topics: ['Kinematika', 'Dinamika', 'Bosim', 'Energiya', 'Mexanizmlar'], color: '#34d399', count: 7 },
  8:  { topics: ['Termodinamika', 'Issiqlik', 'Agregat holat'],                  color: '#60a5fa', count: 3 },
  9:  { topics: ['Elektr toki', 'Om qonuni', 'Magnit maydon'],                   color: '#f59e0b', count: 3 },
  10: { topics: ['Optika', "To'lqinlar", 'Elektromagnit'],                       color: '#a78bfa', count: 3 },
  11: { topics: ['Yadro fizikasi', 'Kvant mexanikasi', 'Nisbiylik'],             color: '#fb923c', count: 3 },
}

const DIFF_CFG: Record<string, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Oson',  color: '#34D399', bg: '#34D39918' },
  medium: { label: "O'rta", color: '#FFB347', bg: '#FFB34718' },
  hard:   { label: 'Qiyin', color: '#EF4444', bg: '#EF444418' },
}

// ─── Kichik komponentlar ─────────────────────────────────────────────────────

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

function TestCard({ t, accent }: { t: TestItem; accent: string }) {
  const [hov, setHov] = useState(false)
  const router = useRouter()
  const diff = DIFF_CFG[t.diff]
  const hasAttempt = t.bestScore !== null
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300"
      style={{
        background: hov ? 'rgba(12,12,35,0.9)' : 'rgba(8,8,25,0.7)',
        border: `1px solid ${hov ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov
          ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${accent}50, 0 0 40px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.08)`
          : `0 6px 24px rgba(0,0,0,0.35), 0 0 0 1px ${accent}18, 0 0 16px ${accent}0e`,
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-lg px-2.5 py-1 text-xs text-gray-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {t.topic}
          </span>
          {t.isNew && (
            <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}>NEW</span>
          )}
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}30` }}>
          {diff.label}
        </span>
      </div>
      <h3 className="font-bold text-white leading-snug">{t.title}</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-2.5 text-center" style={{ background: accent + '0a', border: `1px solid ${accent}18` }}>
          <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color: accent }}>
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
          <div className="flex justify-center mb-0.5"><ScoreBadge score={t.bestScore} /></div>
          <p className="text-xs text-gray-600">{t.attempts > 0 ? `${t.attempts}x` : 'yangi'}</p>
        </div>
      </div>
      {hasAttempt && (
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${t.bestScore}%`, background: t.bestScore! >= 80 ? 'linear-gradient(90deg,#34D399,#10b981)' : t.bestScore! >= 60 ? 'linear-gradient(90deg,#FFB347,#f59e0b)' : 'linear-gradient(90deg,#EF4444,#dc2626)' }} />
        </div>
      )}
      <button
        onClick={() => router.push(`/tests/${t.id}`)}
        className="flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-sm text-white transition-all"
        style={{ background: hov ? `linear-gradient(135deg,${accent},${accent}aa)` : accent + '18', border: `1px solid ${accent}35`, boxShadow: hov ? `0 0 20px ${accent}40` : 'none' }}>
        <Zap className="h-4 w-4" />
        {hasAttempt ? 'Qayta boshlash' : 'Boshlash'}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── API dan grade bo'yicha testlarni yuklovchi komponent ───────────────────

function GradeTestsSection({ grade }: { grade: number }) {
  const [tests, setTests]   = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const info = GRADE_INFO[grade]

  useEffect(() => {
    setLoading(true)
    setError('')
    if (grade === 7) {
      // 7-sinf: API dan yuklash
      testsApi.list({ grade: String(grade) })
        .then(res => {
          const quizzes: ApiQuiz[] = res.data?.results ?? res.data ?? []
          setTests(quizzes.map(apiQuizToTestItem))
        })
        .catch(() => {
          setError("Testlarni yuklashda xatolik. Iltimos qayta urinib ko'ring.")
        })
        .finally(() => setLoading(false))
    } else {
      // Boshqa sinflar: statik ma'lumot
      setTests(STATIC_GRADE_TESTS[grade] ?? [])
      setLoading(false)
    }
  }, [grade])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl"
        style={{ background: info.color + '0a', border: `1px solid ${info.color}20` }}>
        <div className="rounded-xl px-4 py-2 font-black text-3xl"
          style={{ background: info.color + '18', color: info.color }}>{grade}</div>
        <div>
          <div className="font-bold text-white">{grade}-sinf fizika darsligi</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {loading ? 'Yuklanmoqda...' : `${tests.length} ta test`}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: info.color }} />
          <span>Testlar yuklanmoqda...</span>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <TestList tests={tests} accent={info.color} title={`${grade}-sinf`} />
      )}
    </div>
  )
}

// ─── Test ro'yxati va filterlash ─────────────────────────────────────────────

function TestList({ tests, accent, title }: { tests: TestItem[]; accent: string; title: string }) {
  const [search, setSearch] = useState('')
  const [diff, setDiff]     = useState('')
  const [tab, setTab]       = useState<'all'|'new'|'done'>('all')

  const filtered = tests.filter(t => {
    if (diff && t.diff !== diff) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.topic.toLowerCase().includes(search.toLowerCase())) return false
    if (tab === 'new'  && t.attempts > 0)  return false
    if (tab === 'done' && t.attempts === 0) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
              className="rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: 'rgba(8,8,25,0.7)', border: `1px solid ${accent}20`, minWidth: 200 }} />
          </div>
          {['','easy','medium','hard'].map(d => (
            <button key={d} onClick={() => setDiff(d)}
              className="rounded-xl px-3 py-2 text-xs font-bold transition-all"
              style={{
                background: diff===d ? (DIFF_CFG[d]?.bg ?? accent+'18') : 'rgba(8,8,25,0.7)',
                border: `1px solid ${diff===d ? (DIFF_CFG[d]?.color ?? accent)+'50' : 'rgba(255,255,255,0.08)'}`,
                color: diff===d ? (DIFF_CFG[d]?.color ?? accent) : '#6b7280',
              }}>
              {d === '' ? 'Barchasi' : DIFF_CFG[d]?.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['all','new','done'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={{ background: tab===t ? accent+'22' : 'transparent', color: tab===t ? accent : '#6b7280', border: `1px solid ${tab===t ? accent+'40' : 'transparent'}` }}>
              {t==='all' ? 'Barchasi' : t==='new' ? 'Yangi' : "O'tilgan"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <div className="py-20 text-center"><Lock className="mx-auto mb-3 h-8 w-8 text-gray-700" /><p className="text-gray-500">Test topilmadi</p></div>
        : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(t => <TestCard key={t.id} t={t} accent={accent} />)}</div>}
    </div>
  )
}

// ─── Asosiy sahifa ───────────────────────────────────────────────────────────

type View =
  | { type: 'home' }
  | { type: 'maktab' }
  | { type: 'maktab-grade'; grade: number }
  | { type: 'abiturent' }
  | { type: 'abiturent-milliy' }
  | { type: 'abiturent-dtm' }

export default function TestsPage() {
  const [view, setView] = useState<View>({ type: 'home' })

  const go = (v: View) => setView(v)
  const back = () => {
    if (view.type === 'maktab' || view.type === 'abiturent') go({ type: 'home' })
    else if (view.type === 'maktab-grade') go({ type: 'maktab' })
    else if (view.type === 'abiturent-milliy' || view.type === 'abiturent-dtm') go({ type: 'abiturent' })
  }

  // Breadcrumb
  const crumbs: { label: string; view: View }[] = [{ label: 'Testlar', view: { type: 'home' } }]
  if (view.type === 'maktab')          crumbs.push({ label: 'Maktab darsliklari', view: { type: 'maktab' } })
  if (view.type === 'maktab-grade')    crumbs.push({ label: 'Maktab darsliklari', view: { type: 'maktab' } }, { label: `${(view as { type: 'maktab-grade'; grade: number }).grade}-sinf`, view })
  if (view.type === 'abiturent')       crumbs.push({ label: 'Abituriyentlar', view: { type: 'abiturent' } })
  if (view.type === 'abiturent-milliy') crumbs.push({ label: 'Abituriyentlar', view: { type: 'abiturent' } }, { label: 'Milliy sertifikat', view })
  if (view.type === 'abiturent-dtm')   crumbs.push({ label: 'Abituriyentlar', view: { type: 'abiturent' } }, { label: 'DTM', view })

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          {view.type !== 'home' && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <button onClick={back} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" /> Orqaga
              </button>
              <span className="text-gray-700">/</span>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-700">/</span>}
                  <button onClick={() => go(c.view)}
                    className={i === crumbs.length - 1 ? 'text-white font-semibold' : 'text-gray-500 hover:text-gray-300 transition-colors'}>
                    {c.label}
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Bilim sinovi</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-1">
            {view.type === 'home' ? 'Testlar'
              : view.type === 'maktab' ? 'Maktab darsliklari'
              : view.type === 'maktab-grade' ? `${(view as { type: 'maktab-grade'; grade: number }).grade}-sinf testlari`
              : view.type === 'abiturent' ? 'Abituriyentlar'
              : view.type === 'abiturent-milliy' ? 'Milliy sertifikat testlari'
              : 'DTM testlari'}
          </h1>
          <p className="text-gray-400">
            {view.type === 'home' && 'Fizika bilimingizni sinab ko\'ring'}
            {view.type === 'maktab' && 'Sinfni tanlang'}
            {view.type === 'maktab-grade' && `${(view as { type: 'maktab-grade'; grade: number }).grade}-sinf fizika darsligi bo'yicha testlar`}
            {view.type === 'abiturent' && "Bo'limni tanlang"}
            {view.type === 'abiturent-milliy' && "O'zbekiston milliy sertifikat imtihoniga tayyorgarlik"}
            {view.type === 'abiturent-dtm' && "Davlat Test Markazi formatidagi testlar"}
          </p>
        </div>

        {/* ═══════════════ HOME ═══════════════ */}
        {view.type === 'home' && (
          <div className="grid sm:grid-cols-2 gap-6">
            <button onClick={() => go({ type: 'maktab' })}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(124,58,237,0.25)', boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.12), 0 0 30px rgba(124,58,237,0.10)' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="rounded-2xl p-3.5" style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}>
                  <BookOpen className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <div className="font-black text-white text-2xl">Maktab darsliklari</div>
                  <div className="text-sm text-cyan-400/70 mt-0.5">7 — 11-sinf fizika</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">Sinf dasturi bo'yicha mavzuli testlar. Har bir sinf va mavzu alohida sinab ko'riladi.</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-cyan-300" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {7 + Object.values(STATIC_GRADE_TESTS).flat().length} ta test
                  </span>
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-gray-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    5 sinf
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button onClick={() => go({ type: 'abiturent' })}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(167,139,250,0.28)', boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.15), 0 0 30px rgba(167,139,250,0.12)' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="rounded-2xl p-3.5" style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)' }}>
                  <GraduationCap className="h-8 w-8 text-violet-400" />
                </div>
                <div>
                  <div className="font-black text-white text-2xl">Abituriyentlar</div>
                  <div className="text-sm text-violet-400/70 mt-0.5">Milliy sertifikat & DTM</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">Oliy ta'lim muassasalariga kirish imtihoniga tayyorgarlik uchun professional testlar.</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-violet-300" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                    {MILLIY_TESTS.length + DTM_TESTS.length} ta test
                  </span>
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-yellow-400" style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.2)' }}>
                    2 bo'lim
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* ═══════════════ MAKTAB — sinf tanlash ═══════════════ */}
        {view.type === 'maktab' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[7, 8, 9, 10, 11].map(grade => {
              const info = GRADE_INFO[grade]
              return (
                <button key={grade} onClick={() => go({ type: 'maktab-grade', grade })}
                  className="rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 group"
                  style={{ background: 'rgba(8,8,25,0.7)', border: `1px solid ${info.color}25`, boxShadow: `0 4px 20px ${info.color}0a` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-2xl px-4 py-2 font-black text-2xl" style={{ background: info.color + '18', color: info.color, border: `1px solid ${info.color}30` }}>
                      {grade}
                    </div>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" style={{ color: info.color }} />
                  </div>
                  <div className="font-black text-white text-xl mb-1">{grade}-sinf fizika</div>
                  <div className="text-xs mb-4" style={{ color: info.color + 'aa' }}>
                    {grade === 7 ? `${info.count} ta test (bazadan)` : `${info.count} ta test mavjud`}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {info.topics.map(topic => (
                      <span key={topic} className="rounded-full px-2.5 py-0.5 text-xs text-gray-400"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ═══════════════ MAKTAB — sinf testlari ═══════════════ */}
        {view.type === 'maktab-grade' && (
          <GradeTestsSection grade={(view as { type: 'maktab-grade'; grade: number }).grade} />
        )}

        {/* ═══════════════ ABITURENT — bo'lim tanlash ═══════════════ */}
        {view.type === 'abiturent' && (
          <div className="grid sm:grid-cols-2 gap-6">
            <button onClick={() => go({ type: 'abiturent-milliy' })}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(52,211,153,0.2)', boxShadow: '0 4px 24px rgba(52,211,153,0.08)' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="rounded-2xl p-3.5" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
                  <Award className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <div className="font-black text-white text-2xl">Milliy sertifikat</div>
                  <div className="text-sm text-emerald-400/70 mt-0.5">O'zbekiston milliy imtihoni</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">O'zbekiston Milliy sertifikat imtihoni formatidagi testlar. Mavzu bo'yicha va to'liq variant.</p>
              <div className="flex items-center justify-between">
                <span className="rounded-lg px-3 py-1 text-xs font-bold text-emerald-300" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  {MILLIY_TESTS.length} ta test
                </span>
                <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button onClick={() => go({ type: 'abiturent-dtm' })}
              className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(8,8,25,0.7)', border: '1px solid rgba(251,146,60,0.2)', boxShadow: '0 4px 24px rgba(251,146,60,0.08)' }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="rounded-2xl p-3.5" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}>
                  <FlaskConical className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <div className="font-black text-white text-2xl">DTM</div>
                  <div className="text-sm text-orange-400/70 mt-0.5">Davlat Test Markazi</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">DTM imtihoni uslubidagi testlar va to'liq variant simulyatorlari. Chuqur tayyorgarlik uchun.</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-orange-300" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                    {DTM_TESTS.length} ta test
                  </span>
                  <span className="rounded-lg px-3 py-1 text-xs font-bold text-yellow-400" style={{ background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.2)' }}>
                    30 savol
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* ═══════════════ MILLIY SERTIFIKAT testlari ═══════════════ */}
        {view.type === 'abiturent-milliy' && (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <Award className="h-7 w-7 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Milliy sertifikat imtihoni testlari</div>
                <div className="text-xs text-gray-500 mt-0.5">{MILLIY_TESTS.length} ta test · Mavzu va to'liq variant</div>
              </div>
            </div>
            <TestList tests={MILLIY_TESTS} accent="#34d399" title="Milliy sertifikat" />
          </div>
        )}

        {/* ═══════════════ DTM testlari ═══════════════ */}
        {view.type === 'abiturent-dtm' && (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}>
              <FlaskConical className="h-7 w-7 text-orange-400 shrink-0" />
              <div>
                <div className="font-bold text-white">DTM — Davlat Test Markazi testlari</div>
                <div className="text-xs text-gray-500 mt-0.5">{DTM_TESTS.length} ta test · 30 savol · 45 daqiqa</div>
              </div>
            </div>
            <TestList tests={DTM_TESTS} accent="#fb923c" title="DTM" />
          </div>
        )}

      </div>
    </div>
  )
}
