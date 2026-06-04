import { useState } from 'react'
import { motion } from 'framer-motion'
import AtomSVG from './AtomSVG'

export default function RegisterModal({ onClose, onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', pass: '', pass2: '' })
  const [showP, setShowP]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (form.pass !== form.pass2) { setError("Parollar mos kelmadi"); return }
    if (form.pass.length < 8)     { setError("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.name.split(' ')[0] || form.name,
          last_name:  form.name.split(' ')[1] || '',
          email: form.email,
          password: form.pass,
          password2: form.pass2,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        const msg = Object.values(d)[0]
        setError(Array.isArray(msg) ? msg[0] : msg || 'Xatolik yuz berdi')
        return
      }
      onClose()
    } catch {
      setError("Server bilan bog'lanib bo'lmadi.")
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name',  icon: '👤', placeholder: 'Ism Familiya', type: 'text'     },
    { key: 'email', icon: '✉️', placeholder: 'Email',        type: 'email'    },
    { key: 'pass',  icon: '🔒', placeholder: 'Parol (kamida 8 ta belgi)', type: showP ? 'text' : 'password', hasToggle: true },
    { key: 'pass2', icon: '🔒', placeholder: 'Parolni tasdiqlang', type: 'password', mismatch: form.pass2 && form.pass !== form.pass2 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 400,
          background: 'rgba(5,13,26,0.78)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: 32,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <AtomSVG size={64} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>Hisob yarating</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Platformaga qo&apos;shiling</p>
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map(f => (
            <div key={f.key} style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>{f.icon}</span>
              <input
                className="fi-input"
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={set(f.key)}
                required
                style={{
                  borderColor: f.mismatch ? 'rgba(239,68,68,0.5)' : undefined,
                  paddingRight: f.hasToggle ? 44 : undefined,
                }}
              />
              {f.hasToggle && (
                <button type="button" onClick={() => setShowP(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
                  {showP ? '🙈' : '👁️'}
                </button>
              )}
            </div>
          ))}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '9px 14px', fontSize: 13, color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "⏳ Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Hisobingiz bormi?{' '}
          <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#a855f7', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            Kirish
          </button>
        </div>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: 'none',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </motion.div>
    </motion.div>
  )
}
