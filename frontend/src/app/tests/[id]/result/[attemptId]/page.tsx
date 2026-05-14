'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { testsApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { QuizAttempt } from '@/types'
import {
  Trophy, XCircle, CheckCircle2, RotateCcw,
  ChevronDown, ChevronRight, Loader2,
} from 'lucide-react'
import clsx from 'clsx'

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="absolute -rotate-90" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={passed ? '#22c55e' : '#ef4444'}
          strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="text-center">
        <div className={clsx('text-4xl font-bold', passed ? 'text-green-400' : 'text-red-400')}>
          {score}%
        </div>
        <div className="text-xs text-gray-400">ball</div>
      </div>
    </div>
  )
}

function AnswerReview({ answer }: { answer: QuizAttempt['answers'][number] }) {
  const [open, setOpen] = useState(false)

  const correctIds   = new Set(answer.correct_choices.map((c) => c.id))
  const chosenIds    = new Set(answer.chosen_choices.map((c) => c.id))
  const isCorrect    = (
    answer.chosen_choices.length === answer.correct_choices.length &&
    answer.chosen_choices.every((c) => correctIds.has(c.id))
  )

  return (
    <div className={clsx(
      'rounded-xl border',
      isCorrect ? 'border-green-800/50' : 'border-red-800/50'
    )}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {isCorrect
          ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
          : <XCircle      className="h-5 w-5 shrink-0 text-red-400" />
        }
        <span className="flex-1 text-sm text-white line-clamp-2">{answer.question_text}</span>
        <ChevronDown className={clsx('h-4 w-4 shrink-0 text-gray-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="border-t border-gray-800 px-4 py-4 space-y-3">
          {/* Berilgan javoblar */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Sizning javobingiz:</p>
            <div className="space-y-1.5">
              {answer.chosen_choices.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Javob berilmadi</p>
              ) : answer.chosen_choices.map((c) => (
                <div key={c.id} className={clsx(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                  correctIds.has(c.id)
                    ? 'bg-green-900/20 text-green-300'
                    : 'bg-red-900/20 text-red-300'
                )}>
                  {correctIds.has(c.id)
                    ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                    : <XCircle      className="h-4 w-4 shrink-0" />
                  }
                  {c.text}
                </div>
              ))}
            </div>
          </div>

          {/* To'g'ri javoblar */}
          {!isCorrect && (
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">To&apos;g&apos;ri javob:</p>
              <div className="space-y-1.5">
                {answer.correct_choices.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 rounded-lg bg-green-900/20 px-3 py-2 text-sm text-green-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> {c.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ResultPage() {
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>()
  const router = useRouter()
  const { loading: authLoading } = useRequireAuth()

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    testsApi.attemptDetail(Number(attemptId))
      .then((r) => { setAttempt(r.data); setLoading(false) })
      .catch(() => { router.replace('/tests'); setLoading(false) })
  }, [attemptId, authLoading, router])

  if (loading || authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-green-400" />
    </div>
  )
  if (!attempt) return null

  const correctCount = attempt.answers.filter((a) => {
    const cIds = new Set(a.correct_choices.map((c) => c.id))
    return (
      a.chosen_choices.length === a.correct_choices.length &&
      a.chosen_choices.every((c) => cIds.has(c.id))
    )
  }).length

  const duration = attempt.completed_at
    ? Math.round((new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
    : 0
  const durationStr = duration >= 60
    ? `${Math.floor(duration / 60)} daq ${duration % 60} son`
    : `${duration} soniya`

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* Natija kartasi */}
      <div className={clsx(
        'mb-8 overflow-hidden rounded-2xl border text-center',
        attempt.is_passed ? 'border-green-700 bg-green-900/10' : 'border-red-700 bg-red-900/10'
      )}>
        <div className={clsx(
          'py-4 text-sm font-semibold',
          attempt.is_passed ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
        )}>
          {attempt.is_passed
            ? '🎉 Tabriklaymiz! Test muvaffaqiyatli topshirildi!'
            : '😔 Test o\'tilmadi. Yana urinib ko\'ring!'}
        </div>

        <div className="flex flex-col items-center gap-6 py-8">
          <ScoreRing score={attempt.score} passed={attempt.is_passed} />

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{correctCount}</div>
              <div className="text-xs text-gray-400">To&apos;g&apos;ri</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {attempt.answers.length - correctCount}
              </div>
              <div className="text-xs text-gray-400">Noto&apos;g&apos;ri</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{durationStr}</div>
              <div className="text-xs text-gray-400">Sarflandi</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 border-t border-gray-800 py-4">
          <Link
            href={`/tests/${id}`}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Qayta ishlash
          </Link>
          <Link
            href="/tests"
            className="flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-2.5 text-sm text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            Boshqa testlar <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Javoblar sharhi */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Javoblar sharhi
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({correctCount}/{attempt.answers.length} to&apos;g&apos;ri)
          </span>
        </h2>
        <div className="space-y-3">
          {attempt.answers.map((answer, i) => (
            <AnswerReview key={i} answer={answer} />
          ))}
        </div>
      </div>
    </div>
  )
}
