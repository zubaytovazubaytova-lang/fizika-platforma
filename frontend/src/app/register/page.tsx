'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'

function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const nextPath     = searchParams.get('next') || '/dashboard'
  const register     = useAuthStore((s) => s.register)
  const loading  = useAuthStore((s) => s.loading)

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [showP,     setShowP]     = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const handle = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    if (password !== password2) { setError("Parollar mos kelmadi"); return }
    if (password.length < 8)    { setError("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    try {
      await register({ email, password, password2, username: '', first_name: firstName, last_name: lastName, phone: '' })
      router.push(nextPath)
    } catch (err) {
      const d = (err as AxiosError<Record<string, string | string[]>>)?.response?.data
      const first = d ? Object.values(d)[0] : null
      const msg = Array.isArray(first) ? first[0] : (typeof first === 'string' ? first : null)
      setError(msg ?? "Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    }
  }

  const inputStyle = {
    width: '100%', borderRadius: 12, border: '2px solid rgba(255,255,255,0.25)',
    padding: '10px 16px', fontSize: 14, fontWeight: 500, color: 'white',
    background: 'rgba(255,255,255,0.08)', outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
              ⚛️
            </div>
            <span className="text-2xl font-black" style={{ color: "white" }}>
              Fizika <span style={{ color: "#a855f7" }}>AI</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold" style={{ color: "white", textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>Hisob yarating</h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Platformaga qo&apos;shiling va o&apos;rganishni boshlang</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(5, 13, 26, 0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 32, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Ism va Familiya */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>Ism</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ism"
                  required
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>Familiya</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Familiya"
                  required
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>Parol</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showP ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 8 ta belgi"
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                />
                <button type="button" onClick={() => setShowP(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                  {showP ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8 }}>Parolni tasdiqlang</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, borderColor: password2 && password !== password2 ? '#ef4444' : 'rgba(255,255,255,0.25)' }}
                onFocus={e => { if (!(password2 && password !== password2)) e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)' }}
                onBlur={e => { e.currentTarget.style.borderColor = password2 && password !== password2 ? '#ef4444' : 'rgba(255,255,255,0.25)' }}
              />
              {password2 && password !== password2 && (
                <p style={{ marginTop: 4, fontSize: 12, color: '#fca5a5' }}>Parollar mos kelmadi</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', fontSize: 14, color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', borderRadius: 12, padding: '12px 0', fontSize: 15, fontWeight: 700, color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? <Loader2 style={{ width: 18, height: 18, margin: '0 auto', animation: 'spin 1s linear infinite' }} /> : "Ro'yxatdan o'tish"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Hisobingiz bormi?{' '}
          <Link href="/login" className="font-semibold" style={{ color: "#a855f7" }}>
            Kirish
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
