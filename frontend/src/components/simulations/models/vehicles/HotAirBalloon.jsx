import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function HotAirBalloon({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group   = useRef()
  const flame   = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.position.y = position[1] + Math.sin(t * (moving ? speed : 0.5)) * 0.15
    if (flame.current) flame.current.scale.y = 0.8 + Math.abs(Math.sin(t * 8)) * 0.5
  })

  const colors = ['#F97316','#FBBF24','#EF4444','#8B5CF6','#F97316','#FBBF24','#EF4444','#8B5CF6']
  return (
    <group ref={group} position={position} scale={[0.7, 0.7, 0.7]}>
      {/* Envelope — main sphere */}
      <mesh position={[0, 1.2, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.85, 16, 16]} /><meshStandardMaterial color="#F97316" roughness={0.8} /></mesh>
      {/* Colored panels */}
      {colors.map((c, i) => {
        const angle = (i / colors.length) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.6, 1.35, Math.sin(angle) * 0.6]} scale={[0.5, 1.1, 0.12]}>
            <sphereGeometry args={[0.55, 6, 10]} />
            <meshStandardMaterial color={c} roughness={0.75} transparent opacity={0.85} />
          </mesh>
        )
      })}
      {/* Ropes */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, 0.45, Math.sin(a) * 0.5]} rotation={[0.45, a, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.0, 3]} />
            <meshStandardMaterial color="#92400E" />
          </mesh>
        )
      })}
      {/* Basket */}
      <mesh position={[0, -0.18, 0]}><boxGeometry args={[0.55, 0.42, 0.55]} /><meshStandardMaterial color="#92400E" roughness={0.9} /></mesh>
      {/* Burner */}
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.08, 0.1, 0.22, 8]} /><meshStandardMaterial color="#bbb" metalness={0.8} /></mesh>
      {/* Flame */}
      <group ref={flame} position={[0, 0.52, 0]}>
        <mesh><coneGeometry args={[0.08, 0.35, 8]} /><meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2} transparent opacity={0.9} /></mesh>
        <mesh scale={[0.6, 1, 0.6]}><coneGeometry args={[0.05, 0.28, 6]} /><meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={3} transparent opacity={0.8} /></mesh>
      </group>
    </group>
  )
}
