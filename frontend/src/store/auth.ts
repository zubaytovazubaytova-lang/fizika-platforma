import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from '@/lib/api'

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
  password:   string
  password2:  string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      loading:      false,
      initialized:  false,

      setTokens: (access, refresh, user) => {
        set({ accessToken: access, refreshToken: refresh, user })
      },

      login: async (username, password) => {
        set({ loading: true })
        try {
          const { data } = await authApi.login(username, password)
          set({
            accessToken:  data.access,
            refreshToken: data.refresh,
            user:         data.user,
            loading:      false,
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
          set({
            accessToken:  data.access,
            refreshToken: data.refresh,
            user:         data.user,
            loading:      false,
          })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      logout: async () => {
        const refresh = get().refreshToken
        if (refresh) {
          try { await authApi.logout(refresh) } catch { /* server error'ni e'tiborsiz qoldiramiz */ }
        }
        set({ user: null, accessToken: null, refreshToken: null })
      },

      fetchMe: async () => {
        if (!get().accessToken) {
          set({ initialized: true })
          return
        }
        try {
          const { data } = await authApi.me()
          set({ user: data, initialized: true })
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, initialized: true })
        }
      },
    }),
    {
      name:    'fizika-auth',
      storage: createJSONStorage(() => localStorage),
      // Faqat tokenlarni saqlash — user fetchMe da yangilanadi
      partialize: (s) => ({
        accessToken:  s.accessToken,
        refreshToken: s.refreshToken,
        user:         s.user,
      }),
    }
  )
)
