import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Bicycle({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const wF = useRef(); const wB = useRef(); const pedals = useRef()
  useFrame(() => {
    if (!moving) return
    const delta = speed * 0.08
    if (wF.current) wF.current.rotation.x += delta
    if (wB.current) wB.current.rotation.x += delta
    if (pedals.current) pedals.current.rotation.x += delta
  })
  const chrome = <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
  const black  = <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
  const gold   = <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.2} />

  return (
    <group position={position} scale={[0.85, 0.85, 0.85]}>
      {/* Rear wheel */}
      <group ref={wB} position={[-0.9, 0, 0]} rotation={[0, Math.PI/2, 0]}><mesh><torusGeometry args={[0.45, 0.06, 8, 24]} />{black}</mesh><mesh><torusGeometry args={[0.42, 0.02, 4, 24]} />{chrome}</mesh></group>
      {/* Front wheel */}
      <group ref={wF} position={[0.9, 0, 0]} rotation={[0, Math.PI/2, 0]}><mesh><torusGeometry args={[0.45, 0.06, 8, 24]} />{black}</mesh><mesh><torusGeometry args={[0.42, 0.02, 4, 24]} />{chrome}</mesh></group>
      {/* Frame: down tube */}
      <mesh position={[0.1, 0.22, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.025, 0.025, 1.05, 6]} />{chrome}</mesh>
      {/* Seat tube */}
      <mesh position={[-0.18, 0.28, 0]} rotation={[0, 0, 0.12]}><cylinderGeometry args={[0.025, 0.025, 0.7, 6]} />{chrome}</mesh>
      {/* Top tube */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.08]}><cylinderGeometry args={[0.022, 0.022, 1.1, 6]} />{chrome}</mesh>
      {/* Chain stay */}
      <mesh position={[-0.58, -0.05, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.018, 0.018, 0.72, 5]} />{chrome}</mesh>
      {/* Fork */}
      <mesh position={[0.75, 0.18, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.022, 0.022, 0.52, 5]} />{chrome}</mesh>
      {/* Handlebar */}
      <mesh position={[0.9, 0.72, 0]}><cylinderGeometry args={[0.018, 0.018, 0.55, 5]} />{chrome}</mesh>
      {/* Seat */}
      <mesh position={[-0.18, 0.72, 0]} rotation={[0, 0, 0.05]}><boxGeometry args={[0.26, 0.06, 0.14]} />{black}</mesh>
      {/* Pedals */}
      <group ref={pedals} position={[-0.08, 0.15, 0]}>
        <mesh><cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />{gold}</mesh>
        <mesh position={[0.15, 0, 0]}><boxGeometry args={[0.1, 0.04, 0.07]} />{black}</mesh>
        <mesh position={[-0.15, 0, 0]}><boxGeometry args={[0.1, 0.04, 0.07]} />{black}</mesh>
      </group>
    </group>
  )
}
