'use client'
// g = 9.8 — Yerning Imzosi | 2-sahnali interaktiv simulatsiya

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════ GLSL SHADERLAR ═══════════════════ */

/* ── Yer yuzasi — object-space sferik UV (yarim sfera uchun to'g'ri) ── */
const EARTH_VERT = /* glsl */`
varying vec3 vObjPos;
varying vec3 vWorldNormal;
void main() {
  vObjPos      = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const EARTH_FRAG = /* glsl */`
#define PI 3.14159265359

varying vec3 vObjPos;
varying vec3 vWorldNormal;

float hash(float n) { return fract(sin(n) * 43758.5453); }

float n2(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i.x + i.y*57.0), hash(i.x+1.0 + i.y*57.0), f.x),
    mix(hash(i.x + (i.y+1.0)*57.0), hash(i.x+1.0+(i.y+1.0)*57.0), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 7; i++) { v += a * n2(p); p *= 2.08; a *= 0.5; }
  return v;
}

void main() {
  /* Sferik UV koordinatalar — object-space pozitsiyadan hisoblash.
     Yarim sfera uchun ham butun Yer teksturasini to'g'ri ko'rsatadi. */
  vec3 p   = normalize(vObjPos);
  float lon = atan(p.x, p.z);
  float lat = asin(clamp(p.y, -1.0, 1.0));
  vec2 uv   = vec2((lon + PI) / (2.0 * PI), (lat + PI * 0.5) / PI);

  /* --- Qit'a maskasi --- */
  float land  = smoothstep(0.455, 0.545, fbm(uv * vec2(4.2, 2.9) + vec2(1.71, 0.93)));

  /* --- Qutb muzliklari (kenglik asosida) --- */
  float absLat = abs(lat) / (PI * 0.5);
  float polar  = smoothstep(0.72, 0.90, absLat);

  /* --- Okean rangi (chuqur + sayoz) --- */
  float od    = fbm(uv * vec2(6.5, 4.2) + vec2(3.31, 2.17));
  vec3 ocean  = mix(vec3(0.010, 0.060, 0.220), vec3(0.035, 0.115, 0.360), od);

  /* --- Qit'a rangi (o'rmon / savanna / cho'l / tog') --- */
  float vd = fbm(uv * vec2(5.8, 4.1) + vec2(5.83, 3.24));
  float md = fbm(uv * vec2(9.0, 7.0) + vec2(1.13, 7.51));
  vec3 lc  = mix(vec3(0.10, 0.28, 0.06), vec3(0.36, 0.42, 0.11), smoothstep(0.35, 0.55, vd));
  lc = mix(lc, vec3(0.68, 0.50, 0.20), smoothstep(0.52, 0.68, vd));
  lc = mix(lc, vec3(0.40, 0.33, 0.26), smoothstep(0.64, 0.82, md));

  /* --- Bulutlar --- */
  float cloud = smoothstep(0.53, 0.69, fbm(uv * vec2(3.8, 2.6) + vec2(8.33, 1.55)));

  /* --- Barcha qatlamlarni birlashtirish --- */
  vec3 color = mix(ocean, lc, land);
  color = mix(color, vec3(0.90, 0.95, 1.00), polar);
  color = mix(color, vec3(0.96, 0.97, 1.00), cloud * 0.75);

  /* --- Yorug'lik (dunyo makonida) --- */
  vec3 sunDir = normalize(vec3(4.0, 3.0, 5.0));
  float diff  = max(dot(vWorldNormal, sunDir), 0.0);

  /* Okean spekulyar (quyosh aksi suvda) */
  vec3 viewApprox = normalize(vec3(1.0, 0.5, 2.5));
  vec3 h          = normalize(sunDir + viewApprox);
  float spec      = pow(max(dot(h, vWorldNormal), 0.0), 60.0)
                  * (1.0 - land) * (1.0 - polar) * (1.0 - cloud * 0.8);

  color = color * (0.25 + 0.75 * diff)
        + vec3(0.78, 0.92, 1.0) * spec * 0.48;

  /* Terminator — kun/tun chegarasi */
  color *= smoothstep(0.0, 0.18, diff) * 0.94 + 0.06;

  gl_FragColor = vec4(color, 1.0);
}
`

/* ── Atmosfera — rim glow effekti ── */
const ATM_VERT = /* glsl */`
varying vec3 vNormal;
void main() {
  vNormal     = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ATM_FRAG = /* glsl */`
varying vec3 vNormal;
void main() {
  float rim = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
  rim = pow(rim, 2.2);
  gl_FragColor = vec4(0.22, 0.60, 1.0, rim * 0.90);
}
`

/* ═══════════════════ MA'LUMOTLAR ═══════════════════ */

const LAYERS = [
  { name: 'Qobiq',        color: '#4a7c59', r: 2.00, mass: '1%',  desc: '~70 km qalin. Granit va bazalt.' },
  { name: 'Mantiya',      color: '#c0622f', r: 1.62, mass: '67%', desc: '2900 km qalin. Suyuq tosh.' },
  { name: 'Tashqi yadro', color: '#1d9e75', r: 1.18, mass: '16%', desc: 'Suyuq temir-nikel. Magnit hosil qiladi.' },
  { name: 'Ichki yadro',  color: '#e8c547', r: 0.62, mass: '16%', desc: 'Qattiq temir. Harorat ~6000°C.' },
]

const SCENE_NAMES = ['Galiley tajribasi', 'Yer ichkari']

/* ═══════════════════ 3D SAHNALAR ═══════════════════ */

/* ── Sahna 0: Tushuvchi jismlar ──────────────────────── */
function GalileoObjects({ dropped, onLand }: { dropped: boolean; onLand: () => void }) {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const tRef      = useRef(0)
  const landedRef = useRef(false)
  const START_Y   = 3.2
  const GROUND_Y  = -1.9

  useEffect(() => {
    tRef.current = 0
    landedRef.current = false
    refs.forEach(r => { if (r.current) r.current.position.y = START_Y })
  }, [dropped]) // eslint-disable-line

  useFrame((_, delta) => {
    if (!dropped || landedRef.current) return
    tRef.current += delta * 0.65
    const y = START_Y - 0.5 * 9.8 * tRef.current ** 2
    if (y <= GROUND_Y) {
      landedRef.current = true
      refs.forEach(r => { if (r.current) r.current.position.y = GROUND_Y })
      onLand()
      return
    }
    refs.forEach(r => { if (r.current) r.current.position.y = y })
  })

  return (
    <>
      {/* Tosh */}
      <mesh ref={refs[0]} position={[-2.8, START_Y, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} metalness={0.08} />
      </mesh>
      {/* Qog'oz */}
      <mesh ref={refs[1]} position={[0, START_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.055, 0.75]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
      </mesh>
      {/* Olma */}
      <mesh ref={refs[2]} position={[2.8, START_Y, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.45} metalness={0.05} />
      </mesh>
      {/* Zamin */}
      <mesh position={[0, GROUND_Y - 0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Ustunlar */}
      {([-2.8, 0, 2.8] as number[]).map(x => (
        <mesh key={x} position={[x, 0.65, -0.6]}>
          <boxGeometry args={[0.03, 5.5, 0.03]} />
          <meshStandardMaterial color="#334155" transparent opacity={0.35} />
        </mesh>
      ))}
    </>
  )
}

/* ── Sahna 1: Realistik Yer Kesimi ─────────────────────────────── */

function EarthCrossSection({ activeLayer }: { activeLayer: number | null }) {
  const earthGroupRef = useRef<THREE.Group>(null)

  // Sekin aylanish (faqat tashqi Yer shari)
  useFrame((_, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.12
    }
  })

  const outerR = LAYERS[0].r

  const earthMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   EARTH_VERT,
    fragmentShader: EARTH_FRAG,
    side: THREE.FrontSide,
  }), [])

  const atmMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   ATM_VERT,
    fragmentShader: ATM_FRAG,
    side: THREE.BackSide,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
  }), [])

  return (
    <group>
      {/* ── Atmosfera porlashi (aylanmaydi — doim bir joyda) ── */}
      <mesh>
        <sphereGeometry args={[outerR + 0.18, 96, 48]} />
        <primitive object={atmMat} attach="material" />
      </mesh>

      {/* ── Tashqi Yer shari (realistik, sekin aylanadi) ── */}
      <group ref={earthGroupRef}>
        {/* Orqa yarmi — realistik Yer teksturasi */}
        <mesh>
          <sphereGeometry args={[outerR, 128, 64, Math.PI, Math.PI]} />
          <primitive object={earthMat} attach="material" />
        </mesh>
        {/* Old yarmi — shaffof okean rangi (kesim ko'rinadi) */}
        <mesh>
          <sphereGeometry args={[outerR, 64, 32, 0, Math.PI]} />
          <meshStandardMaterial
            color="#1a5fcc"
            roughness={0.05}
            metalness={0.12}
            transparent
            opacity={0.18}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>

      {/* ── Ichki qatlamlar (statik — kesim ochiq ko'rinadi) ── */}
      {LAYERS.map((layer, i) => {
        const isActive = activeLayer === i
        const innerR   = i < LAYERS.length - 1 ? LAYERS[i + 1].r : 0
        const emissive = isActive ? 0.55 : (i === 3 ? 0.42 : 0.04)

        return (
          <group key={layer.name}>
            {/* Orqa yarmi — faqat ichki qatlamlar ko'rinadi (Qobiq= i>0) */}
            {i > 0 && (
              <mesh>
                <sphereGeometry args={[layer.r, 64, 32, Math.PI, Math.PI]} />
                <meshStandardMaterial
                  color={layer.color}
                  roughness={i === 3 ? 0.12 : 0.50}
                  metalness={i === 2 ? 0.65 : i === 3 ? 0.88 : 0.0}
                  emissive={layer.color}
                  emissiveIntensity={emissive}
                  side={THREE.FrontSide}
                />
              </mesh>
            )}

            {/* Old yarmi — shaffof (kesim tomoni, layerlar ko'rinadi) */}
            {i > 0 && (
              <mesh>
                <sphereGeometry args={[layer.r, 64, 32, 0, Math.PI]} />
                <meshStandardMaterial
                  color={layer.color}
                  roughness={0.6}
                  transparent
                  opacity={isActive ? 0.45 : 0.12}
                  side={THREE.FrontSide}
                />
              </mesh>
            )}

            {/* Kesim halqasi — ringGeometry (faqat o'z qatlami kengligi) */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[innerR, layer.r, 128]} />
              <meshStandardMaterial
                color={layer.color}
                roughness={i === 3 ? 0.10 : 0.35}
                metalness={i === 2 ? 0.60 : i === 3 ? 0.82 : 0.04}
                emissive={layer.color}
                emissiveIntensity={isActive ? 0.70 : (i === 3 ? 0.50 : 0.06)}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/* ═══════════════════ ASOSIY KOMPONENT ═══════════════════ */

export default function GravitySim() {
  const [scene, setScene] = useState(0)

  /* Sahna 0 */
  const [s0Answer,  setS0Answer]  = useState<number | null>(null)
  const [s0Dropped, setS0Dropped] = useState(false)
  const [s0Landed,  setS0Landed]  = useState(false)

  /* Sahna 1 */
  const [s1Layer, setS1Layer] = useState<number | null>(null)

  /* Orbit boshqaruv */
  const [orbitZoom,   setOrbitZoom]   = useState(false)
  const [orbitRotate, setOrbitRotate] = useState(false)
  const [sceneKey,    setSceneKey]    = useState(0)

  function resetScene() {
    setSceneKey(k => k + 1)
    if (scene === 0) { setS0Answer(null); setS0Dropped(false); setS0Landed(false) }
    if (scene === 1) { setS1Layer(null) }
  }

  function goNext() { setScene(s => Math.min(s + 1, 1)); setOrbitZoom(false); setOrbitRotate(false) }
  function goPrev() { setScene(s => Math.max(s - 1, 0)); setOrbitZoom(false); setOrbitRotate(false) }
  function jumpScene(i: number) { setScene(i); setOrbitZoom(false); setOrbitRotate(false) }

  const Btn = ({
    children, onClick, color = '#6366f1', disabled = false, style = {},
  }: {
    children: React.ReactNode
    onClick: () => void
    color?: string
    disabled?: boolean
    style?: React.CSSProperties
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '7px 16px', borderRadius: 9, cursor: disabled ? 'default' : 'pointer',
        background: disabled ? 'rgba(255,255,255,0.06)' : color,
        border: 'none', color: 'white', fontSize: 12, fontWeight: 700,
        transition: 'opacity 0.2s', opacity: disabled ? 0.45 : 1, ...style,
      }}
    >
      {children}
    </button>
  )

  const camPos: [number, number, number][] = [
    [0, 1.5, 11],   // 0: Galiley
    [4.2, 2.0, 6.5], // 1: Yer kesimi — yaxshi burchak
  ]

  function SceneLights({ s }: { s: number }) {
    return (
      <>
        <ambientLight intensity={0.55} color="#c8d8ff" />

        {s === 0 && (
          <>
            <directionalLight position={[-4, 12, 6]} intensity={2.2} color="#fff5e0" castShadow
              shadow-mapSize-width={1024} shadow-mapSize-height={1024}
              shadow-camera-near={0.5} shadow-camera-far={40}
              shadow-camera-left={-10} shadow-camera-right={10}
              shadow-camera-top={10} shadow-camera-bottom={-10} />
            <directionalLight position={[6, 6, -3]} intensity={0.9} color="#b0c8ff" />
            <pointLight position={[0, -0.5, 3]} intensity={1.2} color="#4a6fa5" distance={18} />
            <spotLight position={[0, 10, 5]} angle={0.45} penumbra={0.6}
              intensity={2.5} color="#ffffff" castShadow
              target-position={[0, 0, 0]} />
          </>
        )}

        {s === 1 && (
          <>
            {/* Ambient — kosmik muhit */}
            <ambientLight intensity={0.45} color="#c8d8ff" />
            {/* Quyosh — yuqori o'ngdan (soyalar aniq) */}
            <directionalLight position={[6, 5, 8]} intensity={2.4} color="#fff5e0" castShadow />
            {/* Ichki yadro porlashi */}
            <pointLight position={[0, 0, 0]} intensity={5.0} color="#f59e0b" distance={3.5} decay={1.5} />
            {/* Mantiya issiq porlash */}
            <pointLight position={[0, 0.5, 0.5]} intensity={2.2} color="#ff5500" distance={3.0} decay={2} />
            {/* Tashqi yadro moviy-yashil */}
            <pointLight position={[0, 0, 1.5]} intensity={1.5} color="#00e5b0" distance={2.5} decay={2} />
            {/* Kameraga qarab old tomonni yoritish */}
            <directionalLight position={[5, 2, 7]} intensity={1.2} color="#e0eeff" />
          </>
        )}
      </>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#06080f', overflow: 'hidden' }}>

      {/* ═══ NAV ═══ */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        zIndex: 30, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button onClick={goPrev} disabled={scene === 0} style={{
          width: 28, height: 28, borderRadius: 7, cursor: scene === 0 ? 'default' : 'pointer',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          color: scene === 0 ? '#374151' : 'white', fontSize: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>‹</button>

        {SCENE_NAMES.map((_, i) => (
          <button key={i} onClick={() => jumpScene(i)} style={{
            width: i === scene ? 26 : 8, height: 8, borderRadius: 4, padding: 0,
            background: i === scene ? '#6366f1' : 'rgba(255,255,255,0.18)',
            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
          }} />
        ))}

        <button onClick={goNext} disabled={scene === 1} style={{
          width: 28, height: 28, borderRadius: 7, cursor: scene === 1 ? 'default' : 'pointer',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          color: scene === 1 ? '#374151' : 'white', fontSize: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>›</button>
      </div>

      {/* ── Chap panel ── */}
      <div style={{
        position: 'absolute', top: 40, left: 12, zIndex: 30,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          fontSize: 10, color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}>
          {scene + 1}/2 · {SCENE_NAMES[scene]}
        </span>

        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)' }} />

        <button
          onClick={resetScene}
          title="Qayta takrorlash"
          style={{
            width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.13)',
            color: 'rgba(255,255,255,0.7)', fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#a5b4fc' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
        >↺</button>

        <button
          onClick={() => setOrbitZoom(v => !v)}
          title={orbitZoom ? "Zoom o'chirish" : "Zoom yoqish"}
          style={{
            width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
            background: orbitZoom ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${orbitZoom ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.13)'}`,
            color: orbitZoom ? '#34d399' : 'rgba(255,255,255,0.55)', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
        >⊕</button>

        <button
          onClick={() => setOrbitRotate(v => !v)}
          title={orbitRotate ? "Aylantirishni o'chirish" : "Aylantirishni yoqish"}
          style={{
            width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
            background: orbitRotate ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${orbitRotate ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.13)'}`,
            color: orbitRotate ? '#818cf8' : 'rgba(255,255,255,0.55)', fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
        >⟳</button>

        {(orbitZoom || orbitRotate) && (
          <span style={{
            fontSize: 9, color: 'rgba(255,255,255,0.25)',
            fontStyle: 'italic', letterSpacing: 0.3,
          }}>
            {orbitZoom && orbitRotate ? 'zoom + aylan' : orbitZoom ? 'scroll = zoom' : 'sürükla = aylan'}
          </span>
        )}
      </div>

      {/* ═══ 3D CANVAS ═══ */}
      <Canvas
        camera={{ position: camPos[scene], fov: 62 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
        shadows
      >
        <SceneLights s={scene} />

        {scene === 0 && (
          <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
        )}

        {scene === 0 && (
          <>
            <GalileoObjects key={sceneKey} dropped={s0Dropped} onLand={() => setS0Landed(true)} />
            <OrbitControls
              enableZoom={orbitZoom}
              enableRotate={orbitRotate}
              enablePan={true}
              enableDamping={true}
              dampingFactor={0.06}
              zoomSpeed={2.0}
              rotateSpeed={0.75}
            />
          </>
        )}

        {scene === 1 && (
          <>
            <Stars radius={120} depth={60} count={5000} factor={2.5} saturation={0.1} fade />
            <EarthCrossSection activeLayer={s1Layer} />
            <OrbitControls
              enableZoom={orbitZoom}
              enableRotate={orbitRotate}
              enablePan={false}
              autoRotate={false}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 1.7}
              zoomSpeed={2.0}
            />
          </>
        )}
      </Canvas>

      {/* ══════════════ SAHNA 0 UI ══════════════ */}
      {scene === 0 && (
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 28, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            {(['🪨 Tosh', '📄 Qog\'oz', '🍏 Olma'] as string[]).map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {!s0Dropped && !s0Landed && (
            <div style={{
              background: 'rgba(6,10,30,0.88)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14,
              padding: '14px 20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 10, textAlign: 'center', maxWidth: 380,
            }}>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0, fontWeight: 600 }}>
                Qaysi biri oldin tushadi?
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Tosh', 'Qog\'oz', 'Olma', 'Hammasi birga'].map((opt, i) => (
                  <button key={i} onClick={() => setS0Answer(i)} style={{
                    padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11,
                    background: s0Answer === i ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${s0Answer === i ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                    color: s0Answer === i ? '#a5b4fc' : 'rgba(255,255,255,0.65)', fontWeight: 600,
                  }}>{opt}</button>
                ))}
              </div>
              <Btn onClick={() => setS0Dropped(true)} disabled={s0Answer === null}
                style={{ width: 160 }}>
                ▼ Tashlash
              </Btn>
            </div>
          )}

          {s0Dropped && !s0Landed && (
            <div style={{
              background: 'rgba(6,10,30,0.8)', borderRadius: 12, padding: '10px 20px',
              border: '1px solid rgba(96,165,250,0.2)',
            }}>
              <p style={{ color: '#60a5fa', fontSize: 13, margin: 0 }}>Tushayapti... ⬇</p>
            </div>
          )}

          {s0Landed && (
            <div style={{
              background: 'rgba(6,10,30,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(52,211,153,0.35)', borderRadius: 14,
              padding: '16px 22px', maxWidth: 400, textAlign: 'center',
            }}>
              <p style={{ color: '#34d399', fontWeight: 800, fontSize: 15, margin: '0 0 8px' }}>
                ✓ Hammasi bir vaqtda tushdi!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: '0 0 12px', lineHeight: 1.7 }}>
                Galiley 1590-yilda kashf etdi — tortish kuchi massaga qaramaydi.
                Vakuumda tosh ham, qog'oz ham bir xil tushadi.
              </p>
              <Btn onClick={goNext} color="#34d399">Davom → Yer ichkari</Btn>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ SAHNA 1 UI ══════════════ */}
      {scene === 1 && (
        <div style={{
          position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
          width: '95%',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {LAYERS.map((l, i) => (
              <button key={i} onClick={() => setS1Layer(s1Layer === i ? null : i)} style={{
                padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
                background: s1Layer === i ? `${l.color}28` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${s1Layer === i ? l.color : 'rgba(255,255,255,0.1)'}`,
                color: s1Layer === i ? l.color : 'rgba(255,255,255,0.6)',
                fontSize: 11, fontWeight: 700, transition: 'all 0.2s', minWidth: 90,
              }}>
                <div style={{ marginBottom: 2 }}>{l.name}</div>
                <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>{l.mass} massa</div>
              </button>
            ))}
          </div>

          {s1Layer !== null && (
            <div style={{
              background: 'rgba(6,10,30,0.9)', border: `1px solid ${LAYERS[s1Layer].color}45`,
              borderRadius: 10, padding: '10px 16px', width: '100%', textAlign: 'center',
            }}>
              <span style={{ color: LAYERS[s1Layer].color, fontWeight: 700, fontSize: 13 }}>
                {LAYERS[s1Layer].name}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginLeft: 10 }}>
                {LAYERS[s1Layer].desc}
              </span>
              <span style={{
                marginLeft: 12, fontSize: 11,
                background: `${LAYERS[s1Layer].color}20`,
                color: LAYERS[s1Layer].color, padding: '2px 8px', borderRadius: 6,
              }}>
                {LAYERS[s1Layer].mass}
              </span>
            </div>
          )}

          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, margin: 0, textAlign: 'center' }}>
            Yerning massasi: M = 5.97 × 10²⁴ kg — Tortish kuchining manbai
          </p>
        </div>
      )}
    </div>
  )
}
