'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Atom, Eye, EyeOff, Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const login  = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)

  const [form, setForm]     = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError("Barcha maydonlarni to'ldiring.")
      return
    }
    try {
      await login(form.username, form.password)
      router.push('/courses')
    } catch (err) {
      const ax = err as AxiosError<{ detail?: string }>
      setError(
        ax.response?.data?.detail === 'No active account found with the given credentials'
          ? "Login yoki parol noto'g'ri."
          : "Xatolik yuz berdi. Qayta urinib ko'ring."
      )
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-blue-600/20 p-3">
              <Atom className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Xush kelibsiz</h1>
          <p className="mt-1 text-sm text-gray-400">
            Akkauntingizga kiring
          </p>
        </div>

        {/* Forma */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-6"
        >
          {/* Xato */}
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Foydalanuvchi nomi
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="username"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Parol */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Parol
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Kirish
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Akkaunt yo&apos;qmi?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </div>
    </div>
  )
}
