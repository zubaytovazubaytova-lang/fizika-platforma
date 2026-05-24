'use client'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Geometriya konstantalari ───────────────────────────────────── */
const RING_R  = 0.56
const RING_Y  = 1.22
const GLASS_Z = 0.28
const ROD_BOT = 1.00
const ROD_TOP = 1.87
const BALL_Y  = 1.98
const BALL_R  = 0.175
const HINGE_Y = 1.00
const LEAF_H  = 0.31
const LEAF_W  = 0.022
const LEAF_T  = 0.006
const MAX_DEG = 58

/* Tayoqcha o'lchamlari */
const TAY_LEN = 1.70   // tayoqcha uzunligi
const TAY_R   = 0.052  // tayoqcha radiusi

/* Drag cheklovlar */
const DRAG_MIN = 0.30   // sharcha yuzasidan min masofa (BALL_R + gap)
const DRAG_MAX = 6.5    // max masofa

const TICKS = Array.from({ length: 5 }, (_, i) => {
  const a = ((-48 + i * 24) * Math.PI) / 180
  return { x: 0.41 * Math.sin(a), y: RING_Y + 0.41 * Math.cos(a), a }
})

/* ─── Ko'rsatgich chiziqlar ─────────────────────────────────────── */
type LabelItem = { num: number; dot: [number,number,number]; tip: [number,number,number]; text: string; color: string }

const LABEL_ITEMS: LabelItem[] = [
  { num: 3, dot: [0.176, BALL_Y, 0],                        tip: [1.32, BALL_Y + 0.42, 0], text: 'Sharcha',              color: '#fbbf24' },
  { num: 1, dot: [0.061, 1.80,    0],                        tip: [1.32, 1.65,           0], text: 'Plastmassa tiqin',     color: '#60a5fa' },
  { num: 2, dot: [0.022, 1.37,    GLASS_Z - 0.008],          tip: [1.32, 1.37,           0], text: 'Metall sterjen',       color: '#34d399' },
  { num: 4, dot: [0.012, HINGE_Y - LEAF_H / 2, GLASS_Z - 0.008], tip: [1.32, 0.68,      0], text: 'Folga yaproqchalari',  color: '#f87171' },
]

