import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Ship({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(t * 0.6) * 0.03
  })
  return (
    <group ref={group} position={position} scale={[0.55, 0.55, 0.55]}>
      {/* Hull */}
      <mesh position={[0, -0.1, 0]}><boxGeometry args={[4.5, 0.7, 1.3]} /><meshStandardMaterial color="#1E3A5F" metalness={0.4} roughness={0.5} /></mesh>
      {/* Hull bow taper */}
      <mesh position={[2.5, -0.1, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.65, 0.9, 6]} /><meshStandardMaterial color="#1E3A5F" metalness={0.4} roughness={0.5} /></mesh>
      {/* Main deck */}
      <mesh position={[0, 0.38, 0]}><boxGeometry args={[4.2, 0.12, 1.25]} /><meshStandardMaterial color="#F3F4F6" roughness={0.5} /></mesh>
      {/* Superstructure floors */}
      {[0.7, 1.1, 1.42].map((y, i) => (
        <mesh key={i} position={[-0.4, y, 0]}><boxGeometry args={[2.0 - i * 0.3, 0.45, 1.0 - i * 0.1]} /><meshStandardMaterial color="#FFFFFF" roughness={0.4} /></mesh>
      ))}
      {/* Funnels */}
      <mesh position={[-0.5, 1.95, 0.3]}><cylinderGeometry args={[0.14, 0.18, 0.6, 10]} /><meshStandardMaterial color="#DC2626" roughness={0.4} /></mesh>
      <mesh position={[-0.5, 1.95, -0.3]}><cylinderGeometry args={[0.14, 0.18, 0.6, 10]} /><meshStandardMaterial color="#DC2626" roughness={0.4} /></mesh>
      {/* Portholes */}
      {[-1.5,-0.5,0.5,1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.66]}><cylinderGeometry args={[0.07, 0.07, 0.04, 8]} /><meshStandardMaterial color="#93C5FD" metalness={0.3} /></mesh>
      ))}
    </group>
  )
}
