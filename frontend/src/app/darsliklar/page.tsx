'use client'
import { useState, useEffect } from 'react'
import { BookMarked, BookOpen, Search, X, ChevronRight } from 'lucide-react'
import { darsliklarApi } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

function pdfUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

interface Mavzu { mavzu: string; bet: number | string; pdf?: string | null }

interface GradeBook {
  grade: number
  subject: string
  subtitle: string
  icon: string
  color: string       // spine & accent color
  dark: string        // dark card body tint
  formulas: string[]
  chapters: number
  pages: number
  mavzular?: Mavzu[]
}

// Kosmik fon bilan uyg'un rang palitrasi:
// — To'q karta foni, faqat spine/belgi yorqin rang
const BOOKS: GradeBook[] = [
  {
    grade: 7,
    subject: 'Mexanika',
    subtitle: 'Harakat, Kuch va Energiya',
    icon: '🚀',
    color: '#38bdf8',   // yulduz ko'k
    dark:  '#0c2233',
    formulas: ['F = ma', 'v = v₀ + at', 'E = mgh'],
    chapters: 7,
    pages: 180,
  },
  {
    grade: 8,
    subject: 'Termodinamika',
    subtitle: 'Issiqlik, Elektr va Magnit',
    icon: '⚡',
    color: '#fbbf24',   // quyosh sariq
    dark:  '#211a00',
    formulas: ['Q = mcΔT', 'U = IR', 'P = UI'],
    chapters: 7,
    pages: 196,
  },
  {
    grade: 9,
    subject: 'Elektromagnitizm',
    subtitle: "To'lqinlar, Optika va Atom",
    icon: '🌊',
    color: '#a78bfa',   // tumanlik binafsha
    dark:  '#150d2e',
    formulas: ['λ = v/f', 'n = c/v', 'E = hf'],
    chapters: 7,
    pages: 208,
  },
  {
    grade: 10,
    subject: 'Fizika (Chuqur)',
    subtitle: 'Mexanika, Elektrostatika, Magnit',
    icon: '🔭',
    color: '#34d399',   // shimoliy yorug'lik
    dark:  '#061a12',
    formulas: ['F = kq₁q₂/r²', 'W = qU', 'Φ = BS·cosα'],
    chapters: 6,
    pages: 224,
  },
  {
    grade: 11,
    subject: 'Zamonaviy Fizika',
    subtitle: 'Kvant, Yadro va Kosmologiya',
    icon: '⚛️',
    color: '#f87171',   // supernova qizil
    dark:  '#200a0a',
    formulas: ['E = mc²', 'ΔxΔp ≥ ℏ/2', 'λ = h/mv'],
    chapters: 7,
    pages: 238,
  },
]

