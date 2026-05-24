'use client'
import { useEffect, useState } from 'react'
import { referenslarApi } from '@/lib/api'
import { FlaskConical, Search } from 'lucide-react'

interface Formula {
  id: number; title: string; formula: string; description: string
  kategoriya: string; kategoriya_display: string; image: string | null; order: number
}

const KATEGORIYALAR = [
  { value: '', label: 'Barchasi' },
  { value: 'mexanika',      label: 'Mexanika' },
  { value: 'elektr',        label: 'Elektr va magnit' },
  { value: 'optika',        label: 'Optika' },
  { value: 'termodinamika', label: 'Termodinamika' },
  { value: 'kvant',         label: 'Kvant fizikasi' },
  { value: 'boshqa',        label: 'Boshqa' },
]

export default function FormulalarPage() {
  const [formulalar, setFormulalar] = useState<Formula[]>([])
  const [loading, setLoading]       = useState(true)
  const [kategoriya, setKategoriya] = useState('')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const r = await referenslarApi.formulalar(kategoriya || undefined)
        setFormulalar(r.data.results ?? r.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [kategoriya])

  const filtered = formulalar.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.formula.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Ma&apos;lumotnoma</span>
        </div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3">
          <FlaskConical className="h-9 w-9 text-blue-400" /> Formulalar
        </h1>
        <p className="text-gray-400 mt-1">Fizika formulalari to&apos;plami</p>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Qidirish..."
            className="w-full rounded-xl bg-gray-900/60 border border-gray-700/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {KATEGORIYALAR.map(k => (
            <button key={k.value} onClick={() => setKategoriya(k.value)}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              style={{
                background: kategoriya === k.value ? 'rgba(59,130,246,0.2)' : 'rgba(17,24,39,0.7)',
                border: `1px solid ${kategoriya === k.value ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
                color: kategoriya === k.value ? '#93c5fd' : '#6b7280',
              }}>
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Hozircha formulalar yo&apos;q</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(f => (
            <div key={f.id} className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1"
              style={{ background: 'rgba(8,8,25,0.8)', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(12px)' }}>
              {/* Formula */}
              <div className="rounded-xl px-4 py-3 text-center"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <code className="text-lg font-bold text-blue-300">{f.formula}</code>
              </div>
              <div>
                <h3 className="font-bold text-white">{f.title}</h3>
                {f.description && <p className="text-sm text-gray-400 mt-1 leading-relaxed">{f.description}</p>}
              </div>
              <span className="self-start rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                {f.kategoriya_display}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
