'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function GridScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <gridHelper args={[24, 24, 'rgba(99,179,237,0.18)', 'rgba(99,179,237,0.06)']} />
      <OrbitControls enablePan={true} enableDamping={true} dampingFactor={0.06} zoomSpeed={2.0} rotateSpeed={0.75} panSpeed={0.9} minDistance={0.5} maxDistance={100} />
    </>
  )
}

export default function EmptyScene() {
  return (
    <div style={{ position: 'relative', height: 420, background: '#060d1f' }}>
      <Canvas
        camera={{ position: [0, 8, 18], fov: 50 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', background: '#060d1f' }}
      >
        <GridScene />
      </Canvas>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          textAlign: 'center',
          background: 'rgba(5,5,16,0.70)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          borderRadius: 20,
          padding: '28px 48px',
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚗️</div>
          <p style={{ color: '#6b7280', fontWeight: 700, fontSize: 16, margin: 0 }}>
            Simulatsiya tanlanmagan
          </p>
          <p style={{ color: '#374151', fontSize: 13, margin: '8px 0 0' }}>
            Pastdagi ro&apos;yxatdan fizik hodisani tanlang
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center' }}>
            {['⚙️', '⚡', '🌊', '🔥', '⚛️'].map((icon, i) => (
              <span key={i} style={{ fontSize: 20, opacity: 0.22 }}>{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
