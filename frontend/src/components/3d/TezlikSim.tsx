'use client'
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Html, useGLTF } from '@react-three/drei'
import { Pause, RotateCcw, Move3d,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react'
import * as THREE from 'three'

import Ant           from '@/components/simulations/models/creatures/Ant'
import Snail         from '@/components/simulations/models/creatures/Snail'
import Rabbit        from '@/components/simulations/models/creatures/Rabbit'
import Wolf          from '@/components/simulations/models/creatures/Wolf'
import Human         from '@/components/simulations/models/creatures/Human'
import Bicycle       from '@/components/simulations/models/vehicles/Bicycle'
import Motorcycle    from '@/components/simulations/models/vehicles/Motorcycle'
import Car           from '@/components/simulations/models/vehicles/Car'
import Truck         from '@/components/simulations/models/vehicles/Truck'
import Ship          from '@/components/simulations/models/vehicles/Ship'
import Airplane      from '@/components/simulations/models/vehicles/Airplane'
import Helicopter    from '@/components/simulations/models/vehicles/Helicopter'
import HotAirBalloon from '@/components/simulations/models/vehicles/HotAirBalloon'

const TRACK_LEN   = 40
const MOVE_STEP   = 0.06
const IDLE_OFFSET = 0.8
const VIS_LEN     = TRACK_LEN - 2 * IDLE_OFFSET
const FLOOR_Y     = -2.0   // ground surface
const OBJ_Y       = -1.5   // object sitting level (0.5 above FLOOR_Y)
const GROUND      = new THREE.Plane(new THREE.Vector3(0, 1, 0), -OBJ_Y)

const OBJECTS = [
  { id:'ant',      emoji:'🐜', label:'Chumoli',     C: Ant,            speed: 0.008 },
  { id:'snail',    emoji:'🐌', label:'Shilliqurt',  C: Snail,          speed: 0.003 },
  { id:'rabbit',   emoji:'🐰', label:'Quyon',       C: Rabbit,         speed: 0.05  },
  { id:'wolf',     emoji:'🐺', label:"Bo'ri",       C: Wolf,           speed: 0.12  },
  { id:'human',    emoji:'🚶', label:'Odam',        C: Human,          speed: 0.05  },
  { id:'bicycle',  emoji:'🚲', label:'Velosiped',   C: Bicycle,        speed: 0.07  },
  { id:'moto',     emoji:'🏍', label:'Mototsikl',   C: Motorcycle,     speed: 0.22  },
  { id:'car',      emoji:'🚗', label:'Avtomobil',   C: Car,            speed: 0.25  },
  { id:'truck',    emoji:'🚛', label:'Yuk mashina', C: Truck,          speed: 0.18  },
  { id:'ship',     emoji:'🚢', label:'Kema',        C: Ship,           speed: 0.08  },
  { id:'airplane', emoji:'✈️', label:'Samolyot',    C: Airplane,       speed: 0.8   },
  { id:'heli',     emoji:'🚁', label:'Vertolyot',   C: Helicopter,     speed: 0.45  },
  { id:'balloon',  emoji:'🎈', label:'Havo shari',  C: HotAirBalloon,  speed: 0.03  },
]

/* ── captures Three.js camera + renderer into refs ── */
function CameraCapture({
  camRef, glRef,
}: { camRef: { current: THREE.Camera | null }; glRef: { current: THREE.WebGLRenderer | null } }) {
  const { camera, gl } = useThree()
  useEffect(() => { camRef.current = camera; glRef.current = gl }, [camera, gl, camRef, glRef])
  return null
}

/* ── Flag ─────────────────────────────────── */
function Flag({ x, label, color }: { x: number; label: string; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 1.8) * 0.12 })
  return (
    <group position={[x, FLOOR_Y, 0]}>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 4.4, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={ref} position={[0.52, 4.0, 0]}>
        <boxGeometry args={[1.1, 0.62, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.6} />
      </mesh>
      <pointLight color={color} intensity={1.4} distance={4} decay={2} position={[0.5, 4, 0.3]} />
      <Html position={[0, 5.0, 0]} center style={{ pointerEvents:'none' }}>
        <div style={{ fontSize:16, fontWeight:900, color, fontFamily:'monospace',
          textShadow:`0 0 14px ${color}, 0 2px 6px rgba(0,0,0,0.9)`, userSelect:'none' }}>{label}</div>
      </Html>
    </group>
  )
}

/* ── Gizmo rings ─────────────────────────── */
function GizmoRings({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => { if (ref.current && active) ref.current.rotation.y = clock.elapsedTime * 0.5 })
  if (!active) return null
  return (
    <group ref={ref}>
      <mesh><torusGeometry args={[2.0,0.022,8,48]} /><meshBasicMaterial color="#7C3AED" transparent opacity={0.5} /></mesh>
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.0,0.022,8,48]} /><meshBasicMaterial color="#06b6d4" transparent opacity={0.5} /></mesh>
      <mesh rotation={[0,Math.PI/2,0]}><torusGeometry args={[2.0,0.022,8,48]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.5} /></mesh>
    </group>
  )
}

/* ── Placement indicator ring ────────────── */
function PlacedRing({ pos }: { pos: { x:number; z:number } }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.12)
      ;(ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.35 + Math.sin(clock.elapsedTime * 4) * 0.15
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[pos.x, FLOOR_Y+0.06, pos.z]}>
      <ringGeometry args={[0.6, 0.85, 24]} />
      <meshBasicMaterial color="#7C3AED" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  )
}


