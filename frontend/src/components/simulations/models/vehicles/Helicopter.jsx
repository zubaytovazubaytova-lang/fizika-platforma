import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Helicopter({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const rotor = useRef(); const tailRotor = useRef(); const group = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const rSpeed = moving ? speed * 0.8 : 0.4
    if (rotor.current) rotor.current.rotation.y += rSpeed
    if (tailRotor.current) tailRotor.current.rotation.x += rSpeed * 2
    if (group.current) group.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08
  })
  const darkGray = <meshStandardMaterial color="#1F2937" metalness={0.6} roughness={0.25} />
  const panel    = <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.3} />
  const glass    = <meshStandardMaterial color="#BAE6FD" metalness={0.1} roughness={0} transparent opacity={0.55} />

  return (
    <group ref={group} position={position} scale={[0.8, 0.8, 0.8]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}><capsuleGeometry args={[0.38, 1.1, 6, 12]} />{darkGray}</mesh>
      {/* Cockpit bubble */}
      <mesh position={[0.72, 0.05, 0]} scale={[0.9, 0.82, 1.05]}><sphereGeometry args={[0.4, 10, 10]} />{glass}</mesh>
      {/* Tail boom */}
      <mesh position={[-1.2, 0.1, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.1, 0.06, 1.6, 8]} />{darkGray}</mesh>
      {/* Main rotor hub */}
      <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.08, 0.08, 0.14, 8]} />{panel}</mesh>
      {/* Main rotor blades */}
      <group ref={rotor} position={[0, 0.52, 0]}>
        {[0, Math.PI/2, Math.PI, Math.PI*3/2].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9]} rotation={[0, a, 0]}>
            <boxGeometry args={[1.8, 0.04, 0.18]} />
            {darkGray}
          </mesh>
        ))}
      </group>
      {/* Tail rotor */}
      <group ref={tailRotor} position={[-2.0, 0.2, 0.15]}>
        <mesh rotation={[Math.PI/2, 0, 0]}><boxGeometry args={[0.55, 0.03, 0.1]} />{panel}</mesh>
        <mesh rotation={[0, Math.PI/2, 0]}><boxGeometry args={[0.55, 0.03, 0.1]} />{panel}</mesh>
      </group>
      {/* Skids */}
      <mesh position={[0.1, -0.52, 0.36]}><cylinderGeometry args={[0.025, 0.025, 1.4, 5]} /><meshStandardMaterial color="#555" metalness={0.7} /></mesh>
      <mesh position={[0.1, -0.52, -0.36]}><cylinderGeometry args={[0.025, 0.025, 1.4, 5]} /><meshStandardMaterial color="#555" metalness={0.7} /></mesh>
      {/* Struts */}
      {[0.4, -0.4].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.3, 0.36]} rotation={[0.3, 0, 0.15]}><cylinderGeometry args={[0.018, 0.018, 0.3, 4]} /><meshStandardMaterial color="#555" metalness={0.7} /></mesh>
          <mesh position={[x, -0.3, -0.36]} rotation={[0.3, 0, -0.15]}><cylinderGeometry args={[0.018, 0.018, 0.3, 4]} /><meshStandardMaterial color="#555" metalness={0.7} /></mesh>
        </group>
      ))}
      {/* Nav lights */}
      <mesh position={[0.4, 0, 0.4]}><sphereGeometry args={[0.04, 5, 5]} /><meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2} /></mesh>
      <mesh position={[0.4, 0, -0.4]}><sphereGeometry args={[0.04, 5, 5]} /><meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={2} /></mesh>
    </group>
  )
}
