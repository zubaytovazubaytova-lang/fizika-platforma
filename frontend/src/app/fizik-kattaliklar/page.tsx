'use client'
import { useEffect, useState } from 'react'
import { referenslarApi } from '@/lib/api'
import { Sigma, Ruler, Search, FileDown, ExternalLink } from 'lucide-react'

interface FizikKattaik {
  id: number; nomi: string; belgi: string; olchov_birligi: string
  description: string; order: number
}
interface FizikBirlik {
  id: number; nomi: string; belgi: string; sistema: string
  sistema_display: string; description: string; order: number
}

const SISTEMA_COLORS: Record<string, string> = {
  SI: '#a78bfa', CGS: '#fb923c', boshqa: '#6b7280',
}
const SISTEMALAR = [
  { value: '', label: 'Barchasi' },
  { value: 'SI', label: 'SI' },
  { value: 'CGS', label: 'CGS' },
  { value: 'boshqa', label: 'Boshqa' },
]

export default function FizikMalumotnoma() {
  const [tab, setTab]             = useState<'kattaliklar' | 'birliklar'>('kattaliklar')
  const [search, setSearch]       = useState('')
  const [sistema, setSistema]     = useState('')

  const [kattaliklar, setKattaliklar] = useState<FizikKattaik[]>([])
  const [birliklar, setBirliklar]     = useState<FizikBirlik[]>([])
  const [loadingK, setLoadingK]       = useState(true)
  const [loadingB, setLoadingB]       = useState(true)

  useEffect(() => {
    referenslarApi.kattaliklar()
      .then(r => setKattaliklar(r.data.results ?? r.data))
      .finally(() => setLoadingK(false))
    referenslarApi.birliklar()
      .then(r => setBirliklar(r.data.results ?? r.data))
      .finally(() => setLoadingB(false))
  }, [])

  const filteredK = kattaliklar.filter(i =>
    i.nomi.toLowerCase().includes(search.toLowerCase()) ||
    i.belgi.toLowerCase().includes(search.toLowerCase())
  )
  const filteredB = birliklar.filter(i =>
    (i.nomi.toLowerCase().includes(search.toLowerCase()) ||
     i.belgi.toLowerCase().includes(search.toLowerCase())) &&
    (sistema === '' || i.sistema === sistema)
  )

  const loading = tab === 'kattaliklar' ? loadingK : loadingB

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Ma&apos;lumotnoma</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-4xl font-black text-white">
            Fizik <span className="text-emerald-400">Ma&apos;lumotnoma</span>
          </h1>
          {tab === 'kattaliklar' && (
            <div className="flex items-center gap-2 mt-2">
              <a href="/Fizik_Kattaliklar.pdf" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#059669,#065f46)', color: '#fff', border: '1px solid rgba(52,211,153,0.3)' }}>
                <ExternalLink className="h-4 w-4" /> Ko&apos;rish
              </a>
              <a href="/Fizik_Kattaliklar.pdf" download="Fizik_Kattaliklar.pdf"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:brightness-110"
                style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                <FileDown className="h-4 w-4" /> PDF
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tabs + Search — bitta qatorda */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* Tabs */}
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => { setTab('kattaliklar'); setSearch('') }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all"
            style={{
              background: tab === 'kattaliklar' ? 'rgba(52,211,153,0.15)' : 'transparent',
              color: tab === 'kattaliklar' ? '#34d399' : '#6b7280',
              border: tab === 'kattaliklar' ? '1px solid rgba(52,211,153,0.3)' : '1px solid transparent',
            }}>
            <Sigma className="h-4 w-4" /> Kattaliklar
            <span className="rounded-full px-1.5 py-0.5 text-xs" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
              {kattaliklar.length}
            </span>
          </button>
          <button onClick={() => { setTab('birliklar'); setSearch(''); setSistema('') }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all"
            style={{
              background: tab === 'birliklar' ? 'rgba(167,139,250,0.15)' : 'transparent',
              color: tab === 'birliklar' ? '#c4b5fd' : '#6b7280',
              border: tab === 'birliklar' ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
            }}>
            <Ruler className="h-4 w-4" /> Birliklar
            <span className="rounded-full px-1.5 py-0.5 text-xs" style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd' }}>
              {birliklar.length}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'kattaliklar' ? 'Kattaik yoki belgi bo\'yicha...' : 'Birlik yoki belgi bo\'yicha...'}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none"
            style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${tab === 'kattaliklar' ? 'rgba(52,211,153,0.2)' : 'rgba(167,139,250,0.2)'}` }}
          />
        </div>

        {/* Sistema filter — faqat birliklar tabida */}
        {tab === 'birliklar' && (
          <div className="flex gap-2">
            {SISTEMALAR.map(s => (
              <button key={s.value} onClick={() => setSistema(s.value)}
                className="rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                style={{
                  background: sistema === s.value ? 'rgba(167,139,250,0.15)' : 'rgba(17,24,39,0.7)',
                  border: `1px solid ${sistema === s.value ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: sistema === s.value ? '#c4b5fd' : '#6b7280',
                }}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${tab === 'kattaliklar' ? 'border-emerald-500' : 'border-violet-500'}`} />
        </div>
      ) : tab === 'kattaliklar' ? (
        filteredK.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Hech narsa topilmadi</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-800">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500"
              style={{ background: 'rgba(17,24,39,0.8)' }}>
              <div className="col-span-4">Nomi</div>
              <div className="col-span-2 text-center">Belgisi</div>
              <div className="col-span-3">O&apos;lchov birligi</div>
              <div className="col-span-3">Tavsif</div>
            </div>
            {filteredK.map((item, i) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm transition-colors hover:bg-white/[0.03]"
                style={{ background: i % 2 === 0 ? 'rgba(8,8,25,0.6)' : 'rgba(12,12,35,0.6)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
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
        )
      ) : (
        filteredB.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Hech narsa topilmadi</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredB.map(item => {
              const c = SISTEMA_COLORS[item.sistema] ?? '#6b7280'
              return (
                <div key={item.id} className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(8,8,25,0.8)', border: `1px solid ${c}25`, backdropFilter: 'blur(12px)' }}>
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
        )
      )}
    </div>
  )
}
