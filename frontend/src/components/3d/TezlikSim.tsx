'use client'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Html } from '@react-three/drei'
import { Play, Pause, RotateCcw, Move3d,
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

const TRACK_LEN = 22
const MOVE_STEP = 0.06
const GROUND    = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

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
    <group position={[x, -0.5, 0]}>
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
    <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]} position={[pos.x, -0.44, pos.z]}>
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
    <group ref={gRef} position={[worldX, 0, worldZ]}>
      <C position={[0,0,0]} moving={moving && !ctrlMode} speed={def.speed * 60} />
      <GizmoRings active={ctrlMode} />
    </group>
  )
}

/* ── Light modes ─────────────────────────── */
type LightMode = 'normal' | 'stadium' | 'neon'

const LIGHT_MODES: Record<LightMode, {
  label: string; emoji: string
  front: string[]; back: string[]
  intensity: number; fillIntensity: number
  fillColor: string; angle: number; distance: number; decay: number
  emissive: number; glowOpacity: number
}> = {
  normal: {
    label: 'Oddiy', emoji: '💡',
    front: ['#ffe8c0','#d4e8ff','#ffe8c0','#d4e8ff','#ffe8c0'],
    back:  ['#c8d8ff','#ffe0b0','#c8d8ff','#ffe0b0','#c8d8ff'],
    intensity: 55, fillIntensity: 18,
    fillColor: '#e8eeff', angle: Math.PI/3.8, distance: 48, decay: 1.4,
    emissive: 2.5, glowOpacity: 0.7,
  },
  stadium: {
    label: 'Stadion', emoji: '🏟️',
    front: ['#ffffff','#f0f8ff','#ffffff','#f0f8ff','#ffffff'],
    back:  ['#fff8e0','#ffffff','#fff8e0','#ffffff','#fff8e0'],
    intensity: 100, fillIntensity: 35,
    fillColor: '#ffffff', angle: Math.PI/3.2, distance: 55, decay: 1.2,
    emissive: 4.0, glowOpacity: 0.85,
  },
  neon: {
    label: 'Neon', emoji: '✨',
    front: ['#ff00ff','#00ffff','#ff3080','#00ffcc','#ff00ff'],
    back:  ['#7c3aed','#06b6d4','#a855f7','#22d3ee','#7c3aed'],
    intensity: 70, fillIntensity: 22,
    fillColor: '#b040ff', angle: Math.PI/3.5, distance: 52, decay: 1.3,
    emissive: 3.5, glowOpacity: 0.8,
  },
}

/* ── Stadium lights ──────────────────────── */
function StadiumLights({ mode }: { mode: LightMode }) {
  const xs = [-10, -5, 0, 5, 10]
  const m = LIGHT_MODES[mode]
  const poles = [
    ...xs.map((x, i) => ({ x, z:-5, color: m.front[i] })),
    ...xs.map((x, i) => ({ x, z: 5, color: m.back[i]  })),
  ]
  return (
    <>
      {poles.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          {/* Pole */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 10, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Lamp head */}
          <mesh position={[0, 10.2, 0]}>
            <boxGeometry args={[0.95, 0.28, 0.48]} />
            <meshStandardMaterial color={p.color} emissive={p.color}
              emissiveIntensity={m.emissive} metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Glow sphere */}
          <mesh position={[0, 10.15, 0]}>
            <sphereGeometry args={[0.32, 14, 14]} />
            <meshBasicMaterial color={p.color} transparent opacity={m.glowOpacity} />
          </mesh>
          {/* Spotlight */}
          <spotLight
            position={[0, 10.2, 0]}
            angle={m.angle}
            penumbra={0.55}
            intensity={m.intensity}
            color={p.color}
            decay={m.decay}
            distance={m.distance}
          />
        </group>
      ))}
      {/* Overhead fill light */}
      <spotLight position={[0, 16, 0]} angle={Math.PI/2.8} penumbra={0.8}
        intensity={m.fillIntensity} color={m.fillColor} decay={1.1} distance={m.distance} />
    </>
  )
}

