'use client'
import { useRef, useState, useMemo, useEffect, useCallback, useId } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Maximize2, Minimize2, Camera, Monitor } from 'lucide-react'

export interface ElectricSimProps {
  q1: number
  q2: number
  dist: number
  numLines: number
  paused: boolean
  simKey: number
  boardMode?: boolean
}

// ─── Physics helpers ──────────────────────────────────────────────────────────

function eFieldAt(p: THREE.Vector3, charges: { pos: THREE.Vector3; q: number }[]) {
  const E = new THREE.Vector3()
  for (const { pos, q } of charges) {
    const r = new THREE.Vector3().subVectors(p, pos)
    const d = r.length()
    if (d < 0.13) continue
    E.addScaledVector(r.normalize(), q / (d * d))
  }
  return E
}

function traceLine(
  start: THREE.Vector3,
  charges: { pos: THREE.Vector3; q: number }[],
  forward: boolean,
  maxSteps = 220,
  step = 0.1,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [start.clone()]
  const cur  = start.clone()
  const sign = forward ? 1 : -1
  for (let i = 0; i < maxSteps; i++) {
    const E = eFieldAt(cur, charges)
    if (E.length() < 1e-6) break
    cur.addScaledVector(E.normalize(), sign * step)
    pts.push(cur.clone())
    if (cur.length() > 13) break
    for (const { pos } of charges) {
      if (cur.distanceTo(pos) < 0.22) return pts
    }
  }
  return pts
}

function spherePoints(center: THREE.Vector3, n: number, r = 0.44): THREE.Vector3[] {
  const φ = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2
    const ρ = Math.sqrt(Math.max(0, 1 - y * y))
    return new THREE.Vector3(
      center.x + Math.cos(φ * i) * ρ * r,
      center.y + y * r,
      center.z + Math.sin(φ * i) * ρ * r,
    )
  })
}

interface LineData { points: THREE.Vector3[]; color: string }

function computeLines(
  q1: number, q2: number, p1: THREE.Vector3, p2: THREE.Vector3, n: number,
): LineData[] {
  const charges = [{ pos: p1, q: q1 }, { pos: p2, q: q2 }]
  const result: LineData[] = []
  const addFrom = (pos: THREE.Vector3, q: number) => {
    if (q === 0) return
    const fwd   = q > 0
    const color = fwd ? '#f87171' : '#60a5fa'
    for (const s of spherePoints(pos, n)) {
      const pts = traceLine(s, charges, fwd)
      if (pts.length >= 3) result.push({ points: pts, color })
    }
  }
  addFrom(p1, q1)
  addFrom(p2, q2)
  return result
}

// ─── Charge sphere ────────────────────────────────────────────────────────────

function ChargeObject({ pos, q }: { pos: THREE.Vector3; q: number }) {
  const glowRef = useRef<THREE.Mesh>(null)
  const color    = q > 0 ? '#ef4444' : q < 0 ? '#3b82f6' : '#6b7280'
  const emissive = q > 0 ? '#7f1d1d' : q < 0 ? '#1e3a8a' : '#111827'
  useFrame(() => {
    if (glowRef.current)
      glowRef.current.scale.setScalar(1 + 0.07 * Math.sin(Date.now() * 0.0025))
  })
  return (
    <group position={pos.toArray() as [number, number, number]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.58, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.55} metalness={0.3} roughness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.03, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <pointLight color={color} intensity={Math.abs(q) * 0.9 + 0.3} distance={5} decay={2} />
    </group>
  )
}

// ─── Particles ────────────────────────────────────────────────────────────────

const PER_LINE = 3

