import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

/**
 * Himoyalangan sahifa uchun hook.
 * Foydalanuvchi login qilmagan bo'lsa /login ga yo'naltiradi.
 *
 * Ishlatish:
 *   const { user, loading } = useRequireAuth()
 */
export function useRequireAuth() {
  const router      = useRouter()
  const user        = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)
  const loading     = useAuthStore((s) => s.loading)

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login')
    }
  }, [initialized, user, router])

  return { user, loading: !initialized || loading }
}
