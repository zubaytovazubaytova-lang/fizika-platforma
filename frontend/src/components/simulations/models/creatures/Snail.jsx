import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Snail({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group = useRef()
  const shell = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (shell.current) shell.current.rotation.y = Math.sin(t * 0.5) * 0.05
    if (group.current && moving) group.current.position.y = position[1] + Math.sin(t * speed) * 0.01
  })

  return (
    <group ref={group} position={position} scale={[0.6, 0.6, 0.6]}>
      {/* Body */}
      <mesh position={[0, -0.1, 0]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.35, 12, 8]} />
        <meshStandardMaterial color="#6B7B5E" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Shell */}
      <group ref={shell} position={[0, 0.25, 0.05]}>
        <mesh><torusGeometry args={[0.28, 0.14, 10, 20]} /><meshStandardMaterial color="#8B4513" roughness={0.7} /></mesh>
        <mesh scale={[0.7, 0.7, 0.7]}><torusGeometry args={[0.2, 0.1, 8, 16]} /><meshStandardMaterial color="#F5DEB3" roughness={0.8} /></mesh>
        <mesh scale={[0.4, 0.4, 0.4]}><torusGeometry args={[0.15, 0.08, 6, 12]} /><meshStandardMaterial color="#8B4513" roughness={0.7} /></mesh>
      </group>
      {/* Eye stalks */}
      <mesh position={[0.1, 0.2, -0.25]} rotation={[0.5, 0, 0.2]}><cylinderGeometry args={[0.025, 0.025, 0.22, 5]} /><meshStandardMaterial color="#5a6a4e" roughness={0.8} /></mesh>
      <mesh position={[0.1, 0.42, -0.29]}><sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.1, 0.2, -0.25]} rotation={[0.5, 0, -0.2]}><cylinderGeometry args={[0.025, 0.025, 0.22, 5]} /><meshStandardMaterial color="#5a6a4e" roughness={0.8} /></mesh>
      <mesh position={[-0.1, 0.42, -0.29]}><sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
  )
}
