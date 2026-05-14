'use client'
import dynamic from 'next/dynamic'

const SolarSystemBg  = dynamic(() => import('./SolarSystemBg'),  { ssr: false })
const PageTransition = dynamic(() => import('./PageTransition'), { ssr: false })

export default function ClientEffects() {
  return (
    <>
      <SolarSystemBg />
      <PageTransition />
    </>
  )
}
