'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'
import SimChat     from '@/components/3d/SimChat'
import SimSelector from '@/components/3d/SimSelector'
import type { PendulumSimProps  } from '@/components/3d/PendulumSim'
import type { ElectricSimProps  } from '@/components/3d/ElectricFieldSim'
import { type Sol, parseProblem, solveProblem, detectObjectId, PROB_EXAMPLES } from '@/lib/physicsParser'

const PendulumSim      = dynamic<PendulumSimProps>(() => import('@/components/3d/PendulumSim'),      { ssr: false })
const ElectricFieldSim = dynamic<ElectricSimProps>(() => import('@/components/3d/ElectricFieldSim'), { ssr: false })
const TezlikSim        = dynamic(() => import('@/components/3d/TezlikSim'),        { ssr: false })
const PaskalSim        = dynamic(() => import('@/components/3d/PaskalSim'),        { ssr: false })
const PaskalShariSim   = dynamic(() => import('@/components/3d/PaskalShariSim'),   { ssr: false })
const ElektroskopSim   = dynamic(() => import('@/components/3d/ElektroskopSim'),   { ssr: false })
const GravitySim       = dynamic(() => import('@/components/3d/GravitySim'),       { ssr: false })
const SimInfoPanel     = dynamic(() => import('@/components/3d/SimInfoPanel'),     { ssr: false })

/* ── tiny slider helper ── */
function Slider({
  label, value, min, max, step = 1, unit = '', color = '#60a5fa',
  onChange,
}: {
  label: string; value: number; min: number; max: number
  step?: number; unit?: string; color?: string; onChange: (v: number) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontFamily: 'monospace' }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ accentColor: color, width: '100%', cursor: 'pointer' }}
      />
    </div>
  )
}

/* ── pendulum controls ── */
function PendulumControls({
  length, angleDeg, speed, paused,
  setLength, setAngleDeg, setSpeed, setPaused, onReset,
}: {
  length: number; angleDeg: number; speed: number; paused: boolean
  setLength: (v:number) => void; setAngleDeg: (v:number) => void
  setSpeed: (v:number) => void; setPaused: (v:boolean) => void; onReset: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '10px 14px', background: 'rgba(5,8,25,0.85)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(96,165,250,0.2)' }}>
      <Slider label="Uzunlik" value={length} min={0.5} max={5} step={0.1} unit=" m" color="#60a5fa"
        onChange={setLength} />
      <Slider label="Burchak" value={angleDeg} min={5} max={75} step={1} unit="°" color="#a78bfa"
        onChange={setAngleDeg} />
      <Slider label="Tezlik" value={speed} min={0.1} max={3} step={0.1} unit="×" color="#34d399"
        onChange={setSpeed} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setPaused(!paused)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8,
            background: paused ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${paused ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {paused ? <><Play className="h-3 w-3" /> Davom</> : <><Pause className="h-3 w-3" /> Pauza</>}
        </button>
        <button onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>
    </div>
  )
}

/* ── electric controls ── */
function ElectricControls({
  q1, q2, dist, numLines, paused,
  setQ1, setQ2, setDist, setNumLines, setPaused, onReset,
}: {
  q1:number; q2:number; dist:number; numLines:number; paused:boolean
  setQ1:(v:number)=>void; setQ2:(v:number)=>void; setDist:(v:number)=>void
  setNumLines:(v:number)=>void; setPaused:(v:boolean)=>void; onReset:()=>void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '10px 14px', background: 'rgba(5,8,25,0.85)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(251,191,36,0.2)' }}>
      <Slider label="q₁ (μC)" value={q1} min={-8} max={8} step={1} unit="μC" color="#f87171" onChange={setQ1} />
      <Slider label="q₂ (μC)" value={q2} min={-8} max={8} step={1} unit="μC" color="#60a5fa" onChange={setQ2} />
      <Slider label="Masofa" value={dist} min={1} max={8} step={0.5} unit=" m" color="#fbbf24" onChange={setDist} />
      <Slider label="Chiziq soni" value={numLines} min={4} max={20} step={2} color="#34d399" onChange={setNumLines} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setPaused(!paused)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8,
            background: paused ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${paused ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {paused ? <><Play className="h-3 w-3" /> Davom</> : <><Pause className="h-3 w-3" /> Pauza</>}
        </button>
        <button onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>
    </div>
  )
}

