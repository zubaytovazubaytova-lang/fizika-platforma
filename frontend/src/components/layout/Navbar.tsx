'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { BookOpen, TestTube2, Bot, Atom, User, LogOut, Settings, ChevronDown, BookMarked, Telescope, ShieldCheck, FlaskConical, Sigma, Library, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth'
import EnergyLine from '@/components/effects/EnergyLine'

const navLinks = [
  { href: '/courses',      label: 'Kurslar',  icon: BookOpen  },
  { href: '/darsliklar',   label: 'Darslik',  icon: BookMarked},
  { href: '/tests',        label: 'Test',     icon: TestTube2 },
  { href: '/musobaqa',     label: 'Musobaqa', icon: Trophy    },
  { href: '/simulations',  label: '3D',       icon: Atom      },
  { href: '/kashfiyotlar', label: 'Kashf',    icon: Telescope },
  { href: '/ai-tutor',     label: 'AI Tutor', icon: Bot       },
]

const LANGS = [
  { code: 'UZ', label: "O'zbek",  flag: '🇺🇿' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
]

const REF_ITEMS = [
  { href: '/formulalar',      label: 'Formulalar',        sub: "Fizika formulalari to'plami",        icon: FlaskConical, color: '#a78bfa', glow: 'rgba(167,139,250,0.12)' },
  { href: '/fizik-kattaliklar', label: 'Kattaliklar & Birliklar', sub: "Belgilar, o'lchov birliklari", icon: Sigma,        color: '#34d399', glow: 'rgba(52,211,153,0.12)'  },
]

/* ── Dropdown bazasi ─────────────────────────────────────── */
const DROPDOWN_STYLE = {
  background: 'rgba(12,12,30,0.97)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(124,58,237,0.18)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
}

function RefDropdown() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = REF_ITEMS.some(i => pathname.startsWith(i.href))

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all whitespace-nowrap',
          isActive || open
            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
            : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
        )}
      >
        <Library className="h-3.5 w-3.5" />
        Manba
        <ChevronDown className={clsx('h-3 w-3 text-gray-600 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl py-2" style={DROPDOWN_STYLE}>
          <div className="px-4 pb-2 mb-1 border-b border-white/[0.05]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Fizika ma&apos;lumotnomasi</p>
          </div>
          {REF_ITEMS.map(({ href, label, sub, icon: Icon, color, glow }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 mx-2 rounded-xl px-3 py-2.5 transition-all group"
                style={{ background: active ? glow : 'transparent', border: `1px solid ${active ? color + '25' : 'transparent'}` }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = glow }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: color + '14', border: `1px solid ${color}22` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90 leading-none">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-none">{sub}</p>
                </div>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0 animate-pulse" style={{ background: color }} />}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LangMenu() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('UZ')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const current = LANGS.find(l => l.code === lang)!

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className={clsx(
          'flex items-center gap-1 rounded-xl border px-2 py-1 text-xs font-semibold transition-all whitespace-nowrap',
          open
            ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
            : 'border-white/[0.1] bg-white/[0.04] text-gray-300 hover:border-white/[0.15] hover:text-white'
        )}>
        <span>{current.flag}</span>
        <span>{current.code}</span>
        <ChevronDown className={clsx('h-3 w-3 text-gray-600 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-2xl py-1" style={DROPDOWN_STYLE}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false) }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-all',
                lang === l.code ? 'bg-purple-500/15 text-purple-300 font-semibold' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
              )}>
              <span className="text-base">{l.flag}</span>
              <div className="text-left">
                <div className="font-medium leading-none">{l.code}</div>
                <div className="text-xs text-gray-600 mt-0.5">{l.label}</div>
              </div>
              {lang === l.code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const router = useRouter()
  const user   = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
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
        className="relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
        Ro&apos;yxatdan o&apos;tish
      </Link>
    </div>
  )

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-sm transition-all"
        style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.08)' }}>
        {user.avatar
          ? <Image src={user.avatar} alt="" width={28} height={28} unoptimized className="h-7 w-7 rounded-full object-cover" />
          : <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>{initials}</span>
        }
        <span className="max-w-[90px] truncate font-medium text-white/90 text-sm">{user.first_name || user.username}</span>
        <ChevronDown className={clsx('h-3.5 w-3.5 text-gray-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl py-1" style={DROPDOWN_STYLE}>
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="font-semibold text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            <span className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs text-purple-300"
              style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.3)' }}>
              {user.role === 'teacher' ? "O'qituvchi" : user.role === 'admin' ? 'Admin' : 'Talaba'}
            </span>
          </div>
          <div className="py-1">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors">
              <User className="h-4 w-4 text-gray-600" /> Profilim
            </Link>
            <Link href="/profile/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors">
              <Settings className="h-4 w-4 text-gray-600" /> Sozlamalar
            </Link>
            {(user.is_staff || user.role === 'admin') && (
              <Link href="/admin/darsliklar" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-colors">
                <ShieldCheck className="h-4 w-4" /> Admin panel
              </Link>
            )}
          </div>
          <div className="border-t border-white/[0.06] py-1">
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
  if (pathname === '/' || pathname === '/login' || pathname === '/register') return null

  return (
    <nav className="sticky top-0 z-50"
      style={{
        background: 'rgba(12,12,30,0.88)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(124,58,237,0.18)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(124,58,237,0.1)',
      }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sofena-icon.svg"
            alt="SOFENA"
            style={{ height: 40, width: 40, borderRadius: 11, userSelect: 'none', flexShrink: 0 }}
            draggable={false}
          />
          <span style={{
            fontSize: 17, fontWeight: 800, letterSpacing: '0.06em',
            background: 'linear-gradient(135deg,#b8d8ff,#6699ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>SOFENA</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-0 md:flex flex-1 justify-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                pathname.startsWith(href)
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </Link>
          ))}
          <RefDropdown />
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <LangMenu />
          <UserMenu />
        </div>
      </div>
      <EnergyLine />
    </nav>
  )
}
