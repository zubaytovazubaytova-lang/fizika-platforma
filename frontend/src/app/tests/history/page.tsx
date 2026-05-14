'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { testsApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { QuizAttempt } from '@/types'
import {
  Trophy, CheckCircle2, XCircle, Clock,
  ChevronRight, Loader2, RotateCcw,
} from 'lucide-react'
import clsx from 'clsx'

export default function HistoryPage() {
  const { loading: authLoading } = useRequireAuth()
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (authLoading) return
    testsApi.attempts()
      .then((r) => { setAttempts(r.data.results ?? r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authLoading])

  const passed = attempts.filter((a) => a.is_passed).length
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : 0

  if (loading || authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-green-400" />
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mening natijalarim</h1>
          <p className="mt-1 text-gray-400">Barcha test urinishlarim</p>
        </div>
        <Link
          href="/tests"
          className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-white"
        >
          Testlar <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Umumiy statistika */}
      {attempts.length > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Jami urinish', value: attempts.length, color: 'text-white' },
            { label: 'O\'tilgan', value: passed, color: 'text-green-400' },
            { label: "O'rtacha ball", value: `${avgScore}%`, color: avgScore >= 60 ? 'text-green-400' : 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
              <div className={clsx('text-3xl font-bold', color)}>{value}</div>
              <div className="mt-1 text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Urinishlar ro'yxati */}
      {attempts.length === 0 ? (
        <div className="py-24 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-700" />
          <p className="text-gray-400">Hali birorta test topshirilmagan</p>
          <Link href="/tests" className="mt-3 inline-block text-sm text-green-400 hover:underline">
            Testlarni ko&apos;rish →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const date = new Date(attempt.started_at).toLocaleDateString('uz-UZ', {
              day: '2-digit', month: 'long', year: 'numeric',
            })
            const time = new Date(attempt.started_at).toLocaleTimeString('uz-UZ', {
              hour: '2-digit', minute: '2-digit',
            })

            return (
              <div
                key={attempt.id}
                className={clsx(
                  'flex items-center gap-4 rounded-2xl border p-4 transition-all',
                  attempt.is_passed
                    ? 'border-green-800/40 bg-green-900/5 hover:border-green-700/60'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                )}
              >
                {/* Ikonka */}
                <div className={clsx(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  attempt.is_passed ? 'bg-green-900/30' : 'bg-gray-800'
                )}>
                  {attempt.is_passed
                    ? <CheckCircle2 className="h-6 w-6 text-green-400" />
                    : <XCircle      className="h-6 w-6 text-red-400" />
                  }
                </div>

                {/* Ma'lumot */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-xl font-bold',
                      attempt.is_passed ? 'text-green-400' : 'text-red-400'
                    )}>
                      {attempt.score}%
                    </span>
                    <span className={clsx(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      attempt.is_passed
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    )}>
                      {attempt.is_passed ? 'O\'tildi' : 'O\'tilmadi'}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {date}, {time}
                  </div>
                </div>

                {/* Havolalar */}
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/tests/${attempt.quiz}/result/${attempt.id}`}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-500 hover:text-white"
                  >
                    Ko&apos;rish
                  </Link>
                  <Link
                    href={`/tests/${attempt.quiz}`}
                    className="flex items-center gap-1 rounded-lg bg-green-600/20 px-3 py-1.5 text-xs text-green-400 hover:bg-green-600/30"
                  >
                    <RotateCcw className="h-3 w-3" /> Qayta
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