/* ── Masala yechish paneli (TezlikSim slot uchun) ── */
function MasalaPanel({
  masalaText, masalaSol, masalaErr, onChange, onSolve,
}: {
  masalaText: string; masalaSol: Sol | null; masalaErr: string
  onChange: (t: string) => void; onSolve: () => void
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      {/* Chips */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
        {PROB_EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => onChange(ex)} title={ex}
            style={{
              padding:'2px 8px', borderRadius:20, fontSize:10, cursor:'pointer',
              background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.38)',
              color:'#c4b5fd', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden',
              maxWidth:140, textOverflow:'ellipsis',
            }}>
            {ex.slice(0,22)}{ex.length>22?'…':''}
          </button>
        ))}
      </div>

      {/* Textarea + button */}
      <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
        <textarea
          value={masalaText}
          onChange={e => onChange(e.target.value)}
          placeholder={"Masala yozing...\nMisol: \"Avtomobil 72 km/soat...\""}
          rows={2}
          style={{
            flex:1, boxSizing:'border-box',
            background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(124,58,237,0.35)',
            borderRadius:8, padding:'6px 8px', resize:'none',
            color:'#e2e8f0', fontSize:11, fontFamily:'inherit', outline:'none', lineHeight:1.5,
          }}
          onFocus={e => { e.currentTarget.style.borderColor='rgba(168,85,247,0.8)' }}
          onBlur={e  => { e.currentTarget.style.borderColor='rgba(124,58,237,0.35)' }}
        />
        <button
          onClick={onSolve} disabled={!masalaText.trim()}
          style={{
            padding:'6px 12px', borderRadius:8, fontWeight:700, fontSize:11,
            background:'linear-gradient(135deg,#7C3AED,#a855f7)', border:'none', color:'#fff',
            cursor: masalaText.trim() ? 'pointer' : 'not-allowed',
            opacity: masalaText.trim() ? 1 : 0.4, whiteSpace:'nowrap',
            boxShadow:'0 0 10px rgba(124,58,237,0.4)', flexShrink:0,
          }}>Yeching →</button>
      </div>

      {masalaErr && <span style={{ fontSize:10, color:'#f87171' }}>{masalaErr}</span>}
      {masalaSol && (
        <div style={{ fontSize:10, color:'rgba(167,139,250,0.7)', fontStyle:'italic', paddingTop:2 }}>
          ✓ Yechim monitor ekranida ko&apos;rinmoqda
        </div>
      )}
    </div>
  )
}

/* ── idle placeholder ── */
function IdlePlaceholder() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14, color: 'rgba(255,255,255,0.35)' }}>
      <div style={{ fontSize: 52 }}>🔬</div>
      <p style={{ fontSize: 15, fontWeight: 600 }}>Simulatsiya tanlanmagan</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Pastagi ro&apos;yxatdan fizik hodisani tanlang</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        {['⚙️','⚡','〰️','🔥','⚛️'].map(e => (
          <span key={e} style={{ fontSize: 22, opacity: 0.5 }}>{e}</span>
        ))}
      </div>
    </div>
  )
}

/* ════════════ Elektroskop Ma'lumot paneli ════════════ */
const PARTS = [
  { num: 1, name: 'Plastmassa tiqin', color: '#60a5fa', desc: 'Metall sterjenni metalldan iborat gardishdan izolyatsiya qiladi. Zaryad tashqariga chiqib ketmasligi uchun plastmassadan yasalgan.' },
  { num: 2, name: 'Metall sterjen',   color: '#34d399', desc: 'Sharcha bilan folga yaproqchalari orasidagi o\'tkazgich. Elektr zaryadni ikkalasiga birday uzatadi.' },
  { num: 3, name: 'Sharcha',          color: '#fbbf24', desc: 'Zaryadlangan jism tekkiziladi yoki yaqin keltiriladi. Katta yuzasi tufayli zaryadni yaxshi qabul qiladi.' },
  { num: 4, name: 'Folga yaproqchalari', color: '#f87171', desc: 'Juda ingichka oltin folga barglar. Bir xil zaryad olganida bir-birini itarib, ochilib ketadi — bu zaryadlanishning ko\'rsatkichidir.' },
]

