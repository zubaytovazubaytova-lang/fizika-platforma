'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, Check, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'mexanika',
    label: 'MEXANIKA',
    icon: '⚙️',
    color: '#60a5fa',
    items: [
      { id: 'pendulum',  label: 'Matematik mayatnik',         icon: '🕰️', available: true  },
      { id: 'tezlik',   label: 'Tezlik. Yo\'l. Vaqt. Tezlanish', icon: '🚀', available: true  },
      { id: 'free-fall', label: 'Erkin tushish',               icon: '🎯', available: false },
      { id: 'rotation',  label: 'Aylanma harakat',             icon: '🌀', available: false },
      { id: 'collision', label: "To'qnashuv",                  icon: '💥', available: false },
      { id: 'gravity',   label: "g = 9.8 — Yerning Imzosi",    icon: '🌍', available: true  },
      { id: 'harmonic',  label: 'Garmonik tebranish',          icon: '〰️', available: false },
    ],
  },
  {
    id: 'electr',
    label: 'ELEKTR VA MAGNIT',
    icon: '⚡',
    color: '#fbbf24',
    items: [
      { id: 'electric',    label: 'Elektr maydon',              icon: '⚡', available: true  },
      { id: 'elektroskop', label: 'Elektroskop',                icon: '🔬', available: true  },
      { id: 'capacitor',  label: 'Kondensator zaryadlanishi',   icon: '🔋', available: false },
      { id: 'magnetic',   label: 'Magnit maydon',              icon: '🧲', available: false },
      { id: 'em-wave',    label: "Elektromagnit to'lqin",       icon: '〰️', available: false },
      { id: 'circuit',    label: 'Elektr zanjiri',             icon: '💡', available: false },
    ],
  },
  {
    id: 'waves',
    label: "TO'LQIN VA OPTIKA",
    icon: '🌊',
    color: '#a78bfa',
    items: [
      { id: 'interference', label: "To'lqin interferensiyasi", icon: '〰️', available: false },
      { id: 'refraction',   label: "Yorug'lik sinishi",         icon: '🔆', available: false },
      { id: 'diffraction',  label: 'Difraksiya',               icon: '🌈', available: false },
      { id: 'resonance',    label: 'Rezonans va ovoz',          icon: '🎵', available: false },
    ],
  },
  {
    id: 'hydro',
    label: 'GIDROSTATIKA',
    icon: '💧',
    color: '#38bdf8',
    items: [
      { id: 'paskal',       label: 'Paskal qonuni (silindr)',     icon: '💧', available: true  },
      { id: 'paskal-shar', label: 'Paskal shari (360°)',         icon: '🔵', available: true  },
      { id: 'arximed',    label: 'Arximed kuchi',               icon: '⚓', available: false },
      { id: 'bernulli',   label: 'Bernulli tenglamasi',         icon: '🌊', available: false },
      { id: 'kapillyar',  label: 'Kapillyarlik',                icon: '🧪', available: false },
    ],
  },
  {
    id: 'thermo',
    label: 'TERMODINAMIKA',
    icon: '🔥',
    color: '#f87171',
    items: [
      { id: 'gas',    label: 'Ideal gaz molekulalari', icon: '💨', available: false },
      { id: 'heat',   label: 'Issiqlik uzatilishi',    icon: '🔥', available: false },
      { id: 'carnot', label: 'Karno sikli',            icon: '⚙️', available: false },
    ],
  },
  {
    id: 'quantum',
    label: 'KVANT FIZIKA',
    icon: '⚛️',
    color: '#34d399',
    items: [
      { id: 'tunnel',       label: 'Kvant tunnel effekti',     icon: '⚛️', available: false },
      { id: 'wave-particle',label: "To'lqin-zarra dualizmi",   icon: '🌊', available: false },
      { id: 'photoeffect',  label: 'Fotoeffekt',               icon: '💡', available: false },
    ],
  },
]

type Item = (typeof CATEGORIES)[0]['items'][0]
type Cat  = (typeof CATEGORIES)[0]

interface SimSelectorProps {
  activeId: string | null
  viewedId: string | null
  onSelect: (id: string) => void      // 3D yuklash (faqat available)
  onView:   (id: string) => void      // info ko'rish (har qanday)
}

