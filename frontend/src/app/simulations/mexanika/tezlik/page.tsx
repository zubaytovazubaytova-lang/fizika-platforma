'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const MechanicsSimulation = dynamic(
  () => import('@/components/simulations/MechanicsSimulation'),
  { ssr: false, loading: () => (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', fontSize:14 }}>
      3D muhit yuklanmoqda...
    </div>
  )}
)

export default function TezlikSimulationPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 64px)', overflow:'hidden' }}>
      {/* Breadcrumb */}
      <div style={{
        display:'flex', alignItems:'center', gap:6, padding:'10px 16px',
        background:'rgba(5,8,25,0.7)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(124,58,237,0.2)', flexShrink:0,
        fontSize:12, flexWrap:'wrap',
      }}>
        <Link href="/simulations" style={{ color:'#7C3AED', textDecoration:'none', fontWeight:700 }}>3D Simulatsiyalar</Link>
        <ChevronRight className="h-3.5 w-3.5" style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
        <Link href="/simulations/mexanika" style={{ color:'#7C3AED', textDecoration:'none', fontWeight:700 }}>Mexanika</Link>
        <ChevronRight className="h-3.5 w-3.5" style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
        <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:700 }}>Tezlik · Yo&apos;l · Vaqt · Tezlanish</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:16, fontFamily:'monospace', fontSize:11 }}>
          {[['v','=','s/t','#7C3AED'],['s','=','v₀t + ½at²','#06b6d4'],['a','=','Δv/t','#f59e0b']].map(([l,eq,f,c]) => (
            <span key={l} style={{ color:'rgba(255,255,255,0.45)' }}>
              <span style={{ color:c, fontWeight:700 }}>{l}</span> {eq} <span style={{ color:c }}>{f}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Simulation (flex:1 fills remaining height) */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:0 }}>
        <MechanicsSimulation />
      </div>
    </div>
  )
}
