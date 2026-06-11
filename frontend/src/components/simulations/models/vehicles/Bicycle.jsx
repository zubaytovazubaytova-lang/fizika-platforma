import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

// GLB vertex analysis dan olingan har bir mesh'ning aniq markaz koordinatalari.
// G'ildirak va pidal bu markazlar atrofida aylanishi kerak (node origin emas).
const WF_HUB = [-0.6581,  0.4000,  0.0063]  // WheelFront markazi
const WR_HUB = [ 0.6577,  0.4000,  0.0063]  // WheelRear markazi
const CR_HUB = [ 0.2042,  0.4153, -0.0167]  // Crank (pedal o'qi) markazi

export default function Bicycle({ position = [0, 0, 0], moving = false, speed = 1 }) {
  const gltf  = useGLTF('/models/bicycle.glb')
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  const frame  = useMemo(() => model.getObjectByName('BikeFrame'),  [model])
  const crank  = useMemo(() => model.getObjectByName('Pedals'),     [model])
  const wFront = useMemo(() => model.getObjectByName('WheelFront'), [model])
  const wRear  = useMemo(() => model.getObjectByName('WheelRear'),  [model])

  // Pivot gruplar — har biri tegishli mesh markazi bo'yicha joylashtirilgan
  const pivotF = useRef()
  const pivotR = useRef()
  const pivotP = useRef()

  useFrame(() => {
    if (!moving) return
    const delta = speed * 0.12
    // G'ildiraklar va pidal Z o'qi atrofida aylanadi (ular X-Y tekisligida yotadi)
    if (pivotF.current) pivotF.current.rotation.z += delta
    if (pivotR.current) pivotR.current.rotation.z += delta
    if (pivotP.current) pivotP.current.rotation.z += delta
  })

  return (
    <group position={[position[0], position[1] - 0.5, position[2]]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Rama — o'z joyida, animatsiyasiz */}
      {frame && <primitive object={frame} />}

      {/* Old g'ildirak: pivot WF_HUB da, mesh negative offset bilan markazlashtirilgan */}
      {wFront && (
        <group ref={pivotF} position={WF_HUB}>
          <primitive
            object={wFront}
            position={[-WF_HUB[0], -WF_HUB[1], -WF_HUB[2]]}
          />
        </group>
      )}

      {/* Orqa g'ildirak: pivot WR_HUB da */}
      {wRear && (
        <group ref={pivotR} position={WR_HUB}>
          <primitive
            object={wRear}
            position={[-WR_HUB[0], -WR_HUB[1], -WR_HUB[2]]}
          />
        </group>
      )}

      {/* Pidal: pivot CR_HUB da (kranк o'qi) */}
      {crank && (
        <group ref={pivotP} position={CR_HUB}>
          <primitive
            object={crank}
            position={[-CR_HUB[0], -CR_HUB[1], -CR_HUB[2]]}
          />
        </group>
      )}
    </group>
  )
}

useGLTF.preload('/models/bicycle.glb')