/* ── Moving object ───────────────────────── */
function MovingObj({
  objId, worldX, worldZ, moving, ctrlMode, rotY, rotX, savedRotY, savedRotX,
}: {
  objId: string; worldX: number; worldZ: number
  moving: boolean; ctrlMode: boolean
  rotY: number; rotX: number
  savedRotY: number; savedRotX: number   // persisted rot when NOT in ctrlMode
}) {
  const gRef = useRef<THREE.Group>(null!)
  const def  = OBJECTS.find(o => o.id === objId) ?? OBJECTS[7]
  const C = def.C as React.ComponentType<{ position:[number,number,number]; moving:boolean; speed:number }>

  useFrame(() => {
    if (!gRef.current) return
    if (ctrlMode) {
      // live rotation during control mode
      gRef.current.rotation.y = rotY
      gRef.current.rotation.x = Math.max(-0.85, Math.min(0.85, rotX))
    } else {
      // snap directly to saved rotation — no lerp-to-zero
      gRef.current.rotation.y = savedRotY
      gRef.current.rotation.x = savedRotX
    }
  })

  return (
    <group ref={gRef} position={[worldX, OBJ_Y, worldZ]}>
      <C position={[0,0,0]} moving={moving && !ctrlMode} speed={def.speed * 60} />
      <GizmoRings active={ctrlMode} />
    </group>
  )
}


/* ── Stage lamp (GLB model + spotlight) ──── */
const LAMP_H = 13   // hanging height above ground

function StageLamp({ x }: { x: number }) {
  const gltf     = useGLTF('/models/spotlight.glb')
  const lightRef = useRef<THREE.SpotLight>(null!)
  const { scene: threeScene } = useThree()
  const model    = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  // tilt model toward track center (matching actual light direction)
  const tiltZ = -Math.atan2(x, LAMP_H) * 0.75

  useEffect(() => {
    const light = lightRef.current
    if (!light) return
    const tgt = light.target
    // each lamp aims at the track quarter-point on its side for even coverage
    tgt.position.set(x * 0.25, FLOOR_Y, 0)
    threeScene.add(tgt)
    tgt.updateMatrixWorld()
    return () => { threeScene.remove(tgt) }
  }, [threeScene, x])

  return (
    <group position={[x, LAMP_H, 0]}>
      {/* model: lens was at -Z in Blender, rotate -90° on X → lens faces -Y (down)
          then tiltZ rotates the whole unit toward the track center              */}
      <group rotation={[0, 0, tiltZ]}>
        <primitive object={model} scale={1.6} />
      </group>
      {/* SpotLight shoots from lens position toward the aimed target */}
      <spotLight
        ref={lightRef}
        position={[0, -0.7, 0]}
        angle={1.25}
        penumbra={0.6}
        intensity={450}
        color="#ffe8d0"
        decay={0.75}
        distance={45}
      />
    </group>
  )
}
useGLTF.preload('/models/spotlight.glb')

/* ── Physics monitor ── */
interface MonitorProps {
  speed: number; elapsed: number
  progress: number; distance: number; running: boolean
  solutionNode?: React.ReactNode
}

