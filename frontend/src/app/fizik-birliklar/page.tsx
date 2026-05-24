'use client'
import { useEffect, useState } from 'react'
import { referenslarApi } from '@/lib/api'
import { Ruler, Search } from 'lucide-react'

interface FizikBirlik {
  id: number; nomi: string; belgi: string; sistema: string
  sistema_display: string; description: string; order: number
}

const SISTEMALAR = [
  { value: '', label: 'Barchasi' },
  { value: 'SI',     label: 'SI' },
  { value: 'CGS',    label: 'CGS' },
  { value: 'boshqa', label: 'Boshqa' },
]

const SISTEMA_COLORS: Record<string, string> = {
  SI:     '#a78bfa',
  CGS:    '#fb923c',
  boshqa: '#6b7280',
}

export default function FizikBirliklar() {
  const [items, setItems]       = useState<FizikBirlik[]>([])
  const [loading, setLoading]   = useState(true)
  const [sistema, setSistema]   = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    referenslarApi.birliklar(sistema || undefined)
      .then(r => setItems(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }, [sistema])

  const filtered = items.filter(i =>
    i.nomi.toLowerCase().includes(search.toLowerCase()) ||
    i.belgi.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Ma&apos;lumotnoma</span>
        </div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3">
          <Ruler className="h-9 w-9 text-violet-400" /> Fizik birliklar
        </h1>
        <p className="text-gray-400 mt-1">O&apos;lchov birliklari va ularning xalqaro tizimdagi o&apos;rni</p>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Qidirish..."
            className="w-full rounded-xl bg-gray-900/60 border border-gray-700/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500"
          />
        </div>
        <div className="flex gap-2">
          {SISTEMALAR.map(s => (
            <button key={s.value} onClick={() => setSistema(s.value)}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              style={{
                background: sistema === s.value ? 'rgba(167,139,250,0.15)' : 'rgba(17,24,39,0.7)',
                border: `1px solid ${sistema === s.value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: sistema === s.value ? '#c4b5fd' : '#6b7280',
              }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Hozircha ma&apos;lumot yo&apos;q</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => {
            const c = SISTEMA_COLORS[item.sistema] ?? '#6b7280'
            return (
              <div key={item.id} className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1"
                style={{ background: 'rgba(8,8,25,0.8)', border: `1px solid ${c}20`, backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg px-3 py-1.5 text-2xl font-bold italic"
                    style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}>
                    {item.belgi}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: `${c}15`, color: c, border: `1px solid ${c}25` }}>
                    {item.sistema}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white">{item.nomi}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
