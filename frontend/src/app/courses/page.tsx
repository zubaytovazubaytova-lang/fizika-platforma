'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, Zap, Star } from 'lucide-react'

/* ── 15 ta fizika bo'limi ── */
const SECTIONS = [
  {
    id: 1,
    name: 'Kinematika',
    icon: '🏃',
    color: '#00D4FF',
    desc: "Jismlar harakati: tezlik, tezlanish va yo'l hisoblash qonunlari.",
    lessons: 18,
    diff: 'easy',
    has3D: true,
    tags: ['harakat', 'tezlik', 'vaqt'],
  },
  {
    id: 2,
    name: 'Dinamika',
    icon: '⚙️',
    color: '#8B5CF6',
    desc: "Kuch va massa o'rtasidagi bog'liqlik, Nyuton qonunlari.",
    lessons: 22,
    diff: 'medium',
    has3D: true,
    tags: ['kuch', 'massa', 'tezlanish'],
  },
  {
    id: 3,
    name: 'Saqlanish qonunlari',
    icon: '♾️',
    color: '#34D399',
    desc: "Energiya, impuls va moment saqlanish qonunlari.",
    lessons: 16,
    diff: 'medium',
    has3D: true,
    tags: ['energiya', 'impuls', 'moment'],
  },
  {
    id: 4,
    name: 'Statika',
    icon: '⚖️',
    color: '#FFB347',
    desc: "Muvozanat sharoitlari, tayanch reaksiyalari va arpalar.",
    lessons: 14,
    diff: 'easy',
    has3D: false,
    tags: ['muvozanat', 'bosim', 'tayanch'],
  },
  {
    id: 5,
    name: 'Suyuqlik va gazlar mexanikasi',
    icon: '💧',
    color: '#3B82F6',
    desc: "Gidrostatika, Bernulli qonuni, suyuqlik oqimi.",
    lessons: 20,
    diff: 'medium',
    has3D: true,
    tags: ['bosim', 'oqim', 'gidrostatika'],
  },
  {
    id: 6,
    name: 'Mexanik tebranishlar',
    icon: '〰️',
    color: '#EC4899',
    desc: "Mayatnik, rezonans, garmonik tebranishlar va to'lqinlar.",
    lessons: 17,
    diff: 'medium',
    has3D: true,
    tags: ['amplituda', 'chastota', 'rezonans'],
  },
  {
    id: 7,
    name: 'Molekulyar fizika',
    icon: '🔬',
    color: '#06B6D4',
    desc: "Molekulalar harakati, diffuziya, ideal gaz modeli.",
    lessons: 15,
    diff: 'medium',
    has3D: true,
    tags: ['molekula', 'diffuziya', 'temperatur'],
  },
  {
    id: 8,
    name: 'Termodinamika',
    icon: '🌡️',
    color: '#F97316',
    desc: "Issiqlik mashinalari, entropiya va termodinamika qonunlari.",
    lessons: 19,
    diff: 'hard',
    has3D: false,
    tags: ['issiqlik', 'entropiya', 'ish'],
  },
  {
    id: 9,
    name: 'Elektrostatika',
    icon: '⚡',
    color: '#EAB308',
    desc: "Elektr zaryadlar, Kulon qonuni, elektr maydon va potentsial.",
    lessons: 21,
    diff: 'hard',
    has3D: true,
    tags: ['zaryad', 'maydon', 'potentsial'],
  },
  {
    id: 10,
    name: "O'zgarmas tok",
    icon: '🔋',
    color: '#10B981',
    desc: "Om va Kirxgof qonunlari, zanjir hisoblash, quvvat.",
    lessons: 23,
    diff: 'medium',
    has3D: false,
    tags: ['tok', 'kuchlanish', 'qarshilik'],
  },
  {
    id: 11,
    name: "Turli muhitlarda elektr toki",
    icon: '💡',
    color: '#A78BFA',
    desc: "Metallarda, gazlarda, suyuqliklarda va yarim o'tkazgichlarda tok.",
    lessons: 16,
    diff: 'hard',
    has3D: true,
    tags: ['plazma', 'elektroliz', 'yarimo\'tkazgich'],
  },
  {
    id: 12,
    name: 'Magnetizm',
    icon: '🧲',
    color: '#EF4444',
    desc: "Magnit maydon, induksiya, elektromagnit tebranishlar.",
    lessons: 18,
    diff: 'hard',
    has3D: true,
    tags: ['magnet', 'induksiya', 'Lorents'],
  },
  {
    id: 13,
    name: 'Optika',
    icon: '🔭',
    color: '#F59E0B',
    desc: "Nur tarqalishi, linzalar, interferensiya va difraksiya.",
    lessons: 24,
    diff: 'medium',
    has3D: true,
    tags: ['linza', 'interferensiya', 'nur'],
  },
  {
    id: 14,
    name: 'Atom va yadro fizikasi',
    icon: '⚛️',
    color: '#6366F1',
    desc: "Atom modeli, radioaktivlik, yadroviy reaksiyalar.",
    lessons: 26,
    diff: 'hard',
    has3D: true,
    tags: ['proton', 'neytron', 'radioaktivlik'],
  },
  {
    id: 15,
    name: 'Astronomiya',
    icon: '🌌',
    color: '#8B5CF6',
    desc: "Quyosh sistemasi, yulduzlar evolyutsiyasi, kosmologiya.",
    lessons: 20,
    diff: 'medium',
    has3D: true,
    tags: ['galaktika', 'yulduz', 'kosmologiya'],
  },
]