function MonitorPanel({ speed, elapsed, progress, distance, running, solutionNode }: MonitorProps) {
  const covered   = progress * distance
  const pct       = Math.round(progress * 100)
  const remaining = speed > 0 && progress < 1
    ? ((1 - progress) * distance / speed).toFixed(1)
    : '0.0'

  const statusColor = running ? '#00ff88' : progress > 0 ? '#ffcc00' : solutionNode ? '#c084fc' : '#3b82f6'
  const statusText  = running ? 'JONLI' : progress > 0 ? 'YAKUNLANDI' : solutionNode ? 'YECHIM' : 'TAYYOR'
  const statusDot   = running ? '●' : progress > 0 ? '■' : solutionNode ? '◆' : '○'

  /* compact stat card (used in solution mode right panel) */
  const statCard = (label: string, val: string, unit: string, accent: string) => (
    <div style={{
      flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background: `linear-gradient(160deg, rgba(0,0,0,0.55), ${accent}09)`,
      border: `1.5px solid ${accent}30`,
      borderRadius: 16, padding: '14px 10px', gap: 4,
      boxShadow: `inset 0 0 20px ${accent}08`,
    }}>
      <span style={{ fontSize:20, color:'rgba(255,255,255,0.42)', fontWeight:700,
        letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:'sans-serif' }}>{label}</span>
      <span style={{ fontSize:64, fontWeight:900, color: accent, fontFamily:"'Courier New',monospace",
        lineHeight:1, textShadow:`0 0 22px ${accent}bb, 0 0 8px ${accent}66` }}>{val}</span>
      <span style={{ fontSize:22, color:`${accent}99`, fontWeight:600, fontFamily:'sans-serif' }}>{unit}</span>
    </div>
  )

  /* large stat card (used in stats-only mode) */
  const bigCard = (label: string, val: string, unit: string, accent: string) => (
    <div style={{
      flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background: `linear-gradient(170deg, rgba(0,6,24,0.95), ${accent}0a)`,
      border: `2px solid ${accent}28`,
      borderRadius: 18, padding: '22px 14px', gap: 6,
      boxShadow: `inset 0 0 40px ${accent}0a, 0 4px 20px rgba(0,0,0,0.5)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:2,
        background:`linear-gradient(90deg,transparent,${accent}80,transparent)` }} />
      <span style={{ fontSize:26, color:'rgba(255,255,255,0.35)', fontWeight:700,
        letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:'sans-serif' }}>{label}</span>
      <span style={{ fontSize:96, fontWeight:900, color: accent, fontFamily:"'Courier New',monospace",
        lineHeight:1, textShadow:`0 0 28px ${accent}cc, 0 0 12px ${accent}55` }}>{val}</span>
      <span style={{ fontSize:26, color:`${accent}88`, fontWeight:600, fontFamily:'sans-serif', letterSpacing:'0.06em' }}>{unit}</span>
    </div>
  )

  return (
    <group position={[0, 0, -5.5]}>
      <Html
        position={[0, 9.0, 0.30]}
        transform
        distanceFactor={5}
        style={{ width: 2720, pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          width: 2720,
          background: 'linear-gradient(170deg,#010a1f 0%,#000d28 60%,#010818 100%)',
          border: `2px solid #1a3a6e`,
          borderRadius: 20,
          padding: '24px 40px 22px',
          fontFamily: "'Courier New', monospace",
          boxShadow: '0 0 60px #0033aa50, 0 0 120px #0011440a, inset 0 0 80px #000f2a60',
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* corner decorations */}
          {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i) => (
            <div key={i} style={{
              position:'absolute',
              top: sy < 0 ? 0 : undefined, bottom: sy > 0 ? 0 : undefined,
              left: sx < 0 ? 0 : undefined, right: sx > 0 ? 0 : undefined,
              width:40, height:40, pointerEvents:'none',
              borderTop: sy < 0 ? '2px solid #1e5fff' : undefined,
              borderBottom: sy > 0 ? '2px solid #1e5fff' : undefined,
              borderLeft: sx < 0 ? '2px solid #1e5fff' : undefined,
              borderRight: sx > 0 ? '2px solid #1e5fff' : undefined,
              borderTopLeftRadius: sx<0&&sy<0 ? 18 : undefined,
              borderTopRightRadius: sx>0&&sy<0 ? 18 : undefined,
              borderBottomLeftRadius: sx<0&&sy>0 ? 18 : undefined,
              borderBottomRightRadius: sx>0&&sy>0 ? 18 : undefined,
              opacity: 0.7,
            }}/>
          ))}

          {/* subtle grid overlay */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
            backgroundImage:`
              linear-gradient(rgba(0,60,180,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,60,180,0.04) 1px, transparent 1px)`,
            backgroundSize:'80px 80px', borderRadius:18 }} />

          {/* scanline */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
            backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(0,0,0,0.06) 5px,rgba(0,0,0,0.06) 6px)',
            borderRadius:18 }} />

          {/* ── HEADER ── */}
          <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:22, paddingBottom:16,
            borderBottom:'1px solid rgba(30,95,255,0.25)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:6, height:44, borderRadius:4,
                background:'linear-gradient(180deg,#60a5fa,#3b82f6)', boxShadow:'0 0 16px #3b82f6aa' }} />
              <div>
                <div style={{ fontSize:34, fontWeight:900, color:'#60a5fa',
                  letterSpacing:'0.22em', textTransform:'uppercase',
                  textShadow:'0 0 20px #3b82f699', fontFamily:'sans-serif' }}>
                  FIZIKA ANALIZATOR
                </div>
                <div style={{ fontSize:18, color:'rgba(148,163,184,0.5)', letterSpacing:'0.10em',
                  fontFamily:'sans-serif', marginTop:2 }}>
                  REAL VAQT MONITORI
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12,
              background:`${statusColor}14`, border:`1.5px solid ${statusColor}40`,
              borderRadius:30, padding:'10px 24px',
              boxShadow:`0 0 20px ${statusColor}20` }}>
              <span style={{ fontSize:20, color:statusColor,
                animation: running ? 'pulse 1s ease-in-out infinite' : undefined }}>
                {statusDot}
              </span>
              <span style={{ fontSize:26, fontWeight:800, color:statusColor,
                letterSpacing:'0.14em', fontFamily:'sans-serif' }}>{statusText}</span>
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{ position:'relative', zIndex:2 }}>
            {solutionNode ? (
              /* ── SOLUTION MODE: left 58% + divider + right 42% stats ── */
              <div style={{ display:'flex', gap:28, marginBottom:20, alignItems:'stretch', minHeight:300 }}>
                {/* LEFT: solution */}
                <div style={{ flex:'0 0 58%', minWidth:0 }}>
                  {solutionNode}
                </div>
                {/* divider */}
                <div style={{ width:1, flexShrink:0,
                  background:'linear-gradient(180deg,transparent 5%,rgba(59,130,246,0.45) 35%,rgba(59,130,246,0.45) 65%,transparent 95%)' }} />
                {/* RIGHT: 2×2 stats */}
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', gap:12, flex:1 }}>
                    {statCard('Tezlik',  speed.toFixed(1),   'm/s', '#22d3ee')}
                    {statCard('Vaqt',    elapsed.toFixed(1), 's',   '#a78bfa')}
                  </div>
                  <div style={{ display:'flex', gap:12, flex:1 }}>
                    {statCard('Masofa',  covered.toFixed(0), 'm',   '#fb923c')}
                    {statCard('Qoldi',   remaining,          's',   '#f472b6')}
                  </div>
                </div>
              </div>
            ) : (
              /* ── STATS MODE: 4 big cards ── */
              <div style={{ display:'flex', gap:20, marginBottom:20 }}>
                {bigCard('Tezlik',      speed.toFixed(1),   'm/s', '#22d3ee')}
                {bigCard('Vaqt',        elapsed.toFixed(1), 's',   '#a78bfa')}
                {bigCard('Masofa',      covered.toFixed(0), 'm',   '#fb923c')}
                {bigCard('Qolgan vaqt', remaining,          's',   '#f472b6')}
              </div>
            )}
          </div>

          {/* ── PROGRESS BAR ── */}
          <div style={{ position:'relative', zIndex:2 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:22, color:'rgba(255,255,255,0.35)', fontWeight:700,
                fontFamily:'sans-serif', letterSpacing:'0.08em' }}>A</span>
              <span style={{ fontSize:22, color:'rgba(255,255,255,0.50)', fontWeight:700,
                fontFamily:'sans-serif' }}>{pct}%</span>
              <span style={{ fontSize:22, color:'rgba(255,255,255,0.35)', fontWeight:700,
                fontFamily:'sans-serif', letterSpacing:'0.08em' }}>B</span>
            </div>
            <div style={{ background:'rgba(0,30,80,0.60)', borderRadius:10, height:18,
              overflow:'hidden', border:'1px solid rgba(30,95,255,0.25)',
              boxShadow:'inset 0 2px 6px rgba(0,0,0,0.5)' }}>
              <div style={{ height:'100%', width:`${pct}%`,
                background:'linear-gradient(90deg,#1d4ed8,#0ea5e9 50%,#22d3ee)',
                boxShadow:'0 0 20px #0ea5e9aa, inset 0 1px 0 rgba(255,255,255,0.25)',
                transition:'width 0.1s linear', borderRadius:10 }} />
            </div>
          </div>

        </div>
      </Html>
    </group>
  )
}
/* ── Track ───────────────────────────────── */
const TRACK_W = 9.0   // road width (3 lanes × 3 units)
const LANE    = TRACK_W / 3   // one lane = 3 units

