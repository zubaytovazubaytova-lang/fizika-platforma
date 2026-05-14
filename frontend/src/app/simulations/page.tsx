'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Atom, Clock, Zap } from 'lucide-react'
import clsx from 'clsx'

const PendulumSim = dynamic(() => import('@/components/3d/PendulumSim'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  ),
})

const SIMS = [
  {
    id: 'pendulum',
    title: 'Matematik mayatnik',
    desc: 'Davr va uzunlik munosabati',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-900/20 border-blue-800/50',
    activeBg: 'bg-blue-900/40 border-blue-600',
    info: (
      <div className="space-y-2 text-sm text-gray-400">
        <p>
          Davr formulasi:{' '}
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-blue-300">
            T = 2π√(L/g)
          </code>
        </p>
        <p>Bu yerda <strong className="text-white">L</strong> — ip uzunligi (m), <strong className="text-white">g</strong> — erkin tushish tezlanishi (9.8 m/s²).</p>
        <p>Davr massaga bog'liq emas — faqat uzunlikka!</p>
        <p className="text-gray-600">Sichqoncha bilan 3D ko&apos;rinishni aylantirish mumkin.</p>
      </div>
    ),
  },
  {
    id: 'coming1',
    title: 'Elektr maydon',
    desc: 'Zaryadlar o\'rtasidagi kuch',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/10 border-yellow-900/30',
    activeBg: 'bg-yellow-900/10 border-yellow-900/30',
    info: null,
    disabled: true,
  },
  {
    id: 'coming2',
    title: 'To\'lqin interferensiyasi',
    desc: 'To\'lqinlar ustma-ust kelishi',
    icon: Atom,
    color: 'text-purple-400',
    bg: 'bg-purple-900/10 border-purple-900/30',
    activeBg: 'bg-purple-900/10 border-purple-900/30',
    info: null,
    disabled: true,
  },
]

export default function SimulationsPage() {
  const [activeId, setActiveId] = useState('pendulum')
  const active = SIMS.find((s) => s.id === activeId)!

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">3D Simulatsiyalar</h1>
        <p className="mt-1 text-gray-400">Fizika qonunlarini real vaqtda interaktiv 3D muhitda kuzating</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chap — ro'yxat */}
        <div className="lg:col-span-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Simulatsiyalar</p>
          <div className="space-y-2">
            {SIMS.map(({ id, title, desc, icon: Icon, color, bg, activeBg, disabled }) => (
              <button
                key={id}
                disabled={disabled}
                onClick={() => !disabled && setActiveId(id)}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                  disabled
                    ? 'cursor-not-allowed opacity-40 ' + bg
                    : activeId === id
                    ? activeBg
                    : bg + ' hover:opacity-90'
                )}
              >
                <Icon className={clsx('h-5 w-5 shrink-0', color)} />
                <div>
                  <p className={clsx('text-sm font-medium', activeId === id ? 'text-white' : 'text-gray-300')}>
                    {title}
                  </p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                {disabled && (
                  <span className="ml-auto rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">Tez orada</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* O'ng — simulatsiya */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950" style={{ height: '480px' }}>
            {activeId === 'pendulum' && <PendulumSim />}
          </div>
          {active.info && (
            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-3 font-semibold">{active.title}</h3>
              {active.info}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