const DIFF: Record<string, { label: string; color: string }> = {
  easy:   { label: 'Oson',   color: '#34D399' },
  medium: { label: "O'rta",  color: '#FFB347' },
  hard:   { label: 'Qiyin',  color: '#EF4444' },
}

/* ── Kurs kartochkasi ── */
function CourseCard({ s, idx }: { s: typeof SECTIONS[number]; idx: number }) {
  const [hov, setHov] = useState(false)
  const diff = DIFF[s.diff]

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        animationDelay: `${idx * 50}ms`,
        background: hov
          ? `linear-gradient(145deg, ${s.color}18 0%, rgba(5,5,20,0.95) 100%)`
          : 'rgba(8,8,25,0.75)',
        border: `1px solid ${hov ? s.color + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov
          ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${s.color}55, 0 0 50px ${s.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 8px 28px rgba(0,0,0,0.4), 0 0 0 1px ${s.color}18, 0 0 20px ${s.color}10`,
        transform: hov ? 'translateY(-6px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(16px)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Top stripe */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Icon + badges */}
        <div className="flex items-start justify-between">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl select-none"
            style={{
              background: `${s.color}18`,
              border: `1px solid ${s.color}30`,
              boxShadow: hov ? `0 0 20px ${s.color}35` : 'none',
              transition: 'box-shadow 0.3s',
            }}
          >
            {s.icon}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ background: `${diff.color}18`, color: diff.color, border: `1px solid ${diff.color}30` }}
            >
              {diff.label}
            </span>
            {s.has3D && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"
                style={{ background: 'rgba(99,102,241,0.18)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                <Zap className="h-2.5 w-2.5" />
                3D
              </span>
            )}
          </div>
        </div>

        {/* Name + desc */}
        <div className="flex-1">
          <h3 className="font-black text-white text-base mb-1.5 leading-snug">{s.name}</h3>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{s.desc}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {s.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-lg px-2 py-0.5 text-xs text-gray-500"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Lessons count */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <BookOpen className="h-3.5 w-3.5" style={{ color: s.color }} />
          <span>{s.lessons} ta dars</span>
          <span className="mx-1 text-gray-700">•</span>
          <Star className="h-3 w-3 text-yellow-500/60" />
          <span>Interaktiv</span>
        </div>

        {/* CTA button */}
        <Link
          href={`/bo-lim/${s.id}`}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200"
          style={{
            background: hov
              ? `linear-gradient(135deg, ${s.color}, ${s.color}bb)`
              : `${s.color}18`,
            color: hov ? '#000' : s.color,
            border: `1px solid ${s.color}40`,
            boxShadow: hov ? `0 4px 20px ${s.color}40` : 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Boshlash
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

/* ── Asosiy sahifa ── */
export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('')

  const filtered = SECTIONS.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    const matchDiff = diffFilter ? s.diff === diffFilter : true
    return matchSearch && matchDiff
  })

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.12) 0%, transparent 65%)',
      }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 slide-up text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>O&apos;quv dasturi</span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Fizika{' '}
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Bo&apos;limlari
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            15 ta asosiy bo&apos;lim, 3D animatsiyalar va interaktiv darslar bilan fizikani o&apos;rganing
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4 slide-up-d1">
          {[
            { label: "Jami bo'lim",    value: SECTIONS.length,                                   color: '#a78bfa' },
            { label: '3D animatsiya',  value: SECTIONS.filter((s) => s.has3D).length,            color: '#8B5CF6' },
            { label: 'Jami darslar',   value: SECTIONS.reduce((a, s) => a + s.lessons, 0),       color: '#34D399' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(124,58,237,0.06)', border: `1px solid ${color}30`, backdropFilter: 'blur(16px)', boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${color}18, 0 0 24px ${color}14` }}
            >
              <div className="text-2xl font-black" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3 slide-up-d2">
          <div className="relative flex-1 min-w-[220px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bo'lim qidirish..."
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-all outline-none"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}
            />
          </div>
          {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: diffFilter === d ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.05)',
                border: `1px solid ${diffFilter === d ? 'rgba(168,85,247,0.45)' : 'rgba(124,58,237,0.15)'}`,
                color: diffFilter === d ? '#c084fc' : '#6b7280',
                boxShadow: diffFilter === d ? '0 0 12px rgba(124,58,237,0.2)' : 'none',
              }}
            >
              {d === '' ? 'Barchasi' : DIFF[d]?.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-32 text-center text-gray-600">Bo&apos;lim topilmadi</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 slide-up-d2">
            {filtered.map((s, i) => (
              <CourseCard key={s.id} s={s} idx={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
