'use client'
import { useState, useEffect, useRef } from 'react'
import {
  BookMarked, BookOpen, Search, X, ChevronRight,
  FlaskConical, Wrench, FolderKanban, LayoutList, ChevronDown,
} from 'lucide-react'
import { darsliklarApi } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

function pdfUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

// ── Kategoriya turlari ───────────────────────────────────────────────────────
type LabCategory = 'all' | 'lab' | 'amaliy' | 'loyiha'

const LAB_CATEGORIES: { id: LabCategory; label: string; icon: React.ReactNode; color: string; match: string }[] = [
  { id: 'all',    label: 'Hammasi',             icon: <LayoutList   className="h-3.5 w-3.5" />, color: '#94a3b8', match: '' },
  { id: 'lab',    label: 'Lab ishlari',         icon: <FlaskConical className="h-3.5 w-3.5" />, color: '#38bdf8', match: 'lab ishi' },
  { id: 'amaliy', label: 'Amaliy mashg\'ulot',  icon: <Wrench       className="h-3.5 w-3.5" />, color: '#34d399', match: 'amaliy' },
  { id: 'loyiha', label: 'Loyiha ishi',         icon: <FolderKanban className="h-3.5 w-3.5" />, color: '#a78bfa', match: 'loyiha' },
]

function filterMavzu(mavzu: string, cat: LabCategory): boolean {
  if (cat === 'all') return true
  const m = cat === 'lab' ? 'lab ishi' : cat === 'amaliy' ? 'amaliy' : 'loyiha'
  return mavzu.toLowerCase().includes(m)
}

// ── Interfaces ───────────────────────────────────────────────────────────────
interface Mavzu {
  mavzu: string
  bet: number | string
  bob?: number
  pdf?: string | null
}

interface GradeBook {
  id: number
  grade: number
  subject: string
  subtitle: string
  icon: string
  color: string
  accent: string
  dark: string
  formulas: string[]
  chapters: number
  pages: number
  mavzular?: Mavzu[]
}

function makeDark(color: string): string {
  const map: Record<string, string> = {
    '#38bdf8': '#071a27', '#fb923c': '#1a0c04', '#ea580c': '#1a0c04',
    '#34d399': '#061a12', '#059669': '#061a12', '#a78bfa': '#120a2e',
    '#7c3aed': '#120a2e', '#818cf8': '#0d0f2e', '#4f46e5': '#0d0f2e',
    '#f87171': '#200a0a', '#dc2626': '#200a0a', '#fbbf24': '#211a00',
    '#e11d48': '#200510',
  }
  return map[color.toLowerCase()] ?? '#080c1a'
}

