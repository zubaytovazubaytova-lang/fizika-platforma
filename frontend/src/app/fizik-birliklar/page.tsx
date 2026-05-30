'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FizikBirliklarRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/fizik-kattaliklar') }, [router])
  return null
}