export default function SimSelector({ activeId, viewedId, onSelect, onView }: SimSelectorProps) {
  const [open, setOpen]         = useState(false)
  const [query, setQuery]       = useState('')
  const [hoveredId, setHovered] = useState<string | null>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSim = CATEGORIES.flatMap(c => c.items).find(i => i.id === viewedId) ?? null

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function handleSelect(item: Item) {
    onView(item.id)                    // har doim info ko'rsat
    if (item.available) onSelect(item.id)  // faqat available bo'lsa 3D yukla
    setQuery(item.label)
    setOpen(false)
  }

  const q = query.toLowerCase()
  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    items: q
      ? cat.items.filter(
          item => item.label.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q)
        )
      : cat.items,
  })).filter(cat => cat.items.length > 0)

  return (
    <div
      className="flex flex-col rounded-2xl"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,24,0.97)', height: '100%' }}
    >
      <div className="px-4 pt-3 pb-2">
        <div ref={wrapRef} className="relative">

          {/* Single trigger — click to open categories */}
          <button
            onClick={() => { setOpen(v => !v); if (!open) inputRef.current?.focus() }}
            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${open ? 'rgba(96,165,250,0.55)' : 'rgba(255,255,255,0.11)'}`,
              boxShadow: open ? '0 0 0 3px rgba(96,165,250,0.08)' : 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
          >
            <Search className="h-4 w-4 shrink-0" style={{ color: open ? '#60a5fa' : '#4b5563' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onClick={e => e.stopPropagation()}
              placeholder="Fizik hodisani qidiring yoki tanlang..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600 cursor-pointer"
              readOnly={!open}
            />
            {query && open && (
              <button
                onMouseDown={e => { e.preventDefault(); setQuery(''); inputRef.current?.focus() }}
                onClick={e => e.stopPropagation()}
                className="text-xl leading-none text-gray-600 hover:text-gray-400 transition-colors"
              >×</button>
            )}
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-200"
              style={{ color: open ? '#60a5fa' : '#4b5563', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-y-auto"
              style={{
                background: 'rgba(6,6,18,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 16px 56px rgba(0,0,0,0.75)',
                maxHeight: 320,
                zIndex: 60,
              }}
            >
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-600">Hech narsa topilmadi</div>
              ) : (
                filtered.map((cat: Cat & { items: Item[] }) => (
                  <div key={cat.id}>
                    {/* Category header */}
                    <div
                      className="sticky top-0 flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest"
                      style={{
                        background: 'rgba(6,6,18,0.98)',
                        color: cat.color,
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>

                    {/* Items */}
                    {cat.items.map((item: Item) => {
                      const isViewed  = viewedId === item.id
                      const isLoaded  = activeId === item.id
                      const isHovered = hoveredId === item.id

                      let bg = 'transparent'
                      if (isViewed)              bg = `${cat.color}18`
                      if (isHovered && !isViewed) bg = `${cat.color}10`

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setHovered(item.id)}
                          onMouseLeave={() => setHovered(null)}
                          className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors"
                          style={{
                            background: bg,
                            opacity: item.available ? 1 : 0.55,
                            cursor: 'pointer',
                          }}
                        >
                          <span className="text-base leading-none">{item.icon}</span>
                          <span
                            className="flex-1 text-sm"
                            style={{ color: isViewed ? cat.color : '#d1d5db' }}
                          >
                            {item.label}
                          </span>
                          {isLoaded ? (
                            <Check className="h-3.5 w-3.5 shrink-0" style={{ color: cat.color }} />
                          ) : !item.available ? (
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-xs"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#4b5563' }}
                            >
                              Tez orada
                            </span>
                          ) : (
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-xs"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280' }}
                            >
                              Yukla
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Active sim badge */}
        {activeSim && (
          <div
            className="mt-3 flex items-center gap-2.5 rounded-xl px-4 py-2.5"
            style={{
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
            }}
          >
            <span className="text-base">{activeSim.icon}</span>
            <span className="flex-1 text-sm font-medium text-green-300">{activeSim.label}</span>
            <span className="text-xs text-green-500">● Faol</span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-700">
          <span>
            {CATEGORIES.flatMap(c => c.items).filter(i => i.available).length} ta mavjud
          </span>
          <span>
            {CATEGORIES.flatMap(c => c.items).length} ta jami
          </span>
        </div>
      </div>
    </div>
  )
}
