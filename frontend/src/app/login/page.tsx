'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Eye, EyeOff, Loader2, AlertCircle, UserX } from 'lucide-react'
import { AxiosError } from 'axios'

/* ── Foydalanuvchi topilmadi — modal ─────────────────────────────────────── */
function NotFoundModal({
  email, onClose, onRegister,
}: { email: string; onClose: () => void; onRegister: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 360, borderRadius: 20, background: 'rgba(20,10,40,0.95)', border: '1px solid rgba(124,58,237,0.3)', padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', margin: '0 auto 16px' }}>
          <UserX style={{ width: 28, height: 28, color: '#f59e0b' }} />
        </div>
        <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>Hisob topilmadi</h2>
        <p style={{ marginTop: 8, textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{email}</span> email
          manzili bilan ro&apos;yxatdan o&apos;tilmagan.<br />Yangi hisob yaratmoqchimisiz?
        </p>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={onRegister} style={{ width: '100%', borderRadius: 12, padding: '10px 0', fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            Ro&apos;yxatdan o&apos;tish
          </button>
          <button onClick={onClose} style={{ width: '100%', borderRadius: 12, padding: '10px 0', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }}>
            Boshqa email kiritish
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Login sahifasi ───────────────────────────────────────────────────────── */
function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const nextPath     = searchParams.get('next') || '/dashboard'
  const login        = useAuthStore((s) => s.login)
  const loading      = useAuthStore((s) => s.loading)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showP,    setShowP]    = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    setRemember(localStorage.getItem('remember_me') === 'true')
    setEmail(localStorage.getItem('saved_email') ?? '')
    setPassword(localStorage.getItem('saved_password') ?? '')
  }, [])
  const [error,      setError]      = useState<string | null>(null)
  const [notFound,   setNotFound]   = useState<string | null>(null)

  const handle = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null); setNotFound(null)
    try {
      await login(email, password)
      if (remember) {
        localStorage.setItem('saved_email',    email)
        localStorage.setItem('saved_password', password)
        localStorage.setItem('remember_me',    'true')
      } else {
        localStorage.removeItem('saved_email')
        localStorage.removeItem('saved_password')
        localStorage.setItem('remember_me', 'false')
      }
      router.replace(nextPath)
    } catch (raw) {
      const axErr  = raw as AxiosError<{ error?: string; detail?: { error?: string } }>
      const status = axErr?.response?.status
      const data   = axErr?.response?.data
      const code   = data?.error ?? (data?.detail as { error?: string })?.error
      if (status === 404 && code === 'user_not_found') {
        setNotFound(email)
      } else if (status === 401 && code === 'wrong_password') {
        setError("Parol noto'g'ri. Yana urinib ko'ring.")
      } else if (status === 401 || status === 400) {
        setError("Email yoki parol noto'g'ri.")
      } else if (!axErr?.response) {
        setError("Server bilan bog'lanib bo'lmadi.")
      } else {
        setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring.')
      }
    }
  }

  return (
    <>
      {/* ── CSS override — barcha global stillardan ustun ── */}
      <style>{`
        .lbg-wrap {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          right: 0 !important; bottom: 0 !important;
          z-index: 100 !important;
        }
        .lbg-img {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          width: 100% !important; height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
        }
        .lbg-overlay {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          right: 0 !important; bottom: 0 !important;
          background: rgba(0,10,30,0.60) !important;
          z-index: 1 !important;
        }
        .lbg-content {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          right: 0 !important; bottom: 0 !important;
          z-index: 2 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 16px !important;
        }
      `}</style>

      {/* ── To'liq ekran fon ── */}
      <div className="lbg-wrap">
        {/* Fon rasmi */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/space-bg.png" alt="" className="lbg-img" />

        {/* Overlay */}
        <div className="lbg-overlay" />

        {/* Kontent */}
        <div className="lbg-content">
          <div style={{ width: '100%', maxWidth: 520 }}>

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{ height: 50, width: 50, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}>⚛️</div>
                <span style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>
                  Fizika <span style={{ color: '#a855f7' }}>AI</span>
                </span>
              </Link>
              <h1 style={{ marginTop: 24, fontSize: 32, fontWeight: 800, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>Xush kelibsiz</h1>
              <p style={{
                marginTop: 10, display: 'inline-block',
                fontSize: 15, fontWeight: 700, color: '#000000',
                background: 'rgba(186,230,255,0.45)',
                border: '1px solid rgba(147,210,255,0.3)',
                borderRadius: 8, padding: '5px 20px',
                backdropFilter: 'blur(6px)',
                letterSpacing: '0.01em',
              }}>Hisobingizga kiring</p>
            </div>

            {/* Card */}
            <div style={{ background: 'rgba(5, 13, 26, 0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8, letterSpacing: '0.02em' }}>Email</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    placeholder="example@mail.com"
                    required autoFocus
                    style={{ width: '100%', borderRadius: 14, border: '2px solid rgba(255,255,255,0.35)', padding: '14px 18px', fontSize: 15, fontWeight: 500, color: 'white', background: 'rgba(255,255,255,0.08)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
                  />
                </div>

                {/* Parol */}
                <div>
                  <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 8, letterSpacing: '0.02em' }}>Parol</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showP ? 'text' : 'password'} value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null) }}
                      placeholder="••••••••" required
                      style={{ width: '100%', borderRadius: 14, border: '2px solid rgba(255,255,255,0.35)', padding: '14px 48px 14px 18px', fontSize: 15, fontWeight: 500, color: 'white', background: 'rgba(255,255,255,0.08)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.9)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
                    />
                    <button type="button" onClick={() => setShowP(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                      {showP ? <EyeOff style={{ width: 20, height: 20 }} /> : <Eye style={{ width: 20, height: 20 }} />}
                    </button>
                  </div>
                </div>

                {/* Xato */}
                {error && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 16px', fontSize: 14, color: '#fca5a5' }}>
                    <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Kirish */}
                <button type="submit" disabled={loading}
                  style={{ width: '100%', borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 700, color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', opacity: loading ? 0.6 : 1, marginTop: 20 }}>
                  {loading ? <Loader2 style={{ width: 20, height: 20, margin: '0 auto', animation: 'spin 1s linear infinite' }} /> : 'Kirish'}
                </button>

                {/* Eslab qolish */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', justifyContent: 'center' }}>
                  <div
                    onClick={() => setRemember(v => !v)}
                    style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${remember ? '#a855f7' : 'rgba(255,255,255,0.3)'}`,
                      background: remember ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', cursor: 'pointer',
                    }}
                  >
                    {remember && (
                      <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => setRemember(v => !v)}
                    style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}
                  >
                    Login va parolni saqlab qolish
                  </span>
                </label>
              </form>
            </div>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: '#000000',
                background: 'rgba(186,230,255,0.45)',
                border: '1px solid rgba(147,210,255,0.3)',
                borderRadius: 8, padding: '4px 14px',
                backdropFilter: 'blur(6px)',
              }}>
                Hisobingiz yo&apos;qmi?
              </span>
              <Link
                href="/register"
                style={{
                  fontSize: 14, fontWeight: 700, color: '#c084fc', textDecoration: 'none',
                  border: '2px solid rgba(168,85,247,0.7)',
                  borderRadius: 8, padding: '4px 14px',
                  background: 'rgba(168,85,247,0.12)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 0 12px rgba(168,85,247,0.25)',
                  transition: 'all 0.2s',
                }}
              >
                Ro&apos;yxatdan o&apos;ting
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {notFound && (
        <NotFoundModal
          email={notFound}
          onClose={() => setNotFound(null)}
          onRegister={() => router.push(`/register?email=${encodeURIComponent(notFound ?? '')}`)}
        />
      )}
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
