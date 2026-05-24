'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const TOPICS = [
  { id:'tezlik', name:'Tezlik. Yo\'l. Vaqt. Tezlanish', icon:'🚀', color:'#7C3AED', href:'/simulations/mexanika/tezlik', desc:'v = s/t • s = v₀t + ½at²' },
  { id:'kuch',   name:'Kuch va tezlanish',              icon:'💪', color:'#06b6d4', href:'#', desc:'F = ma',        soon:true },
  { id:'energiya', name:'Energiya va ish',              icon:'⚡', color:'#f59e0b', href:'#', desc:'E = mgh, A = Fs', soon:true },
  { id:'impuls', name:'Impuls',                         icon:'💥', color:'#ef4444', href:'#', desc:'p = mv',        soon:true },
  { id:'grav',   name:'Gravitatsiya',                   icon:'🌍', color:'#34d399', href:'#', desc:'F = Gm₁m₂/r²', soon:true },
  { id:'mayt',   name:'Mayatnik harakati',              icon:'🔴', color:'#a855f7', href:'#', desc:'T = 2π√(L/g)',  soon:true },
]

export default function MexanikaPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <Link href="/simulations" style={{ color:'#7C3AED', textDecoration:'none', fontWeight:600 }}>3D Simulatsiyalar</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white font-bold">Mexanika</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background:'#7C3AED' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color:'#7C3AED' }}>Mexanika</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">⚙️ Mexanika mavzulari</h1>
          <p className="text-gray-400">Mavzuni tanlang va 3D simulatsiyani boshlang</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link key={t.id} href={t.href}
              className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background:`linear-gradient(160deg,rgba(5,5,20,0.88) 0%,${t.color}18 100%)`, border:`2px solid ${t.color}${t.soon?'30':'55'}`, textDecoration:'none', pointerEvents:t.soon?'none':'auto' }}
            >
              <div style={{ height:3, background:`linear-gradient(90deg,${t.color},${t.color}22)` }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize:28 }}>{t.icon}</span>
                  {t.soon
                    ? <span style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'2px 8px', fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>TEZDA</span>
                    : <span style={{ background:`${t.color}20`, border:`1px solid ${t.color}50`, borderRadius:20, padding:'2px 10px', fontSize:9, fontWeight:800, color:t.color }}>TAYYOR</span>
                  }
                </div>
                <h3 style={{ fontWeight:800, fontSize:14, color: t.soon ? 'rgba(255,255,255,0.45)' : '#fff', marginBottom:4, lineHeight:1.4 }}>{t.name}</h3>
                <p style={{ fontSize:12, color:t.color, fontWeight:700, fontFamily:'monospace', opacity: t.soon ? 0.5 : 1 }}>{t.desc}</p>
                {!t.soon && (
                  <div className="mt-3 flex items-center gap-1" style={{ color:t.color, fontSize:12, fontWeight:700 }}>
                    Simulatsiyani boshlash <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
