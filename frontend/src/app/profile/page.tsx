'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { coursesApi, testsApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Enrollment, QuizAttempt } from '@/types'
import {
  BookOpen, Trophy, Settings, Clock,
  CheckCircle2, XCircle, ChevronRight, Loader2,
  GraduationCap, BarChart3,
} from 'lucide-react'
import clsx from 'clsx'

const ROLE_LABEL: Record<string, string> = {
  student: 'O\'quvchi',
  teacher: 'O\'qituvchi',
  admin:   'Admin',
}

const LEVEL_LABEL: Record<string, string> = {
  beginner:     'Boshlang\'ich',
  intermediate: 'O\'rta',
  advanced:     'Yuqori',
}

const LEVEL_COLOR: Record<string, string> = {
  beginner:     'bg-green-900/30 text-green-400',
  intermediate: 'bg-yellow-900/30 text-yellow-400',
  advanced:     'bg-red-900/30 text-red-400',
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [attempts, setAttempts]       = useState<QuizAttempt[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (authLoading) return
    Promise.all([
      coursesApi.myCourses().catch(() => ({ data: [] })),
      testsApi.attempts().catch(() => ({ data: [] })),
    ]).then(([coursesRes, attemptsRes]) => {
      const courseData = coursesRes.data.results ?? coursesRes.data
      const attData   = attemptsRes.data.results ?? attemptsRes.data
      setEnrollments(Array.isArray(courseData) ? courseData : [])
      setAttempts(Array.isArray(attData) ? attData : [])
      setLoading(false)
    })
  }, [authLoading])

  if (authLoading || loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  )
  if (!user) return null

  const passedTests  = attempts.filter((a) => a.is_passed).length
  const avgScore     = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : 0
  const joinDate = new Date(user.date_joined).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">

      {/* Header kartasi */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="h-24 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-green-900/50" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="-mt-10 flex items-end gap-4">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-gray-900 bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
                {user.avatar
                  ? <Image src={user.avatar} alt={user.username} width={80} height={80} unoptimized className="h-full w-full rounded-2xl object-cover" />
                  : (user.first_name?.[0] ?? user.username[0]).toUpperCase()
                }
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-white">
                  {user.first_name || user.last_name
                    ? `${user.first_name} ${user.last_name}`.trim()
                    : user.username}
                </h1>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </div>
            </div>

            <Link
              href="/profile/settings"
              className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" /> Tahrirlash
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-blue-900/30 px-3 py-1 text-blue-400">
              <GraduationCap className="h-3.5 w-3.5" />
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
            {user.email && (
              <span className="text-gray-500">{user.email}</span>
            )}
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">
              <Clock className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
              {joinDate}dan beri
            </span>
          </div>

          {user.bio && (
            <p className="mt-3 text-sm text-gray-400">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Kurslar',    value: enrollments.length,  icon: BookOpen,      color: 'text-blue-400' },
          { label: 'Testlar',    value: attempts.length,     icon: Trophy,        color: 'text-green-400' },
          { label: 'O\'tildi',   value: passedTests,         icon: CheckCircle2,  color: 'text-emerald-400' },
          { label: 'O\'rtacha',  value: attempts.length ? `${avgScore}%` : '—', icon: BarChart3, color: avgScore >= 60 ? 'text-green-400' : 'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
            <Icon className={clsx('mx-auto mb-2 h-6 w-6', color)} />
            <div className={clsx('text-2xl font-bold', color)}>{value}</div>
            <div className="mt-0.5 text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Mening kurslarim */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mening kurslarim</h2>
            <Link href="/courses" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
              Barchasi <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-700" />
              <p className="text-sm text-gray-500">Hali kurs yo&apos;q</p>
              <Link href="/courses" className="mt-2 inline-block text-sm text-blue-400 hover:underline">
                Kurslarni ko&apos;rish →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 5).map((enr) => (
                <Link
                  key={enr.id}
                  href={`/courses/${enr.course.id}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 to-purple-900">
                    {enr.course.thumbnail
                      ? <Image src={enr.course.thumbnail} alt="" width={48} height={48} unoptimized className="h-full w-full object-cover" />
                      : <BookOpen className="h-6 w-6 text-blue-300 opacity-60" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">{enr.course.title}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${enr.progress_percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{enr.progress_percent}% bajarildi</p>
                  </div>

                  {enr.course.level && (
                    <span className={clsx('shrink-0 rounded-full px-2 py-0.5 text-xs', LEVEL_COLOR[enr.course.level])}>
                      {LEVEL_LABEL[enr.course.level]}
                    </span>
                  )}
                </Link>
              ))}
              {enrollments.length > 5 && (
                <p className="text-center text-sm text-gray-500">
                  + {enrollments.length - 5} ta kurs ko&apos;proq
                </p>
              )}
            </div>
          )}
        </section>

        {/* So'nggi test natijalari */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">So&apos;nggi testlar</h2>
            <Link href="/tests/history" className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
              Barchasi <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {attempts.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
              <Trophy className="mx-auto mb-3 h-10 w-10 text-gray-700" />
              <p className="text-sm text-gray-500">Hali test topshirilmagan</p>
              <Link href="/tests" className="mt-2 inline-block text-sm text-green-400 hover:underline">
                Testlarni ko&apos;rish →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 5).map((attempt) => {
                const date = new Date(attempt.started_at).toLocaleDateString('uz-UZ', {
                  day: '2-digit', month: 'short',
                })
                return (
                  <Link
                    key={attempt.id}
                    href={`/tests/${attempt.quiz}/result/${attempt.id}`}
                    className={clsx(
                      'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                      attempt.is_passed
                        ? 'border-green-800/40 bg-green-900/5 hover:border-green-700/60'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                    )}
                  >
                    <div className={clsx(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      attempt.is_passed ? 'bg-green-900/30' : 'bg-gray-800'
                    )}>
                      {attempt.is_passed
                        ? <CheckCircle2 className="h-5 w-5 text-green-400" />
                        : <XCircle      className="h-5 w-5 text-red-400" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">{date}</p>
                      <p className={clsx(
                        'text-sm font-medium',
                        attempt.is_passed ? 'text-green-400' : 'text-red-400'
                      )}>
                        {attempt.is_passed ? 'O\'tildi' : 'O\'tilmadi'}
                      </p>
                    </div>

                    <div className={clsx(
                      'text-2xl font-bold',
                      attempt.is_passed ? 'text-green-400' : 'text-red-400'
                    )}>
                      {attempt.score}%
                    </div>
                  </Link>
                )
              })}
              {attempts.length > 5 && (
                <p className="text-center text-sm text-gray-500">
                  + {attempts.length - 5} ta natija ko&apos;proq
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
