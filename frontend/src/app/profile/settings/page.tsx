'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import {
  User, Lock, Save, Eye, EyeOff,
  ChevronLeft, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'
import clsx from 'clsx'

type Tab = 'profile' | 'password'

function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  return (
    <div className={clsx(
      'flex items-center gap-2 rounded-xl px-4 py-3 text-sm',
      type === 'success'
        ? 'bg-green-900/20 text-green-400 border border-green-800/50'
        : 'bg-red-900/20 text-red-400 border border-red-800/50'
    )}>
      {type === 'success'
        ? <CheckCircle2 className="h-4 w-4 shrink-0" />
        : <AlertCircle  className="h-4 w-4 shrink-0" />
      }
      {msg}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useRequireAuth()
  const fetchMe = useAuthStore((s) => s.fetchMe)

  const [tab, setTab] = useState<Tab>('profile')

  // Profile form
  const [form, setForm] = useState({
    first_name: '',
    last_name:  '',
    email:      '',
    bio:        '',
    phone:      '',
  })
  const [saving,    setSaving]    = useState(false)
  const [profileOk, setProfileOk] = useState<string | null>(null)
  const [profileErr,setProfileErr]= useState<string | null>(null)

  // Password form
  const [pwd, setPwd] = useState({
    old_password:  '',
    new_password:  '',
    new_password2: '',
  })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdOk,  setPwdOk]  = useState<string | null>(null)
  const [pwdErr, setPwdErr] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setForm({
      first_name: user.first_name ?? '',
      last_name:  user.last_name  ?? '',
      email:      user.email      ?? '',
      bio:        user.bio        ?? '',
      phone:      user.phone      ?? '',
    })
  }, [user])

  async function handleSaveProfile(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setProfileOk(null)
    setProfileErr(null)
    try {
      await authApi.updateMe(form)
      await fetchMe()
      setProfileOk('Profil muvaffaqiyatli yangilandi!')
    } catch {
      setProfileErr('Xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: { preventDefault(): void }) {
    e.preventDefault()
    setPwdOk(null)
    setPwdErr(null)

    if (pwd.new_password !== pwd.new_password2) {
      setPwdErr('Yangi parollar mos kelmadi!')
      return
    }
    if (pwd.new_password.length < 8) {
      setPwdErr('Yangi parol kamida 8 ta belgi bo\'lishi kerak!')
      return
    }

    setPwdSaving(true)
    try {
      await authApi.changePassword(pwd.old_password, pwd.new_password, pwd.new_password2)
      setPwdOk('Parol muvaffaqiyatli o\'zgartirildi!')
      setPwd({ old_password: '', new_password: '', new_password2: '' })
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data
      const firstMsg = errData
        ? Object.values(errData)[0]?.[0]
        : null
      setPwdErr(firstMsg ?? 'Eski parol noto\'g\'ri yoki xatolik yuz berdi.')
    } finally {
      setPwdSaving(false)
    }
  }

  if (authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  )
  if (!user) return null

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'profile',  label: 'Profil',  icon: User },
    { id: 'password', label: 'Parol',   icon: Lock },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Sozlamalar</h1>
          <p className="text-sm text-gray-400">Profilingizni boshqaring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-800 bg-gray-900 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
              tab === id
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Ism</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="Ismingiz"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Familiya</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="Familiyangiz"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Telefon</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              placeholder="O'zingiz haqingizda qisqacha..."
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {profileOk  && <Alert type="success" msg={profileOk} />}
          {profileErr && <Alert type="error"   msg={profileErr} />}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {saving
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Save    className="h-4 w-4" />
            }
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <form onSubmit={handleChangePassword} className="space-y-5">

          {/* Old password */}
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Joriy parol</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                value={pwd.old_password}
                onChange={(e) => setPwd({ ...pwd, old_password: e.target.value })}
                placeholder="Joriy parolingiz"
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Yangi parol</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={pwd.new_password}
                onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })}
                placeholder="Kamida 8 ta belgi"
                required
                minLength={8}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {pwd.new_password.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((n) => {
                  const strength = [
                    pwd.new_password.length >= 8,
                    /[A-Z]/.test(pwd.new_password),
                    /[0-9]/.test(pwd.new_password),
                    /[^A-Za-z0-9]/.test(pwd.new_password),
                  ].filter(Boolean).length
                  return (
                    <div
                      key={n}
                      className={clsx(
                        'h-1 rounded-full transition-colors',
                        strength >= n
                          ? strength <= 1 ? 'bg-red-500'
                            : strength <= 2 ? 'bg-yellow-500'
                            : strength <= 3 ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-gray-800'
                      )}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Yangi parolni tasdiqlash</label>
            <input
              type="password"
              value={pwd.new_password2}
              onChange={(e) => setPwd({ ...pwd, new_password2: e.target.value })}
              placeholder="Yangi parolni qaytaring"
              required
              className={clsx(
                'w-full rounded-xl border bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none',
                pwd.new_password2 && pwd.new_password !== pwd.new_password2
                  ? 'border-red-600 focus:border-red-500'
                  : 'border-gray-700 focus:border-blue-500'
              )}
            />
            {pwd.new_password2 && pwd.new_password !== pwd.new_password2 && (
              <p className="mt-1 text-xs text-red-400">Parollar mos kelmadi</p>
            )}
          </div>

          {pwdOk  && <Alert type="success" msg={pwdOk} />}
          {pwdErr && <Alert type="error"   msg={pwdErr} />}

          <button
            type="submit"
            disabled={pwdSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {pwdSaving
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Lock    className="h-4 w-4" />
            }
            {pwdSaving ? 'O\'zgartirilmoqda...' : 'Parolni o\'zgartirish'}
          </button>
        </form>
      )}
    </div>
  )
}