/* ── Track ───────────────────────────────── */
function TrackScene() {
  const n = Math.ceil(TRACK_LEN / 2)
  return (
    <>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.5,0]}>
        <planeGeometry args={[80,28]} />
        <meshStandardMaterial color="#070d18" roughness={1} metalness={0} transparent opacity={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.49,0]}>
        <planeGeometry args={[TRACK_LEN+3,3.0]} />
        <meshStandardMaterial color="#0e1e34" roughness={1} metalness={0} transparent opacity={0.97} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.485,1.4]}>
        <planeGeometry args={[TRACK_LEN+3,0.07]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.485,-1.4]}>
        <planeGeometry args={[TRACK_LEN+3,0.07]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      {Array.from({length:n},(_,i)=>(
        <mesh key={i} position={[-TRACK_LEN/2+1.1+i*2.1,-0.483,0]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[1.1,0.09]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      ))}
      <Grid position={[0,-0.5,0]} args={[120,60]}
        cellSize={2} cellThickness={0.35} cellColor="#0f1e30"
        sectionSize={10} sectionThickness={0.7} sectionColor="#1a2e48"
        fadeDistance={45} fadeStrength={1} infiniteGrid />
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

/* ════════════════════════════════════════════════════ */
export default function TezlikSim() {
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

  /* simulation */
  const [speed,    setSpeed]    = useState(10)
  const [distance, setDistance] = useState(100)
  const [running,  setRunning]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed,  setElapsed]  = useState(0)
  const [objIdx,   setObjIdx]   = useState(0)
  const [ctrlMode,   setCtrlMode]   = useState(false)
  const [lightMode,  setLightMode]  = useState<LightMode>('normal')

  /* rotation (live during ctrl mode) */
  const rotY = useRef(0); const rotX = useRef(0)
  const [rotState,  setRotState]  = useState({ y:0, x:0 })
  /* saved rotation — persists after exiting ctrl mode */
  const [savedRot, setSavedRot] = useState({ y:0, x:0 })

  /* world position (absolute, persists across mode switches) */
  const worldPos = useRef({ x: -TRACK_LEN/2, z: 0 })
  const [wpState, setWpState] = useState({ x: -TRACK_LEN/2, z: 0 })
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
      const x = -TRACK_LEN/2 + progress * TRACK_LEN
      worldPos.current = { x, z: 0 }
      setWpState({ x, z: 0 })
    }
  }, [progress, ctrlMode, placed])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setRunning(false); setProgress(0); setElapsed(0)
    startRef.current = 0; pauseAt.current = 0
    rotY.current = 0; rotX.current = 0
    setRotState({ y:0, x:0 })
    setSavedRot({ y:0, x:0 })
    worldPos.current = { x: -TRACK_LEN/2, z: 0 }
    setWpState({ x: -TRACK_LEN/2, z: 0 })
    setPlaced(false)
  }, [])

  const start = useCallback(() => {
    if (running || progress >= 1 || ctrlMode) return
    setRunning(true)
    const v0 = Math.max(speed, 0.1), s0 = progress * distance
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts - pauseAt.current * 1000
      const t = (ts - startRef.current) / 1000
      const p = Math.min((s0 + v0 * t) / Math.max(distance, 1), 1)
      const nx = -TRACK_LEN/2 + p * TRACK_LEN
      setProgress(p); setElapsed(t)
      if (!ctrlMode) { worldPos.current = { x: nx, z: 0 }; setWpState({ x: nx, z: 0 }) }
      if (p < 1) rafRef.current = requestAnimationFrame(animate)
      else {
        setRunning(false)
        setTimeout(() => { setObjIdx(i => (i+1) % OBJECTS.length); reset() }, 900)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [running, progress, speed, distance, ctrlMode, reset])

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
        <Canvas camera={{ position:[0,3.5,16], fov:52 }} dpr={[1,2]}
          style={{ width:'100%', height:'100%', background:'transparent' }}>
          <CameraCapture camRef={camRef} glRef={glRef} />
          <ambientLight intensity={0.18} />
          <directionalLight position={[0,20,0]} intensity={0.22} />

          <StadiumLights mode={lightMode} />
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


          <fog attach="fog" args={['#060d18',30,65]} />
          <OrbitControls
            enabled={!ctrlMode}
            enablePan={false} enableZoom={true} enableRotate={!ctrlMode}
            maxPolarAngle={Math.PI/2.1} minDistance={8} maxDistance={35}
            target={[0,0.5,0]}
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

        {/* Light mode switcher */}
        <div
          style={{ position:'absolute', top:10, right:120, display:'flex', gap:4, zIndex:10 }}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
        >
          {(Object.keys(LIGHT_MODES) as LightMode[]).map(m => {
            const active = m === lightMode
            return (
              <button key={m} onClick={e => { e.stopPropagation(); setLightMode(m) }}
                title={LIGHT_MODES[m].label}
                style={{
                  width:38, height:38, borderRadius:10, cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', gap:1,
                  background: active ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.07)',
                  border: active ? '1.5px solid rgba(168,85,247,0.9)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: active ? '0 0 14px rgba(124,58,237,0.6)' : 'none',
                  backdropFilter:'blur(12px)', transition:'all 0.2s',
                }}>
                <span style={{ fontSize:16, lineHeight:1 }}>{LIGHT_MODES[m].emoji}</span>
                <span style={{ fontSize:7, fontWeight:900, color: active ? '#e9d5ff' : 'rgba(255,255,255,0.4)', letterSpacing:'0.04em' }}>
                  {LIGHT_MODES[m].label.toUpperCase()}
                </span>
              </button>
            )
          })}
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={e => { e.stopPropagation(); toggleFullscreen() }}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
          title={isFullscreen ? "Oynaga qaytish" : "To'liq ekran"}
          style={{
            position:'absolute', top:10, right:66,
            width:38, height:38, borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer',
            background: isFullscreen ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
            border: isFullscreen ? '1.5px solid rgba(34,197,94,0.6)' : '1.5px solid rgba(255,255,255,0.18)',
            backdropFilter:'blur(12px)', transition:'all 0.2s', zIndex:10,
            color: isFullscreen ? '#4ade80' : 'rgba(255,255,255,0.7)',
          }}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Control mode toggle — stopPropagation to prevent drag capture */}
        <button
          onClick={e => { e.stopPropagation(); toggleCtrl() }}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
          title={ctrlMode ? "Rejimdan chiqish" : "Boshqarish rejimi"}
          style={{
            position:'absolute', top:10, right:10,
            width:48, height:48, borderRadius:13,
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:1, cursor:'pointer',
            background: ctrlMode
              ? 'linear-gradient(135deg,rgba(124,58,237,0.65),rgba(168,85,247,0.55))'
              : 'rgba(255,255,255,0.08)',
            border: ctrlMode
              ? '2px solid rgba(168,85,247,0.9)' : '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: ctrlMode ? '0 0 24px rgba(124,58,237,0.7)' : 'none',
            backdropFilter:'blur(12px)', transition:'all 0.2s', zIndex:10,
          }}>
          <span style={{ fontSize:22, lineHeight:1 }}>{curObj.emoji}</span>
          <span style={{ fontSize:8, fontWeight:900,
            color: ctrlMode ? '#e9d5ff' : 'rgba(255,255,255,0.5)', letterSpacing:'0.05em' }}>
            {ctrlMode ? '✕' : '3D'}
          </span>
        </button>

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

      {/* ── Object selector bar ── */}
      <div style={{
        display:'flex', alignItems:'center', gap:4, padding:'6px 12px',
        background:'rgba(3,5,18,0.96)', backdropFilter:'blur(18px)',
        borderTop:'1px solid rgba(255,255,255,0.05)',
        overflowX:'auto', flexShrink:0,
      }}>
        <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)',
          marginRight:4, whiteSpace:'nowrap', flexShrink:0 }}>Jism:</span>
        {OBJECTS.map((obj, i) => {
          const active = i === objIdx
          return (
            <button
              key={obj.id}
              onClick={() => { setObjIdx(i); reset() }}
              title={obj.label}
              style={{
                flexShrink:0, width:34, height:34, borderRadius:9,
                display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', gap:0, cursor:'pointer',
                background: active
                  ? 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(168,85,247,0.4))'
                  : 'rgba(255,255,255,0.05)',
                border: active
                  ? '1.5px solid rgba(168,85,247,0.8)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: active ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
                transition:'all 0.15s',
              }}
            >
              <span style={{ fontSize:16, lineHeight:1 }}>{obj.emoji}</span>
            </button>
          )
        })}
      </div>

      {/* Controls strip */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'8px 16px',
        background:'rgba(4,7,22,0.94)', backdropFilter:'blur(18px)',
        borderTop:`1px solid ${ctrlMode ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.22)'}`,
        flexWrap:'wrap', transition:'border-color 0.3s',
      }}>
        <label style={{ display:'flex', alignItems:'center', gap:6,
          background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(124,58,237,0.45)',
          borderRadius:10, padding:'6px 14px', flex:'1 1 160px', minWidth:130,
          opacity: ctrlMode ? 0.4 : 1 }}>
          <span style={{ fontSize:11, color:'#a78bfa', fontWeight:800, fontFamily:'monospace' }}>v =</span>
          <input type="number" min={0.1} value={speed} disabled={ctrlMode}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ background:'transparent', border:'none', outline:'none', color:'#fff',
              fontSize:14, fontWeight:700, width:'100%', fontFamily:'monospace' }} />
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>m/s</span>
        </label>

        <label style={{ display:'flex', alignItems:'center', gap:6,
          background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(6,182,212,0.45)',
          borderRadius:10, padding:'6px 14px', flex:'1 1 160px', minWidth:130,
          opacity: ctrlMode ? 0.4 : 1 }}>
          <span style={{ fontSize:11, color:'#67e8f9', fontWeight:800, fontFamily:'monospace' }}>s =</span>
          <input type="number" min={1} value={distance} disabled={ctrlMode}
            onChange={e => setDistance(Number(e.target.value))}
            style={{ background:'transparent', border:'none', outline:'none', color:'#fff',
              fontSize:14, fontWeight:700, width:'100%', fontFamily:'monospace' }} />
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>m</span>
        </label>

        <button onClick={start} disabled={running||progress>=1||ctrlMode} style={{
          display:'flex', alignItems:'center', gap:5, padding:'7px 18px', borderRadius:10,
          background:'linear-gradient(135deg,#7C3AED,#a855f7)', border:'none', color:'#fff',
          fontWeight:700, fontSize:13,
          cursor: running||progress>=1||ctrlMode?'not-allowed':'pointer',
          opacity: running||progress>=1||ctrlMode?0.4:1,
          boxShadow:'0 0 16px rgba(124,58,237,0.5)',
        }}>
          <Play className="h-3.5 w-3.5" /> Boshlash
        </button>
        <button onClick={pause} disabled={!running} style={{
          display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:10,
          background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)',
          color:'#fff', fontWeight:600, fontSize:13,
          cursor:!running?'not-allowed':'pointer', opacity:!running?0.4:1,
        }}>
          <Pause className="h-3.5 w-3.5" /> Pauza
        </button>
        <button onClick={reset} style={{
          display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:10,
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
          color:'rgba(255,255,255,0.6)', fontWeight:600, fontSize:13, cursor:'pointer',
        }}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>

        <div style={{ marginLeft:'auto', display:'flex', gap:18, fontFamily:'monospace' }}>
          {[
            { l:'s', v:(progress*distance).toFixed(0), u:'m', c:'#67e8f9' },
            { l:'t', v:elapsed.toFixed(1), u:'s', c:'#fbbf24' },
            { l:'%', v:String(pct), u:'', c:'#a78bfa' },
          ].map(({ l, v, u, c }) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>{l}</div>
              <div style={{ fontSize:15, fontWeight:900, color:c, textShadow:`0 0 10px ${c}80` }}>{v}{u}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
