'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, BookOpen, ChevronRight, GripVertical, ChevronDown, Search, Layers } from 'lucide-react'

const SECTIONS = [
  { id: 1,  name: 'Kinematika',                   icon: '🏃', color: '#00D4FF', desc: "Jismlar harakati: tezlik, tezlanish va yo'l hisoblash qonunlari." },
  { id: 2,  name: 'Dinamika',                      icon: '⚙️', color: '#8B5CF6', desc: "Kuch va massa o'rtasidagi bog'liqlik, Nyuton qonunlari." },
  { id: 3,  name: 'Saqlanish qonunlari',           icon: '♾️', color: '#34D399', desc: "Energiya, impuls va moment saqlanish qonunlari." },
  { id: 4,  name: 'Statika',                       icon: '⚖️', color: '#FFB347', desc: "Muvozanat sharoitlari, tayanch reaksiyalari." },
  { id: 5,  name: 'Suyuqlik va gazlar mexanikasi', icon: '💧', color: '#3B82F6', desc: "Gidrostatika, Bernulli qonuni, suyuqlik oqimi." },
  { id: 6,  name: 'Mexanik tebranishlar',          icon: '〰️', color: '#EC4899', desc: "Mayatnik, rezonans, garmonik tebranishlar." },
  { id: 7,  name: 'Molekulyar fizika',             icon: '🔬', color: '#06B6D4', desc: "Molekulalar harakati, diffuziya, ideal gaz modeli." },
  { id: 8,  name: 'Termodinamika',                 icon: '🌡️', color: '#F97316', desc: "Issiqlik mashinalari, entropiya va termodinamika qonunlari." },
  { id: 9,  name: 'Elektrostatika',                icon: '⚡', color: '#EAB308', desc: "Elektr zaryadlar, Kulon qonuni, elektr maydon." },
  { id: 10, name: "O'zgarmas tok",                 icon: '🔋', color: '#10B981', desc: "Om va Kirxgof qonunlari, zanjir hisoblash, quvvat." },
  { id: 11, name: "Turli muhitlarda elektr toki",  icon: '💡', color: '#A78BFA', desc: "Metallarda, gazlarda, suyuqliklarda tok." },
  { id: 12, name: 'Magnetizm',                     icon: '🧲', color: '#EF4444', desc: "Magnit maydon, induksiya, elektromagnit tebranishlar." },
  { id: 13, name: 'Optika',                        icon: '🔭', color: '#F59E0B', desc: "Nur tarqalishi, linzalar, interferensiya." },
  { id: 14, name: 'Atom va yadro fizikasi',        icon: '⚛️', color: '#6366F1', desc: "Atom modeli, radioaktivlik, yadroviy reaksiyalar." },
  { id: 15, name: 'Astronomiya',                   icon: '🌌', color: '#8B5CF6', desc: "Quyosh sistemasi, yulduzlar evolyutsiyasi, kosmologiya." },
]

const SECTION_TOPICS: Record<number, string[]> = {
  1:  ["Mexanik harakat", "Tekis chiziqli harakat", "Tezlanuvchan harakat", "Erkin tushish", "Proyeksion harakat", "Aylanma harakat", "Nisbiy harakat", "Tezlik va tezlanish grafiklari"],
  2:  ["Nyuton I qonuni", "Nyuton II qonuni", "Nyuton III qonuni", "Ishqalanish kuchi", "Tortishish kuchi", "Elastiklik kuchi", "Og'irlik kuchi", "Markazga intilma kuch"],
  3:  ["Impuls saqlanish qonuni", "Energiya saqlanish qonuni", "Mexanik energiya", "Potensial energiya", "Kinetik energiya", "Ish va quvvat", "Moment saqlanish qonuni"],
  4:  ["Muvozanat shartlari", "Kuchlar momenti", "Og'irlik markazi", "Richag qoidasi", "Tayanch reaksiyalari", "Mustahkamlik asoslari"],
  5:  ["Gidrostatika", "Arximed qonuni", "Bernulli qonuni", "Paskal qonuni", "Suyuqlik bosimi", "Kapillyarlik", "Yuzaki taranglik"],
  6:  ["Garmonik tebranishlar", "Matematik mayatnik", "Fizik mayatnik", "Rezonans", "Majburiy tebranishlar", "Tebranish energiyasi", "So'nuvchi tebranishlar"],
  7:  ["Molekulyar-kinetik nazariya", "Ideal gaz", "Diffuziya", "Broun harakati", "Gazning bosimi", "Temperaturaning kinetik ma'nosi", "Agregat holatlar"],
  8:  ["Termodinamika I qonuni", "Termodinamika II qonuni", "Izotermik jarayon", "Izobarik jarayon", "Izoxorik jarayon", "Adiabatik jarayon", "Issiqlik mashinasi", "Entropiya"],
  9:  ["Elektr zaryad", "Kulon qonuni", "Elektr maydon", "Elektr potensial", "Kondensator", "Dielektriklar", "Elektr sig'imi"],
  10: ["Om qonuni", "Kirxgof qonunlari", "Qarshilik", "Elektr zanjiri", "O'tkazgichlar ulanishi", "Elektr quvvati", "EYuK va ichki qarshilik"],
  11: ["Metallardagi tok", "Gazlardagi tok", "Vakuumdagi tok", "Suyuqliklardagi tok", "Yarimo'tkazgichlar", "Diod", "Tranzistor"],
  12: ["Magnit maydon", "Amper kuchi", "Lorens kuchi", "Elektromagnit induksiya", "Faredey qonuni", "Lenz qoidasi", "Transformator", "Elektromagnit to'lqinlar"],
  13: ["Nur tarqalishi", "Sinish qonuni", "To'liq ichki aks etish", "Linzalar", "Ko'zgu", "Interferensiya", "Difraksiya", "Dispersiya", "Polyarizatsiya"],
  14: ["Atom tuzilishi", "Bor modeli", "Fotoeffekt", "Rentgen nurlari", "Radioaktivlik", "Yadro reaksiyalari", "Elementar zarralar"],
  15: ["Quyosh sistemasi", "Yulduzlar", "Galaktikalar", "Kosmologiya", "Qora tuynuklar", "Teleskoplar", "Fazo va vaqt"],
}

