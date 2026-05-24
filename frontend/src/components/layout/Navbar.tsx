'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { BookOpen, TestTube2, Bot, Atom, User, LogOut, Settings, ChevronDown, Globe, BookMarked, Telescope, ShieldCheck, FlaskConical, Sigma, Ruler, Library } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth'
import EnergyLine from '@/components/effects/EnergyLine'

const navLinks = [
  { href: '/courses',     label: 'Kurslar',    icon: BookOpen   },
  { href: '/darsliklar',  label: 'Darsliklar', icon: BookMarked },
  { href: '/tests',       label: 'Testlar',    icon: TestTube2  },
  { href: '/simulations',  label: '3D',          icon: Atom       },
  { href: '/kashfiyotlar', label: 'Kashfiyot',  icon: Telescope  },
  { href: '/ai-tutor',     label: 'AI Tutor',   icon: Bot        },
]

const LANGS = [
  { code: 'UZ', label: "O'zbek",  flag: '🇺🇿' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
]

/* ── Ma'lumotnoma dropdown ── */
const REF_ITEMS = [
  {
    href: '/formulalar',
    label: 'Formulalar',
    sub: 'Fizika formulalari to\'plami',
    icon: FlaskConical,
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.15)',
  },
  {
    href: '/fizik-kattaliklar',
    label: 'Fizik kattaliklar',
    sub: 'Belgilar va o\'lchov birliklari',
    icon: Sigma,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.15)',
  },
  {
    href: '/fizik-birliklar',
    label: 'Fizik birliklar',
    sub: 'SI va boshqa sistemalar',
    icon: Ruler,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.15)',
  },
]

function RefDropdown() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isActive = REF_ITEMS.some(i => pathname.startsWith(i.href))

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
          isActive || open
            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
            : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
        )}
        style={(isActive || open) ? { boxShadow: '0 0 10px rgba(0,212,255,0.12)' } : {}}
      >
        <Library className="h-4 w-4" />
        Ma&apos;lumotnoma
        <ChevronDown className={clsx('h-3 w-3 text-gray-500 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-gray-700/50 py-2 shadow-2xl"
          style={{
            background: 'rgba(6,6,20,0.96)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.06)',
          }}
        >
          {/* Header */}
          <div className="px-4 pb-2 mb-1 border-b border-white/[0.05]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Fizika ma&apos;lumotnomasi</p>
          </div>

          {REF_ITEMS.map(({ href, label, sub, icon: Icon, color, glow }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 mx-2 rounded-xl px-3 py-2.5 transition-all group"
                style={{
                  background: active ? glow : 'transparent',
                  border: `1px solid ${active ? color + '30' : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = glow }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: color + '15', border: `1px solid ${color}25` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-none">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-none">{sub}</p>
                </div>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: color }} />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Language selector ── */
function LangMenu() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('UZ')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const current = LANGS.find((l) => l.code === lang)!

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all',
          open
            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
            : 'border-gray-700/60 bg-gray-900/50 text-gray-300 hover:border-gray-600 hover:text-white'
        )}
        style={open ? { boxShadow: '0 0 12px rgba(0,212,255,0.15)' } : {}}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.flag} {current.code}</span>
        <ChevronDown className={clsx('h-3 w-3 text-gray-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-2xl border border-gray-700/60 py-1 shadow-2xl"
          style={{
            background: 'rgba(8, 8, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)',
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-all',
                lang === l.code
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              )}
            >
              <span className="text-base">{l.flag}</span>
              <div className="text-left">
                <div className="font-medium leading-none">{l.code}</div>
                <div className="text-xs text-gray-500 mt-0.5">{l.label}</div>
              </div>
              {lang === l.code && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── User menu ── */
function UserMenu() {
  const router = useRouter()
  const user   = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleLogout = async () => { setOpen(false); await logout(); router.push('/') }

  if (!user) return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
        Kirish
      </Link>
      <Link href="/register"
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-cyan-500 hover:to-blue-500"
        style={{ boxShadow: '0 0 16px rgba(0,212,255,0.25)' }}>
        Ro&apos;yxatdan o&apos;tish
      </Link>
    </div>
  )

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-700/60 bg-gray-900/60 px-3 py-1.5 text-sm hover:border-gray-500 transition-all">
        {user.avatar
          ? <Image src={user.avatar} alt="" width={28} height={28} unoptimized className="h-7 w-7 rounded-full object-cover" />
          : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">{initials}</span>
        }
        <span className="max-w-[100px] truncate font-medium text-white">{user.first_name || user.username}</span>
        <ChevronDown className={clsx('h-3.5 w-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-gray-700/50 py-1 shadow-2xl"
          style={{ background: 'rgba(8,8,28,0.90)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}
        >
          <div className="border-b border-gray-800/60 px-4 py-3">
            <p className="font-semibold text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-cyan-900/40 border border-cyan-800/40 px-2 py-0.5 text-xs text-cyan-300">
              {user.role === 'teacher' ? "O'qituvchi" : user.role === 'admin' ? 'Admin' : 'Talaba'}
            </span>
          </div>
          <div className="py-1">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors">
              <User className="h-4 w-4 text-gray-500" /> Profilim
            </Link>
            <Link href="/profile/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/60 hover:text-white transition-colors">
              <Settings className="h-4 w-4 text-gray-500" /> Sozlamalar
            </Link>
            {(user.is_staff || user.role === 'admin') && (
              <Link href="/admin/darsliklar" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 transition-colors">
                <ShieldCheck className="h-4 w-4" /> Admin panel
              </Link>
            )}
          </div>
          <div className="border-t border-gray-800/60 py-1">
            <button onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors">
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

  if (pathname === '/login' || pathname === '/register') return null

  return (
    <nav className="sticky top-0 z-50 bg-[#050510]/85 backdrop-blur-xl border-b border-gray-800/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm"
            style={{ boxShadow: '0 0 14px rgba(0,212,255,0.3)' }}>⚛️</div>
          <span className="text-lg font-black text-white">Fizika <span className="text-cyan-400">AI</span></span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex flex-1 justify-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                pathname.startsWith(href)
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
              )}
              style={pathname.startsWith(href) ? { boxShadow: '0 0 10px rgba(0,212,255,0.12)' } : {}}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          <RefDropdown />
        </div>

        {/* Right: lang + user */}
        <div className="flex items-center gap-2 shrink-0">
          <LangMenu />
          <UserMenu />
        </div>
      </div>
      <EnergyLine />
    </nav>
  )
}
