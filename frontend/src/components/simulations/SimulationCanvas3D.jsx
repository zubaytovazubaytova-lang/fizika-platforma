'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Suspense } from 'react'

function CameraFollower({ targetX }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (targetX - camera.position.x + 0) * 0.05
    camera.lookAt(targetX, 0, 0)
  })
  return null
}

function MovingObject({ Component, moving, posX, speed }) {
  return (
    <Suspense fallback={null}>
      <Component position={[posX, 0, 0]} moving={moving} speed={speed} />
    </Suspense>
  )
}

function RoadMarkings() {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[-40 + i * 4, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.18]} />
          <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
      ))}
    </>
  )
}

export default function SimulationCanvas3D({ selectedItem, moving, positionX, speed }) {
  const Component = selectedItem?.Component

  return (
    <Canvas
      camera={{ position: [0, 2.5, 10], fov: 58 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      shadows
      dpr={[1, 2]}
    >
      <color attach="background" args={['transparent']} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 10, 5]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-10, 5, -5]} intensity={0.9} color="#4F46E5" />
      <pointLight position={[10, 0, 5]} intensity={0.5} color="#7C3AED" />

      <Environment preset="night" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 20]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.55} />
      </mesh>

      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <planeGeometry args={[200, 3.5]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.75} />
      </mesh>

      <RoadMarkings />

      {/* Grid */}
      <Grid
        position={[0, -0.5, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={0.4}
        cellColor="#1e2d4a"
        sectionSize={10}
        sectionThickness={0.8}
        sectionColor="#2d3f66"
        fadeDistance={60}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Moving model */}
      {Component && (
        <>
          <MovingObject Component={Component} moving={moving} posX={positionX} speed={speed} />

          <CameraFollower targetX={positionX} />
        </>
      )}

      <fog attach="fog" args={['#050d1a', 25, 70]} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={30} />
    </Canvas>
  )
}