function TrackScene() {
  const nDash = Math.ceil((TRACK_LEN + 2) / 2.6)

  /* helper: horizontal dash row at given z */
  const dashRow = (zPos: number, color: string, opacity: number, key: string) =>
    Array.from({ length: nDash }, (_, i) => (
      <mesh key={`${key}${i}`}
        position={[-TRACK_LEN/2 - 0.3 + i * 2.6, FLOOR_Y + 0.022, zPos]}
        rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[1.55, 0.11]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
    ))

  return (
    <>
      {/* ── 1. Base ground (infinite feel) ── */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,FLOOR_Y,0]}>
        <planeGeometry args={[160, 60]} />
        <meshStandardMaterial color="#050a14" roughness={1} metalness={0} />
      </mesh>

      {/* ── 2. Wide shoulder / verge ── */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,FLOOR_Y+0.004,0]}>
        <planeGeometry args={[TRACK_LEN+5, TRACK_W+3.2]} />
        <meshStandardMaterial color="#09121f" roughness={0.97} metalness={0} />
      </mesh>

      {/* ── 3. Kerb strips (red-white rumble) left & right edges ── */}
      {([-1,1] as const).map(side => (
        <mesh key={side} rotation={[-Math.PI/2,0,0]}
          position={[0, FLOOR_Y+0.007, side*(TRACK_W/2+0.65)]}>
          <planeGeometry args={[TRACK_LEN+4, 1.3]} />
          <meshStandardMaterial color={side<0 ? '#1a0a0a' : '#0a1a0a'} roughness={0.9} metalness={0} />
        </mesh>
      ))}
      {/* kerb chevron marks */}
      {Array.from({length:14},(_,i)=>[-1,1].map(side=>(
        <mesh key={`k${side}${i}`} rotation={[-Math.PI/2,0,0]}
          position={[-TRACK_LEN/2 + 1.5 + i*(TRACK_LEN/13), FLOOR_Y+0.009, side*(TRACK_W/2+0.65)]}>
          <planeGeometry args={[1.0, 1.25]} />
          <meshStandardMaterial color={side<0?'#3d1010':'#0d2a12'} roughness={0.85} metalness={0} transparent opacity={0.9}/>
        </mesh>
      )))}

      {/* ── 4. Main asphalt road surface ── */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,FLOOR_Y+0.010,0]}>
        <planeGeometry args={[TRACK_LEN+3, TRACK_W]} />
        <meshStandardMaterial color="#121a27" roughness={0.88} metalness={0} />
      </mesh>

      {/* subtle surface worn lighter strip down center lane */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,FLOOR_Y+0.011,0]}>
        <planeGeometry args={[TRACK_LEN+2, LANE*0.70]} />
        <meshStandardMaterial color="#141e2e" roughness={0.85} metalness={0} transparent opacity={0.6}/>
      </mesh>

      {/* ── 5. Edge lines (solid white) ── */}
      {([-1,1] as const).map(side=>(
        <mesh key={`edge${side}`} rotation={[-Math.PI/2,0,0]}
          position={[0, FLOOR_Y+0.018, side*(TRACK_W/2-0.18)]}>
          <planeGeometry args={[TRACK_LEN+3, 0.18]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.82} />
        </mesh>
      ))}

      {/* ── 6. Lane dividers (dashed white) — z = ±LANE ── */}
      {dashRow( LANE, '#ffffff', 0.48, 'dl')}
      {dashRow(-LANE, '#ffffff', 0.48, 'dr')}

      {/* ── 7. Center line (dashed yellow) ── */}
      {Array.from({length:nDash},(_,i)=>(
        <mesh key={`cy${i}`}
          position={[-TRACK_LEN/2 - 0.3 + i*2.6, FLOOR_Y+0.024, 0]}
          rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[1.20, 0.14]} />
          <meshStandardMaterial color="#ffd700" transparent opacity={0.65} />
        </mesh>
      ))}

      {/* ── 8. Grid (background) ── */}
      <Grid position={[0,FLOOR_Y,0]} args={[160,80]}
        cellSize={2} cellThickness={0.28} cellColor="#0b1626"
        sectionSize={10} sectionThickness={0.60} sectionColor="#14253a"
        fadeDistance={55} fadeStrength={1.2} infiniteGrid />
    </>
  )
}

