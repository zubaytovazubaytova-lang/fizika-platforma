'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { BookOpen, TestTube2, Bot, Atom, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth'

const navLinks = [
  { href: '/courses',     label: 'Kurslar',        icon: BookOpen  },
  { href: '/tests',       label: 'Testlar',         icon: TestTube2 },
  { href: '/simulations', label: '3D Simulatsiya',  icon: Atom      },
  { href: '/ai-tutor',    label: 'AI Tutor',        icon: Bot       },
]

function UserMenu() {
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)
  const logout  = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Tashqariga bosilganda yopish
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Kirish
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          Ro&apos;yxatdan o&apos;tish
        </Link>
      </div>
    )
  }

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm hover:border-gray-500 transition-colors"
      >
        {/* Avatar */}
        {user.avatar ? (
          <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold">
            {initials}
          </span>
        )}
        <span className="max-w-[120px] truncate font-medium text-white">
          {user.first_name || user.username}
        </span>
        <ChevronDown className={clsx('h-3.5 w-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-700 bg-gray-900 py-1 shadow-xl shadow-black/50">
          {/* Foydalanuvchi info */}
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="font-medium text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300">
              {user.role === 'teacher' ? "O'qituvchi" : user.role === 'admin' ? 'Admin' : 'Talaba'}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <User className="h-4 w-4" /> Profilim
            </Link>
            <Link
              href="/profile/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Settings className="h-4 w-4" /> Sozlamalar
            </Link>
          </div>

          <div className="border-t border-gray-800 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" /> Chiqish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-400">
          <Atom className="h-6 w-6" />
          Fizika
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <UserMenu />
      </div>
    </nav>
  )
}