function Particles({ lines, paused }: { lines: LineData[]; paused: boolean }) {
  const tArr     = useRef<Float32Array>(
    new Float32Array(lines.length * PER_LINE).map((_, i) => (i % PER_LINE) / PER_LINE),
  )
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    const grp = groupRef.current
    if (paused || !grp) return
    const spd = dt * 0.3
    let mi = 0
    lines.forEach((line, li) => {
      const pts = line.points
      for (let pi = 0; pi < PER_LINE; pi++) {
        const idx = li * PER_LINE + pi
        tArr.current[idx] = (tArr.current[idx] + spd) % 1
        const t   = tArr.current[idx]
        const raw = t * (pts.length - 1)
        const lo  = Math.floor(raw)
        const fr  = raw - lo
        const mesh = grp.children[mi] as THREE.Mesh
        if (mesh && lo < pts.length - 1)
          mesh.position.lerpVectors(pts[lo], pts[lo + 1], fr)
        mi++
      }
    })
  })
  const all = lines.flatMap((l, li) =>
    Array.from({ length: PER_LINE }, (_, pi) => ({ key: `${li}-${pi}`, color: l.color })),
  )
  return (
    <group ref={groupRef}>
      {all.map(({ key, color }) => (
        <mesh key={key}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function ElectricScene({
  q1, q2, dist, numLines, paused,
}: {
  q1: number; q2: number; dist: number; numLines: number; paused: boolean
}) {
  const p1 = useMemo(() => new THREE.Vector3(-dist / 2, 0, 0), [dist])
  const p2 = useMemo(() => new THREE.Vector3(dist / 2,  0, 0), [dist])
  const lines    = useMemo(() => computeLines(q1, q2, p1, p2, numLines), [q1, q2, p1, p2, numLines])
  const linesKey = `${q1}|${q2}|${dist}|${numLines}`
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 6]} intensity={0.9} castShadow />
      <gridHelper args={[22, 22, '#1e3a5f', '#0a1628']} />
      <ChargeObject pos={p1} q={q1} />
      <ChargeObject pos={p2} q={q2} />
      <Line
        points={[p1.toArray() as [number, number, number], p2.toArray() as [number, number, number]]}
        color="#374151" lineWidth={1} dashed dashSize={0.3} gapSize={0.2}
      />
      {lines.map((l, i) => (
        <Line
          key={i}
          points={l.points.map(p => [p.x, p.y, p.z] as [number, number, number])}
          color={l.color} lineWidth={1.4} transparent opacity={0.72}
        />
      ))}
      <Particles key={linesKey} lines={lines} paused={paused} />
      <OrbitControls enablePan={true} enableDamping={true} dampingFactor={0.06} zoomSpeed={2.0} rotateSpeed={0.75} panSpeed={0.9} minDistance={0.5} maxDistance={80} />
    </>
  )
}

// ─── LiveAnalysis (named export — used in scrollable section of page) ─────────

function sup(n: number) {
  return n.toString().split('').map(c =>
    c === '-' ? '⁻' : ('⁰¹²³⁴⁵⁶⁷⁸⁹'[+c] ?? c),
  ).join('')
}

function fmtF(x: number) {
  if (!isFinite(x) || x === 0) return '0 N'
  const e = Math.floor(Math.log10(x))
  return `${(x / 10 ** e).toFixed(2)}×10${sup(e)} N`
}

export function LiveAnalysis({ q1, q2, dist }: { q1: number; q2: number; dist: number }) {
  const K   = 8.99e9
  const q1C = q1 * 1e-6
  const q2C = q2 * 1e-6
  const F   = (q1 !== 0 && q2 !== 0) ? K * Math.abs(q1C * q2C) / (dist * dist) : 0
  const Fhalf = (q1 !== 0 && q2 !== 0) ? K * Math.abs(q1C * q2C) / ((dist / 2) ** 2) : 0

  const isNeutral    = q1 === 0 || q2 === 0
  const isAttractive = !isNeutral && ((q1 > 0 && q2 < 0) || (q1 < 0 && q2 > 0))

  const stateColor = isNeutral ? '#fbbf24' : isAttractive ? '#34d399' : '#f87171'
  const stateIcon  = isNeutral ? '⚪' : isAttractive ? '🔗' : '↔️'
  const stateLabel = isNeutral
    ? "Neytral jism — kuch yo'q"
    : isAttractive
    ? 'Har xil zaryadlar bir-birini TORTADI'
    : 'Bir xil zaryadlar bir-birini ITARADI'

  const grams = F / 9.81 * 1000
  const gramsStr = grams < 1 ? `${(grams * 1000).toFixed(1)} mg`
    : grams < 1000 ? `${grams.toFixed(1)} g`
    : `${(grams / 1000).toFixed(2)} kg`

  const [compIcon, compText] =
    F < 0.001  ? ['🍃', 'Bargni ushlab turish kabi kuchsiz']
    : F < 0.1  ? ['📄', "Qog'oz varag'ini tortish kabi"]
    : F < 1    ? ['✏️', "Pensni ushlab turish kabi"]
    : F < 50   ? ['📚', "Kitob ko'tarish kabi"]
    : F < 500  ? ['🏋️', "Kishi ko'tarish kabi kuchli"]
    : ['🚗', "Avtomobil tortish kabi kuchli"]

  const animKey = `${q1}_${q2}_${dist}`

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800/60 bg-[#08081a]">
      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .lv-inner { animation: fadeSlideIn 0.22s ease; }
      `}</style>
      <div key={animKey} className="lv-inner px-4 pt-3 pb-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600">⚡ Joriy holat tahlili</p>
        <div className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: stateColor + '0f', border: `1.5px solid ${stateColor}35` }}>
          <span className="text-2xl mt-0.5">{stateIcon}</span>
          <div>
            <p className="font-bold text-sm" style={{ color: stateColor }}>{stateLabel}</p>
          </div>
        </div>
        {!isNeutral && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}>
              <p className="text-xs font-bold text-yellow-400 mb-2">📐 Hisob-kitob</p>
              <div className="space-y-1 font-mono text-xs">
                <p className="text-gray-500">F = k × |q₁| × |q₂| / r²</p>
                <p className="font-bold text-yellow-300">F = {fmtF(F)}</p>
              </div>
              <div className="mt-2 rounded-lg px-3 py-1.5 text-xs"
                style={{ background: 'rgba(251,191,36,0.08)' }}>
                <span className="text-gray-500">≈ </span>
                <span className="text-yellow-200 font-semibold">{gramsStr}</span>
                <span className="text-gray-500"> massani ko&apos;tarish uchun zarur kuchga teng</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: stateColor }}>{compIcon} {compText}</p>
            </div>
            <div className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <p className="text-xs font-bold text-cyan-400 mb-2">📏 Masofa ta&apos;siri</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="rounded-lg px-2 py-2 text-center"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  <p className="text-xs text-gray-500">r={dist}m</p>
                  <p className="font-mono text-xs font-bold text-cyan-300">{fmtF(F)}</p>
                </div>
                <div className="rounded-lg px-2 py-2 text-center"
                  style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <p className="text-xs text-gray-500">r={dist / 2}m</p>
                  <p className="font-mono text-xs font-bold text-emerald-300">{fmtF(Fhalf)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Masofa <strong className="text-white">2×</strong> kamaysa →
                kuch <strong className="text-emerald-300">4×</strong> oshadi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main export — canvas only ────────────────────────────────────────────────

export default function ElectricFieldSim({
  q1, q2, dist, numLines, paused, simKey, boardMode = false,
}: ElectricSimProps) {
  const [localBoard, setLocalBoard] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const wrapperId = useId()

  const isBoard = boardMode || localBoard

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  /* Tuzatilgan: ref emas, id orqali — React compiler ref-render xatosini chiqarmaydi */
  const takeScreenshot = useCallback(() => {
    const wrapper = document.getElementById(wrapperId)
    const c = wrapper?.querySelector('canvas') as HTMLCanvasElement | null
    if (!c) return
    const a = document.createElement('a')
    a.href = c.toDataURL('image/png')
    a.download = 'elektr-maydon.png'
    a.click()
  }, [wrapperId])

  const iconBtn = (
    onClick: () => void, title: string,
    children: React.ReactNode, active = false,
  ) => (
    <button onClick={onClick} title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95"
      style={{
        background: active ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.10)',
        border: `1px solid ${active ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.2)'}`,
        backdropFilter: 'blur(10px)',
        color: active ? '#fbbf24' : 'white',
      }}>
      {children}
    </button>
  )

  const bg = isBoard ? '#000' : '#060d1f'

  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-[9998] bg-black/70"
          onClick={() => setFullscreen(false)} />
      )}

      <div
        id={wrapperId}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: bg,
          ...(fullscreen
            ? { position: 'fixed' as const, inset: 0, zIndex: 9999 }
            : {}),
        }}
      >
        <Canvas
          key={simKey}
          camera={{ position: [0, 5, 13], fov: 50 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          style={{ background: bg, width: '100%', height: '100%' }}
        >
          <ElectricScene
            q1={q1} q2={q2} dist={dist}
            numLines={isBoard ? Math.max(numLines, 16) : numLines}
            paused={paused}
          />
        </Canvas>

        {/* Overlay buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          {iconBtn(() => setLocalBoard(v => !v), 'Doska rejimi',
            <Monitor className="h-3.5 w-3.5" />, localBoard)}
          {iconBtn(() => takeScreenshot(), 'Screenshot', <Camera className="h-3.5 w-3.5" />)}
          {iconBtn(
            () => setFullscreen(v => !v),
            fullscreen ? 'Kichraytirish (ESC)' : "To'liq ekran",
            fullscreen
              ? <Minimize2 className="h-3.5 w-3.5" />
              : <Maximize2 className="h-3.5 w-3.5" />,
            fullscreen,
          )}
        </div>

        {isBoard && (
          <div className="absolute top-3 left-3 z-10 rounded-lg px-2.5 py-1 text-xs font-bold"
            style={{
              background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.4)',
              color: '#fbbf24',
            }}>
            📺 Doska Rejimi
          </div>
        )}
      </div>
    </>
  )
}