/* ── D-pad button ─────────────────────────── */
function DPadBtn({ icon, onHold, style }: {
  icon: React.ReactNode; onHold:(a:boolean)=>void; style?: React.CSSProperties
}) {
  const ivRef = useRef<ReturnType<typeof setInterval>|null>(null)
  const start = (e: React.PointerEvent) => {
    e.stopPropagation(); onHold(true)
    ivRef.current = setInterval(() => onHold(true), 16)
  }
  const stop = (e: React.PointerEvent) => {
    e.stopPropagation(); onHold(false)
    if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null }
  }
  useEffect(() => () => { if (ivRef.current) clearInterval(ivRef.current) }, [])
  return (
    <button
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
      style={{
        width:38, height:38, borderRadius:10, border:'1px solid rgba(124,58,237,0.55)',
        background:'rgba(124,58,237,0.18)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', color:'rgba(255,255,255,0.85)',
        transition:'background 0.1s', userSelect:'none', ...style,
      }}>
      {icon}
    </button>
  )
}

/*
/* ════════════════════════════════════════════════════ */
export default function TezlikSim({
  initSpeed = 10,
  initDistance = 100,
  solveKey = 0,
  masalaSlot,
  monitorSolution,
}: {
  initSpeed?: number
  initDistance?: number
  solveKey?: number
  masalaSlot?: React.ReactNode
  monitorSolution?: React.ReactNode
}) {
  /* fullscreen */
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }, [])

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  /* simulation state — synced from props when masala changes */
  const [speed,    setSpeed]    = useState(initSpeed)
  const [distance, setDistance] = useState(initDistance)
  const prevSolveKeyRef = useRef(solveKey)
  const [wantAutoStart, setWantAutoStart] = useState(false)
  const startFnRef      = useRef<() => void>(() => {})
  const [running,  setRunning]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed,  setElapsed]  = useState(0)
  const [objIdx,   setObjIdx]   = useState(0)
  const [showObjPanel, setShowObjPanel] = useState(false)
  const [ctrlMode,   setCtrlMode]   = useState(false)

  /* rotation (live during ctrl mode) */
  // -Math.PI/2 around Y = face +X (toward B flag), matching the track direction
  const rotY = useRef(-Math.PI / 2); const rotX = useRef(0)
  const [rotState,  setRotState]  = useState({ y: -Math.PI / 2, x: 0 })
  /* saved rotation — persists after exiting ctrl mode */
  const [savedRot, setSavedRot] = useState({ y: -Math.PI / 2, x: 0 })

  /* world position (absolute, persists across mode switches) */
  const worldPos = useRef({ x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 })
  const [wpState, setWpState] = useState({ x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 })
  const [placed,  setPlaced]  = useState(false)


  /* raf */
  const rafRef   = useRef<number>(0)
  const startRef = useRef<number>(0)
  const pauseAt  = useRef<number>(0)
  const progressRef = useRef(0)

  /* Three.js refs (captured from inside Canvas) */
  const camRef = useRef<THREE.Camera | null>(null)
  const glRef  = useRef<THREE.WebGLRenderer | null>(null)

  /* drag refs */
  const dragActive = useRef(false)
  const ptrDown    = useRef({ x:0, y:0 })
  const lastPtr    = useRef({ x:0, y:0 })

  /* keep progressRef in sync */
  useEffect(() => { progressRef.current = progress }, [progress])

  /* sync world pos when NOT in ctrl mode (object follows track) */
  useEffect(() => {
    if (!ctrlMode && !placed) {
      let x: number
      if (progress <= 0)       x = -TRACK_LEN/2 + IDLE_OFFSET  // idle: A flag
      else if (progress >= 1)  x =  TRACK_LEN/2 - IDLE_OFFSET
      else                     x = -TRACK_LEN/2 + IDLE_OFFSET + progress * VIS_LEN
      worldPos.current = { x, z: 0 }
      setWpState({ x, z: 0 })
    }
  }, [progress, ctrlMode, placed])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false); setProgress(0); setElapsed(0)
    startRef.current = 0; pauseAt.current = 0
    rotY.current = -Math.PI / 2; rotX.current = 0
    setRotState({ y: -Math.PI / 2, x: 0 })
    setSavedRot({ y: -Math.PI / 2, x: 0 })
    worldPos.current = { x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 }
    setWpState({ x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 })
    setPlaced(false)
  }, [])

  /* sync speed/distance + mark auto-start ONLY when solveKey increments */
  useEffect(() => {
    const isNewSolve = solveKey !== prevSolveKeyRef.current
    prevSolveKeyRef.current = solveKey
    if (!isNewSolve) return
    setSpeed(initSpeed)
    setDistance(initDistance)
    setWantAutoStart(true)
    reset()
  }, [initSpeed, initDistance, solveKey, reset])

  const start = useCallback(() => {
    if (running || progress >= 1 || ctrlMode) return
    setRunning(true)
    const v0 = Math.max(speed, 0.1), s0 = progress * distance
    // Snap to A flag when starting fresh (progress=0)
    if (progress <= 0 && !ctrlMode) {
      worldPos.current = { x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 }
      setWpState({ x: -TRACK_LEN/2 + IDLE_OFFSET, z: 0 })
    }
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts - pauseAt.current * 1000
      const t = (ts - startRef.current) / 1000
      const p = Math.min((s0 + v0 * t) / Math.max(distance, 1), 1)
      const nx = -TRACK_LEN/2 + IDLE_OFFSET + p * VIS_LEN
      setProgress(p); setElapsed(t)
      if (!ctrlMode) { worldPos.current = { x: nx, z: 0 }; setWpState({ x: nx, z: 0 }) }
      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setRunning(false)
        const endX = TRACK_LEN/2 - IDLE_OFFSET
        worldPos.current = { x: endX, z: 0 }
        setWpState({ x: endX, z: 0 })
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [running, progress, speed, distance, ctrlMode, reset])

  /* keep startFnRef pointing at latest start without it being an effect dep */
  useEffect(() => { startFnRef.current = start }, [start])

  /* fire start() once wantAutoStart is true and sim is idle */
  useEffect(() => {
    if (!wantAutoStart || running || progress > 0) return
    setWantAutoStart(false)
    startFnRef.current()
  }, [wantAutoStart, running, progress])

  const pause = useCallback(() => {
    if (!running) return
    cancelAnimationFrame(rafRef.current)
    pauseAt.current = elapsed; startRef.current = 0; setRunning(false)
  }, [running, elapsed])

  /* ── raycast click → place object ─────── */
  const placeAtClick = useCallback((clientX: number, clientY: number) => {
    const cam = camRef.current; const gl = glRef.current
    if (!cam || !gl) return
    const rect = gl.domElement.getBoundingClientRect()
    const ndc  = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    )
    const ray = new THREE.Raycaster()
    ray.setFromCamera(ndc, cam)
    const target = new THREE.Vector3()
    ray.ray.intersectPlane(GROUND, target)
    if (target.length() > 0) {
      worldPos.current = { x: target.x, z: target.z }
      setWpState({ x: target.x, z: target.z })
      setPlaced(true)
    }
  }, [])

  /* ── pointer handlers ─────────────────── */
  const onPtrDown = useCallback((e: React.PointerEvent) => {
    if (!ctrlMode) return
    dragActive.current = true
    ptrDown.current = { x: e.clientX, y: e.clientY }
    lastPtr.current  = { x: e.clientX, y: e.clientY }
  }, [ctrlMode])

  const onPtrMove = useCallback((e: React.PointerEvent) => {
    if (!ctrlMode || !dragActive.current) return
    const dx = e.clientX - lastPtr.current.x
    const dy = e.clientY - lastPtr.current.y
    lastPtr.current = { x: e.clientX, y: e.clientY }
    rotY.current += dx * 0.012
    rotX.current += dy * 0.010
    setRotState({ y: rotY.current, x: rotX.current })
  }, [ctrlMode])

  const onPtrUp = useCallback((e: React.PointerEvent) => {
    if (!ctrlMode) { dragActive.current = false; return }
    const moved = Math.hypot(e.clientX - ptrDown.current.x, e.clientY - ptrDown.current.y)
    dragActive.current = false
    // short tap (< 6px) = place object
    if (moved < 6) placeAtClick(e.clientX, e.clientY)
  }, [ctrlMode, placeAtClick])

  /* ── D-pad movement ───────────────────── */
  const moveObj = useCallback((dir:'left'|'right'|'fwd'|'back', active:boolean) => {
    if (!active) return
    if (dir === 'left')  worldPos.current.x -= MOVE_STEP
    if (dir === 'right') worldPos.current.x += MOVE_STEP
    if (dir === 'fwd')   worldPos.current.z -= MOVE_STEP
    if (dir === 'back')  worldPos.current.z += MOVE_STEP
    setWpState({ ...worldPos.current })
    setPlaced(true)
  }, [])

  /* ── toggle ctrl mode ─────────────────── */
  const toggleCtrl = useCallback(() => {
    if (running) pause()
    setCtrlMode(v => {
      if (v) {
        // exiting — save current rotation so it persists
        setSavedRot({ y: rotY.current, x: rotX.current })
      }
      dragActive.current = false
      return !v
    })
  }, [running, pause])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])


  const curObj = OBJECTS[objIdx]
  const pct    = Math.round(progress * 100)

  return (
    <div ref={containerRef} style={{ position:'relative', width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'#060d18' }}>

      <div
        style={{
          flex:1, position:'relative', minHeight:0,
          cursor: ctrlMode
            ? (dragActive.current ? 'grabbing' : (placed ? 'grab' : 'crosshair'))
            : 'default',
          outline: ctrlMode ? '2px solid rgba(124,58,237,0.5)' : 'none',
        }}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        onPointerLeave={() => { dragActive.current = false }}
      >
        <Canvas camera={{ position:[0,4,22], fov:58 }} dpr={[1,2]}
          style={{ width:'100%', height:'100%', background:'transparent' }}>
          <CameraCapture camRef={camRef} glRef={glRef} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[0,20,0]} intensity={0.4} />

          <StageLamp x={-TRACK_LEN / 2} />
          <StageLamp x={ TRACK_LEN / 2} />
          <MonitorPanel
            speed={speed} elapsed={elapsed}
            progress={progress} distance={distance} running={running}
            solutionNode={monitorSolution}
          />
          <TrackScene />
          <Flag x={-TRACK_LEN/2} label="A" color="#22c55e" />
          <Flag x={ TRACK_LEN/2} label="B" color="#ef4444" />

          <MovingObj
            objId={curObj.id}
            worldX={wpState.x} worldZ={wpState.z}
            moving={running}
            ctrlMode={ctrlMode}
            rotY={rotState.y} rotX={rotState.x}
            savedRotY={savedRot.y} savedRotX={savedRot.x}
          />

          {/* placement ring */}
          {ctrlMode && placed && <PlacedRing pos={wpState} />}


          <fog attach="fog" args={['#060d18', 70, 160]} />
          <OrbitControls
            enabled={!ctrlMode}
            enablePan={true}
            enableZoom={true}
            enableRotate={!ctrlMode}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={0.75}
            zoomSpeed={2.0}
            panSpeed={0.9}
            minDistance={0.5}
            maxDistance={120}
            target={[0, 3.0, 0]}
          />
        </Canvas>

        {/* Object badge */}
        <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
          background:'rgba(5,8,25,0.78)', backdropFilter:'blur(10px)',
          border:'1px solid rgba(124,58,237,0.45)', borderRadius:20,
          padding:'4px 18px', fontSize:12, fontWeight:700, color:'#c4b5fd',
          pointerEvents:'none', whiteSpace:'nowrap' }}>
          {objIdx+1} / {OBJECTS.length} &nbsp;·&nbsp; {curObj.label}
        </div>

        {/* Top-right toolbar — all buttons in one flex row */}
        <div
          style={{ position:'absolute', top:10, right:10, display:'flex', alignItems:'center', gap:6, zIndex:10 }}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
        >
          {/* Fullscreen toggle */}
          <button
            onClick={e => { e.stopPropagation(); toggleFullscreen() }}
            title={isFullscreen ? "Oynaga qaytish" : "To'liq ekran"}
            style={{
              width:38, height:38, borderRadius:10,
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer',
              background: isFullscreen ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
              border: isFullscreen ? '1.5px solid rgba(34,197,94,0.6)' : '1.5px solid rgba(255,255,255,0.18)',
              backdropFilter:'blur(12px)', transition:'all 0.2s',
              color: isFullscreen ? '#4ade80' : 'rgba(255,255,255,0.7)',
            }}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Control mode toggle */}
          <button
            onClick={e => { e.stopPropagation(); toggleCtrl() }}
            title={ctrlMode ? "Rejimdan chiqish" : "Boshqarish rejimi"}
            style={{
              width:38, height:38, borderRadius:10,
              display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:1, cursor:'pointer',
              background: ctrlMode
                ? 'linear-gradient(135deg,rgba(124,58,237,0.65),rgba(168,85,247,0.55))'
                : 'rgba(255,255,255,0.08)',
              border: ctrlMode
                ? '2px solid rgba(168,85,247,0.9)' : '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: ctrlMode ? '0 0 24px rgba(124,58,237,0.7)' : 'none',
              backdropFilter:'blur(12px)', transition:'all 0.2s',
            }}>
          <span style={{ fontSize:18, lineHeight:1 }}>{curObj.emoji}</span>
          <span style={{ fontSize:7, fontWeight:900,
            color: ctrlMode ? '#e9d5ff' : 'rgba(255,255,255,0.5)', letterSpacing:'0.05em' }}>
            {ctrlMode ? '✕' : '3D'}
          </span>
          </button>
        </div>{/* /top-right toolbar */}

        {/* D-pad */}
        {ctrlMode && (
          <div
            style={{
              position:'absolute', bottom:18, left:16,
              display:'grid', gridTemplateColumns:'38px 38px 38px',
              gridTemplateRows:'38px 38px 38px', gap:4, userSelect:'none',
            }}
            onPointerDown={e => e.stopPropagation()}
            onPointerMove={e => e.stopPropagation()}
          >
            <span /><DPadBtn icon={<ArrowUp className="h-4 w-4" />} onHold={a=>moveObj('fwd',a)} /><span />
            <DPadBtn icon={<ArrowLeft className="h-4 w-4" />} onHold={a=>moveObj('left',a)} />
            <div style={{ width:38, height:38, borderRadius:10,
              background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.35)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Move3d className="h-4 w-4" style={{ color:'rgba(255,255,255,0.4)' }} />
            </div>
            <DPadBtn icon={<ArrowRight className="h-4 w-4" />} onHold={a=>moveObj('right',a)} />
            <span /><DPadBtn icon={<ArrowDown className="h-4 w-4" />} onHold={a=>moveObj('back',a)} /><span />
          </div>
        )}

        {/* Hint */}
        {ctrlMode && (
          <div style={{
            position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)',
            background:'rgba(124,58,237,0.18)', backdropFilter:'blur(10px)',
            border:'1px solid rgba(168,85,247,0.4)', borderRadius:20,
            padding:'5px 16px', fontSize:11, fontWeight:700, color:'#d8b4fe',
            pointerEvents:'none', whiteSpace:'nowrap',
          }}>
            {placed
              ? '🖱 Suring — aylantiruv  |  ↕↔ Siljitish'
              : '👆 Bosing — joylashtirish  |  🖱 Suring — aylantiruv'}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4,
          background:'rgba(255,255,255,0.07)' }}>
          <div style={{ height:'100%', width:`${pct}%`,
            background:'linear-gradient(90deg,#22c55e,#7C3AED)',
            boxShadow:'0 0 10px #7C3AED90', transition:'width 0.08s linear' }} />
        </div>
      </div>


      {/* Controls strip */}
      <div style={{
        display:'flex', alignItems:'flex-start', gap:10, padding:'8px 16px',
        background:'rgba(4,7,22,0.94)', backdropFilter:'blur(18px)',
        borderTop:`1px solid ${ctrlMode ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.22)'}`,
        transition:'border-color 0.3s',
      }}>
        {/* Sim buttons */}
        <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0, paddingTop:3 }}>
          <button onClick={pause} disabled={!running} style={{
            display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:10,
            background: running ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)',
            border: running ? '1px solid rgba(251,191,36,0.45)' : '1px solid rgba(255,255,255,0.10)',
            color: running ? '#fbbf24' : 'rgba(255,255,255,0.35)',
            fontWeight:600, fontSize:13,
            cursor:!running?'not-allowed':'pointer', opacity:!running?0.45:1,
            transition:'all 0.2s',
          }}>
            <Pause className="h-3.5 w-3.5" /> Pauza
          </button>
          <button onClick={reset} style={{
            display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:10,
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
            color:'rgba(255,255,255,0.55)', fontWeight:600, fontSize:13, cursor:'pointer',
            transition:'all 0.2s',
          }}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {/* Masala input slot — 35% of strip */}
        {masalaSlot && (
          <div style={{ flex:'0 0 35%', minWidth:0 }}>
            {masalaSlot}
          </div>
        )}

        {/* Jism toggle button */}
        <button
          onClick={() => setShowObjPanel(v => !v)}
          style={{
            marginLeft:'auto', flexShrink:0, display:'flex', alignItems:'center', gap:6,
            padding:'6px 14px', borderRadius:10, cursor:'pointer',
            background: showObjPanel
              ? 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(168,85,247,0.4))'
              : 'rgba(255,255,255,0.06)',
            border: showObjPanel
              ? '1.5px solid rgba(168,85,247,0.8)'
              : '1px solid rgba(255,255,255,0.12)',
            boxShadow: showObjPanel ? '0 0 14px rgba(124,58,237,0.5)' : 'none',
            transition:'all 0.15s',
          }}>
          <span style={{ fontSize:18, lineHeight:1 }}>{curObj.emoji}</span>
          <span style={{ fontSize:11, fontWeight:700, color: showObjPanel ? '#e9d5ff' : 'rgba(255,255,255,0.55)' }}>
            Jism {showObjPanel ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* ── Jism tanlash paneli (collapsible) ── */}
      {showObjPanel && (
        <div style={{
          flexShrink:0, padding:'8px 12px',
          background:'rgba(3,5,18,0.97)', backdropFilter:'blur(18px)',
          borderTop:'1px solid rgba(124,58,237,0.25)',
          display:'flex', flexWrap:'wrap', gap:6,
        }}>
          {OBJECTS.map((obj, i) => {
            const active = i === objIdx
            return (
              <button
                key={obj.id}
                onClick={() => { setObjIdx(i); reset(); setShowObjPanel(false) }}
                title={obj.label}
                style={{
                  display:'flex', alignItems:'center', gap:7,
                  padding:'6px 12px', borderRadius:10, cursor:'pointer',
                  background: active
                    ? 'linear-gradient(135deg,rgba(124,58,237,0.45),rgba(168,85,247,0.35))'
                    : 'rgba(255,255,255,0.05)',
                  border: active
                    ? '1.5px solid rgba(168,85,247,0.75)'
                    : '1px solid rgba(255,255,255,0.09)',
                  boxShadow: active ? '0 0 10px rgba(124,58,237,0.4)' : 'none',
                  transition:'all 0.12s',
                }}>
                <span style={{ fontSize:20, lineHeight:1 }}>{obj.emoji}</span>
                <span style={{ fontSize:11, fontWeight:600, color: active ? '#e9d5ff' : 'rgba(255,255,255,0.6)' }}>
                  {obj.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
