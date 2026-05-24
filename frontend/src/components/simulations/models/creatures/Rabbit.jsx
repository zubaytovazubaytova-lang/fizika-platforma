import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Rabbit({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const group = useRef()
  const earL = useRef(); const earR = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * (moving ? speed * 3 : 0.5)
    if (group.current && moving) {
      const hop = Math.abs(Math.sin(t * 2.5))
      group.current.position.y = position[1] + hop * 0.4
      group.current.rotation.x = Math.sin(t * 2.5) * 0.08
    }
    if (earL.current) earL.current.rotation.z = Math.sin(t * 0.8) * 0.15 + 0.1
    if (earR.current) earR.current.rotation.z = -Math.sin(t * 0.8) * 0.15 - 0.1
  })

  const white = <meshStandardMaterial color="#F8F8F8" roughness={0.95} metalness={0} />
  const pink  = <meshStandardMaterial color="#FFB6C1" roughness={0.9} />
  const dark  = <meshStandardMaterial color="#2C1810" roughness={0.8} />

  return (
    <group ref={group} position={position} scale={[0.7, 0.7, 0.7]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}><sphereGeometry args={[0.45, 12, 12]} />{white}</mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0.1]}><sphereGeometry args={[0.3, 12, 12]} />{white}</mesh>
      {/* Ears */}
      <group ref={earL} position={[0.14, 0.92, 0.08]}>
        <mesh><sphereGeometry args={[0.08, 6, 12]} />{white}</mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.06, 0.08, 0.45, 6]} />{white}</mesh>
        <mesh position={[0, 0.22, 0.01]} scale={[0.6, 0.9, 0.5]}><cylinderGeometry args={[0.04, 0.05, 0.42, 5]} />{pink}</mesh>
      </group>
      <group ref={earR} position={[-0.14, 0.92, 0.08]}>
        <mesh><sphereGeometry args={[0.08, 6, 12]} />{white}</mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.06, 0.08, 0.45, 6]} />{white}</mesh>
        <mesh position={[0, 0.22, 0.01]} scale={[0.6, 0.9, 0.5]}><cylinderGeometry args={[0.04, 0.05, 0.42, 5]} />{pink}</mesh>
      </group>
      {/* Eyes */}
      <mesh position={[0.12, 0.58, 0.26]}><sphereGeometry args={[0.055, 6, 6]} />{dark}</mesh>
      <mesh position={[-0.12, 0.58, 0.26]}><sphereGeometry args={[0.055, 6, 6]} />{dark}</mesh>
      {/* Nose */}
      <mesh position={[0, 0.48, 0.3]}><sphereGeometry args={[0.035, 6, 6]} />{pink}</mesh>
      {/* Tail */}
      <mesh position={[0, 0.05, -0.44]}><sphereGeometry args={[0.12, 8, 8]} />{white}</mesh>
      {/* Legs (back) */}
      <mesh position={[0.2, -0.32, 0.08]} rotation={[0.4, 0, 0.15]}><capsuleGeometry args={[0.07, 0.3, 4, 8]} />{white}</mesh>
      <mesh position={[-0.2, -0.32, 0.08]} rotation={[0.4, 0, -0.15]}><capsuleGeometry args={[0.07, 0.3, 4, 8]} />{white}</mesh>
    </group>
  )
}
