import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Human({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group   = useRef()
  const armL    = useRef(); const armR = useRef()
  const legL    = useRef(); const legR = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * (moving ? speed * 2.5 : 0.3)
    if (group.current && moving) group.current.position.y = position[1] + Math.abs(Math.sin(t * 2)) * 0.06
    if (armL.current) armL.current.rotation.x =  Math.sin(t * 2) * 0.5
    if (armR.current) armR.current.rotation.x = -Math.sin(t * 2) * 0.5
    if (legL.current) legL.current.rotation.x = -Math.sin(t * 2) * 0.55
    if (legR.current) legR.current.rotation.x =  Math.sin(t * 2) * 0.55
  })

  const skin  = <meshStandardMaterial color="#FDBCB4" roughness={0.7} />
  const shirt = <meshStandardMaterial color="#1E40AF" roughness={0.6} />
  const pant  = <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
  const shoe  = <meshStandardMaterial color="#2C1810" roughness={0.8} />
  const hair  = <meshStandardMaterial color="#3D2B1F" roughness={0.9} />

  return (
    <group ref={group} position={position} scale={[0.55, 0.55, 0.55]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.28, 10, 10]} />{skin}</mesh>
      {/* Hair */}
      <mesh position={[0, 1.88, 0]} scale={[1.02, 0.55, 1.02]}><sphereGeometry args={[0.28, 8, 8]} />{hair}</mesh>
      {/* Eyes */}
      <mesh position={[0.1, 1.68, 0.25]}><sphereGeometry args={[0.04, 5, 5]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.1, 1.68, 0.25]}><sphereGeometry args={[0.04, 5, 5]} /><meshStandardMaterial color="#111" /></mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[0.48, 0.62, 0.28]} />{shirt}</mesh>
      {/* Arms */}
      <group ref={armL} position={[0.32, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.08, 0.07, 0.55, 6]} />{shirt}</mesh>
        <mesh position={[0, -0.62, 0]}><sphereGeometry args={[0.08, 6, 6]} />{skin}</mesh>
      </group>
      <group ref={armR} position={[-0.32, 1.3, 0]}>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.08, 0.07, 0.55, 6]} />{shirt}</mesh>
        <mesh position={[0, -0.62, 0]}><sphereGeometry args={[0.08, 6, 6]} />{skin}</mesh>
      </group>
      {/* Legs */}
      <group ref={legL} position={[0.16, 0.78, 0]}>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.1, 0.09, 0.56, 6]} />{pant}</mesh>
        <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.09, 0.08, 0.35, 6]} />{pant}</mesh>
        <mesh position={[0, -0.82, 0.06]}><boxGeometry args={[0.14, 0.09, 0.24]} />{shoe}</mesh>
      </group>
      <group ref={legR} position={[-0.16, 0.78, 0]}>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.1, 0.09, 0.56, 6]} />{pant}</mesh>
        <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.09, 0.08, 0.35, 6]} />{pant}</mesh>
        <mesh position={[0, -0.82, 0.06]}><boxGeometry args={[0.14, 0.09, 0.24]} />{shoe}</mesh>
      </group>
    </group>
  )
}
