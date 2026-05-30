'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, BookOpen, ChevronRight, GripVertical } from 'lucide-react'

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
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`bolim-topics-${sectionId}`)
    if (stored) {
      try { setTopics(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [sectionId])

  const persist = (updated: Topic[]) => {
    setTopics(updated)
    localStorage.setItem(`bolim-topics-${sectionId}`, JSON.stringify(updated))
  }

  const addTopic = () => {
    const title = newTitle.trim()
    if (!title) return
    const topic: Topic = { id: Date.now().toString(), title, order: topics.length + 1 }
    persist([...topics, topic])
    setNewTitle('')
    inputRef.current?.focus()
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

      {/* Add topic */}
      <div
        className="mb-8 rounded-2xl p-5"
        style={{ background: 'rgba(8,8,25,0.8)', border: `1px solid ${section.color}20` }}
      >
        <p className="text-sm font-bold text-white mb-3">Yangi mavzu qo&apos;shish</p>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTopic()}
            placeholder="Mavzu nomini kiriting... (Enter bilan qo'shing)"
            className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${newTitle ? section.color + '50' : 'rgba(255,255,255,0.08)'}`,
            }}
          />
          <button
            onClick={addTopic}
            disabled={!newTitle.trim()}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
              color: '#000',
              boxShadow: newTitle.trim() ? `0 4px 20px ${section.color}40` : 'none',
            }}
          >
            <Plus className="h-4 w-4" />
            Qo&apos;shish
          </button>
        </div>
      </div>

      {/* Topics list */}
      {topics.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'rgba(8,8,25,0.5)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-500 text-sm">Hali mavzu qo&apos;shilmagan</p>
          <p className="text-gray-600 text-xs mt-1">Yuqoridagi forma orqali mavzu qo&apos;shing</p>
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
