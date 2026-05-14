'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

/**
 * Ilova yuklananda localStorage dagi tokenni tekshiradi
 * va server dan foydalanuvchi ma'lumotini oladi.
 * layout.tsx ga bir marta wraplash yetarli.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return <>{children}</>
}
