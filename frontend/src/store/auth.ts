import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from '@/lib/api'

/* ── Cookie yordamchilari (middleware uchun) ─────────────────────────────── */
const COOKIE = 'fizika-access'
const COOKIE_MAX = 24 * 3600  // 24 soat (access token bilan teng)

function setCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE}=1; path=/; max-age=${COOKIE_MAX}; SameSite=Lax`
}

function clearCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

/* ── Tiplar ──────────────────────────────────────────────────────────────── */
interface AuthState {
  user:         User | null
  accessToken:  string | null
  refreshToken: string | null
  loading:      boolean
  initialized:  boolean

  login:    (username: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout:   () => Promise<void>
  fetchMe:  () => Promise<void>
  setTokens:(access: string, refresh: string, user: User) => void
}

export interface RegisterData {
  username:   string
  email:      string
  first_name: string
  last_name:  string
  phone:      string
  password:   string
  password2:  string
}

/* ── Store ───────────────────────────────────────────────────────────────── */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      loading:      false,
      initialized:  false,

      setTokens: (access, refresh, user) => {
        setCookie()
        set({ accessToken: access, refreshToken: refresh, user })
      },

      login: async (username, password) => {
        set({ loading: true })
        try {
          const { data } = await authApi.login(username, password)
          setCookie()
          set({
            accessToken:  data.access,
            refreshToken: data.refresh,
            user:         data.user,
            loading:      false,
            initialized:  true,
          })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      register: async (formData) => {
        set({ loading: true })
        try {
          const { data } = await authApi.register(formData)
          setCookie()
          set({
            accessToken:  data.access,
            refreshToken: data.refresh,
            user:         data.user,
            loading:      false,
            initialized:  true,
          })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: async () => {
        const refresh = get().refreshToken
        if (refresh) {
          try { await authApi.logout(refresh) } catch { /* ignore */ }
        }
        clearCookie()
        set({ user: null, accessToken: null, refreshToken: null, initialized: false })
      },

      fetchMe: async () => {
        if (!get().accessToken) {
          clearCookie()
          set({ initialized: true })
          return
        }
        try {
          const { data } = await authApi.me()
          set({ user: data, initialized: true })
        } catch {
          clearCookie()
          set({ user: null, accessToken: null, refreshToken: null, initialized: true })
        }
      },
    }),
    {
      name: 'fizika-auth',
      storage: createJSONStorage(() => {
        try {
          if (typeof window === 'undefined') return sessionStorage
          return localStorage.getItem('fizika-auth-remember') === '1'
            ? localStorage
            : sessionStorage
        } catch {
          return sessionStorage
        }
      }),
      partialize: (s) => ({
        accessToken:  s.accessToken,
        refreshToken: s.refreshToken,
        user:         s.user,
      }),
    },
  ),
)