const INFO_CATS = [
  {
    icon: '🏛️',
    title: 'Kim tomonidan yaratilgan',
    color: '#a78bfa',
    body: 'Varag\'li elektroskopni 1787-yilda ingliz olimi Abraham Bennet ixtiro qildi. Undan oldin 1748-yilda Yan Ingenhous sodda ko\'rinishini taklif qilgan edi. Zamonaviy ko\'rinishi XIX asrda Faraday va boshqalar tomonidan takomillashtirildi.',
  },
  {
    icon: '🔬',
    title: 'Qachon tajriba o\'tkazilgan',
    color: '#34d399',
    body: '1787-yil: Bennet dastlabki tajribalar o\'tkazdi. 1832-yil: Maykl Faraday elektroskop yordamida induksiya hodisasini tasdiqladi. XIX asr oxiri: Rentgen nurlarini aniqlashda keng qo\'llanildi.',
  },
  {
    icon: '🎯',
    title: 'Nima maqsadda ishlatamiz',
    color: '#fbbf24',
    body: 'Jismning zaryadlanganligini va zaryad belgisini (musbat yoki manfiy) aniqlash uchun ishlatiladi. Zaryadlangan jism tekkizilganda yaproqlar ochiladi; manfiy jism yaqin keltirilganda ham xuddi shunday bo\'ladi (induksiya).',
  },
  {
    icon: '📚',
    title: 'Bu jarayonni o\'rganish nimaga kerak',
    color: '#60a5fa',
    body: 'Elektrostatika asoslarini tushunish uchun zarur. Kulon qonuni, elektr maydon, induksiya va o\'tkazgichlik tushunchalarini vizual ko\'rsatadi. Zamonaviy kondensator, voltmetr va dielektrik nazariyasining ibtidosi shu qurilmadan boshlangan.',
  },
  {
    icon: '🌍',
    title: 'Hayotda qo\'llanilishi',
    color: '#f87171',
    body: [
      'Elektr stansiyalarida — statik zaryad xavfini nazorat qilish',
      'Havo kemachiligida — chaqmoqdan himoya tizimlarini tekshirish',
      'Tibbiyotda — defibrillator va EKG qurilmalarini sinash',
      'Meteorologiyada — atmosfera elektr maydonini kuzatish',
      'Kimyo laboratoriyalarida — gazlardagi ionlanishni o\'lchash',
    ],
  },
]

