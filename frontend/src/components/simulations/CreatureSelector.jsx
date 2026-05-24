'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import Ant    from './models/creatures/Ant'
import Snail  from './models/creatures/Snail'
import Rabbit from './models/creatures/Rabbit'
import Wolf   from './models/creatures/Wolf'
import Human  from './models/creatures/Human'

const CREATURES = [
  { id:'ant',    name:'Chumoli', emoji:'🐜', Component: Ant,    camPos:[0,0.5,2],   speed:18 },
  { id:'snail',  name:'Shilliqurt', emoji:'🐌', Component: Snail,  camPos:[0,0.5,2],   speed:0.03 },
  { id:'rabbit', name:'Quyon',   emoji:'🐰', Component: Rabbit, camPos:[0,1,2.5],   speed:5 },
  { id:'wolf',   name:"Bo'ri",   emoji:'🐺', Component: Wolf,   camPos:[0,1,3],     speed:14 },
  { id:'human',  name:'Odam',    emoji:'🚶', Component: Human,  camPos:[0,1,2.5],   speed:5 },
]

function MiniPreview({ Component, camPos }) {
  return (
    <Canvas camera={{ position: camPos, fov: 50 }} style={{ width: '100%', height: 60 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2,3,2]} intensity={1.2} />
      <Suspense fallback={null}>
        <Component position={[0,0,0]} moving={false} />
      </Suspense>
    </Canvas>
  )
}

export default function CreatureSelector({ selected, onSelect }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, width:115, flexShrink:0 }}>
      <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2, textAlign:'center' }}>
        Jonli narsalar
      </div>
      {CREATURES.map((c) => {
        const active = selected === c.id
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              height:80, borderRadius:12, padding:'6px 4px', cursor:'pointer',
              background: active ? 'rgba(124,58,237,0.28)' : 'rgba(8,15,40,0.65)',
              border: `${active ? 2 : 1}px solid ${active ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: active ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
              transition:'all 0.2s ease',
              display:'flex', flexDirection:'column', alignItems:'center', overflow:'hidden',
              transform: active ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor='rgba(124,58,237,0.5)'; e.currentTarget.style.transform='scale(1.05)' }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='scale(1)' }}}
          >
            <div style={{ flex:1, width:'100%', overflow:'hidden' }}>
              <MiniPreview Component={c.Component} camPos={c.camPos} />
            </div>
            <div style={{ fontSize:10, fontWeight:700, color: active ? '#c4b5fd' : 'rgba(255,255,255,0.75)', marginTop:2 }}>
              {c.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export { CREATURES }
