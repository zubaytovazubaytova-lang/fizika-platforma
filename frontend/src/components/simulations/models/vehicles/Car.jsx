import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Car({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const wheels = [useRef(), useRef(), useRef(), useRef()]
  useFrame(() => {
    const d = moving ? speed * 0.07 : 0
    wheels.forEach(w => { if (w.current) w.current.rotation.x += d })
  })
  const blue   = <meshStandardMaterial color="#2563EB" metalness={0.6} roughness={0.15} />
  const black  = <meshStandardMaterial color="#111" roughness={0.7} />
  const silver = <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.15} />
  const glass  = <meshStandardMaterial color="#BFDBFE" metalness={0.1} roughness={0} transparent opacity={0.45} />

  const wPos = [[0.75, -0.22, 0.52], [0.75, -0.22, -0.52], [-0.75, -0.22, 0.52], [-0.75, -0.22, -0.52]]
  return (
    <group position={position} scale={[1, 1, 1]}>
      {/* Main body */}
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[2.2, 0.52, 1.05]} />{blue}</mesh>
      {/* Roof */}
      <mesh position={[0.05, 0.56, 0]}><boxGeometry args={[1.1, 0.38, 0.95]} />{blue}</mesh>
      {/* Windshield front */}
      <mesh position={[0.5, 0.52, 0]} rotation={[0, 0, -0.4]}><boxGeometry args={[0.04, 0.42, 0.88]} />{glass}</mesh>
      {/* Windshield rear */}
      <mesh position={[-0.42, 0.52, 0]} rotation={[0, 0, 0.4]}><boxGeometry args={[0.04, 0.4, 0.88]} />{glass}</mesh>
      {/* Side windows */}
      <mesh position={[0, 0.54, 0.49]}><boxGeometry args={[0.9, 0.28, 0.02]} />{glass}</mesh>
      <mesh position={[0, 0.54, -0.49]}><boxGeometry args={[0.9, 0.28, 0.02]} />{glass}</mesh>
      {/* Headlights */}
      <mesh position={[1.1, 0.16, 0.32]}><sphereGeometry args={[0.07, 6, 6]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} /></mesh>
      <mesh position={[1.1, 0.16, -0.32]}><sphereGeometry args={[0.07, 6, 6]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} /></mesh>
      {/* Taillights */}
      <mesh position={[-1.1, 0.16, 0.32]}><boxGeometry args={[0.04, 0.1, 0.16]} /><meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.2} /></mesh>
      <mesh position={[-1.1, 0.16, -0.32]}><boxGeometry args={[0.04, 0.1, 0.16]} /><meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.2} /></mesh>
      {/* Wheels */}
      {wPos.map((wp, i) => (
        <group key={i} ref={wheels[i]} position={wp} rotation={[0, Math.PI/2, 0]}>
          <mesh><torusGeometry args={[0.28, 0.1, 8, 20]} />{black}</mesh>
          <mesh><cylinderGeometry args={[0.18, 0.18, 0.08, 8]} />{silver}</mesh>
        </group>
      ))}
    </group>
  )
}
