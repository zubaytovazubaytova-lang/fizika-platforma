'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Bicycle      from './models/vehicles/Bicycle'
import Motorcycle   from './models/vehicles/Motorcycle'
import Car          from './models/vehicles/Car'
import Truck        from './models/vehicles/Truck'
import Ship         from './models/vehicles/Ship'
import Airplane     from './models/vehicles/Airplane'
import Helicopter   from './models/vehicles/Helicopter'
import HotAirBalloon from './models/vehicles/HotAirBalloon'

const VEHICLES = [
  { id:'bicycle',    name:'Velosiped',  emoji:'🚲', Component: Bicycle,       camPos:[0,1,4],   speed:3 },
  { id:'motorcycle', name:'Mototsikl',  emoji:'🏍', Component: Motorcycle,    camPos:[0,1,4],   speed:15 },
  { id:'car',        name:'Avtomobil',  emoji:'🚗', Component: Car,           camPos:[0,1.5,5], speed:14 },
  { id:'truck',      name:'Yuk mashina',emoji:'🚛', Component: Truck,         camPos:[0,1.5,6], speed:11 },
  { id:'ship',       name:'Kema',       emoji:'🚢', Component: Ship,          camPos:[0,2,7],   speed:8 },
  { id:'airplane',   name:'Samolyot',   emoji:'✈️', Component: Airplane,      camPos:[0,1.5,6], speed:250 },
  { id:'helicopter', name:'Vertolyot',  emoji:'🚁', Component: Helicopter,    camPos:[0,1.5,5], speed:55 },
  { id:'balloon',    name:'Havo shari', emoji:'🎈', Component: HotAirBalloon, camPos:[0,2,5],   speed:2 },
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

export default function VehicleSelector({ selected, onSelect }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, width:115, flexShrink:0 }}>
      <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2, textAlign:'center' }}>
        Transport
      </div>
      {VEHICLES.map((v) => {
        const active = selected === v.id
        return (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
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
              <MiniPreview Component={v.Component} camPos={v.camPos} />
            </div>
            <div style={{ fontSize:10, fontWeight:700, color: active ? '#c4b5fd' : 'rgba(255,255,255,0.75)', marginTop:2 }}>
              {v.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export { VEHICLES }
