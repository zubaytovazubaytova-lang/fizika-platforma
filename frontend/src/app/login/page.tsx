'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AxiosError } from 'axios'

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            width:  `${1 + Math.random() * 1.5}px`,
            height: `${1 + Math.random() * 1.5}px`,
            left:   `${Math.random() * 100}%`,
            top:    `${Math.random() * 100}%`,
            opacity: 0.2 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const router  = useRouter()
  const login   = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)

  const [form, setForm]     = useState({ username: '', password: '' })
  const [showPass, setShow] = useState(false)
  const [remember, setRem]  = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const handle = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    try {
      await login(form.username, form.password)
      router.push('/courses')
    } catch (err) {
      const msg = (err as AxiosError<{ detail?: string }>)?.response?.data?.detail
      setError(msg ?? "Login yoki parol noto'g'ri")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0">
        <img
          src="/hero-beruniy.png" alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'brightness(0.35) saturate(0.9)' }}
        />
        <div className="aurora-bg absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[#050510]/60" />
        <Stars />
      </div>

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md slide-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl"
            style={{ boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}>
            ⚛️
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-white">Fizika <span className="text-cyan-400">AI</span></span>
            <p className="text-sm text-gray-400 mt-1">O&apos;zbekiston yetakchi fizika platformasi</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 25px 60px rgba(0,0,0,0.5)' }}>
          <h2 className="text-2xl font-black text-white mb-1">Kirish</h2>
          <p className="text-sm text-gray-400 mb-6">Hisobingizga kirish</p>

          <form onSubmit={handle} className="space-y-4">
            {/* Email/username */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Email yoki telefon</label>
              <input
                type="text" value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="login@mail.com"
                className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Parol</label>
                <Link href="/" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Parolni unutdingizmi?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 neon-input transition-all"
                />
                <button type="button" onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setRem((v) => !v)}
                className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${remember ? 'border-cyan-400 bg-cyan-400' : 'border-gray-600'}`}
              >
                {remember && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-gray-400">Meni eslab qol</span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-900/20 border border-red-800/50 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="relative w-full overflow-hidden rounded-xl py-3 font-bold text-white transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                boxShadow: '0 0 25px rgba(0,212,255,0.35)',
              }}>
              <span className="shimmer absolute inset-0" />
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Kirish'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">yoki</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Social */}
          <div className="flex justify-center gap-3">
            {[{ l: 'G', c: '#4285F4' }, { l: '✈', c: '#2AABEE' }, { l: '🍎', c: '#fff' }].map((s) => (
              <button key={s.l}
                className="h-11 w-11 glass rounded-xl border border-gray-700 flex items-center justify-center text-sm font-bold hover:border-gray-500 transition-colors"
                style={{ color: s.c }}>
                {s.l}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Hisobingiz yo&apos;qmi?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
