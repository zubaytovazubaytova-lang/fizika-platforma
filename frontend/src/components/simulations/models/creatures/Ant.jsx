import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ant({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group = useRef()
  const legRefs = Array.from({ length: 6 }, () => useRef())
  const antRef1 = useRef(); const antRef2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * (moving ? speed * 2 : 0.5)
    if (group.current && moving) {
      group.current.position.y = position[1] + Math.abs(Math.sin(t * 3)) * 0.04
    }
    legRefs.forEach((ref, i) => {
      if (ref.current) {
        const phase = (i % 3) * (Math.PI * 2 / 3)
        ref.current.rotation.z = Math.sin(t * 4 + phase) * 0.4 * (i < 3 ? 1 : -1)
      }
    })
    if (antRef1.current) antRef1.current.rotation.z = Math.sin(t * 2) * 0.3
    if (antRef2.current) antRef2.current.rotation.z = -Math.sin(t * 2) * 0.3
  })

  const mat = <meshStandardMaterial color="#1a1a1a" metalness={0.35} roughness={0.4} />
  const scale = 0.3

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {/* Abdomen */}
      <mesh position={[0, 0, 0.6]}><sphereGeometry args={[0.5, 12, 12]} />{mat}</mesh>
      {/* Thorax */}
      <mesh position={[0, 0, 0]}><sphereGeometry args={[0.3, 10, 10]} />{mat}</mesh>
      {/* Head */}
      <mesh position={[0, 0, -0.45]}><sphereGeometry args={[0.25, 10, 10]} />{mat}</mesh>
      {/* Eyes */}
      <mesh position={[0.12, 0.15, -0.62]}><sphereGeometry args={[0.07, 6, 6]} /><meshStandardMaterial color="#cc0000" emissive="#880000" /></mesh>
      <mesh position={[-0.12, 0.15, -0.62]}><sphereGeometry args={[0.07, 6, 6]} /><meshStandardMaterial color="#cc0000" emissive="#880000" /></mesh>
      {/* Antennae */}
      <group ref={antRef1} position={[0.1, 0.2, -0.55]}><mesh rotation={[0.3, 0, 0.3]}><cylinderGeometry args={[0.02, 0.01, 0.6, 4]} />{mat}</mesh></group>
      <group ref={antRef2} position={[-0.1, 0.2, -0.55]}><mesh rotation={[0.3, 0, -0.3]}><cylinderGeometry args={[0.02, 0.01, 0.6, 4]} />{mat}</mesh></group>
      {/* 6 legs */}
      {[[-0.2, -0.1, -0.1], [-0.2, -0.1, 0.05], [-0.2, -0.1, 0.2], [0.2, -0.1, -0.1], [0.2, -0.1, 0.05], [0.2, -0.1, 0.2]].map((pos, i) => (
        <group key={i} ref={legRefs[i]} position={pos}>
          <mesh rotation={[0, 0, i < 3 ? -Math.PI / 4 : Math.PI / 4]}>
            <cylinderGeometry args={[0.025, 0.015, 0.5, 4]} />
            {mat}
          </mesh>
        </group>
      ))}
    </group>
  )
}
