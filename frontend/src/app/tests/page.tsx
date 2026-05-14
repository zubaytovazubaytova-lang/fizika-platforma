'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { testsApi } from '@/lib/api'
import { Quiz } from '@/types'
import {
  TestTube2, Clock, HelpCircle, Trophy,
  ChevronRight, Search, CheckCircle2,
} from 'lucide-react'
import clsx from 'clsx'

const PASS_COLOR = (score: number) =>
  score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'

function QuizCard({ quiz }: { quiz: Quiz }) {
  const hasLimit = quiz.time_limit_minutes > 0
  return (
    <Link
      href={`/tests/${quiz.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-blue-900/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-900/30">
          <TestTube2 className="h-5 w-5 text-green-400" />
        </div>
        <span className={clsx(
          'rounded-full px-2.5 py-1 text-xs font-medium',
          quiz.pass_score >= 80
            ? 'bg-red-900/30 text-red-400'
            : 'bg-yellow-900/30 text-yellow-400'
        )}>
          O&apos;tish: {quiz.pass_score}%
        </span>
      </div>

      <div>
        <h3 className="mb-1 font-semibold text-white group-hover:text-green-300 transition-colors line-clamp-2">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{quiz.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" />
          {quiz.question_count} savol
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {hasLimit ? `${quiz.time_limit_minutes} daqiqa` : 'Cheksiz'}
        </span>
        <span className="flex items-center gap-1 text-green-400 group-hover:gap-2 transition-all">
          Boshlash <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export default function TestsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    testsApi.list()
      .then((r) => { setQuizzes(r.data.results ?? r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Testlar</h1>
          <p className="mt-1 text-gray-400">Bilimingizni sinab ko&apos;ring</p>
        </div>
        <Link
          href="/tests/history"
          className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
        >
          <Trophy className="h-4 w-4" /> Mening natijalarim
        </Link>
      </div>

      {/* Qidiruv */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Test qidirish..."
          className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
        />
      </div>

      {/* Ro'yxat */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <TestTube2 className="mx-auto mb-4 h-12 w-12 text-gray-700" />
          <p className="text-gray-400">
            {search ? 'Test topilmadi' : 'Hali testlar qo\'shilmagan'}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">{filtered.length} ta test</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
