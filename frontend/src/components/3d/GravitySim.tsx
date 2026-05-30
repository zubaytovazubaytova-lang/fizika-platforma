'use client'
// g = 9.8 — Yerning Imzosi | 2-sahnali interaktiv simulatsiya

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════ GLSL SHADERLAR ═══════════════════ */

const EARTH_VERT = /* glsl */`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const EARTH_FRAG = /* glsl */`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
uniform vec3 cameraPosition;

float hash(float n) { return fract(sin(n) * 43758.5453); }

float n2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
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
  // --- Qit'a maskasi ---
  float land  = smoothstep(0.455, 0.545, fbm(vUv * vec2(4.2, 2.9) + vec2(1.71, 0.93)));
  // --- Qutb muz qoplami ---
  float polar = smoothstep(0.68, 0.86, abs(vUv.y - 0.5) * 2.0);

  // --- Okean rangi ---
  float od    = fbm(vUv * vec2(6.5, 4.2) + vec2(3.31, 2.17));
  vec3  ocean = mix(vec3(0.006, 0.028, 0.115), vec3(0.018, 0.072, 0.22), od);

  // --- Qit'a rangi (o'rmon / savanna / cho'l / tog') ---
  float vd = fbm(vUv * vec2(5.8, 4.1) + vec2(5.83, 3.24));
  float md = fbm(vUv * vec2(9.0, 7.0) + vec2(1.13, 7.51));
  vec3 forest   = vec3(0.068, 0.188, 0.038);
  vec3 savanna  = vec3(0.275, 0.315, 0.082);
  vec3 desert   = vec3(0.592, 0.425, 0.162);
  vec3 mountain = vec3(0.325, 0.258, 0.188);
  vec3 lc = mix(forest, savanna, smoothstep(0.35, 0.55, vd));
  lc = mix(lc, desert,   smoothstep(0.52, 0.68, vd));
  lc = mix(lc, mountain, smoothstep(0.64, 0.82, md));

  // --- Okean + Qit'a + Muz ---
  vec3 color = mix(mix(ocean, lc, land), vec3(0.86, 0.93, 1.0), polar);

  // --- Yorug'lik ---
  vec3 ld   = normalize(vec3(2.2, 3.0, 3.8));
  float diff = max(dot(vNormal, ld), 0.0);
  vec3 vd2  = normalize(cameraPosition - vWorldPos);
  vec3 h    = normalize(ld + vd2);
  float spec = pow(max(dot(h, vNormal), 0.0), 52.0) * (1.0 - land) * (1.0 - polar);

  color = color * (0.22 + 0.78 * diff) + vec3(0.72, 0.88, 1.0) * spec * 0.55;

  // --- Tungi tomon (terminator effekti) ---
  float night = smoothstep(0.0, 0.12, diff);
  color = mix(color * 0.04, color, night);

  gl_FragColor = vec4(color, 1.0);
}
`

const ATM_VERT = /* glsl */`
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ATM_FRAG = /* glsl */`
varying vec3 vNormal;
varying vec3 vWorldPos;
uniform vec3 cameraPosition;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float rim    = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 3.0);
  vec3 ld      = normalize(vec3(2.2, 3.0, 3.8));
  float lit    = max(dot(vNormal, ld), 0.0) * 0.55 + 0.45;
  gl_FragColor = vec4(vec3(0.18, 0.52, 1.0) * lit, rim * 0.88);
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

/* ── Sahna 1: Yer kesimi + Realistik tashqi ko'rinish ── */

function EarthCrossSection({ activeLayer }: { activeLayer: number | null }) {
  const { gl } = useThree()
  useEffect(() => {
    gl.localClippingEnabled = true
    return () => { gl.localClippingEnabled = false }
  }, [gl])

  const outerR = LAYERS[0].r

  // Realistik Yer yuzasi uchun shader
  const earthShader = useMemo(() => ({
    vertexShader: EARTH_VERT,
    fragmentShader: EARTH_FRAG,
    side: THREE.FrontSide,
  }), [])

  // Atmosfera qirrasi uchun shader
  const atmShader = useMemo(() => ({
    vertexShader: ATM_VERT,
    fragmentShader: ATM_FRAG,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  return (
    <group>
      {/* ── Realistik Yer yuzasi (orqa yarmi ko'rinadigan tomon) ── */}
      <mesh>
        <sphereGeometry args={[outerR, 128, 64, Math.PI, Math.PI]} />
        <shaderMaterial attach="material" {...earthShader} />
      </mesh>

      {/* ── Atmosfera porlashi (butun sharni o'rab turadi) ── */}
      <mesh>
        <sphereGeometry args={[outerR + 0.14, 96, 48]} />
        <shaderMaterial attach="material" {...atmShader} />
      </mesh>

      {/* ── Ichki qatlamlar ── */}
      {LAYERS.map((layer, i) => {
        const isActive    = activeLayer === i
        const emissiveStr = isActive ? 0.38 : 0.0
        return (
          <group key={layer.name}>
            {/* Orqa yarmi (ko'rinadigan kesim) — faqat ichki qatlamlar */}
            {i > 0 && (
              <mesh>
                <sphereGeometry args={[layer.r, 64, 32, Math.PI, Math.PI]} />
                <meshStandardMaterial
                  color={layer.color}
                  roughness={0.55}
                  metalness={i === 2 ? 0.45 : 0.0}
                  emissive={layer.color}
                  emissiveIntensity={emissiveStr}
                  side={THREE.FrontSide}
                />
              </mesh>
            )}

            {/* Old yarmi — shaffof (kesim tomoni) */}
            <mesh>
              <sphereGeometry args={[layer.r, 64, 32, 0, Math.PI]} />
              <meshStandardMaterial
                color={i === 0 ? '#3b7fd4' : layer.color}
                roughness={i === 0 ? 0.08 : 0.6}
                metalness={i === 0 ? 0.15 : 0}
                transparent
                opacity={isActive ? 0.40 : (i === 0 ? 0.22 : 0.18)}
              />
            </mesh>

            {/* Kesim yuzasi (doira) */}
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[layer.r, 128]} />
              <meshStandardMaterial
                color={layer.color}
                roughness={0.35}
                metalness={i === 2 ? 0.5 : 0.0}
                emissive={layer.color}
                emissiveIntensity={isActive ? 0.55 : 0.08}
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
    [0, 1.5, 11],  // 0: Galiley
    [3.5, 2.5, 7], // 1: Yer kesimi
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
            <ambientLight intensity={0.7} color="#ffe8c0" />
            <directionalLight position={[4, 8, 6]} intensity={1.8} color="#fff3d0" />
            <pointLight position={[0, 0, 0]} intensity={3.5} color="#f59e0b" distance={5} decay={1.5} />
            <pointLight position={[0, 0, 2.5]} intensity={1.8} color="#ef4444" distance={4} decay={1.5} />
            <pointLight position={[0, 4, 4]} intensity={1.0} color="#60a5fa" distance={10} />
            <spotLight position={[6, 5, 0]} angle={0.5} penumbra={0.4}
              intensity={2.0} color="#ffffff" />
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
              enablePan={false}
              zoomSpeed={0.6}
            />
          </>
        )}

        {scene === 1 && (
          <>
            <EarthCrossSection activeLayer={s1Layer} />
            <OrbitControls
              enableZoom={orbitZoom}
              enableRotate={orbitRotate}
              enablePan={false}
              autoRotate={!orbitRotate}
              autoRotateSpeed={0.6}
              minPolarAngle={0.3}
              maxPolarAngle={Math.PI / 1.8}
              zoomSpeed={0.6}
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
