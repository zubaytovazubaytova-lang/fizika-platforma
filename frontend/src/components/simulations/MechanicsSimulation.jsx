'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import CreatureSelector, { CREATURES } from './CreatureSelector'
import VehicleSelector,  { VEHICLES  } from './VehicleSelector'
import SimulationControls from './SimulationControls'

const SimulationCanvas3D = dynamic(() => import('./SimulationCanvas3D'), { ssr: false })

export default function MechanicsSimulation() {
  const [selectedItem, setSelectedItem] = useState(VEHICLES[2]) // default: Car
  const [selectedType, setSelectedType] = useState('vehicle')   // 'creature' | 'vehicle'

  const [speed,        setSpeed]        = useState(14)
  const [distance,     setDistance]     = useState(200)
  const [time,         setTime]         = useState(14)
  const [acceleration, setAcceleration] = useState(0)

  const [running,      setRunning]      = useState(false)
  const [elapsed,      setElapsed]      = useState(0)
  const [currentDist,  setCurrentDist]  = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [positionX,    setPositionX]    = useState(-8)

  const animRef  = useRef(null)
  const startRef = useRef(null)
  const pausedAt = useRef(0)

  const reset = useCallback(() => {
    cancelAnimationFrame(animRef.current)
    setRunning(false)
    setElapsed(0)
    setCurrentDist(0)
    setCurrentSpeed(speed)
    setPositionX(-8)
    pausedAt.current = 0
    startRef.current = null
  }, [speed])

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    const v0 = speed
    const a  = acceleration

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts - pausedAt.current * 1000
      const t   = (ts - startRef.current) / 1000
      const s   = v0 * t + 0.5 * a * t * t
      const v   = v0 + a * t
      const xPos = -8 + (s / Math.max(distance, 1)) * 60

      setElapsed(t)
      setCurrentDist(Math.min(s, distance))
      setCurrentSpeed(Math.max(0, v))
      setPositionX(xPos)

      if (s < distance && t < (time || 9999)) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setRunning(false)
      }
    }
    animRef.current = requestAnimationFrame(animate)
  }, [running, speed, acceleration, distance, time])

  const pause = useCallback(() => {
    if (!running) return
    cancelAnimationFrame(animRef.current)
    pausedAt.current = elapsed
    setRunning(false)
    startRef.current = null
  }, [running, elapsed])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  const handleSelectCreature = (c) => { setSelectedItem(c); setSelectedType('creature'); reset() }
  const handleSelectVehicle  = (v) => { setSelectedItem(v); setSelectedType('vehicle');  reset() }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 130px)', minHeight:600 }}>
      {/* Main area */}
      <div style={{ flex:1, display:'flex', gap:10, padding:'10px 12px', overflow:'hidden', minHeight:0 }}>
        {/* Left: Creatures */}
        <div style={{ overflowY:'auto', paddingRight:4 }}>
          <CreatureSelector
            selected={selectedType === 'creature' ? selectedItem?.id : null}
            onSelect={handleSelectCreature}
          />
        </div>

        {/* Center: Canvas */}
        <div style={{ flex:1, borderRadius:16, overflow:'hidden', border:'1px solid rgba(124,58,237,0.2)', background:'transparent', minWidth:0 }}>
          <SimulationCanvas3D
            selectedItem={selectedItem}
            moving={running}
            positionX={positionX}
            speed={selectedItem?.speed ?? speed}
          />
        </div>

        {/* Right: Vehicles */}
        <div style={{ overflowY:'auto', paddingLeft:4 }}>
          <VehicleSelector
            selected={selectedType === 'vehicle' ? selectedItem?.id : null}
            onSelect={handleSelectVehicle}
          />
        </div>
      </div>

      {/* Bottom controls */}
      <SimulationControls
        speed={speed}         setSpeed={setSpeed}
        distance={distance}   setDistance={setDistance}
        time={time}           setTime={setTime}
        acceleration={acceleration} setAcceleration={setAcceleration}
        running={running}
        onStart={start}
        onPause={pause}
        onReset={reset}
        elapsed={elapsed}
        currentDist={currentDist}
        currentSpeed={currentSpeed}
      />
    </div>
  )
}
