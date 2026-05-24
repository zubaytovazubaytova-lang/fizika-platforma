import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Wolf({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group = useRef()
  const legFL = useRef(); const legFR = useRef()
  const legBL = useRef(); const legBR = useRef()
  const tail  = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * (moving ? speed * 3 : 0.4)
    if (group.current && moving) group.current.position.y = position[1] + Math.abs(Math.sin(t * 2)) * 0.08
    if (legFL.current) legFL.current.rotation.x = Math.sin(t * 2) * 0.6
    if (legFR.current) legFR.current.rotation.x = -Math.sin(t * 2) * 0.6
    if (legBL.current) legBL.current.rotation.x = -Math.sin(t * 2) * 0.6
    if (legBR.current) legBR.current.rotation.x = Math.sin(t * 2) * 0.6
    if (tail.current) tail.current.rotation.x = Math.sin(t * 1.5) * 0.3
  })

  const fur = <meshStandardMaterial color="#7A8B7A" roughness={0.85} />
  const belly = <meshStandardMaterial color="#9BA89B" roughness={0.85} />

  return (
    <group ref={group} position={position} scale={[0.65, 0.65, 0.65]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} rotation={[0.1, 0, 0]}><sphereGeometry args={[0.6, 10, 10]} />{fur}</mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0.55]}><sphereGeometry args={[0.34, 10, 10]} />{fur}</mesh>
      {/* Snout */}
      <mesh position={[0, 0.6, 0.82]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.12, 0.15, 0.28, 8]} />{fur}</mesh>
      {/* Ears */}
      <mesh position={[0.18, 1.06, 0.52]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.1, 0.22, 5]} />{fur}</mesh>
      <mesh position={[-0.18, 1.06, 0.52]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.1, 0.22, 5]} />{fur}</mesh>
      {/* Eyes */}
      <mesh position={[0.14, 0.77, 0.78]}><sphereGeometry args={[0.055, 6, 6]} /><meshStandardMaterial color="#DAA520" emissive="#886600" /></mesh>
      <mesh position={[-0.14, 0.77, 0.78]}><sphereGeometry args={[0.055, 6, 6]} /><meshStandardMaterial color="#DAA520" emissive="#886600" /></mesh>
      {/* Nose */}
      <mesh position={[0, 0.63, 0.95]}><sphereGeometry args={[0.055, 6, 6]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      {/* Belly */}
      <mesh position={[0, 0.15, 0.25]} scale={[0.75, 0.75, 0.5]}><sphereGeometry args={[0.5, 8, 8]} />{belly}</mesh>
      {/* Legs */}
      <group ref={legFL} position={[0.28, -0.1, 0.3]}>
        <mesh><cylinderGeometry args={[0.09, 0.07, 0.55, 6]} />{fur}</mesh>
        <mesh position={[0, -0.32, 0.06]}><sphereGeometry args={[0.1, 6, 6]} />{fur}</mesh>
      </group>
      <group ref={legFR} position={[-0.28, -0.1, 0.3]}>
        <mesh><cylinderGeometry args={[0.09, 0.07, 0.55, 6]} />{fur}</mesh>
        <mesh position={[0, -0.32, 0.06]}><sphereGeometry args={[0.1, 6, 6]} />{fur}</mesh>
      </group>
      <group ref={legBL} position={[0.28, -0.1, -0.2]}>
        <mesh><cylinderGeometry args={[0.09, 0.07, 0.55, 6]} />{fur}</mesh>
        <mesh position={[0, -0.32, 0.06]}><sphereGeometry args={[0.1, 6, 6]} />{fur}</mesh>
      </group>
      <group ref={legBR} position={[-0.28, -0.1, -0.2]}>
        <mesh><cylinderGeometry args={[0.09, 0.07, 0.55, 6]} />{fur}</mesh>
        <mesh position={[0, -0.32, 0.06]}><sphereGeometry args={[0.1, 6, 6]} />{fur}</mesh>
      </group>
      {/* Tail */}
      <group ref={tail} position={[0, 0.25, -0.65]}>
        <mesh rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.08, 0.12, 0.6, 6]} />{fur}</mesh>
        <mesh position={[0, 0.35, -0.1]} rotation={[0.3, 0, 0]}><sphereGeometry args={[0.14, 6, 6]} /><meshStandardMaterial color="#c0c8c0" roughness={0.9} /></mesh>
      </group>
    </group>
  )
}
