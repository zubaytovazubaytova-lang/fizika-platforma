'use client'
import { useEffect, useState } from 'react'
import { referenslarApi } from '@/lib/api'
import { Sigma, Search } from 'lucide-react'

interface FizikKattaik {
  id: number; nomi: string; belgi: string; olchov_birligi: string
  description: string; order: number
}

export default function FizikKattaliklar() {
  const [items, setItems]   = useState<FizikKattaik[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    referenslarApi.kattaliklar()
      .then(r => setItems(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i =>
    i.nomi.toLowerCase().includes(search.toLowerCase()) ||
    i.belgi.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Ma&apos;lumotnoma</span>
        </div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3">
          <Sigma className="h-9 w-9 text-emerald-400" /> Fizik kattaliklar
        </h1>
        <p className="text-gray-400 mt-1">Asosiy fizik kattaliklar, belgilari va o&apos;lchov birliklari</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Qidirish..."
          className="w-full rounded-xl bg-gray-900/60 border border-gray-700/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Hozircha ma&apos;lumot yo&apos;q</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-800">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500"
            style={{ background: 'rgba(17,24,39,0.8)' }}>
            <div className="col-span-4">Nomi</div>
            <div className="col-span-2 text-center">Belgisi</div>
            <div className="col-span-3">O&apos;lchov birligi</div>
            <div className="col-span-3">Tavsif</div>
          </div>
          {/* Rows */}
          {filtered.map((item, i) => (
            <div key={item.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 text-sm transition-colors hover:bg-white/[0.03]"
              style={{
                background: i % 2 === 0 ? 'rgba(8,8,25,0.6)' : 'rgba(12,12,35,0.6)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}>
              <div className="col-span-4 font-semibold text-white">{item.nomi}</div>
              <div className="col-span-2 text-center">
                <span className="rounded-lg px-3 py-1 text-base font-bold italic"
                  style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                  {item.belgi}
                </span>
              </div>
              <div className="col-span-3 text-gray-300">
                <code className="rounded bg-gray-800 px-2 py-0.5 text-xs">{item.olchov_birligi}</code>
              </div>
              <div className="col-span-3 text-gray-500 text-xs leading-relaxed">{item.description || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
