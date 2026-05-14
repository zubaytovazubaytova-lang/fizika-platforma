'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'

const G = 9.8
const PIVOT_Y = 2.5

function PendulumScene({ length, angleDeg }: { length: number; angleDeg: number }) {
  const bobRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<{ setPoints: (p: [number, number, number][]) => void }>(null)
  const theta = useRef(angleDeg * (Math.PI / 180))
  const omega = useRef(0)

  const initX = Math.sin(theta.current) * length
  const initY = PIVOT_Y - Math.cos(theta.current) * length

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.04)
    omega.current += -(G / length) * Math.sin(theta.current) * dt
    theta.current += omega.current * dt

    const bx = Math.sin(theta.current) * length
    const by = PIVOT_Y - Math.cos(theta.current) * length
    if (bobRef.current) bobRef.current.position.set(bx, by, 0)
  })

  return (
    <group>
      {/* Tayanch */}
      <mesh position={[0, PIVOT_Y + 0.15, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Tayanch nuqta */}
      <mesh position={[0, PIVOT_Y, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} />
      </mesh>
      {/* Ip */}
      <Line
        ref={lineRef as never}
        points={[[0, PIVOT_Y, 0], [initX, initY, 0]]}
        color="#9ca3af"
        lineWidth={1.5}
      />
      {/* Bob */}
      <mesh ref={bobRef} position={[initX, initY, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function PendulumSim() {
  const [length, setLength]   = useState(3)
  const [angleDeg, setAngle]  = useState(30)
  const [simKey, setSimKey]   = useState(0)

  const period = (2 * Math.PI * Math.sqrt(length / G)).toFixed(2)

  function restart(newLen?: number, newAng?: number) {
    if (newLen !== undefined) setLength(newLen)
    if (newAng !== undefined) setAngle(newAng)
    setSimKey((k) => k + 1)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <Canvas camera={{ position: [0, 1, 9], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 8, 5]} intensity={1.5} />
          <PendulumScene key={simKey} length={length} angleDeg={angleDeg} />
          <gridHelper args={[12, 12, '#374151', '#1f2937']} position={[0, -1.5, 0]} />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={14} />
        </Canvas>
      </div>

      {/* Boshqaruv */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">
              Uzunlik: <span className="text-white font-medium">{length} m</span>
            </label>
            <input type="range" min={0.5} max={5} step={0.1} value={length}
              onChange={(e) => restart(Number(e.target.value), undefined)}
              className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">
              Burchak: <span className="text-white font-medium">{angleDeg}°</span>
            </label>
            <input type="range" min={5} max={80} step={1} value={angleDeg}
              onChange={(e) => restart(undefined, Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-800 px-3 py-2">
            <span className="text-xs text-gray-400">T = 2π√(L/g)</span>
            <span className="font-mono text-xl font-bold text-blue-400">{period} s</span>
          </div>
          <button
            onClick={() => restart(length, angleDeg)}
            className="rounded-xl bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            Qayta boshlash
          </button>
        </div>
      </div>
    </div>
  )
}
