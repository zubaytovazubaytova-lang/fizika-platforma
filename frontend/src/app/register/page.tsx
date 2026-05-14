'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import type { RegisterData } from '@/store/auth'
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

export default function RegisterPage() {
  const router   = useRouter()
  const register = useAuthStore((s) => s.register)
  const loading  = useAuthStore((s) => s.loading)

  const [form, setForm] = useState<RegisterData>({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: '',
  })
  const [phone, setPhone]   = useState('')
  const [showP, setShowP]   = useState(false)
  const [terms, setTerms]   = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const f = (key: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const handle = async (ev: { preventDefault(): void }) => {
    ev.preventDefault()
    if (!terms) { setError('Foydalanish shartlarini qabul qiling'); return }
    if (form.password !== form.password2) { setError('Parollar mos kelmadi'); return }
    if (form.password.length < 8)         { setError('Parol kamida 8 ta belgi bo\'lishi kerak'); return }
    setError(null)
    try {
      await register(form)
      router.push('/courses')
    } catch (err) {
      const d = (err as AxiosError<Record<string, string[]>>)?.response?.data
      const msg = d ? Object.values(d)[0]?.[0] : null
      setError(msg ?? 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-beruniy.png" alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'brightness(0.30) saturate(0.8)' }}
        />
        <div className="aurora-bg absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-[#050510]/65" />
        <Stars />
      </div>

      <div className="relative z-10 w-full max-w-md slide-up">
        {/* Logo */}
        <div className="mb-7 flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl"
            style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>⚛️</div>
          <div className="text-center">
            <span className="text-2xl font-black text-white">Fizika <span className="text-purple-400">AI</span></span>
            <p className="text-sm text-gray-400 mt-1">Yangi hisob yaratish</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.08), 0 25px 60px rgba(0,0,0,0.5)' }}>
          <h2 className="text-2xl font-black text-white mb-1">Ro&apos;yxatdan o&apos;tish</h2>
          <p className="text-sm text-gray-400 mb-6">Hisob yaratib, o&apos;rganishni boshlang</p>

          <form onSubmit={handle} className="space-y-3.5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">ISM</label>
                <input value={form.first_name} onChange={f('first_name')} placeholder="Ismingiz"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Familiya</label>
                <input value={form.last_name} onChange={f('last_name')} placeholder="Familiyangiz"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={f('email')} placeholder="example@mail.com"
                className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all" />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Foydalanuvchi nomi</label>
              <input value={form.username} onChange={f('username')} placeholder="username"
                className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Telefon</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Parol</label>
              <div className="relative">
                <input type={showP ? 'text' : 'password'} value={form.password} onChange={f('password')}
                  placeholder="Kamida 8 ta belgi"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 neon-input transition-all" />
                <button type="button" onClick={() => setShowP((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showP ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-1.5 grid grid-cols-4 gap-1">
                  {[1,2,3,4].map((n) => {
                    const s = [form.password.length>=8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length
                    return <div key={n} className="h-1 rounded-full transition-colors"
                      style={{ background: s>=n ? (s<=1?'#ef4444':s<=2?'#eab308':s<=3?'#3b82f6':'#22c55e') : '#374151' }} />
                  })}
                </div>
              )}
            </div>

            {/* Password confirm */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">Parolni tasdiqlang</label>
              <input type="password" value={form.password2} onChange={f('password2')} placeholder="••••••••"
                className={`w-full rounded-xl border bg-gray-900/60 px-4 py-3 text-sm text-white placeholder-gray-600 neon-input transition-all ${
                  form.password2 && form.password !== form.password2 ? 'border-red-600' : 'border-gray-700'}`} />
              {form.password2 && form.password !== form.password2 && (
                <p className="mt-1 text-xs text-red-400">Parollar mos kelmadi</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div onClick={() => setTerms((v) => !v)}
                className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${terms ? 'border-purple-400 bg-purple-400' : 'border-gray-600'}`}>
                {terms && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className="text-xs text-gray-400">
                Men <Link href="/" className="text-purple-400 hover:underline">foydalanish shartlari</Link> va{' '}
                <Link href="/" className="text-purple-400 hover:underline">maxfiylik siyosati</Link> bilan tanishib chiqdim
              </span>
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
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 25px rgba(139,92,246,0.35)' }}>
              <span className="shimmer absolute inset-0" />
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
