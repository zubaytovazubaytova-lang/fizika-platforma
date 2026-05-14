import Link from 'next/link'
import { BookOpen, TestTube2, Bot, Atom, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Video darslar',
    desc: 'Har bir mavzu uchun professional video darslar va matn materiallar',
    href: '/courses',
    color: 'text-blue-400',
    bg: 'bg-blue-900/30',
  },
  {
    icon: Atom,
    title: '3D Simulatsiyalar',
    desc: 'Fizika qonunlarini interaktiv 3D animatsiya orqali ko\'ring',
    href: '/simulations',
    color: 'text-purple-400',
    bg: 'bg-purple-900/30',
  },
  {
    icon: TestTube2,
    title: 'Testlar',
    desc: 'Bilimingizni sinab ko\'ring, natijalaringizni kuzating',
    href: '/tests',
    color: 'text-green-400',
    bg: 'bg-green-900/30',
  },
  {
    icon: Bot,
    title: 'AI Tutor',
    desc: 'Har qanday savolingizga AI yordamida tezda javob oling',
    href: '/ai-tutor',
    color: 'text-orange-400',
    bg: 'bg-orange-900/30',
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <div className="mb-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-950/50 px-4 py-1.5 text-sm text-blue-300">
          <Atom className="h-4 w-4" />
          O&apos;zbekiston uchun fizika platformasi
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
          Fizikani yangicha{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            tushun
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
          Video darslar, 3D animatsiyalar, testlar va AI tutor — hammasi bir joyda.
          Mexanikadan kvant fizikasigacha.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Boshlash <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/simulations"
            className="flex items-center gap-2 rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-300 hover:border-gray-500 hover:text-white"
          >
            3D ko&apos;rish
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc, href, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-600 hover:bg-gray-800"
          >
            <div className={`mb-4 inline-flex rounded-xl p-3 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <h3 className="mb-2 font-semibold text-white group-hover:text-blue-300">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-3 gap-6 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
        {[
          { value: '50+', label: 'Mavzu' },
          { value: '200+', label: 'Dars' },
          { value: '500+', label: 'Test savoli' },
        ].map(({ value, label }) => (
          <div key={label}>
            <div className="text-3xl font-bold text-blue-400">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