function BookCard({ book, active, onClick }: { book: GradeBook; active: boolean; onClick: () => void }) {
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
      {/* Pastdagi glow soya */}
      <div
        className="absolute pointer-events-none transition-all duration-500"
        style={{
          bottom: '-6px', left: '50%',
          transform: 'translateX(-50%)',
          width: lifted ? '80%' : '45%',
          height: '18px',
          background: `radial-gradient(ellipse, ${book.color}50 0%, transparent 70%)`,
          filter: 'blur(10px)',
          opacity: lifted ? 1 : 0.3,
        }}
      />

      {/* Kitob tanasi */}
      <div
        className="relative overflow-hidden flex flex-col transition-all duration-500"
        style={{
          width: '164px',
          height: '236px',
          borderRadius: '3px 12px 12px 3px',
          // To'q, deyarli opak fon — kosmik fon ko'rinmaydi
          background: `linear-gradient(160deg, ${book.dark}f0 0%, rgba(4,5,18,0.97) 100%)`,
          border: `1px solid ${book.color}${active ? '55' : '22'}`,
          boxShadow: lifted
            ? `5px 14px 40px rgba(0,0,0,0.8), 0 0 35px ${book.color}22`
            : `3px 8px 22px rgba(0,0,0,0.7)`,
          transform: lifted
            ? 'translateY(-12px) rotateY(-4deg)'
            : 'rotateY(0deg)',
        }}
      >
        {/* Spine (chap chiziq) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[13px]"
          style={{ background: `linear-gradient(180deg, ${book.color} 0%, ${book.color}88 100%)` }}
        />

        {/* Yuqori bezak chiziq */}
        <div
          className="absolute top-[20px] left-5 right-3 h-px"
          style={{ background: `linear-gradient(90deg, ${book.color}45, transparent)` }}
        />

        {/* Katta grade raqami — watermark */}
        <div
          className="absolute right-1 bottom-3 font-black pointer-events-none leading-none"
          style={{ fontSize: '88px', color: `${book.color}0c`, lineHeight: 1 }}
        >
          {book.grade}
        </div>

        {/* O'ng tomondagi formulalar */}
        <div className="absolute top-8 right-2 flex flex-col gap-1.5 items-end pointer-events-none">
          {book.formulas.map((f, i) => (
            <span
              key={f}
              className="font-mono text-[10px] rounded px-1.5 py-0.5"
              style={{
                color: `${book.color}${['bb', '88', '55'][i]}`,
                background: `${book.color}12`,
                border: `1px solid ${book.color}18`,
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Kontent */}
        <div className="relative flex flex-col h-full pl-6 pr-3 pt-6 pb-4">
          <span className="text-3xl mb-3 block">{book.icon}</span>

          <span
            className="inline-block rounded-full px-2 py-0.5 text-[11px] font-black mb-2 self-start"
            style={{
              background: `${book.color}20`,
              color: book.color,
              border: `1px solid ${book.color}40`,
            }}
          >
            {book.grade}-sinf
          </span>

          <h3 className="font-black text-white text-[13px] leading-tight mb-1">{book.subject}</h3>
          <p className="text-[11px] leading-snug mb-auto" style={{ color: 'rgba(180,190,210,0.7)' }}>
            {book.subtitle}
          </p>

          <div
            className="pt-2 flex justify-between mt-2"
            style={{ borderTop: `1px solid ${book.color}18` }}
          >
            <span className="text-[11px]" style={{ color: `${book.color}80` }}>{book.chapters} bob</span>
            <span className="text-[11px]" style={{ color: `${book.color}80` }}>{book.pages} bet</span>
          </div>
        </div>

        {/* Faol holat — yuqori chiziq */}
        {active && (
          <div
            className="absolute top-0 left-3 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, ${book.color}cc, transparent)` }}
          />
        )}
      </div>

      {/* Pastki yorliq */}
      <div className="mt-3.5 text-center transition-all duration-300">
        <p className="text-[13px] font-bold" style={{ color: active ? book.color : 'rgba(255,255,255,0.3)' }}>
          {book.grade}-sinf
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: active ? `${book.color}70` : 'rgba(255,255,255,0.13)' }}>
          {book.subject}
        </p>
      </div>
    </div>
  )
}

function MavzuList({ book }: { book: GradeBook }) {
  const [q, setQ] = useState('')
  const mavzular = book.mavzular ?? []
  const filtered = q.trim()
    ? mavzular.filter(m => m.mavzu.toLowerCase().includes(q.toLowerCase()))
    : mavzular

  const openPdf = (m: Mavzu) => {
    const url = pdfUrl(m.pdf)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      {/* Sarlavha + qidiruv */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${book.color}70` }}>
          Mavzular — {mavzular.length} ta
        </p>
        {mavzular.filter(m => m.pdf).length > 0 && (
          <span className="text-xs" style={{ color: `${book.color}60` }}>
            {mavzular.filter(m => m.pdf).length} ta PDF mavjud
          </span>
        )}
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: `${book.color}55` }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Mavzu nomini qidiring..."
          className="w-full rounded-xl py-2.5 pl-9 pr-9 text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${q ? book.color + '45' : 'rgba(255,255,255,0.09)'}`,
            color: 'rgba(220,230,245,0.9)',
          }}
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {mavzular.length === 0 ? (
        <p className="text-xs italic py-4 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Admin paneldan mavzular qo&apos;shing
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-xs" style={{ color: `${book.color}50` }}>&quot;{q}&quot; topilmadi</p>
      ) : (
        <div
          className="max-h-52 overflow-y-auto rounded-xl"
          style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${book.color}18` }}
        >
          {filtered.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-white/[0.04]"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              {/* Tartib raqami */}
              <span className="shrink-0 text-xs tabular-nums w-5 text-center" style={{ color: `${book.color}45` }}>
                {i + 1}
              </span>

              {/* Mavzu nomi */}
              <span className="flex-1 text-sm truncate" style={{ color: 'rgba(210,220,235,0.88)' }}>
                {m.mavzu}
              </span>

              {/* Bet raqami */}
              <span
                className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums"
                style={{ background: `${book.color}15`, color: `${book.color}cc`, border: `1px solid ${book.color}22` }}
              >
                {m.bet}-bet
              </span>

              {/* PDF tugmasi */}
              {m.pdf ? (
                <button
                  onClick={() => openPdf(m)}
                  className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all hover:brightness-125 active:scale-95"
                  style={{
                    background: `${book.color}22`,
                    color: book.color,
                    border: `1px solid ${book.color}40`,
                  }}
                >
                  <BookOpen className="h-3 w-3" />
                  O&apos;qish
                </button>
              ) : (
                <span className="shrink-0 w-[62px] text-center text-xs" style={{ color: 'rgba(255,255,255,0.12)' }}>
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DarsliklarPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [books, setBooks] = useState<GradeBook[]>(BOOKS)
  const [pdfViewer, setPdfViewer] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    darsliklarApi.list()
      .then((r) => {
        const data = r.data?.results ?? r.data
        if (Array.isArray(data) && data.length > 0) {
          setBooks(prev => prev.map(staticBook => {
            const apiBook = data.find((d: GradeBook & { pdf_file?: string }) => d.grade === staticBook.grade)
            if (!apiBook) return staticBook
            return {
              ...staticBook,
              ...apiBook,
              color: staticBook.color,
              dark: staticBook.dark,
            }
          }))
        }
      })
      .catch(() => {})
  }, [])

  const handleRead = (book: GradeBook) => {
    const url = pdfUrl((book as GradeBook & { pdf_file?: string }).pdf_file)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    else setPdfViewer({ url: '', title: book.subject })
  }

  const book = selected ? books.find(b => b.grade === selected) : null

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
          <div className="flex items-end justify-center gap-7 flex-wrap px-4 pb-5">
            {books.map(b => (
              <BookCard
                key={b.grade}
                book={b}
                active={selected === b.grade}
                onClick={() => setSelected(selected === b.grade ? null : b.grade)}
              />
            ))}
          </div>

          {/* Shelf taxtasi */}
          <div
            className="mx-auto rounded-2xl"
            style={{
              maxWidth: '840px',
              height: '8px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 6px 28px rgba(0,0,0,0.7)',
            }}
          />
          <div
            className="mx-auto mt-[3px]"
            style={{
              maxWidth: '820px',
              height: '3px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
              borderRadius: '0 0 8px 8px',
            }}
          />
        </div>

        {/* Tanlanmagan holat */}
        {!selected && (
          <p
            className="text-center text-sm mt-8 flex items-center justify-center gap-2"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            Kitobni bosib tanlang
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </p>
        )}

        {/* ── Tanlangan kitob detail ── */}
        {book && (
          <div
            key={book.grade}
            className="slide-up mt-8 rounded-3xl overflow-hidden"
            style={{
              // To'q opak fon — fon rasmi ko'rinmaydi
              background: `linear-gradient(135deg, ${book.dark}f8 0%, rgba(4,5,18,0.97) 100%)`,
              border: `1px solid ${book.color}28`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 50px ${book.color}10, 0 24px 60px rgba(0,0,0,0.6)`,
            }}
          >
            {/* Yuqori rang chizig'i */}
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${book.color}70 25%, ${book.color}cc 50%, ${book.color}70 75%, transparent 100%)`,
              }}
            />

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
                  style={{
                    background: `${book.color}18`,
                    color: book.color,
                    border: `1px solid ${book.color}40`,
                  }}
                >
                  {book.grade}-sinf
                </div>
                {/* Formulalar chap ustunda */}
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-0.5"
                    style={{ color: `${book.color}55` }}>
                    Formulalar
                  </p>
                  {book.formulas.map(f => (
                    <div
                      key={f}
                      className="rounded-xl px-3 py-2 text-center font-mono text-sm font-bold"
                      style={{
                        background: `${book.color}0e`,
                        color: book.color,
                        border: `1px solid ${book.color}25`,
                      }}
                    >
                      {f}
                    </div>
                  ))}
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
                    { label: 'Boblar',     value: `${book.chapters}` },
                    { label: 'Sahifalar',  value: `${book.pages}+` },
                    { label: 'Formulalar', value: `${book.formulas.length * 15}+` },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-4 text-center"
                      style={{
                        background: `${book.color}0c`,
                        border: `1px solid ${book.color}1e`,
                      }}
                    >
                      <p className="text-2xl font-black mb-0.5" style={{ color: book.color }}>{value}</p>
                      <p className="text-xs font-medium" style={{ color: 'rgba(160,180,210,0.5)' }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Ajratgich */}
                <div className="mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                {/* Mavzu qidiruv */}
                <div className="mb-7">
                  <MavzuList book={book} />
                </div>

                {/* CTA */}
                <div className="flex gap-3 flex-wrap items-center">
                  <button
                    onClick={() => handleRead(book)}
                    className="flex items-center gap-2.5 rounded-2xl px-6 py-3 font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${book.color}dd, ${book.color}88)`,
                      boxShadow: `0 4px 20px ${book.color}35`,
                      color: '#050510',
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Onlayn o&apos;qish
                  </button>
                  {(book as GradeBook & { pdf_file?: string }).pdf_file ? (
                    <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#34d399' }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      PDF mavjud
                    </span>
                  ) : (
                    <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                      PDF yuklanmagan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── PDF modal ── */}
      {pdfViewer && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
          onClick={() => setPdfViewer(null)}
        >
          <div
            className="rounded-3xl p-10 text-center max-w-sm mx-4"
            style={{
              background: 'rgba(5,6,22,0.99)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-5xl mb-5">📄</div>
            <h3 className="font-black text-white text-xl mb-2">{pdfViewer.title}</h3>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: 'rgba(160,180,210,0.6)' }}>
              Bu darslik uchun PDF hali yuklanmagan.<br />Admin paneldan PDF qo&apos;shing.
            </p>
            <button
              onClick={() => setPdfViewer(null)}
              className="rounded-2xl px-8 py-3 font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#0891b2,#2563eb)', boxShadow: '0 4px 20px rgba(8,145,178,0.3)' }}
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