interface Topic {
  id: string
  title: string
  order: number
}

export default function BolimDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sectionId = Number(params.id)
  const section = SECTIONS.find(s => s.id === sectionId)

  const [topics, setTopics] = useState<Topic[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const allTopics = SECTION_TOPICS[sectionId] ?? []
  const filteredTopics = allTopics.filter(t =>
    t.toLowerCase().includes(search.toLowerCase()) &&
    !topics.some(existing => existing.title === t)
  )

  useEffect(() => {
    const stored = localStorage.getItem(`bolim-topics-${sectionId}`)
    if (stored) {
      try { setTopics(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [sectionId])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (dropdownOpen) setTimeout(() => searchRef.current?.focus(), 50)
  }, [dropdownOpen])

  const persist = (updated: Topic[]) => {
    setTopics(updated)
    localStorage.setItem(`bolim-topics-${sectionId}`, JSON.stringify(updated))
  }

  const selectTopic = (title: string) => {
    const topic: Topic = { id: Date.now().toString(), title, order: topics.length + 1 }
    persist([...topics, topic])
    setSearch('')
    setDropdownOpen(false)
  }

  const removeTopic = (id: string) => {
    persist(topics.filter(t => t.id !== id))
  }

  if (!section) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Bo&apos;lim topilmadi</p>
          <button onClick={() => router.push('/courses')} className="text-cyan-400 hover:underline">
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">

      {/* Back */}
      <button
        onClick={() => router.push('/courses')}
        className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Barcha bo&apos;limlar
      </button>

      {/* Header */}
      <div
        className="mb-10 rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${section.color}12, rgba(8,8,25,0.9))`,
          border: `1px solid ${section.color}30`,
        }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${section.color}18`, border: `1px solid ${section.color}30` }}
          >
            {section.icon}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: section.color }}>
              {sectionId}-bo&apos;lim
            </p>
            <h1 className="text-3xl font-black text-white">{section.name}</h1>
          </div>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{section.desc}</p>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <BookOpen className="h-3.5 w-3.5" style={{ color: section.color }} />
          <span>{topics.length} ta mavzu</span>
        </div>
      </div>

      {/* Topic selector */}
      <div className="mb-8" ref={dropdownRef}>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4" style={{ color: section.color }} />
          <p className="text-sm font-bold text-white">Mavzu tanlang</p>
          <span className="text-xs text-gray-600 ml-1">
            — {filteredTopics.length + topics.filter(t => allTopics.includes(t.title)).length} ta mavzu mavjud
          </span>
        </div>

        {/* Trigger */}
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm transition-all text-left group"
          style={{
            background: dropdownOpen ? `${section.color}10` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${dropdownOpen ? section.color + '60' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: dropdownOpen ? `0 0 24px ${section.color}20` : 'none',
          }}
        >
          <span
            className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: dropdownOpen ? `${section.color}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${dropdownOpen ? section.color + '40' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <Search className="h-4 w-4" style={{ color: dropdownOpen ? section.color : '#6b7280' }} />
          </span>
          <span className={`flex-1 font-medium transition-colors ${dropdownOpen ? 'text-white' : 'text-gray-500'}`}>
            {dropdownOpen ? 'Qidiring yoki tanlang...' : 'Bosing va mavzuni tanlang'}
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform flex-shrink-0"
            style={{
              color: section.color,
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            className="mt-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(6,6,20,0.97)',
              border: `1px solid ${section.color}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${section.color}15`,
            }}
          >
            {/* Search inside dropdown */}
            <div className="p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Search className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Mavzu qidirish..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filteredTopics.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-gray-600 text-sm">
                    {search ? `"${search}" topilmadi` : 'Barcha mavzular qo\'shilgan'}
                  </p>
                </div>
              ) : (
                filteredTopics.map((title, i) => (
                  <button
                    key={i}
                    onClick={() => selectTopic(title)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5 group"
                  >
                    <span
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all group-hover:scale-110"
                      style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}20` }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors">{title}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: `${section.color}20`, color: section.color }}
                    >
                      + Qo&apos;sh
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Topics list */}
      {topics.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'rgba(8,8,25,0.5)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <div className="text-4xl mb-3">📂</div>
          <p className="text-gray-500 text-sm">Hali mavzu tanlanmagan</p>
          <p className="text-gray-600 text-xs mt-1">Yuqoridagi selectordan mavzu tanlang</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map((topic, i) => (
            <div
              key={topic.id}
              className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(8,8,25,0.75)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <GripVertical className="h-4 w-4 text-gray-700 flex-shrink-0" />

              <span
                className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: `${section.color}15`,
                  color: section.color,
                  border: `1px solid ${section.color}25`,
                }}
              >
                {i + 1}
              </span>

              <span className="flex-1 font-semibold text-white text-sm">{topic.title}</span>

              <button
                onClick={() => removeTopic(topic.id)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <Link
                href={`/bo-lim/${sectionId}/${topic.id}`}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all hover:brightness-125"
                style={{
                  background: `${section.color}15`,
                  color: section.color,
                  border: `1px solid ${section.color}25`,
                }}
              >
                Ochish
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