function ElektroskopInfoPanel() {
  const S: React.CSSProperties = {
    background: 'rgba(6,10,30,0.92)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 18,
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    animation: 'slideDown 0.32s cubic-bezier(.22,1,.36,1)',
  }
  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-14px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>
      <div style={S}>

        {/* Sarlavha */}
        <div style={{ display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:16 }}>
          <span style={{ fontSize:22 }}>⚡</span>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:'#e2e8f0' }}>Elektroskop haqida to&apos;liq ma&apos;lumot</h2>
            <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
              Qismlar tasnifi • Ishlash jarayoni • Tarix • Qo&apos;llanilishi
            </p>
          </div>
        </div>

        {/* Qismlar */}
        <div>
          <h3 style={{ margin:'0 0 12px', fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.8px' }}>
            Belgilangan qismlar
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
            {PARTS.map(p => (
              <div key={p.num} style={{
                background:'rgba(255,255,255,0.04)',
                border:`1px solid ${p.color}30`,
                borderRadius:12,
                padding:'12px 14px',
                display:'flex', gap:12, alignItems:'flex-start',
              }}>
                <span style={{
                  background: p.color,
                  color:'#000',
                  borderRadius:'50%',
                  width:24, height:24, minWidth:24,
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:900, marginTop:1,
                }}>{p.num}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:p.color, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ishlash jarayoni */}
        <div style={{
          background:'rgba(251,191,36,0.07)',
          border:'1px solid rgba(251,191,36,0.20)',
          borderRadius:12, padding:'14px 18px',
        }}>
          <h3 style={{ margin:'0 0 8px', fontSize:13, fontWeight:700, color:'#fbbf24', textTransform:'uppercase', letterSpacing:'0.8px' }}>
            ⚙️ Ishlash jarayoni
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {[
              { step:'1', text:'Zaryadlangan jism (3) sharchasiga tekkiziladi yoki yaqin keltiriladi.' },
              { step:'2', text:'Zaryad (2) metall sterjen orqali (4) folga yaproqchalarga o\'tadi.' },
              { step:'3', text:'Ikkala yaproqcha bir xil zaryad oladi → Kulon qonuniga ko\'ra bir-birini itaradi.' },
              { step:'4', text:'Yaproqlar ochilib, burchak hosil qiladi — burchak qanchalik katta bo\'lsa, zaryad shunchalik ko\'p.' },
              { step:'5', text:'Zaryadlangan jism olib ketilgandan keyin yaproqlar asta-sekin yopiladi (izolyatsiya saqlanadi).' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
                <span style={{
                  background:'rgba(251,191,36,0.2)', color:'#fbbf24',
                  borderRadius:6, width:20, height:20, minWidth:20,
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:900, marginTop:1,
                }}>{step}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Kategoriyalangan ma'lumotlar */}
        <div>
          <h3 style={{ margin:'0 0 12px', fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.8px' }}>
            Kategoriyalangan ma&apos;lumotlar
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
            {INFO_CATS.map(cat => (
              <div key={cat.title} style={{
                background:'rgba(255,255,255,0.03)',
                border:`1px solid ${cat.color}25`,
                borderRadius:13,
                padding:'14px 16px',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
                  <span style={{ fontSize:18 }}>{cat.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:cat.color }}>{cat.title}</span>
                </div>
                {Array.isArray(cat.body) ? (
                  <ul style={{ margin:0, padding:'0 0 0 16px', display:'flex', flexDirection:'column', gap:5 }}>
                    {cat.body.map((item, i) => (
                      <li key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.58)', lineHeight:1.6 }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.58)', lineHeight:1.7 }}>{cat.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

/* ════════════════════════════════════════════ */
export default function SimulationsPage() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewedId, setViewedId] = useState<string | null>(null)
  const [simKey,   setSimKey]   = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [snapUrl,  setSnapUrl]  = useState<string | null>(null)
  const canvasRef    = useRef<HTMLDivElement>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleFullscreen = useCallback(async () => {
    if (!canvasRef.current) return
    if (!document.fullscreenElement) {
      await canvasRef.current.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }, [])

  function takeScreenshot() {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setSnapUrl(url)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      dismissTimer.current = setTimeout(() => {
        setSnapUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
      }, 7000)
    }, 'image/png')
  }

  function downloadSnap() {
    if (!snapUrl) return
    const a = document.createElement('a')
    a.href = snapUrl; a.download = 'simulatsiya.png'; a.click()
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  /* ── Pendulum state ── */
  const [pendLen,    setPendLen]    = useState(2)
  const [pendAngle,  setPendAngle]  = useState(30)
  const [pendSpeed,  setPendSpeed]  = useState(1)
  const [pendPaused, setPendPaused] = useState(false)

  /* ── Electric field state ── */
  const [elQ1,      setElQ1]      = useState(4)
  const [elQ2,      setElQ2]      = useState(-4)
  const [elDist,    setElDist]    = useState(4)
  const [elLines,   setElLines]   = useState(10)
  const [elPaused,  setElPaused]  = useState(false)

  /* ── Elektroskop info panel ── */
  const [eInfoOpen, setEInfoOpen] = useState(false)

  /* ── Tezlik sim params (controlled from MasalaPanel) ── */
  const [tezlikSpeed, setTezlikSpeed] = useState(10)
  const [tezlikDist,  setTezlikDist]  = useState(100)
  const [tezlikObjId, setTezlikObjId] = useState<string | null>(null)

  /* ── Masala panel state ── */
  const [masalaText, setMasalaText] = useState('')
  const [masalaSol,  setMasalaSol]  = useState<Sol | null>(null)
  const [masalaErr,  setMasalaErr]  = useState('')
  const [solveKey,   setSolveKey]   = useState(0)

  function handleMasalaSolve() {
    const trimmed = masalaText.trim()
    if (!trimmed) return
    const data = parseProblem(trimmed)
    const sol  = solveProblem(data)
    if (!sol) { setMasalaErr('Masaladan tezlik, masofa yoki vaqtni aniqlay olmadim.'); setMasalaSol(null); return }
    setMasalaErr('')
    setMasalaSol(sol)
    // speed: use given v, or solved answer when find='v'
    const vSI = data.v?.si ?? (sol.answer.sym === 'v' ? sol.answer.val : undefined)
    // distance: use given s, or solved answer (convert km→m if needed)
    const sSI = data.s?.si
      ?? (sol.answer.sym === 's'
          ? (sol.answer.unit === 'km' ? sol.answer.val * 1000 : sol.answer.val)
          : undefined)
    if (vSI) setTezlikSpeed(Math.max(0.1, parseFloat(vSI.toFixed(4))))
    if (sSI) setTezlikDist(Math.max(1, Math.round(sSI)))
    setTezlikObjId(detectObjectId(trimmed))
    setSolveKey(k => k + 1)
  }

  function handleSelect(id: string) {
    setActiveId(id)
    setSimKey(k => k + 1)
    if (id === 'pendulum') setPendPaused(false)
    if (id === 'electric') setElPaused(false)
    if (id !== 'elektroskop') setEInfoOpen(false)
  }

  function resetSim() {
    setSimKey(k => k + 1)
    if (activeId === 'pendulum') { setPendPaused(false) }
    if (activeId === 'electric') { setElPaused(false) }
  }

  const simTitle =
    activeId === 'pendulum' ? 'Matematik mayatnik' :
    activeId === 'electric' ? 'Elektr maydon' :
    activeId === 'tezlik'   ? "Tezlik. Yo'l. Vaqt. Tezlanish" :
    activeId === 'paskal'      ? 'Paskal qonuni (silindr)'  :
    activeId === 'paskal-shar'  ? 'Paskal shari (360°)'       :
    activeId === 'elektroskop'  ? 'Elektroskop'               :
    activeId === 'gravity'      ? "g = 9.8 — Yerning Imzosi"  :
    'Fizika simulatsiyasi'

  return (
    <div style={{ minHeight: '100vh', padding: '20px 20px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* header */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 4 }}>
            3D Simulatsiyalar
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Fizika qonunlarini real vaqtda interaktiv 3D muhitda kuzating
          </p>
        </div>

        {/* ── 3D canvas area ── */}
        <div style={{ borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(6,8,22,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* canvas itself — fixed tall height */}
          <div ref={canvasRef} style={{ height: 'clamp(420px, 62vh, 680px)', position: 'relative', background: isFullscreen ? 'rgba(6,8,22,1)' : undefined }}>
            {!activeId && <IdlePlaceholder />}

            {/* ── Screenshot burchak toast ── */}
            {snapUrl && (
              <div style={{ position: 'absolute', bottom: 14, right: 58, zIndex: 30,
                animation: 'snapIn 0.28s cubic-bezier(.22,1,.36,1)' }}>
                <style>{`@keyframes snapIn{from{opacity:0;transform:scale(.7) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={snapUrl} alt="snap" onClick={downloadSnap}
                    style={{ width: 130, borderRadius: 10, display: 'block', cursor: 'pointer',
                      boxShadow: '0 6px 28px rgba(0,0,0,0.75)',
                      border: '2px solid rgba(251,191,36,0.50)' }} />
                  <button onClick={() => { URL.revokeObjectURL(snapUrl); setSnapUrl(null) }}
                    style={{ position: 'absolute', top: -7, right: -7, width: 20, height: 20,
                      borderRadius: '50%', background: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white', fontSize: 11, lineHeight: '20px',
                      cursor: 'pointer', padding: 0, textAlign: 'center' }}>✕</button>
                  <p style={{ margin: '5px 0 0', fontSize: 10,
                    color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                    Saqlash uchun bosing
                  </p>
                </div>
              </div>
            )}

            {/* 📷 Screenshot tugmasi — TezlikSim o'z tugmalarini boshqaradi */}
            {activeId && activeId !== 'tezlik' && (
              <button
                onClick={takeScreenshot}
                title="Skrinshot"
                style={{
                  position: 'absolute', top: 12, right: 56, zIndex: 20,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10,
                  background: 'rgba(10,12,35,0.75)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer', fontSize: 16,
                }}
              >📷</button>
            )}

            {/* To'liq ekran tugmasi — TezlikSim'da mavjud bo'lganda yashiriladi */}
            {activeId !== 'tezlik' && (
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 20,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10,
                  background: 'rgba(10,12,35,0.75)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.35)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.6)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,12,35,0.75)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
                }}
              >
                {isFullscreen
                  ? <Minimize2 style={{ width: 16, height: 16 }} />
                  : <Maximize2 style={{ width: 16, height: 16 }} />
                }
              </button>
            )}

            {activeId === 'pendulum' && (
              <PendulumSim
                key={simKey}
                length={pendLen}
                angleDeg={pendAngle}
                paused={pendPaused}
                speed={pendSpeed}
                simKey={simKey}
                boardMode={false}
              />
            )}

            {activeId === 'electric' && (
              <ElectricFieldSim
                key={simKey}
                q1={elQ1}
                q2={elQ2}
                dist={elDist}
                numLines={elLines}
                paused={elPaused}
                simKey={simKey}
                boardMode={false}
              />
            )}

            {activeId === 'tezlik' && (
              <TezlikSim
                key={simKey}
                initSpeed={tezlikSpeed}
                initDistance={tezlikDist}
                initObjId={tezlikObjId}
                solveKey={solveKey}
                masalaSlot={
                  <MasalaPanel
                    masalaText={masalaText}
                    masalaSol={masalaSol}
                    masalaErr={masalaErr}
                    onChange={text => { setMasalaText(text); setMasalaSol(null); setMasalaErr('') }}
                    onSolve={handleMasalaSolve}
                  />
                }
                monitorSolution={masalaSol ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:16, height:'100%' }}>

                    {/* Row 1: Formula pill + Given values side by side */}
                    <div style={{ display:'flex', gap:20, alignItems:'stretch' }}>
                      {/* Formula */}
                      <div style={{
                        flexShrink:0,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        padding:'10px 32px', borderRadius:20,
                        background:'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.20))',
                        border:'2px solid rgba(168,85,247,0.55)',
                        boxShadow:'0 0 30px rgba(168,85,247,0.18), inset 0 0 20px rgba(99,102,241,0.08)',
                      }}>
                        <span style={{
                          fontSize:44, fontWeight:900, color:'#e0d7ff',
                          fontFamily:"'Courier New',monospace",
                          letterSpacing:'0.12em',
                          textShadow:'0 0 16px rgba(192,132,252,0.6)',
                        }}>{masalaSol.formula}</span>
                      </div>
                      {/* Given */}
                      <div style={{
                        flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:8,
                        padding:'10px 18px', borderRadius:16,
                        background:'rgba(0,0,0,0.30)', border:'1px solid rgba(148,163,184,0.12)',
                      }}>
                        <div style={{ fontSize:19, color:'rgba(148,163,184,0.55)', fontWeight:700,
                          letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:'sans-serif' }}>
                          BERILGAN
                        </div>
                        {masalaSol.given.map(g => (
                          <div key={g.sym} style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                            <span style={{ fontSize:32, fontWeight:900, color:'#67e8f9',
                              fontFamily:"'Courier New',monospace",
                              textShadow:'0 0 12px rgba(103,232,249,0.5)' }}>{g.sym}</span>
                            <span style={{ fontSize:28, color:'rgba(226,232,240,0.75)',
                              fontFamily:"'Courier New',monospace" }}> = {g.disp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 2: Steps */}
                    <div style={{
                      display:'flex', flexDirection:'column', gap:6,
                      padding:'12px 18px', borderRadius:16,
                      background:'rgba(0,0,0,0.25)', border:'1px solid rgba(59,130,246,0.15)',
                    }}>
                      {masalaSol.steps.map((step, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{
                            width:28, height:28, borderRadius:'50%', flexShrink:0,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            background: i === masalaSol.steps.length-1
                              ? 'rgba(168,85,247,0.30)' : 'rgba(59,130,246,0.18)',
                            border: `1px solid ${i === masalaSol.steps.length-1 ? 'rgba(168,85,247,0.55)' : 'rgba(59,130,246,0.35)'}`,
                            fontSize:16, fontWeight:900, color:'rgba(255,255,255,0.6)',
                            fontFamily:'sans-serif',
                          }}>{i+1}</div>
                          <span style={{
                            fontSize:28, color: i === masalaSol.steps.length-1
                              ? 'rgba(216,180,254,0.9)' : 'rgba(203,213,225,0.80)',
                            fontFamily:"'Courier New',monospace",
                          }}>{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Row 3: Answer */}
                    <div style={{
                      padding:'14px 24px', borderRadius:18,
                      background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.10))',
                      border:'2px solid rgba(52,211,153,0.45)',
                      boxShadow:'0 0 30px rgba(52,211,153,0.12), inset 0 0 20px rgba(16,185,129,0.05)',
                      display:'flex', alignItems:'center', gap:18, flexWrap:'wrap',
                    }}>
                      <span style={{ fontSize:22, color:'rgba(148,163,184,0.55)', fontWeight:700,
                        letterSpacing:'0.14em', fontFamily:'sans-serif' }}>JAVOB:</span>
                      <span style={{ fontSize:62, fontWeight:900, color:'#34d399',
                        fontFamily:"'Courier New',monospace", letterSpacing:'0.05em',
                        textShadow:'0 0 28px rgba(52,211,153,0.65), 0 0 10px rgba(52,211,153,0.35)' }}>
                        {masalaSol.answer.sym} = {masalaSol.answer.val} {masalaSol.answer.unit}
                      </span>
                      {masalaSol.answer.alt && (
                        <span style={{ fontSize:24, color:'rgba(148,163,184,0.45)',
                          fontFamily:"'Courier New',monospace" }}>
                          ({masalaSol.answer.alt})
                        </span>
                      )}
                    </div>

                  </div>
                ) : undefined}
              />
            )}

            {activeId === 'paskal' && (
              <PaskalSim key={simKey} />
            )}

            {activeId === 'paskal-shar' && (
              <PaskalShariSim key={simKey} />
            )}

            {activeId === 'elektroskop' && (
              <ElektroskopSim
                key={simKey}
                showLabels={eInfoOpen}
                onToggle={() => setEInfoOpen(v => !v)}
              />
            )}

            {activeId === 'gravity' && (
              <GravitySim key={simKey} />
            )}
          </div>

          {/* controls strip — only for pendulum & electric */}
          {activeId === 'pendulum' && (
            <PendulumControls
              length={pendLen} angleDeg={pendAngle} speed={pendSpeed} paused={pendPaused}
              setLength={v => { setPendLen(v); setSimKey(k => k+1) }}
              setAngleDeg={v => { setPendAngle(v); setSimKey(k => k+1) }}
              setSpeed={setPendSpeed}
              setPaused={setPendPaused}
              onReset={resetSim}
            />
          )}

          {activeId === 'electric' && (
            <ElectricControls
              q1={elQ1} q2={elQ2} dist={elDist} numLines={elLines} paused={elPaused}
              setQ1={v => { setElQ1(v); setSimKey(k => k+1) }}
              setQ2={v => { setElQ2(v); setSimKey(k => k+1) }}
              setDist={v => { setElDist(v); setSimKey(k => k+1) }}
              setNumLines={v => { setElLines(v); setSimKey(k => k+1) }}
              setPaused={setElPaused}
              onReset={resetSim}
            />
          )}
        </div>

        {/* ── Elektroskop Ma'lumot paneli ── */}
        {activeId === 'elektroskop' && eInfoOpen && (
          <ElektroskopInfoPanel />
        )}

        {/* ── bottom: SimSelector + AI Chat side by side ── */}
        <div style={{ display:'flex', gap:14, alignItems:'stretch' }}>
          {/* left: sim selector */}
          <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:12 }}>
            <SimSelector
              activeId={activeId}
              viewedId={viewedId}
              onSelect={handleSelect}
              onView={setViewedId}
            />
            {viewedId && viewedId !== activeId && (
              <SimInfoPanel simId={viewedId} />
            )}
          </div>
          {/* right: AI chat */}
          <div style={{ flex:1, minWidth:0 }}>
            <SimChat simId={activeId ?? 'general'} simTitle={simTitle} />
          </div>
        </div>

      </div>
    </div>
  )
}
