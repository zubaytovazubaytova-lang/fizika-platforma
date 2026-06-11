'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ─── constants ─── */
const SR    = 1.52   // sphere radius
const JET_L = 2.0    // max jet length (pressure = 1)
const N_HOLES = 28   // total candidate points (filtered ≈ 20 holes)

/* ─── Fibonacci sphere distribution ─────────────────────────────
   Distributes N_HOLES points evenly over a unit sphere.
   Top cap (piston entry) and very bottom (stand) are excluded.
──────────────────────────────────────────────────────────────── */
const PHI_GOLDEN = (1 + Math.sqrt(5)) / 2

const HOLES = Array.from({ length: N_HOLES }, (_, i) => {
  const theta = Math.acos(1 - 2 * (i + 0.5) / N_HOLES)
  const phi   = 2 * Math.PI * i / PHI_GOLDEN
  const x = Math.sin(theta) * Math.cos(phi)
  const y = Math.cos(theta)   // +1 = top, -1 = bottom
  const z = Math.sin(theta) * Math.sin(phi)

  // exclude piston zone (top) and stand zone (bottom)
  if (y > 0.80 || y < -0.88) return null

  const dir  = new THREE.Vector3(x, y, z) // already unit-length
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), dir,
  )
  return { wx: x * SR, wy: y * SR, wz: z * SR, quat }
}).filter(Boolean) as { wx: number; wy: number; wz: number; quat: THREE.Quaternion }[]

/* ─── Stand tripod (precomputed) ─── */
const LEGS = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map(angle => {
  const lx = Math.sin(angle)
  const lz = Math.cos(angle)
  const legDir = new THREE.Vector3(lx, -0.68, lz).normalize()
  const quat   = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), legDir,
  )
  return {
    quat,
    cx: lx * 0.62, cy: -(SR + 1.55), cz: lz * 0.62,   // leg-center
    fx: lx * 1.18, fy: -(SR + 2.12), fz: lz * 1.18,   // foot position
  }
})

