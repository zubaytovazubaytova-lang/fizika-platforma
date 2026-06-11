'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ─── geometry constants ─── */
const CR    = 1.2   // container inner radius
const CH    = 3.4   // container height
const NH    = 8     // number of holes
const HY    = 0.0   // hole world-Y (container centered at Y=0)
const JET_L = 2.6   // max jet length when pressure = 1

/* ─── precomputed layout (module-level, computed once) ─── */
const LAYOUT = Array.from({ length: NH }, (_, i) => {
  const angle = (i / NH) * Math.PI * 2
  const x = Math.cos(angle)
  const z = Math.sin(angle)

  // jet direction: outward + gravity tilt
  const jetDir = new THREE.Vector3(x, -0.26, z).normalize()
  const jetQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), jetDir,
  )

  // pressure arrow direction: outward horizontal
  const arrowQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(x, 0, z),
  )

  return {
    angle, x, z,
    wx: x * CR,       // hole world X
    wz: z * CR,       // hole world Z
    ax: x * 0.52,     // arrow X (inside container)
    az: z * 0.52,     // arrow Z
    jetQuat,
    arrowQuat,
  }
})

/* ═══════════════════════════════════════════ Scene ═══ */
function PaskalScene({ pressure, auto }: { pressure: number; auto: boolean }) {
  const timeRef     = useRef(0)
  const smoothP     = useRef(0)
  const pistonGrp   = useRef<THREE.Group>(null)
  const liquidMesh  = useRef<THREE.Mesh>(null)
  const jetGroups   = useRef<(THREE.Group | null)[]>(Array(NH).fill(null))
  const arrowMeshes = useRef<(THREE.Mesh | null)[]>(Array(NH).fill(null))
  const fArrow      = useRef<THREE.Mesh>(null)
  const fShaft      = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    /* ── target pressure ── */
    let target: number
    if (auto) {
      timeRef.current += dt * 0.48
      target = Math.sin(timeRef.current) * 0.5 + 0.5
    } else {
      target = pressure
    }
    smoothP.current += (target - smoothP.current) * Math.min(dt * 5.5, 0.88)
    const p = smoothP.current

    /* ── piston drops ── */
    if (pistonGrp.current) {
      const ty = CH / 2 - 0.05 - p * 2.05
      pistonGrp.current.position.y +=
        (ty - pistonGrp.current.position.y) * Math.min(dt * 8, 0.8)
    }

    /* ── liquid slight compression ── */
    if (liquidMesh.current) {
      const sy = 1 - p * 0.1
      liquidMesh.current.scale.y +=
        (sy - liquidMesh.current.scale.y) * Math.min(dt * 8, 0.8)
    }

    /* ── jets grow from holes ── */
    jetGroups.current.forEach(g => {
      if (!g) return
      g.scale.setScalar(p < 0.02 ? 0.001 : p)
    })

    /* ── pressure arrows ── */
    arrowMeshes.current.forEach(m => {
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      m.scale.setScalar(0.3 + p * 0.9)
      mat.opacity = 0.15 + p * 0.82
      mat.emissiveIntensity = 0.15 + p * 1.1
    })

    /* ── F arrow opacity ── */
    ;[fArrow.current, fShaft.current].forEach(m => {
      if (!m) return
      ;(m.material as THREE.MeshStandardMaterial).opacity = 0.12 + p * 0.85
    })
  })

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.68} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} />
      <pointLight position={[0, 3.5, 0]} intensity={1.0} color="#93c5fd" />
      <pointLight position={[-4, -1, -4]} intensity={0.35} color="#dbeafe" />

      {/* ── Floor grid ── */}
      <gridHelper
        args={[14, 14, '#1e3a5f', '#0d1e38']}
        position={[0, -CH / 2 - 0.42, 0]}
      />

      {/* ════ Container ════ */}
      {/* Glass walls */}
      <mesh>
        <cylinderGeometry args={[CR + 0.055, CR + 0.055, CH, 52, 1, true]} />
        <meshPhysicalMaterial
          color="#93c5fd"
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          roughness={0.04}
          metalness={0.0}
        />
      </mesh>
      {/* Top rim */}
      <mesh position={[0, CH / 2, 0]}>
        <torusGeometry args={[CR + 0.025, 0.048, 8, 52]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.93} roughness={0.07} />
      </mesh>
      {/* Bottom plate */}
      <mesh position={[0, -CH / 2, 0]}>
        <cylinderGeometry args={[CR + 0.055, CR + 0.055, 0.11, 52]} />
        <meshStandardMaterial color="#64748b" metalness={0.88} roughness={0.12} />
      </mesh>

      {/* ════ Liquid ════ */}
      <mesh ref={liquidMesh} position={[0, 0, 0]}>
        <cylinderGeometry args={[CR - 0.025, CR - 0.025, CH * 0.88, 52]} />
        <meshStandardMaterial
          color="#1d4ed8"
          transparent
          opacity={0.54}
          roughness={0.2}
          metalness={0}
        />
      </mesh>

      {/* ════ Piston ════ */}
      <group ref={pistonGrp} position={[0, CH / 2 - 0.05, 0]}>
        {/* Main disc */}
        <mesh>
          <cylinderGeometry args={[CR - 0.04, CR - 0.04, 0.24, 32]} />
          <meshStandardMaterial color="#475569" metalness={0.96} roughness={0.06} />
        </mesh>
        {/* Disc highlight ring */}
        <mesh position={[0, 0.13, 0]}>
          <torusGeometry args={[CR * 0.78, 0.028, 6, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.02} />
        </mesh>
        {/* Handle rod */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.97, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handle knob */}
        <mesh position={[0, 1.22, 0]}>
          <sphereGeometry args={[0.195, 20, 20]} />
          <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.08} />
        </mesh>
        {/* Force arrow shaft */}
        <mesh ref={fShaft} position={[0, 1.92, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.38, 8]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.12} />
        </mesh>
        {/* Force arrow head */}
        <mesh ref={fArrow} position={[0, 1.72, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.34, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={0.7}
            transparent
            opacity={0.12}
          />
        </mesh>
        {/* F label ring */}
        <mesh position={[0, 2.18, 0]}>
          <torusGeometry args={[0.15, 0.018, 6, 20]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* ════ Holes ════ */}
      {LAYOUT.map((h, i) => (
        <mesh key={i} position={[h.wx, HY, h.wz]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial
            color="#1e40af"
            emissive="#3b82f6"
            emissiveIntensity={1.1}
          />
        </mesh>
      ))}

      {/* ════ Water Jets (scale grows from hole outward) ════ */}
      {LAYOUT.map((h, i) => (
        <group
          key={i}
          ref={el => { jetGroups.current[i] = el }}
          position={[h.wx, HY, h.wz]}
          quaternion={h.jetQuat}
          scale={0.001}
        >
          {/* Main jet body — tapered cylinder along Y (jet direction) */}
          <mesh position={[0, JET_L / 2, 0]}>
            <cylinderGeometry args={[0.035, 0.085, JET_L, 8]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#2563eb"
              emissiveIntensity={0.55}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Tip spray sphere */}
          <mesh position={[0, JET_L + 0.12, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial
              color="#bfdbfe"
              emissive="#60a5fa"
              emissiveIntensity={0.35}
              transparent
              opacity={0.52}
            />
          </mesh>
          {/* Inner bright core */}
          <mesh position={[0, JET_L * 0.38, 0]}>
            <cylinderGeometry args={[0.018, 0.035, JET_L * 0.76, 6]} />
            <meshStandardMaterial
              color="#eff6ff"
              emissive="#93c5fd"
              emissiveIntensity={1.0}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      ))}

      {/* ════ Pressure arrows inside container ════ */}
      {LAYOUT.map((h, i) => (
        <mesh
          key={i}
          ref={el => { arrowMeshes.current[i] = el }}
          position={[h.ax, HY, h.az]}
          quaternion={h.arrowQuat}
          scale={0.3}
        >
          <coneGeometry args={[0.068, 0.25, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.15}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════ Main export ═══ */
export default function PaskalSim() {
  const [pressure, setPressure] = useState(0)
  const [auto, setAuto]         = useState(true)

  return (
    <div
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100%',
        display:  'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#060d1f',
      }}
    >
      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [6.5, 2.2, 6.5], fov: 47 }}
          gl={{ antialias: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <PaskalScene pressure={pressure} auto={auto} />
          <OrbitControls
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.06}
            zoomSpeed={2.0}
            rotateSpeed={0.75}
            panSpeed={0.9}
            minDistance={0.5}
            maxDistance={80}
            target={[0, 0.2, 0]}
          />
        </Canvas>

        {/* Mode badge */}
        <div
          style={{
            position: 'absolute',
            top: 12, left: 12,
            padding: '4px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(96,165,250,0.15)',
            border: '1px solid rgba(96,165,250,0.35)',
            color: '#93c5fd',
            backdropFilter: 'blur(8px)',
          }}
        >
          💧 Paskal qonuni
        </div>
      </div>

      {/* Controls strip */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(5,8,25,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(96,165,250,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        {/* Auto / manual toggle */}
        <button
          onClick={() => setAuto(v => !v)}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            background: auto
              ? 'rgba(96,165,250,0.2)'
              : 'rgba(255,255,255,0.07)',
            border: `1px solid ${auto
              ? 'rgba(96,165,250,0.5)'
              : 'rgba(255,255,255,0.12)'}`,
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {auto ? '✋ Qo\'lda boshqarish' : '▶ Avtomatik'}
        </button>

        {/* Manual pressure slider */}
        {!auto && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 160 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <span style={{ fontWeight: 600 }}>Bosim kuchi (F)</span>
              <span style={{ color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace' }}>
                {Math.round(pressure * 100)} %
              </span>
            </div>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={pressure}
              onChange={e => setPressure(Number(e.target.value))}
              style={{ accentColor: '#60a5fa', cursor: 'pointer', width: '100%' }}
            />
          </div>
        )}

        {/* Formula */}
        <div
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: 'rgba(255,255,255,0.32)',
            textAlign: 'right',
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Paskal qonuni</span>
          {'  '}
          <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>
            P = F / A
          </span>
          <br />
          <span>Bosim berk idishda hamma tomonga teng uzatiladi</span>
        </div>
      </div>
    </div>
  )
}
