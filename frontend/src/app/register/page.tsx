'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Atom, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { AxiosError } from 'axios'

interface FormData {
  first_name: string
  last_name:  string
  username:   string
  email:      string
  password:   string
  password2:  string
}

interface FieldErrors {
  [key: string]: string[]
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Kamida 8 belgi', ok: password.length >= 8 },
    { label: 'Raqam bor',      ok: /\d/.test(password) },
    { label: 'Harf bor',       ok: /[a-zA-Z]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs">
          {ok
            ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
            : <XCircle      className="h-3.5 w-3.5 text-gray-600" />}
          <span className={ok ? 'text-green-400' : 'text-gray-500'}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const router   = useRouter()
  const register = useAuthStore((s) => s.register)
  const loading  = useAuthStore((s) => s.loading)

  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', username: '',
    email: '', password: '', password2: '',
  })
  const [showPass, setShowPass]   = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((fe) => { const copy = { ...fe }; delete copy[name]; return copy })
    setGlobalError(null)
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()

    // Client-side validatsiya
    const errs: FieldErrors = {}
    if (!form.first_name.trim()) errs.first_name = ['Ism kiritilmagan.']
    if (!form.last_name.trim())  errs.last_name  = ['Familiya kiritilmagan.']
    if (!form.username.trim())   errs.username   = ['Foydalanuvchi nomi kiritilmagan.']
    if (!form.email.trim())      errs.email      = ['Email kiritilmagan.']
    if (form.password.length < 8) errs.password  = ['Parol kamida 8 belgi bo\'lishi kerak.']
    if (form.password !== form.password2) errs.password2 = ['Parollar mos kelmadi.']

    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    try {
      await register(form)
      router.push('/courses')
    } catch (err) {
      const ax = err as AxiosError<FieldErrors | { detail: string }>
      if (ax.response?.data) {
        const data = ax.response.data
        if ('detail' in data) {
          setGlobalError(String(data.detail))
        } else {
          // Serverdan keladigan maydon xatoliklari
          setFieldErrors(data as FieldErrors)
        }
      } else {
        setGlobalError("Server bilan bog'lanishda xatolik.")
      }
    }
  }

  const field = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    opts?: { type?: string; autoComplete?: string }
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
      <input
        name={name}
        type={opts?.type ?? 'text'}
        value={form[name]}
        onChange={handleChange}
        autoComplete={opts?.autoComplete}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
          fieldErrors[name]
            ? 'border-red-600 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
        }`}
      />
      {fieldErrors[name] && (
        <p className="mt-1 text-xs text-red-400">{fieldErrors[name][0]}</p>
      )}
    </div>
  )

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-blue-600/20 p-3">
              <Atom className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Ro&apos;yxatdan o&apos;tish</h1>
          <p className="mt-1 text-sm text-gray-400">Bepul akkaunt oching</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-6"
        >
          {/* Global xato */}
          {globalError && (
            <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {globalError}
            </div>
          )}

          {/* Ism / Familiya */}
          <div className="grid grid-cols-2 gap-3">
            {field('first_name', 'Ism',      'Ali',     { autoComplete: 'given-name' })}
            {field('last_name',  'Familiya', 'Valiyev', { autoComplete: 'family-name' })}
          </div>

          {field('username', 'Foydalanuvchi nomi', 'ali_valiyev', { autoComplete: 'username' })}
          {field('email',    'Email', 'ali@example.com', { type: 'email', autoComplete: 'email' })}

          {/* Parol */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Parol</label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-gray-800 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? 'border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.password[0]}</p>
            )}
            <PasswordStrength password={form.password} />
          </div>

          {/* Parolni tasdiqlash */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Parolni tasdiqlang
            </label>
            <input
              name="password2"
              type={showPass ? 'text' : 'password'}
              value={form.password2}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
                fieldErrors.password2
                  ? 'border-red-600 focus:border-red-500 focus:ring-red-500'
                  : form.password2 && form.password === form.password2
                  ? 'border-green-600 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.password2 && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.password2[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Ro&apos;yxatdan o&apos;tish
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Akkaunt bormi?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  )
}
