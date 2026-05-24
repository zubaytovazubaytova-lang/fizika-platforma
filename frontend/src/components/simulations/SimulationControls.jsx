'use client'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function SimulationControls({
  speed, setSpeed,
  distance, setDistance,
  time, setTime,
  acceleration, setAcceleration,
  running, onStart, onPause, onReset,
  elapsed, currentDist, currentSpeed,
}) {
  const progress = distance > 0 ? Math.min((currentDist / distance) * 100, 100) : 0

  return (
    <div style={{ background:'rgba(5,8,25,0.88)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(124,58,237,0.25)', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
      {/* Inputs row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { label:'Tezlik (v)', unit:'m/s', val:speed, set:setSpeed, color:'#7C3AED' },
          { label:"Yo'l (s)", unit:'m', val:distance, set:setDistance, color:'#06b6d4' },
          { label:'Vaqt (t)', unit:'s', val:time, set:setTime, color:'#f59e0b' },
          { label:'Tezlanish (a)', unit:'m/s²', val:acceleration, set:setAcceleration, color:'#ef4444' },
        ].map(({ label, unit, val, set, color }) => (
          <div key={label}>
            <label style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>{label}</label>
            <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.06)', border:`1.5px solid ${color}40`, borderRadius:10, padding:'6px 10px' }}>
              <input
                type="number"
                value={val}
                onChange={e => set(Number(e.target.value))}
                style={{ background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:14, fontWeight:700, width:'100%', fontFamily:'monospace' }}
              />
              <span style={{ fontSize:10, color: color, fontWeight:700, fontFamily:'monospace', whiteSpace:'nowrap' }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons + progress */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <button onClick={onStart} disabled={running}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 20px', borderRadius:10, background:'linear-gradient(135deg,#7C3AED,#a855f7)', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor: running?'not-allowed':'pointer', opacity: running?0.6:1, boxShadow:'0 0 16px rgba(124,58,237,0.4)' }}>
          <Play className="h-3.5 w-3.5" /> Ishga tushirish
        </button>
        <button onClick={onPause}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer' }}>
          <Pause className="h-3.5 w-3.5" /> Pauza
        </button>
        <button onClick={onReset}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:13, cursor:'pointer' }}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>

        {/* Live values */}
        <div style={{ marginLeft:'auto', display:'flex', gap:16 }}>
          {[
            { l:'v', v:currentSpeed.toFixed(1), u:'m/s', c:'#7C3AED' },
            { l:'s', v:currentDist.toFixed(1), u:'m', c:'#06b6d4' },
            { l:'t', v:elapsed.toFixed(1), u:'s', c:'#f59e0b' },
          ].map(({ l, v, u, c }) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>{l}</div>
              <div style={{ fontSize:15, fontWeight:900, color:c, fontFamily:'monospace', textShadow:`0 0 10px ${c}80` }}>{v}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>{u}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>
            s = v₀t + ½at²
          </span>
          <span style={{ fontSize:10, color:'#7C3AED', fontWeight:700, fontFamily:'monospace' }}>{progress.toFixed(0)}%</span>
        </div>
        <div style={{ height:6, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#7C3AED,#06b6d4)', borderRadius:4, transition:'width 0.1s linear', boxShadow:'0 0 8px rgba(124,58,237,0.6)' }} />
        </div>
      </div>
    </div>
  )
}
