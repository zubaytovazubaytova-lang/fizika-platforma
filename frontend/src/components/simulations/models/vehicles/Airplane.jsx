import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Airplane({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const eng1 = useRef(); const eng2 = useRef(); const eng3 = useRef(); const eng4 = useRef()
  useFrame(() => {
    const d = moving ? speed * 0.3 : 0.15
    ;[eng1, eng2, eng3, eng4].forEach(e => { if (e.current) e.current.rotation.z += d })
  })
  const white  = <meshStandardMaterial color="#F8FAFC" metalness={0.5} roughness={0.2} />
  const gray   = <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.3} />
  const blue   = <meshStandardMaterial color="#2563EB" />
  const chrome = <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.05} />

  return (
    <group position={position} scale={[0.7, 0.7, 0.7]}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.32, 0.18, 4.2, 12]} />{white}</mesh>
      {/* Nose cone */}
      <mesh position={[2.3, 0, 0]} rotation={[0, 0, -Math.PI/2]}><coneGeometry args={[0.18, 0.5, 10]} />{white}</mesh>
      {/* Blue livery stripe */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.325, 0.185, 4.2, 12]} />{blue}</mesh>
      {/* Wings */}
      <mesh position={[-0.1, 0, 0]} rotation={[0.05, 0, 0]}><boxGeometry args={[1.4, 0.07, 4.2]} />{white}</mesh>
      {/* Tail vertical */}
      <mesh position={[-1.85, 0.55, 0]} rotation={[0, 0, 0.12]}><boxGeometry args={[0.7, 0.6, 0.05]} />{white}</mesh>
      {/* Tail horizontal */}
      <mesh position={[-1.9, 0.12, 0]}><boxGeometry args={[0.65, 0.05, 1.6]} />{white}</mesh>
      {/* Engines */}
      {[[0.4, -0.3, 1.2],[0.4, -0.3, -1.2],[-0.4, -0.3, 1.8],[-0.4, -0.3, -1.8]].map((ep, i) => (
        <group key={i} position={ep}>
          <mesh><cylinderGeometry args={[0.15, 0.12, 0.55, 10]} />{gray}</mesh>
          <group ref={[eng1,eng2,eng3,eng4][i]}>
            <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.13, 0.13, 0.04, 6]} />{chrome}</mesh>
          </group>
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.15, 0.025, 5, 12]} />{chrome}</mesh>
        </group>
      ))}
      {/* Windows row */}
      {[-0.8,-0.4,0,0.4,0.8,1.2,1.6].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.33]}><boxGeometry args={[0.16, 0.12, 0.02]} /><meshStandardMaterial color="#BFDBFE" transparent opacity={0.7} /></mesh>
      ))}
    </group>
  )
}