/* ════════════════════════ Sahna ════════════════════════ */
function ElektroskopScene({
  charge, auto, showLabels, tayoqcha, orbitRef,
}: {
  charge: number
  auto: boolean
  showLabels: boolean
  tayoqcha: boolean
  orbitRef: React.MutableRefObject<any>
}) {
  /* useThree — canvas va kamera olish */
  const { gl, camera } = useThree()

  /* ── Mavjud animatsiya reflar ── */
  const timeRef   = useRef(0)
  const smoothC   = useRef(0)
  const leafL     = useRef<THREE.Group>(null)
  const leafR     = useRef<THREE.Group>(null)
  const sphereMat = useRef<THREE.MeshStandardMaterial>(null)
  const rodMat    = useRef<THREE.MeshStandardMaterial>(null)
  const glowMesh  = useRef<THREE.Mesh>(null)
  const leafLMat  = useRef<THREE.MeshStandardMaterial>(null)
  const leafRMat  = useRef<THREE.MeshStandardMaterial>(null)

  /* ── Tayoqcha reflar ── */
  const tipX        = useRef(3.0)             // rod tip X (XZ tekislikda)
  const tipZ        = useRef(0.35)            // rod tip Z
  const isDragging  = useRef(false)
  const rodGlow     = useRef(0)
  const tayGroupRef = useRef<THREE.Group>(null)
  const tayGlowMat  = useRef<THREE.MeshBasicMaterial>(null)
  const tayGlowAura = useRef<THREE.MeshBasicMaterial>(null)

  /* Gorizontal tekislik BALL_Y balandligida (drag uchun) */
  const hPlane    = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -BALL_Y))
  const rcaster   = useRef(new THREE.Raycaster())
  const hitPoint  = useRef(new THREE.Vector3())

  /* ── Canvas pointer event listenerlari (drag) ── */
  useEffect(() => {
    const canvas = gl.domElement

    function onMove(e: PointerEvent) {
      if (!isDragging.current) return

      /* NDC koordinatalar */
      const rect = canvas.getBoundingClientRect()
      const ndcX =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      const ndcY = -((e.clientY - rect.top)  / rect.height) * 2 + 1

      /* Ray → gorizontal tekislik kesishmasi */
      rcaster.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
      const hit = rcaster.current.ray.intersectPlane(hPlane.current, hitPoint.current)
      if (!hit) return

      const dx = hitPoint.current.x
      const dz = hitPoint.current.z
      const d  = Math.sqrt(dx * dx + dz * dz)
      if (d < 0.001) return

      /* Masofa cheklash */
      const clamped = Math.min(Math.max(d, DRAG_MIN), DRAG_MAX)
      tipX.current = (dx / d) * clamped
      tipZ.current = (dz / d) * clamped
    }

    function onUp() {
      if (!isDragging.current) return
      isDragging.current = false
      if (orbitRef.current) orbitRef.current.enabled = true
      canvas.style.cursor = 'default'
    }

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup',   onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup',   onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [gl, camera, orbitRef])

  /* Tayoqcha yoq/yoq o'zgarganda: boshlang'ich pozitsiya, OrbitControls reset */
  useEffect(() => {
    if (tayoqcha) {
      tipX.current = 3.0
      tipZ.current = 0.35
    } else {
      isDragging.current = false
      if (orbitRef.current) orbitRef.current.enabled = true
      if (gl.domElement) gl.domElement.style.cursor = 'default'
    }
  }, [tayoqcha, orbitRef, gl])

  /* ── Asosiy animatsiya ── */
  useFrame((_, dt) => {
    /* 1. Tayoqcha guruhi pozitsiyasi va yo'nalishi */
    if (tayGroupRef.current) {
      tayGroupRef.current.visible = tayoqcha
      if (tayoqcha) {
        tayGroupRef.current.position.set(tipX.current, BALL_Y, tipZ.current)
        /*
          Tayoqcha har doim sharcha markaziga qarshi yo'naladi.
          Tip (local x=0) = [tipX, BALL_Y, tipZ]
          Gövde local +X bo'ylab uzayadi → world [cos θ, 0, sin θ]
          θ = atan2(tipZ, tipX) → tayoqcha sharcha markazidan tashqariga qaraydi ✓
        */
        tayGroupRef.current.rotation.y = Math.atan2(tipZ.current, tipX.current)
      }
    }

    /* 2. Zaryad maqsadi */
    let chargeTarget: number

    if (tayoqcha) {
      /* 3D masofa: tip [tipX, BALL_Y, tipZ] → ball [0, BALL_Y, 0] */
      const dist3d = Math.sqrt(tipX.current ** 2 + tipZ.current ** 2)
      /* Elektrostatik induksiya: yaqin → katta zaryad */
      const induced = Math.exp(-(dist3d - BALL_R) * 0.50)
      chargeTarget = Math.min(1, induced)

      rodGlow.current += (induced - rodGlow.current) * Math.min(dt * 3.5, 0.85)
      if (tayGlowMat.current)  tayGlowMat.current.opacity  = Math.min(rodGlow.current * 0.70, 0.85)
      if (tayGlowAura.current) tayGlowAura.current.opacity = Math.min(rodGlow.current * 0.22, 0.35)
    } else {
      rodGlow.current = 0
      if (tayGlowMat.current)  tayGlowMat.current.opacity  = 0
      if (tayGlowAura.current) tayGlowAura.current.opacity = 0

      if (auto) {
        timeRef.current += dt * 0.38
        const t = timeRef.current % (Math.PI * 2)
        chargeTarget = t < Math.PI
          ? Math.sin(t * 0.5) ** 2
          : Math.max(0, 1 - (t - Math.PI) / (Math.PI * 0.25))
      } else {
        chargeTarget = charge
      }
    }

    /* 3. Silliqlash */
    smoothC.current += (chargeTarget - smoothC.current) * Math.min(dt * 4.5, 0.85)
    const c = smoothC.current

    /* 4. Barg burchaklari */
    const angle = (c * MAX_DEG * Math.PI) / 180
    if (leafL.current) leafL.current.rotation.z = -angle
    if (leafR.current) leafR.current.rotation.z =  angle

    /* 5. Emissiya */
    const le = c * 0.60
    if (leafLMat.current) leafLMat.current.emissiveIntensity = le
    if (leafRMat.current) leafRMat.current.emissiveIntensity = le
    if (sphereMat.current) sphereMat.current.emissiveIntensity = c * 0.80
    if (rodMat.current)    rodMat.current.emissiveIntensity    = c * 0.30

    if (glowMesh.current) {
      glowMesh.current.scale.setScalar(1 + c * 0.55)
      ;(glowMesh.current.material as THREE.MeshBasicMaterial).opacity = c * 0.22
    }
  })

  /* ── Pointer handlers (rod uchun) ── */
  const handleRodDown = (e: { stopPropagation: () => void; pointerId?: number }) => {
    e.stopPropagation()
    isDragging.current = true
    if (orbitRef.current) orbitRef.current.enabled = false
    if ((e as any).pointerId !== undefined) {
      try { gl.domElement.setPointerCapture((e as any).pointerId) } catch { /* ignore */ }
    }
    gl.domElement.style.cursor = 'grabbing'
  }

  const handleRodEnter = () => {
    if (!isDragging.current) gl.domElement.style.cursor = 'grab'
  }

  const handleRodLeave = () => {
    if (!isDragging.current) gl.domElement.style.cursor = 'default'
  }

  return (
    <group>
      {/* Yoritish */}
      <ambientLight intensity={1.10} />
      <directionalLight position={[4, 8, 6]}  intensity={1.80} />
      <directionalLight position={[-4, 5, 4]} intensity={0.70} color="#cce8ff" />
      <pointLight position={[0, BALL_Y, 3.0]} intensity={1.4}  color="#ffd966" />
      <pointLight position={[2, 2, 3]}        intensity={0.80} color="#fff8ee" />
      <gridHelper args={[14, 14, '#1e3a5f', '#0d1e38']} position={[0, -0.18, 0]} />

      {/* ═══ TAYANCH / OYOQ ═══ */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.50, 0.54, 0.09, 40]} />
        <meshStandardMaterial color="#8fa4b2" metalness={0.92} roughness={0.10} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.044, 0.054, 0.58, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.26, 0.042, 8, 48]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.06} />
      </mesh>
      <mesh position={[0, (0.66 + RING_Y - RING_R * 0.95) / 2, 0]}>
        <cylinderGeometry args={[0.044, 0.044, (RING_Y - RING_R * 0.95) - 0.66, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.06} />
      </mesh>

      {/* ═══ SHISHA GARDISH ═══ */}
      <mesh position={[0, RING_Y, 0]}>
        <torusGeometry args={[RING_R, 0.052, 14, 80]} />
        <meshStandardMaterial color="#c8d4dc" metalness={0.92} roughness={0.10} />
      </mesh>
      <mesh position={[0, RING_Y, GLASS_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[RING_R - 0.015, RING_R - 0.015, 0.022, 64]} />
        <meshPhysicalMaterial color="#c8dff0" transparent opacity={0.20} roughness={0.04} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, RING_Y, -GLASS_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[RING_R - 0.015, RING_R - 0.015, 0.022, 64]} />
        <meshPhysicalMaterial color="#c8dff0" transparent opacity={0.20} roughness={0.04} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, RING_Y + RING_R * 0.94, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.96} roughness={0.05} />
      </mesh>
      {TICKS.map(({ x, y, a }, i) => (
        <mesh key={i} position={[x, y, 0]} rotation={[0, 0, a]}>
          <boxGeometry args={[0.006, 0.050, 0.007]} />
          <meshStandardMaterial color="#5a6a7a" metalness={0.80} roughness={0.22} />
        </mesh>
      ))}

      {/* ═══ PLASTMASSA TIQIN (1) ═══ */}
      <mesh position={[0, 1.80, 0]}>
        <cylinderGeometry args={[0.060, 0.060, 0.18, 16]} />
        <meshStandardMaterial color="#18100a" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* ═══ METALL STERJEN (2) ═══ */}
      <mesh position={[0, (ROD_BOT + ROD_TOP) / 2, 0]}>
        <cylinderGeometry args={[0.022, 0.022, ROD_TOP - ROD_BOT, 12]} />
        <meshStandardMaterial ref={rodMat} color="#c0c8d0" metalness={0.98} roughness={0.03} emissive="#60a5fa" emissiveIntensity={0} />
      </mesh>

      {/* ═══ SHARCHA (3) ═══ */}
      <mesh ref={glowMesh} position={[0, BALL_Y, 0]}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, BALL_Y, 0]}>
        <sphereGeometry args={[BALL_R, 30, 30]} />
        <meshStandardMaterial ref={sphereMat} color="#e8b800" metalness={0.80} roughness={0.20} emissive="#fbbf24" emissiveIntensity={0.35} />
      </mesh>

      {/* ═══ FOLGA YAPROQCHALARI (4) ═══ */}
      <group ref={leafL} position={[0, HINGE_Y, -0.010]}>
        <mesh position={[0, -LEAF_H / 2, 0]}>
          <boxGeometry args={[LEAF_W, LEAF_H, LEAF_T]} />
          <meshStandardMaterial ref={leafLMat} color="#c8860a" metalness={0.97} roughness={0.04} emissive="#f59e0b" emissiveIntensity={0} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={leafR} position={[0, HINGE_Y, 0.010]}>
        <mesh position={[0, -LEAF_H / 2, 0]}>
          <boxGeometry args={[LEAF_W, LEAF_H, LEAF_T]} />
          <meshStandardMaterial ref={leafRMat} color="#c8860a" metalness={0.97} roughness={0.04} emissive="#f59e0b" emissiveIntensity={0} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.97} roughness={0.03} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          EBONIT TAYOQCHA
          ─ Guruh pozitsiyasi: [tipX, BALL_Y, tipZ]  (tip = sharcha tomoni)
          ─ Guruh rotation.y = atan2(tipZ, tipX)
            → local +X axis yo'nalishi: sharchadan tashqariga ✓
          ─ Silindr geometriyasi Y o'qi bo'yicha, X ga aylantirish: [0,0,π/2]
          ─ Body mesh local [TAY_LEN/2, 0, 0] → local x: 0 … TAY_LEN
          ─ Grip local [TAY_LEN+0.22, 0, 0]
          ─ Tip glow local [0, 0, 0] = sharcha tomonidagi uchi
      ══════════════════════════════════════════════════════════ */}
      <group ref={tayGroupRef} visible={false}>

        {/* Asosiy gövde — ebonit (qoʻngʻir-qora) */}
        <mesh
          position={[TAY_LEN / 2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          onPointerDown={handleRodDown}
          onPointerEnter={handleRodEnter}
          onPointerLeave={handleRodLeave}
        >
          <cylinderGeometry args={[TAY_R, TAY_R * 0.86, TAY_LEN, 22]} />
          <meshStandardMaterial color="#0e0503" roughness={0.80} metalness={0.05} />
        </mesh>

        {/* Yuzaki halqa chiziqlar — ebonit fakturasi */}
        {[-0.55, -0.22, 0.12, 0.44, 0.78].map((ox, i) => (
          <mesh
            key={i}
            position={[TAY_LEN / 2 + ox, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            onPointerDown={handleRodDown}
            onPointerEnter={handleRodEnter}
            onPointerLeave={handleRodLeave}
          >
            <cylinderGeometry args={[TAY_R + 0.003, TAY_R + 0.003, 0.026, 16]} />
            <meshStandardMaterial color="#1e0c06" roughness={0.90} metalness={0} />
          </mesh>
        ))}

        {/* Tutqich / grip — sal kattaroq, jigarrang */}
        <mesh
          position={[TAY_LEN + 0.24, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          onPointerDown={handleRodDown}
          onPointerEnter={handleRodEnter}
          onPointerLeave={handleRodLeave}
        >
          <cylinderGeometry args={[TAY_R * 1.14, TAY_R * 1.14, 0.45, 18]} />
          <meshStandardMaterial color="#2a1208" roughness={0.90} metalness={0.02} />
        </mesh>

        {/* Manfiy zaryad nuri — tip uchidagi kichik glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.070, 14, 14]} />
          <meshBasicMaterial ref={tayGlowMat} color="#8b5cf6" transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Katta aura */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.24, 14, 14]} />
          <meshBasicMaterial ref={tayGlowAura} color="#6d28d9" transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Yorliq + drag ko'rsatmasi */}
        <Html
          position={[TAY_LEN / 2, -0.22, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div style={{
            background: 'rgba(76,29,149,0.90)',
            border: '1px solid rgba(167,139,250,0.55)',
            borderRadius: 6,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
            color: '#ede9fe',
            whiteSpace: 'nowrap',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 12px rgba(109,40,217,0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <span style={{ fontSize: 12 }}>⊖</span>
            Ebonit tayoqcha
            <span style={{ opacity: 0.65, fontSize: 10, marginLeft: 2 }}>· suring</span>
          </div>
        </Html>
      </group>

      {/* ═══ KO'RSATGICH CHIZIQLAR ═══ */}
      {showLabels && LABEL_ITEMS.map(({ num, dot, tip, text, color }) => (
        <group key={num}>
          <Line points={[dot, tip]} color={color} lineWidth={2.2} />
          <mesh position={dot} renderOrder={999}>
            <sphereGeometry args={[0.028, 14, 14]} />
            <meshBasicMaterial color={color} depthTest={false} />
          </mesh>
          <Html position={tip} style={{ pointerEvents: 'none', userSelect: 'none' }} zIndexRange={[100, 0]}>
            <div style={{
              background: 'rgba(4,8,25,0.97)',
              border: `1.5px solid ${color}`,
              borderRadius: 7,
              padding: '4px 10px 4px 5px',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              transform: 'translateY(-50%)',
              boxShadow: `0 2px 12px ${color}44`,
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{
                background: color, color: '#000',
                borderRadius: '50%', width: 20, height: 20,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, flexShrink: 0, fontFamily: 'monospace',
              }}>{num}</span>
              <span style={{ color: '#f0f4ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.25px' }}>{text}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

/* ════════════════════════ Asosiy komponent ════════════════════════ */
export default function ElektroskopSim({
  showLabels = false,
  onToggle,
}: {
  showLabels?: boolean
  onToggle?: () => void
}) {
  const [charge,         setCharge]        = useState(0)
  const [auto,           setAuto]          = useState(true)
  const [tayoqchaActive, setTayoqchaActive] = useState(false)

  /* OrbitControls ref — tayoqcha drag paytida o'chirib qo'yish uchun */
  const orbitRef = useRef<any>(null)

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: '#060d1f',
    }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 1.3, 7.2], fov: 46 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ElektroskopScene
            charge={charge}
            auto={auto}
            showLabels={showLabels}
            tayoqcha={tayoqchaActive}
            orbitRef={orbitRef}
          />
          <OrbitControls
            ref={orbitRef}
            enablePan={false}
            minDistance={0.8}
            maxDistance={18}
            target={[0, 1.1, 0]}
          />
        </Canvas>

        {/* Badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 10px', borderRadius: 8,
          fontSize: 11, fontWeight: 700,
          background: 'rgba(251,191,36,0.15)',
          border: '1px solid rgba(251,191,36,0.40)',
          color: '#fcd34d',
          backdropFilter: 'blur(8px)',
        }}>
          ⚡ Elektroskop
        </div>

        {/* Tayoqcha drag ko'rsatmasi */}
        {tayoqchaActive && (
          <div style={{
            position: 'absolute', bottom: 60, left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 14px',
            background: 'rgba(76,29,149,0.88)',
            border: '1px solid rgba(167,139,250,0.40)',
            borderRadius: 8, fontSize: 11, fontWeight: 600,
            color: '#ede9fe', backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap', pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span>🖱</span>
            <span>Tayoqchani bosib suring — 360° harakatlanadi</span>
          </div>
        )}
      </div>

      {/* ── Boshqaruv paneli ── */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(5,8,25,0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(251,191,36,0.18)',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>

        {/* Avtomatik / Qo'lda */}
        <button
          onClick={() => setAuto(v => !v)}
          disabled={tayoqchaActive}
          style={{
            padding: '6px 14px', borderRadius: 8,
            background: (auto && !tayoqchaActive) ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${(auto && !tayoqchaActive) ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: tayoqchaActive ? 'rgba(255,255,255,0.28)' : 'white',
            fontSize: 12, fontWeight: 600,
            cursor: tayoqchaActive ? 'not-allowed' : 'pointer',
            opacity: tayoqchaActive ? 0.45 : 1,
          }}
        >
          {auto ? "✋ Qo'lda" : '▶ Avtomatik'}
        </button>

        {/* Zaryad slayderi */}
        {!auto && !tayoqchaActive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 160 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ fontWeight: 600 }}>Zaryad Q</span>
              <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>
                {Math.round(charge * 100)} %
              </span>
            </div>
            <input
              type="range" min={0} max={1} step={0.01} value={charge}
              onChange={e => setCharge(Number(e.target.value))}
              style={{ accentColor: '#fbbf24', cursor: 'pointer', width: '100%' }}
            />
          </div>
        )}

        {/* ─── TAYOQCHA TUGMASI ─── */}
        <button
          onClick={() => setTayoqchaActive(v => !v)}
          style={{
            padding: '6px 16px', borderRadius: 8,
            background: tayoqchaActive ? 'rgba(109,40,217,0.30)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${tayoqchaActive ? 'rgba(139,92,246,0.70)' : 'rgba(255,255,255,0.16)'}`,
            color: tayoqchaActive ? '#c4b5fd' : 'rgba(255,255,255,0.70)',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.22s',
            boxShadow: tayoqchaActive ? '0 0 16px rgba(109,40,217,0.40)' : 'none',
          }}
        >
          <span style={{ fontSize: 14 }}>{tayoqchaActive ? '↩' : '⚡'}</span>
          {tayoqchaActive ? "Tayoqchani yashirish" : 'Tayoqcha'}
        </button>

        {/* Ma'lumot tugmasi */}
        {onToggle && (
          <button
            onClick={onToggle}
            style={{
              padding: '6px 16px', borderRadius: 8,
              background: showLabels ? 'rgba(99,102,241,0.28)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${showLabels ? 'rgba(99,102,241,0.65)' : 'rgba(255,255,255,0.14)'}`,
              color: showLabels ? '#a5b4fc' : 'rgba(255,255,255,0.65)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}
          >
            {showLabels ? '✕ Yopish' : "📌 Ma'lumot"}
          </button>
        )}

        {/* O'ng tomon */}
        <div style={{
          marginLeft: 'auto', fontSize: 11,
          color: 'rgba(255,255,255,0.32)',
          textAlign: 'right', lineHeight: 1.6,
        }}>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Elektroskop</span>
          {'  '}
          <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>F = k·q²/r²</span>
          <br />
          <span>Bir xil zaryadli barglar bir-birini itaradi</span>
        </div>
      </div>
    </div>
  )
}
