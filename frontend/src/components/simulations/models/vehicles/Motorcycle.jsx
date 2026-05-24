import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Motorcycle({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const wF = useRef(); const wB = useRef()
  useFrame(() => {
    const d = moving ? speed * 0.1 : 0
    if (wF.current) wF.current.rotation.x += d
    if (wB.current) wB.current.rotation.x += d
  })
  const red    = <meshStandardMaterial color="#DC2626" metalness={0.7} roughness={0.2} />
  const black  = <meshStandardMaterial color="#111" metalness={0.2} roughness={0.5} />
  const chrome = <meshStandardMaterial color="#ddd" metalness={1.0} roughness={0.05} />
  const glass  = <meshStandardMaterial color="#93C5FD" metalness={0.1} roughness={0} transparent opacity={0.35} />

  return (
    <group position={position} scale={[0.9, 0.9, 0.9]}>
      {/* Rear wheel */}
      <group ref={wB} position={[-0.75, 0, 0]} rotation={[0, Math.PI/2, 0]}><mesh><torusGeometry args={[0.42, 0.1, 10, 28]} />{black}</mesh></group>
      {/* Front wheel */}
      <group ref={wF} position={[0.85, 0, 0]} rotation={[0, Math.PI/2, 0]}><mesh><torusGeometry args={[0.42, 0.1, 10, 28]} />{black}</mesh></group>
      {/* Body fairing */}
      <mesh position={[0.1, 0.32, 0]} rotation={[0, 0, 0.08]}><capsuleGeometry args={[0.22, 1.0, 6, 10]} />{red}</mesh>
      {/* Seat */}
      <mesh position={[-0.2, 0.56, 0]}><boxGeometry args={[0.55, 0.1, 0.26]} />{black}</mesh>
      {/* Tank */}
      <mesh position={[0.2, 0.52, 0]}><boxGeometry args={[0.38, 0.22, 0.28]} />{red}</mesh>
      {/* Windshield */}
      <mesh position={[0.6, 0.72, 0]} rotation={[0.4, 0, 0]}><boxGeometry args={[0.26, 0.28, 0.03]} />{glass}</mesh>
      {/* Headlight */}
      <mesh position={[0.78, 0.44, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={2} /></mesh>
      {/* Exhaust */}
      <mesh position={[-0.3, 0.08, 0.18]} rotation={[0, 0.1, -0.15]}><cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />{chrome}</mesh>
      {/* Fork */}
      <mesh position={[0.7, 0.22, 0.14]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.025, 0.025, 0.52, 5]} />{chrome}</mesh>
      <mesh position={[0.7, 0.22, -0.14]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.025, 0.025, 0.52, 5]} />{chrome}</mesh>
      {/* Handlebars */}
      <mesh position={[0.65, 0.58, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.55, 5]} />{chrome}</mesh>
    </group>
  )
}