// ─────────────────────────────────────────────────────────────────────────────
// BookCard
// ─────────────────────────────────────────────────────────────────────────────
function BookCard({ book, active, onClick }: {
  book: GradeBook; active: boolean; onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const lifted = hov || active

  return (
    <div
      className="relative cursor-pointer select-none flex flex-col items-center"
      style={{ perspective: '1000px' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="absolute pointer-events-none transition-all duration-500"
        style={{
          bottom: '-6px', left: '50%', transform: 'translateX(-50%)',
          width: lifted ? '80%' : '45%', height: '18px',
          background: `radial-gradient(ellipse, ${book.color}50 0%, transparent 70%)`,
          filter: 'blur(10px)', opacity: lifted ? 1 : 0.3,
        }}
      />
      <div
        className="relative overflow-hidden flex flex-col transition-all duration-500"
        style={{
          width: '164px', height: '236px',
          borderRadius: '3px 12px 12px 3px',
          background: `linear-gradient(160deg, ${book.dark}f0 0%, rgba(4,5,18,0.97) 100%)`,
          border: `1px solid ${book.color}${active ? '55' : '22'}`,
          boxShadow: lifted
            ? `5px 14px 40px rgba(0,0,0,0.8), 0 0 35px ${book.color}22`
            : `3px 8px 22px rgba(0,0,0,0.7)`,
          transform: lifted ? 'translateY(-12px) rotateY(-4deg)' : 'rotateY(0deg)',
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[13px]"
          style={{ background: `linear-gradient(180deg, ${book.color} 0%, ${book.color}88 100%)` }} />
        <div className="absolute top-[20px] left-5 right-3 h-px"
          style={{ background: `linear-gradient(90deg, ${book.color}45, transparent)` }} />
        <div className="absolute right-1 bottom-3 font-black pointer-events-none leading-none"
          style={{ fontSize: '88px', color: `${book.color}0c`, lineHeight: 1 }}>
          {book.grade}
        </div>
        <div className="absolute top-8 right-2 flex flex-col gap-1.5 items-end pointer-events-none">
          {book.formulas.slice(0, 3).map((f, i) => (
            <span key={f} className="font-mono text-[10px] rounded px-1.5 py-0.5"
              style={{
                color: `${book.color}${['bb', '88', '55'][i]}`,
                background: `${book.color}12`, border: `1px solid ${book.color}18`,
              }}>
              {f}
            </span>
          ))}
        </div>
        <div className="relative flex flex-col h-full pl-6 pr-3 pt-6 pb-4">
          <span className="text-3xl mb-3 block">{book.icon}</span>
          <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-black mb-2 self-start"
            style={{ background: `${book.color}20`, color: book.color, border: `1px solid ${book.color}40` }}>
            {book.grade}-sinf
          </span>
          <h3 className="font-black text-white text-[13px] leading-tight mb-1">{book.subject}</h3>
          <p className="text-[11px] leading-snug mb-auto" style={{ color: 'rgba(180,190,210,0.7)' }}>
            {book.subtitle}
          </p>
          <div className="pt-2 flex justify-between mt-2"
            style={{ borderTop: `1px solid ${book.color}18` }}>
            <span className="text-[11px]" style={{ color: `${book.color}80` }}>{book.chapters} bob</span>
            <span className="text-[11px]" style={{ color: `${book.color}80` }}>{book.pages} bet</span>
          </div>
        </div>
        {active && (
          <div className="absolute top-0 left-3 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, ${book.color}cc, transparent)` }} />
        )}
      </div>
      <div className="mt-3.5 text-center transition-all duration-300">
        <p className="text-[13px] font-bold"
          style={{ color: active ? book.color : 'rgba(255,255,255,0.3)' }}>
          {book.grade}-sinf
        </p>
        <p className="text-[11px] mt-0.5"
          style={{ color: active ? `${book.color}70` : 'rgba(255,255,255,0.13)' }}>
          {book.subject}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GradeFilterInput  — har bir kitob uchun pastki input + kichik dropdown
// ─────────────────────────────────────────────────────────────────────────────
function GradeFilterInput({ book, activeCat, onSelect }: {
  book: GradeBook
  activeCat: LabCategory
  onSelect: (bookId: number, cat: LabCategory) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // tashqarini bosganda yopilsin
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentCat = LAB_CATEGORIES.find(c => c.id === activeCat) ?? LAB_CATEGORIES[0]
  const labCount = (book.mavzular ?? []).filter(m => filterMavzu(m.mavzu, 'lab')).length
  const amaliyCount = (book.mavzular ?? []).filter(m => filterMavzu(m.mavzu, 'amaliy')).length
  const loyihaCount = (book.mavzular ?? []).filter(m => filterMavzu(m.mavzu, 'loyiha')).length
  const counts: Record<LabCategory, number> = {
    all: (book.mavzular ?? []).length,
    lab: labCount,
    amaliy: amaliyCount,
    loyiha: loyihaCount,
  }

  return (
    <div ref={ref} className="relative flex flex-col items-center" style={{ width: '164px' }}>
      {/* ── Asosiy tugma ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 transition-all duration-300"
        style={{
          borderRadius: 14,
          background: open
            ? `linear-gradient(135deg, ${book.color}22 0%, ${book.color}0e 100%)`
            : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${open ? book.color + '60' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: open
            ? `0 8px 28px rgba(0,0,0,0.4), 0 0 0 1px ${book.color}30, 0 0 24px ${book.color}25, inset 0 1px 0 rgba(255,255,255,0.08)`
            : `0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <span className="flex items-center gap-2 truncate min-w-0">
          {/* Rang dot */}
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: book.color,
            boxShadow: `0 0 8px ${book.color}`,
          }} />
          {activeCat !== 'all' ? (
            <>
              <span style={{ color: currentCat.color, fontSize: 11 }}>{currentCat.icon}</span>
              <span className="truncate text-[12px] font-semibold" style={{ color: currentCat.color }}>
                {currentCat.label}
              </span>
            </>
          ) : (
            <>
              <span className="text-[12px] font-black" style={{ color: book.color, flexShrink: 0 }}>
                {book.grade}-sinf
              </span>
              <span className="truncate text-[11px]" style={{ color: `${book.color}70` }}>
                {book.subject}
              </span>
            </>
          )}
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: `${book.color}cc` }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute top-full mt-2.5 z-50 overflow-hidden"
          style={{
            width: '220px',
            borderRadius: 18,
            background: 'rgba(10,10,26,0.97)',
            border: `1.5px solid ${book.color}40`,
            backdropFilter: 'blur(24px)',
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.7),
              0 0 0 1px ${book.color}20,
              0 0 40px ${book.color}20,
              inset 0 1px 0 rgba(255,255,255,0.06)
            `,
          }}
        >
          {/* Yuqori rang chizig'i */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${book.color}cc, transparent)`,
          }} />

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-2.5"
            style={{ borderBottom: `1px solid ${book.color}18`, background: `${book.color}08` }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: `${book.color}20`,
              border: `1px solid ${book.color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>
              {book.icon}
            </div>
            <div>
              <div className="text-[11px] font-black" style={{ color: book.color }}>
                {book.grade}-sinf
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Kategoriya tanlang
              </div>
            </div>
          </div>

          {/* Kategoriyalar */}
          <div className="p-2 flex flex-col gap-1">
            {LAB_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const count = counts[cat.id]
              const isActive = activeCat === cat.id
              const disabled = count === 0
              return (
                <button
                  key={cat.id}
                  onClick={() => { if (!disabled) { onSelect(book.id, cat.id); setOpen(false) } }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-150"
                  style={{
                    borderRadius: 12,
                    background: isActive
                      ? `linear-gradient(135deg, ${book.color}22, ${book.color}0e)`
                      : 'transparent',
                    border: `1px solid ${isActive ? book.color + '45' : 'transparent'}`,
                    boxShadow: isActive
                      ? `0 0 0 1px ${book.color}25, 0 4px 12px ${book.color}15`
                      : 'none',
                    opacity: disabled ? 0.3 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: isActive ? `${cat.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? cat.color + '35' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? `0 0 10px ${cat.color}25` : 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ color: isActive ? cat.color : 'rgba(200,215,235,0.5)', fontSize: 12 }}>
                      {cat.icon}
                    </span>
                  </div>
                  <span className="flex-1 text-[12px] font-semibold"
                    style={{ color: isActive ? cat.color : 'rgba(200,215,235,0.65)' }}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-black rounded-full px-2 py-0.5 tabular-nums"
                    style={{
                      background: isActive ? `${cat.color}28` : 'rgba(255,255,255,0.06)',
                      color: isActive ? cat.color : 'rgba(255,255,255,0.28)',
                      border: `1px solid ${isActive ? cat.color + '30' : 'transparent'}`,
                    }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MavzuList  — mavzularni ko'rsatish (kategoriya filtri bilan)
// ─────────────────────────────────────────────────────────────────────────────
function MavzuList({ book, category }: { book: GradeBook; category: LabCategory }) {
  const [q, setQ] = useState('')
  const allMavzular = book.mavzular ?? []

  // kategoriya filtri
  const catFiltered = category === 'all'
    ? allMavzular
    : allMavzular.filter(m => filterMavzu(m.mavzu, category))

  // qidiruv filtri
  const filtered = q.trim()
    ? catFiltered.filter(m => m.mavzu.toLowerCase().includes(q.toLowerCase()))
    : catFiltered

  const currentCat = LAB_CATEGORIES.find(c => c.id === category)!
  const openPdf = (m: Mavzu) => {
    const url = pdfUrl(m.pdf)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Aktiv kategoriyaga mos rang
  const accentColor = category === 'all' ? book.color : currentCat.color

  return (
    <div>
      {/* Kategoriya badge */}
      {category !== 'all' && (
        <div className="flex items-center gap-2 mb-3">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{
              background: `${currentCat.color}18`,
              border: `1px solid ${currentCat.color}40`,
              color: currentCat.color,
            }}
          >
            {currentCat.icon}
            {currentCat.label}
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {catFiltered.length} ta topildi
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest"
          style={{ color: `${accentColor}70` }}>
          {category === 'all' ? `Mavzular — ${allMavzular.length} ta` : `Filtrlangan — ${catFiltered.length} ta`}
        </p>
        {allMavzular.filter(m => m.pdf).length > 0 && (
          <span className="text-xs" style={{ color: `${accentColor}60` }}>
            {allMavzular.filter(m => m.pdf).length} ta PDF
          </span>
        )}
      </div>

      {/* Qidiruv */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
          style={{ color: `${accentColor}55` }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Mavzu nomini qidiring..."
          className="w-full rounded-xl py-2.5 pl-9 pr-9 text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${q ? accentColor + '45' : 'rgba(255,255,255,0.09)'}`,
            color: 'rgba(220,230,245,0.9)',
          }}
        />
        {q && (
          <button onClick={() => setQ('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Ro'yxat */}
      {allMavzular.length === 0 ? (
        <p className="text-xs italic py-4 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Admin paneldan mavzular qo&apos;shing
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-xs py-3" style={{ color: `${accentColor}50` }}>
          {q ? `"${q}" topilmadi` : 'Bu kategoriyada mavzu yo\'q'}
        </p>
      ) : (
        <div
          className="max-h-52 overflow-y-auto rounded-xl"
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${accentColor}18`,
          }}
        >
          {filtered.map((m, i) => {
            const isLab    = m.mavzu.toLowerCase().includes('lab ishi')
            const isAmaliy = m.mavzu.toLowerCase().includes('amaliy')
            const isLoyiha = m.mavzu.toLowerCase().includes('loyiha')
            const tag = isLab ? { label: 'Lab', color: '#38bdf8' }
              : isAmaliy ? { label: 'Amaliy', color: '#34d399' }
              : isLoyiha ? { label: 'Loyiha', color: '#a78bfa' }
              : null

            return (
              <div
                key={i}
                className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-white/[0.04]"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: (isLab || isAmaliy || isLoyiha) ? `${accentColor}06` : 'transparent',
                }}
              >
                <span className="shrink-0 text-xs tabular-nums w-5 text-center"
                  style={{ color: `${accentColor}45` }}>
                  {i + 1}
                </span>

                <span className="flex-1 text-sm truncate" style={{ color: 'rgba(210,220,235,0.88)' }}>
                  {m.mavzu}
                </span>

                {/* Lab/Amaliy/Loyiha tegi */}
                {tag && (
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      background: `${tag.color}18`,
                      color: tag.color,
                      border: `1px solid ${tag.color}35`,
                    }}
                  >
                    {tag.label}
                  </span>
                )}

                <span
                  className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums"
                  style={{
                    background: `${accentColor}15`,
                    color: `${accentColor}cc`,
                    border: `1px solid ${accentColor}22`,
                  }}
                >
                  {m.bet}-bet
                </span>

                {m.pdf ? (
                  <button
                    onClick={() => openPdf(m)}
                    className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs
                               font-bold transition-all hover:brightness-125 active:scale-95"
                    style={{
                      background: `${accentColor}22`,
                      color: accentColor,
                      border: `1px solid ${accentColor}40`,
                    }}
                  >
                    <BookOpen className="h-3 w-3" />
                    O&apos;qish
                  </button>
                ) : (
                  <span className="shrink-0 w-[62px] text-center text-xs"
                    style={{ color: 'rgba(255,255,255,0.12)' }}>—</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Asosiy sahifa
// ─────────────────────────────────────────────────────────────────────────────
export default function DarsliklarPage() {
  const [selectedId, setSelectedId]   = useState<number | null>(null)
  const [books, setBooks]             = useState<GradeBook[]>([])
  const [loading, setLoading]         = useState(true)
  const [catMap, setCatMap]           = useState<Record<number, LabCategory>>({})
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    darsliklarApi.list()
      .then((r) => {
        const data: GradeBook[] = r.data?.results ?? r.data
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data.map(d => ({ ...d, dark: makeDark(d.color) })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const book = books.find(b => b.id === selectedId) ?? null
  const activeCat: LabCategory = selectedId ? (catMap[selectedId] ?? 'all') : 'all'

  // Kategoriya tanlanganda kitobni ham ochish
  const handleCatSelect = (bookId: number, cat: LabCategory) => {
    setSelectedId(bookId)
    setCatMap(prev => ({ ...prev, [bookId]: cat }))
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  // Kitob kartochkasiga bosilganda: faqat selectedId toggle qilinadi, kategoriya saqlanib qoladi
  const handleBookClick = (bookId: number) => {
    const isOpening = selectedId !== bookId
    setSelectedId(prev => prev === bookId ? null : bookId)
    if (isOpening) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-10 pb-16">
      <div className="mx-auto max-w-5xl">

        {/* ── Header ── */}
        <div className="mb-12 slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#38bdf8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#38bdf8' }}>
              Maktab darsliklari
            </span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(56,189,248,0.25)',
                boxShadow: '0 0 20px rgba(56,189,248,0.12)',
              }}
            >
              <BookMarked className="h-6 w-6" style={{ color: '#38bdf8' }} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Darsliklar</h1>
          </div>
          <p className="ml-16" style={{ color: 'rgba(160,180,210,0.7)' }}>
            O&apos;qimoqchi bo&apos;lgan sinfingizdagi darslikni tanlang
          </p>
        </div>

        {/* ── Kitoblar ── */}
        <div className="slide-up-d1 mb-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-7 flex-wrap px-4 pb-5">
              {books.map(b => (
                <BookCard
                  key={b.id}
                  book={b}
                  active={selectedId === b.id}
                  onClick={() => handleBookClick(b.id)}
                />
              ))}
            </div>
          )}

          {/* Shelf taxtasi */}
          {!loading && (
            <>
              <div className="mx-auto" style={{ maxWidth: '1060px' }}>
                <div style={{
                  height: 10,
                  borderRadius: '0 0 6px 6px',
                  background: 'linear-gradient(180deg, rgba(124,58,237,0.18) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderTop: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1), 0 0 20px rgba(124,58,237,0.08)',
                }} />
                <div style={{
                  height: 4,
                  marginTop: 2,
                  borderRadius: '0 0 8px 8px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.55), transparent)',
                }} />
              </div>
            </>
          )}
        </div>

        {/* ── Filtr qatori ── */}
        {!loading && books.length > 0 && (
          <div className="mt-6 mb-2">
            {/* Sarlavha */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.25))' }} />
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  boxShadow: '0 0 16px rgba(124,58,237,0.08)',
                }}>
                <FlaskConical className="h-3.5 w-3.5" style={{ color: 'rgba(167,139,250,0.7)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(167,139,250,0.6)' }}>
                  Sinf bo&apos;yicha amaliy ishlar filtri
                </span>
              </div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.25), transparent)' }} />
            </div>

            {/* Tugmalar qatori */}
            <div className="flex justify-center gap-4 flex-wrap px-4">
              {books.map(b => (
                <GradeFilterInput
                  key={b.id}
                  book={b}
                  activeCat={catMap[b.id] ?? 'all'}
                  onSelect={handleCatSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tanlanmagan holat */}
        {!selectedId && !loading && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2))' }} />
            <p className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                color: 'rgba(167,139,250,0.45)',
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.12)',
              }}>
              Kitobni yoki pastdagi filtrni bosing
              <ChevronRight className="h-3.5 w-3.5" />
            </p>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.2), transparent)' }} />
          </div>
        )}


        {/* ── Tanlangan kitob detail ── */}
        {book && (
          <div
            ref={detailRef}
            key={`${book.id}-${activeCat}`}
            className="slide-up mt-8 rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${book.dark}f8 0%, rgba(4,5,18,0.97) 100%)`,
              border: `1px solid ${book.color}28`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 50px ${book.color}10, 0 24px 60px rgba(0,0,0,0.6)`,
            }}
          >
            {/* Yuqori rang chizig'i */}
            <div className="relative">
              <div
                className="h-[2px] w-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${book.color}70 25%, ${book.color}cc 50%, ${book.color}70 75%, transparent 100%)`,
                }}
              />
              {/* Yopish tugmasi */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute right-4 top-3 flex items-center justify-center
                           w-8 h-8 rounded-xl transition-all duration-200
                           hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(200,215,235,0.5)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${book.color}22`
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${book.color}55`
                  ;(e.currentTarget as HTMLButtonElement).style.color = book.color
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,215,235,0.5)'
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-8 flex flex-col sm:flex-row gap-8">
              {/* Chap ustun */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div
                  className="h-28 w-28 rounded-3xl flex items-center justify-center text-5xl"
                  style={{
                    background: `radial-gradient(circle at 40% 35%, ${book.color}18, rgba(0,0,0,0.5))`,
                    border: `1px solid ${book.color}30`,
                    boxShadow: `0 0 32px ${book.color}18`,
                  }}
                >
                  {book.icon}
                </div>
                <div
                  className="rounded-full px-5 py-1.5 text-sm font-black"
                  style={{ background: `${book.color}18`, color: book.color, border: `1px solid ${book.color}40` }}
                >
                  {book.grade}-sinf
                </div>

                {/* Lab kategoriyalari statistikasi */}
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-0.5"
                    style={{ color: `${book.color}55` }}>
                    Amaliy ishlar
                  </p>
                  {LAB_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                    const cnt = (book.mavzular ?? []).filter(m => filterMavzu(m.mavzu, cat.id)).length
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCatSelect(book.id, cat.id === activeCat ? 'all' : cat.id)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-150"
                        style={{
                          background: activeCat === cat.id ? `${cat.color}20` : `${book.color}0e`,
                          border: `1px solid ${activeCat === cat.id ? cat.color + '50' : book.color + '25'}`,
                          opacity: cnt === 0 ? 0.3 : 1,
                          cursor: cnt === 0 ? 'not-allowed' : 'pointer',
                        }}
                        disabled={cnt === 0}
                      >
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                        <span className="flex-1 text-[11px] font-medium text-left"
                          style={{ color: activeCat === cat.id ? cat.color : 'rgba(180,200,230,0.65)' }}>
                          {cat.label}
                        </span>
                        <span
                          className="text-[11px] font-black tabular-nums"
                          style={{ color: activeCat === cat.id ? cat.color : `${book.color}70` }}
                        >
                          {cnt}
                        </span>
                      </button>
                    )
                  })}

                  {/* Hammasi tugmasi */}
                  <button
                    onClick={() => handleCatSelect(book.id, 'all')}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 mt-1 transition-all duration-150"
                    style={{
                      background: activeCat === 'all' ? `${book.color}20` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${activeCat === 'all' ? book.color + '50' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <LayoutList className="h-3.5 w-3.5" style={{ color: activeCat === 'all' ? book.color : '#94a3b8' }} />
                    <span className="flex-1 text-[11px] font-medium text-left"
                      style={{ color: activeCat === 'all' ? book.color : 'rgba(180,200,230,0.5)' }}>
                      Hammasi
                    </span>
                    <span className="text-[11px] font-black tabular-nums"
                      style={{ color: activeCat === 'all' ? book.color : `${book.color}70` }}>
                      {book.mavzular?.length ?? 0}
                    </span>
                  </button>
                </div>
              </div>

              {/* O'ng ustun */}
              <div className="flex-1 min-w-0">
                <div className="mb-6">
                  <h2 className="text-3xl font-black text-white mb-1.5 tracking-tight">{book.subject}</h2>
                  <p style={{ color: 'rgba(160,180,210,0.7)' }}>{book.subtitle}</p>
                </div>

                {/* Statistika */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { label: 'Boblar',    value: `${book.chapters}` },
                    { label: 'Sahifalar', value: `${book.pages}` },
                    { label: 'Mavzular',  value: `${book.mavzular?.length ?? 0}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl p-4 text-center"
                      style={{ background: `${book.color}0c`, border: `1px solid ${book.color}1e` }}>
                      <p className="text-2xl font-black mb-0.5" style={{ color: book.color }}>{value}</p>
                      <p className="text-xs font-medium" style={{ color: 'rgba(160,180,210,0.5)' }}>{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                {/* Mavzu ro'yxati */}
                <div className="mb-7">
                  <MavzuList book={book} category={activeCat} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
