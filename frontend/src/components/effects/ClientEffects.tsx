'use client'
import dynamic from 'next/dynamic'
import ContentGuard from '@/components/protection/ContentGuard'

const PageTransition = dynamic(() => import('./PageTransition'), { ssr: false })

export default function ClientEffects() {
  return (
    <>
      <PageTransition />
      <ContentGuard />
    </>
  )
}
