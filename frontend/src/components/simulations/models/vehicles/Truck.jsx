import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Truck({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const wRefs = Array.from({ length: 10 }, () => useRef())
  useFrame(() => {
    const d = moving ? speed * 0.06 : 0
    wRefs.forEach(w => { if (w.current) w.current.rotation.x += d })
  })
  const red    = <meshStandardMaterial color="#DC2626" metalness={0.5} roughness={0.3} />
  const gray   = <meshStandardMaterial color="#E5E7EB" roughness={0.5} />
  const black  = <meshStandardMaterial color="#111" roughness={0.7} />
  const chrome = <meshStandardMaterial color="#ccc" metalness={1.0} roughness={0.05} />
  const glass  = <meshStandardMaterial color="#374151" metalness={0.1} roughness={0.1} transparent opacity={0.7} />

  const wPositions = [
    [1.6,-0.3,0.55],[1.6,-0.3,-0.55],
    [-0.5,-0.3,0.65],[-0.5,-0.3,-0.65],[-0.5,-0.3,0.45],[-0.5,-0.3,-0.45],
    [-1.5,-0.3,0.65],[-1.5,-0.3,-0.65],[-1.5,-0.3,0.45],[-1.5,-0.3,-0.45],
  ]

  return (
    <group position={position} scale={[0.75, 0.75, 0.75]}>
      {/* Cab */}
      <mesh position={[1.8, 0.45, 0]}><boxGeometry args={[1.1, 1.0, 1.2]} />{red}</mesh>
      {/* Cab roof */}
      <mesh position={[1.85, 1.05, 0]}><boxGeometry args={[0.9, 0.3, 1.15]} />{red}</mesh>
      {/* Windshield */}
      <mesh position={[2.28, 0.58, 0]} rotation={[0, 0, 0.18]}><boxGeometry args={[0.04, 0.48, 1.05]} />{glass}</mesh>
      {/* Grille */}
      <mesh position={[2.35, 0.3, 0]}><boxGeometry args={[0.06, 0.55, 1.1]} />{chrome}</mesh>
      {/* Trailer */}
      <mesh position={[-0.8, 0.55, 0]}><boxGeometry args={[3.8, 1.2, 1.15]} />{gray}</mesh>
      {/* Exhaust stacks */}
      <mesh position={[1.5, 1.5, 0.52]}><cylinderGeometry args={[0.05, 0.06, 0.9, 6]} />{chrome}</mesh>
      <mesh position={[1.5, 1.5, -0.52]}><cylinderGeometry args={[0.05, 0.06, 0.9, 6]} />{chrome}</mesh>
      {/* Wheels */}
      {wPositions.map((wp, i) => (
        <group key={i} ref={wRefs[i]} position={wp} rotation={[0, Math.PI/2, 0]}>
          <mesh><torusGeometry args={[0.35, 0.12, 8, 20]} />{black}</mesh>
          <mesh><cylinderGeometry args={[0.2, 0.2, 0.1, 8]} /><meshStandardMaterial color="#888" metalness={0.7} /></mesh>
        </group>
      ))}
    </group>
  )
}
