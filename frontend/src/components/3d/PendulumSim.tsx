'use client'
import { useRef, useState, useCallback, useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Camera, Monitor, Maximize2, Minimize2 } from 'lucide-react'

const G         = 9.8
const PIVOT_Y   = 3.2
const BOB_R     = 0.24
const MAX_TRAIL = 50

export interface PendulumSimProps {
  length:    number
  angleDeg:  number
  paused:    boolean
  speed:     number
  simKey:    number
  onPeriod?: (t: number) => void
  boardMode?: boolean
}

/* ─────────────────────────────────────── 3D sahna ─ */
function PendulumScene({
  length, angleDeg, paused, speed, boardMode, onPeriod,
}: {
  length: number; angleDeg: number; paused: boolean
  speed: number; boardMode: boolean; onPeriod: (t: number) => void
}) {
  /* animatsiya uchun reflar */
  const bobRef   = useRef<THREE.Mesh>(null)
  const glow1Ref = useRef<THREE.Mesh>(null)
  const glow2Ref = useRef<THREE.Mesh>(null)
  const ltRef    = useRef<THREE.PointLight>(null)

  /* fizika holati */
  const theta    = useRef(angleDeg * Math.PI / 180)
  const omega    = useRef(0)
  const lastSign = useRef(Math.sign(angleDeg * Math.PI / 180))
  const lastZero = useRef<number | null>(null)
  const trailPts = useRef<number[][]>([])
  const elapsed  = useRef(0)

  /* boshlang'ich bob pozitsiyasi */
  const ia  = angleDeg * Math.PI / 180
  const ibx = Math.sin(ia) * length
  const iby = PIVOT_Y - Math.cos(ia) * length

  /* ip va iz geometriyasi — faqat useFrame ichida o'qiladi, render vaqtida emas */
  const ropeGeoRef  = useRef<THREE.BufferGeometry>(null!)
  const trailGeoRef = useRef<THREE.BufferGeometry>(null!)

  /* Boshlang'ich position massivlar — bir marta yaratiladi */
  const [ropePosArr]  = useState(() => new Float32Array([0, PIVOT_Y, 0, ibx, iby, 0]))
  const [trailPosArr] = useState(() => new Float32Array(MAX_TRAIL * 3))

  useFrame((_, delta) => {
    if (paused) return
    const dt = Math.min(delta, 0.05) * speed

    /* fizika integratsiyasi */
    omega.current  += -(G / length) * Math.sin(theta.current) * dt
    omega.current  *= 0.999          /* havo qarshiligi */
    theta.current  += omega.current * dt
    elapsed.current += dt

    const bx = Math.sin(theta.current) * length
    const by = PIVOT_Y - Math.cos(theta.current) * length

    /* bob + glow + yorug'lik harakati */
    bobRef.current?.position.set(bx, by, 0)
    glow1Ref.current?.position.set(bx, by, 0)
    if (glow2Ref.current) {
      glow2Ref.current.position.set(bx, by, 0)
      glow2Ref.current.scale.setScalar(1 + 0.05 * Math.sin(Date.now() * 0.003))
    }
    ltRef.current?.position.set(bx, by, 0)

    /* ip uchini yangilash */
    const ra = ropeGeoRef.current!.attributes.position as THREE.BufferAttribute
    ra.setXYZ(1, bx, by, 0)
    ra.needsUpdate = true

    /* iz yangilash */
    trailPts.current.push([bx, by, 0])
    if (trailPts.current.length > MAX_TRAIL) trailPts.current.shift()
    const n = trailPts.current.length
    if (n >= 2) {
      const ta = trailGeoRef.current!.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < n; i++) {
        const p = trailPts.current[i]
        ta.setXYZ(i, p[0], p[1], p[2])
      }
      ta.needsUpdate = true
      trailGeoRef.current!.setDrawRange(0, n)
    }

    /* davr o'lchash — TUZATILGAN (oldida *2 xato bor edi) */
    const sign = Math.sign(theta.current)
    if (sign !== lastSign.current && sign > 0) {
      if (lastZero.current !== null) {
        const T = elapsed.current - lastZero.current
        if (T > 0.3 && T < 20) onPeriod(T)
      }
      lastZero.current = elapsed.current
    }
    lastSign.current = sign
  })

  const dark = !boardMode
  const gC1  = dark ? '#1e3a5f' : '#374151'
  const gC2  = dark ? '#0d1e38' : '#1f2937'
  const supC = boardMode ? '#9ca3af' : '#64748b'

  return (
    <group>
      {/* ── Yorug'lik ── */}
      <ambientLight intensity={boardMode ? 1.1 : 0.55} />
      <directionalLight position={[5, 10, 6]} intensity={boardMode ? 2.0 : 1.5} />
      <pointLight position={[-4, 6, 5]} intensity={0.5} color="#60a5fa" />
      {/* bob bilan birga yonuvchi ko'k yorug'lik */}
      <pointLight ref={ltRef} position={[ibx, iby, 0]}
        color="#3b82f6" intensity={2.5} distance={5} decay={2} />

      {/* ── Panjar (grid) ── */}
      <gridHelper args={[20, 20, gC1, gC2]} position={[0, -1.8, 0]} />

      {/* ── Tayanch konstruktsiyasi ── */}
      {/* Gorizontal tir (asosiy ustun) */}
      <mesh position={[0, PIVOT_Y + 0.62, 0]}>
        <boxGeometry args={[2.8, 0.52, 1.0]} />
        <meshStandardMaterial color={supC} metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Pastki cheti (highlight qator) */}
      <mesh position={[0, PIVOT_Y + 0.34, 0]}>
        <boxGeometry args={[2.8, 0.06, 1.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.04} />
      </mesh>
      {/* Vertikal poydevor stem */}
      <mesh position={[0, PIVOT_Y + 0.10, 0]}>
        <cylinderGeometry args={[0.07, 0.10, 0.46, 16]} />
        <meshStandardMaterial
          color={boardMode ? '#d1d5db' : '#94a3b8'}
          metalness={0.90} roughness={0.08}
        />
      </mesh>
      {/* Tayanch uchi (pivot to'pi) */}
      <mesh position={[0, PIVOT_Y - 0.02, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.97} roughness={0.03} />
      </mesh>

      {/* ── Ip ── */}
      <line>
        <bufferGeometry ref={ropeGeoRef}>
          <bufferAttribute attach="attributes-position" args={[ropePosArr, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={0xf0f0f0} />
      </line>

      {/* ── Sharcha: tashqi glow → ichki glow → asosiy sfera ── */}
      {/* tashqi yumshoq glow */}
      <mesh ref={glow2Ref} position={[ibx, iby, 0]}>
        <sphereGeometry args={[BOB_R * 3.2, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      {/* ichki glow */}
      <mesh ref={glow1Ref} position={[ibx, iby, 0]}>
        <sphereGeometry args={[BOB_R * 1.65, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      {/* asosiy sharcha */}
      <mesh ref={bobRef} position={[ibx, iby, 0]}>
        <sphereGeometry args={[BOB_R, 64, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={boardMode ? 0.90 : 0.60}
          metalness={0.35}
          roughness={0.15}
        />
      </mesh>

      {/* ── Harakat izi ── */}
      <line>
        <bufferGeometry ref={trailGeoRef}>
          <bufferAttribute attach="attributes-position" args={[trailPosArr, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={0x63b3ed} transparent opacity={0.35} />
      </line>
    </group>
  )
}

/* ───────────────────────────────────── Asosiy komponent ─ */
export default function PendulumSim({
  length, angleDeg, paused, speed, simKey,
  onPeriod, boardMode = false,
}: PendulumSimProps) {
  const [localBoard, setLocalBoard] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const wrapperId = useId()

  const isBoard = boardMode || localBoard
  const bg      = isBoard ? '#000000' : '#060d1f'

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const takeScreenshot = useCallback(() => {
    const wrapper = document.getElementById(wrapperId)
    const c = wrapper?.querySelector('canvas') as HTMLCanvasElement | null
    if (!c) return
    const a = document.createElement('a')
    a.href     = c.toDataURL('image/png')
    a.download = 'mayatnik.png'
    a.click()
  }, [wrapperId])

  function iconBtn(
    onClick: () => void, title: string,
    child: ReactNode, active = false,
  ) {
    return (
      <button onClick={onClick} title={title}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background:     active ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.10)',
          border:         `1px solid ${active ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.2)'}`,
          backdropFilter: 'blur(10px)',
          color:          active ? '#60a5fa' : 'white',
        }}>
        {child}
      </button>
    )
  }

  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-[9998] bg-black/70"
          onClick={() => setFullscreen(false)} />
      )}

      <div
        id={wrapperId}
        style={{
          position: 'relative', width: '100%', height: '100%', background: bg,
          ...(fullscreen ? { position: 'fixed' as const, inset: 0, zIndex: 9999 } : {}),
        }}
      >
        <Canvas
          key={simKey}
          camera={{ position: [0, 0.8, 11], fov: 52 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          style={{ background: bg, width: '100%', height: '100%' }}
        >
          <PendulumScene
            key={simKey}
            length={length} angleDeg={angleDeg}
            paused={paused} speed={speed}
            boardMode={isBoard}
            onPeriod={onPeriod ?? (() => {})}
          />
          <OrbitControls
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.06}
            zoomSpeed={2.0}
            rotateSpeed={0.75}
            panSpeed={0.9}
            minDistance={0.5}
            maxDistance={80}
            target={[0, 1.2, 0]}
          />
        </Canvas>

        {/* Overlay tugmalar */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          {iconBtn(() => setLocalBoard(v => !v), 'Doska rejimi',
            <Monitor className="h-3.5 w-3.5" />, localBoard)}
          {iconBtn(() => takeScreenshot(), 'Screenshot',
            <Camera className="h-3.5 w-3.5" />)}
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
              background: 'rgba(96,165,250,0.2)',
              border:     '1px solid rgba(96,165,250,0.4)',
              color:      '#60a5fa',
            }}>
            📺 Doska Rejimi
          </div>
        )}
      </div>
    </>
  )
}