/* ═══════════════════════════════════════════ 3D Scene ═══ */
function PaskalShariScene({ pressure, auto }: { pressure: number; auto: boolean }) {
  const timeRef     = useRef(0)
  const smoothP     = useRef(0)
  const pistonGrp   = useRef<THREE.Group>(null)
  const jetGroups   = useRef<(THREE.Group | null)[]>(Array(HOLES.length).fill(null))
  const arrowMeshes = useRef<(THREE.Mesh | null)[]>(Array(HOLES.length).fill(null))
  const fArrow      = useRef<THREE.Mesh>(null)
  const fShaft      = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    /* target pressure */
    let target: number
    if (auto) {
      timeRef.current += dt * 0.46
      target = Math.sin(timeRef.current) * 0.5 + 0.5
    } else {
      target = pressure
    }
    smoothP.current += (target - smoothP.current) * Math.min(dt * 5.5, 0.88)
    const p = smoothP.current

    /* piston descends */
    if (pistonGrp.current) {
      const ty = SR + 0.25 - p * 0.75
      pistonGrp.current.position.y +=
        (ty - pistonGrp.current.position.y) * Math.min(dt * 8, 0.8)
    }

    /* jets: scale grows radially from sphere surface */
    jetGroups.current.forEach(g => {
      if (!g) return
      g.scale.setScalar(p < 0.02 ? 0.001 : p)
    })

    /* pressure arrows inside sphere */
    arrowMeshes.current.forEach(m => {
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      m.scale.setScalar(0.28 + p * 0.82)
      mat.opacity          = 0.12 + p * 0.80
      mat.emissiveIntensity = 0.08 + p * 1.2
    })

    /* F-arrow opacity */
    ;[fArrow.current, fShaft.current].forEach(m => {
      if (!m) return
      ;(m.material as THREE.MeshStandardMaterial).opacity = 0.12 + p * 0.85
    })
  })

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.70} />
      <directionalLight position={[6, 10, 6]} intensity={1.65} />
      <pointLight position={[0, 2.5, 0]} intensity={1.1} color="#93c5fd" />
      <pointLight position={[-4, -1, -4]} intensity={0.30} color="#dbeafe" />

      {/* ── Floor ── */}
      <gridHelper args={[14, 14, '#1e3a5f', '#0d1e38']} position={[0, -SR - 2.5, 0]} />

      {/* ════ Sphere container ════ */}
      {/* glass shell */}
      <mesh>
        <sphereGeometry args={[SR + 0.045, 52, 52]} />
        <meshPhysicalMaterial
          color="#93c5fd"
          transparent opacity={0.13}
          side={THREE.DoubleSide}
          roughness={0.04}
          metalness={0}
        />
      </mesh>
      {/* equator ring accent */}
      <mesh>
        <torusGeometry args={[SR + 0.05, 0.03, 6, 64]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.08} />
      </mesh>

      {/* ════ Liquid ════ */}
      <mesh>
        <sphereGeometry args={[SR - 0.03, 52, 52]} />
        <meshStandardMaterial
          color="#1d4ed8"
          transparent opacity={0.50}
          roughness={0.18}
          metalness={0}
        />
      </mesh>

      {/* ════ Piston ════ */}
      <group ref={pistonGrp} position={[0, SR + 0.25, 0]}>
        {/* rod inside sphere */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 1.25, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* disc */}
        <mesh>
          <cylinderGeometry args={[0.21, 0.21, 0.18, 20]} />
          <meshStandardMaterial color="#475569" metalness={0.96} roughness={0.06} />
        </mesh>
        {/* disc ring */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.16, 0.022, 6, 20]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.02} />
        </mesh>
        {/* handle rod */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 1.04, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* knob */}
        <mesh position={[0, 1.26, 0]}>
          <sphereGeometry args={[0.185, 18, 18]} />
          <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.08} />
        </mesh>
        {/* F arrow shaft */}
        <mesh ref={fShaft} position={[0, 1.9, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.36, 8]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.12} />
        </mesh>
        {/* F arrow head */}
        <mesh ref={fArrow} position={[0, 1.7, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.10, 0.30, 12]} />
          <meshStandardMaterial
            color="#ef4444" emissive="#dc2626" emissiveIntensity={0.7}
            transparent opacity={0.12}
          />
        </mesh>
      </group>

      {/* ════ Stand ════ */}
      {/* central column */}
      <mesh position={[0, -(SR + 1.0), 0]}>
        <cylinderGeometry args={[0.072, 0.10, 1.1, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* column-sphere collar */}
      <mesh position={[0, -(SR + 0.52), 0]}>
        <torusGeometry args={[0.13, 0.05, 8, 20]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* tripod legs */}
      {LEGS.map((leg, i) => (
        <mesh key={i} position={[leg.cx, leg.cy, leg.cz]} quaternion={leg.quat}>
          <cylinderGeometry args={[0.042, 0.052, 1.15, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* foot pads */}
      {LEGS.map((leg, i) => (
        <mesh key={i} position={[leg.fx, leg.fy, leg.fz]}>
          <cylinderGeometry args={[0.10, 0.12, 0.07, 10]} />
          <meshStandardMaterial color="#475569" metalness={0.82} roughness={0.18} />
        </mesh>
      ))}

      {/* ════ Holes on sphere surface ════ */}
      {HOLES.map((h, i) => (
        <mesh key={i} position={[h.wx, h.wy, h.wz]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* ════ Water jets (radial, scale from hole outward) ════ */}
      {HOLES.map((h, i) => (
        <group
          key={i}
          ref={el => { jetGroups.current[i] = el }}
          position={[h.wx, h.wy, h.wz]}
          quaternion={h.quat}
          scale={0.001}
        >
          {/* outer tapered jet */}
          <mesh position={[0, JET_L / 2, 0]}>
            <cylinderGeometry args={[0.022, 0.072, JET_L, 6]} />
            <meshStandardMaterial
              color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.55}
              transparent opacity={0.82}
            />
          </mesh>
          {/* inner bright core */}
          <mesh position={[0, JET_L * 0.38, 0]}>
            <cylinderGeometry args={[0.010, 0.025, JET_L * 0.75, 6]} />
            <meshStandardMaterial
              color="#eff6ff" emissive="#93c5fd" emissiveIntensity={1.0}
              transparent opacity={0.55}
            />
          </mesh>
          {/* tip spray sphere */}
          <mesh position={[0, JET_L + 0.08, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial
              color="#bfdbfe" emissive="#60a5fa" emissiveIntensity={0.35}
              transparent opacity={0.50}
            />
          </mesh>
        </group>
      ))}

      {/* ════ Pressure arrows inside sphere (radial) ════ */}
      {HOLES.map((h, i) => (
        <mesh
          key={i}
          ref={el => { arrowMeshes.current[i] = el }}
          position={[h.wx * 0.38, h.wy * 0.38, h.wz * 0.38]}
          quaternion={h.quat}
          scale={0.28}
        >
          <coneGeometry args={[0.068, 0.22, 7]} />
          <meshStandardMaterial
            color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.08}
            transparent opacity={0.12}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════ Main export ═══ */
export default function PaskalShariSim() {
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
          camera={{ position: [5.8, 2.4, 5.8], fov: 46 }}
          gl={{ antialias: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <PaskalShariScene pressure={pressure} auto={auto} />
          <OrbitControls
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.06}
            zoomSpeed={2.0}
            rotateSpeed={0.75}
            panSpeed={0.9}
            minDistance={0.5}
            maxDistance={80}
            target={[0, 0.1, 0]}
          />
        </Canvas>

        {/* badge */}
        <div
          style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 10px', borderRadius: 8,
            fontSize: 11, fontWeight: 700,
            background: 'rgba(56,189,248,0.15)',
            border: '1px solid rgba(56,189,248,0.38)',
            color: '#7dd3fc',
            backdropFilter: 'blur(8px)',
          }}
        >
          🔵 Paskal shari — 360°
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(5,8,25,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(56,189,248,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setAuto(v => !v)}
          style={{
            padding: '6px 14px', borderRadius: 8,
            background: auto ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${auto ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {auto ? '✋ Qo\'lda boshqarish' : '▶ Avtomatik'}
        </button>

        {!auto && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 160 }}>
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'rgba(255,255,255,0.5)',
              }}
            >
              <span style={{ fontWeight: 600 }}>Bosim kuchi (F)</span>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
                {Math.round(pressure * 100)} %
              </span>
            </div>
            <input
              type="range" min={0} max={1} step={0.01} value={pressure}
              onChange={e => setPressure(Number(e.target.value))}
              style={{ accentColor: '#38bdf8', cursor: 'pointer', width: '100%' }}
            />
          </div>
        )}

        <div
          style={{
            marginLeft: 'auto', fontSize: 11,
            color: 'rgba(255,255,255,0.32)',
            textAlign: 'right', lineHeight: 1.6,
          }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Paskal shari</span>
          {'  '}
          <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>
            P = F / A
          </span>
          <br />
          <span>Bosim shar yuzasining barcha nuqtasiga teng uzatiladi (360°)</span>
        </div>
      </div>
    </div>
  )
}
