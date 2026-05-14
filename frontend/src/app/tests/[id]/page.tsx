'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { testsApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Quiz, Question } from '@/types'
import {
  Clock, ChevronLeft, ChevronRight, Send,
  HelpCircle, Loader2, AlertTriangle, CheckSquare, Circle,
} from 'lucide-react'
import clsx from 'clsx'

// ── Taymer ──────────────────────────────────────────────────────────────────
function Timer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(totalSeconds)
  const ref = useRef(onExpire)
  ref.current = onExpire

  useEffect(() => {
    if (totalSeconds === 0) return
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { clearInterval(id); ref.current(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [totalSeconds])

  if (totalSeconds === 0) return null

  const m = Math.floor(left / 60)
  const s = left % 60
  const urgent = left < 60

  return (
    <div className={clsx(
      'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-mono font-semibold tabular-nums',
      urgent ? 'bg-red-900/40 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-300'
    )}>
      <Clock className="h-4 w-4" />
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </div>
  )
}

// ── Bir savol ────────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
}: {
  question: Question
  index: number
  total: number
  selected: number[]
  onSelect: (choiceId: number) => void
}) {
  const isMultiple = question.question_type === 'multiple'

  return (
    <div className="flex flex-col gap-5">
      {/* Savol matni */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {isMultiple
              ? <><CheckSquare className="h-3.5 w-3.5 text-purple-400" /> Ko&apos;p javobli</>
              : <><Circle className="h-3.5 w-3.5 text-blue-400" /> Bir javobli</>
            }
          </span>
          <span>·</span>
          <span>{question.points} ball</span>
        </div>
        <p className="text-lg font-medium leading-relaxed text-white">{question.text}</p>
      </div>

      {/* Javob variantlari */}
      <div className="grid gap-3">
        {question.choices.map((choice) => {
          const checked = selected.includes(choice.id)
          return (
            <button
              key={choice.id}
              onClick={() => onSelect(choice.id)}
              className={clsx(
                'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                checked
                  ? 'border-blue-500 bg-blue-900/20 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:bg-gray-800 hover:text-white'
              )}
            >
              {/* Checkbox yoki radio */}
              <div className={clsx(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                checked ? 'border-blue-500 bg-blue-500' : 'border-gray-600'
              )}>
                {checked && (
                  <div className={clsx('bg-white rounded-full', isMultiple ? 'h-2.5 w-2.5' : 'h-2 w-2')} />
                )}
              </div>
              <span className="text-sm leading-relaxed">{choice.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Asosiy sahifa ────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const { loading: authLoading } = useRequireAuth()

  const [quiz, setQuiz]       = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading) return
    testsApi.detail(Number(id))
      .then((r) => { setQuiz(r.data); setLoading(false) })
      .catch(() => { router.replace('/tests'); setLoading(false) })
  }, [id, authLoading, router])

  const questions = quiz?.questions ?? []
  const currentQ  = questions[current]
  const answered  = Object.keys(answers).length
  const totalQ    = questions.length

  const handleSelect = useCallback((choiceId: number) => {
    if (!currentQ) return
    const isMultiple = currentQ.question_type === 'multiple'
    setAnswers((prev) => {
      const existing = prev[currentQ.id] ?? []
      if (isMultiple) {
        return {
          ...prev,
          [currentQ.id]: existing.includes(choiceId)
            ? existing.filter((id) => id !== choiceId)
            : [...existing, choiceId],
        }
      }
      return { ...prev, [currentQ.id]: [choiceId] }
    })
  }, [currentQ])

  const handleSubmit = useCallback(async () => {
    if (!quiz) return
    setSubmitting(true)
    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        choice_ids:  answers[q.id] ?? [],
      }))
      const { data } = await testsApi.submit(quiz.id, payload)
      router.push(`/tests/${quiz.id}/result/${data.id}`)
    } catch {
      setSubmitting(false)
    }
  }, [quiz, questions, answers, router])

  // ── Yuklash ──────────────────────────────────────────────────────────────
  if (loading || authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-green-400" />
    </div>
  )
  if (!quiz) return null

  // ── Boshlash ekrani ──────────────────────────────────────────────────────
  if (!started) return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-green-900/30 p-4">
            <HelpCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold">{quiz.title}</h1>
        {quiz.description && (
          <p className="mb-6 text-gray-400">{quiz.description}</p>
        )}

        <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl bg-gray-800/50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{quiz.question_count}</div>
            <div className="text-xs text-gray-400">Savol</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {quiz.time_limit_minutes > 0 ? `${quiz.time_limit_minutes}` : '∞'}
            </div>
            <div className="text-xs text-gray-400">Daqiqa</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{quiz.pass_score}%</div>
            <div className="text-xs text-gray-400">O&apos;tish bali</div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4 text-left text-sm text-yellow-300">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" /> Diqqat!
          </div>
          <ul className="list-inside list-disc space-y-1 text-yellow-400/80">
            <li>Test boshlangach sahifani tark etmang</li>
            <li>Har bir savolga faqat bir marta javob beriladi</li>
            {quiz.time_limit_minutes > 0 && (
              <li>Vaqt tugaganda javoblar avtomatik topshiriladi</li>
            )}
          </ul>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 transition-colors"
        >
          Testni boshlash
        </button>
      </div>
    </div>
  )

  // ── Test jarayoni ────────────────────────────────────────────────────────
  const selectedChoices = answers[currentQ?.id] ?? []
  const isLast = current === totalQ - 1
  const allAnswered = answered === totalQ

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">

      {/* Top panel */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-white">{current + 1}</span> / {totalQ}
        </div>
        <Timer
          totalSeconds={quiz.time_limit_minutes * 60}
          onExpire={handleSubmit}
        />
        <div className="text-sm text-gray-400">
          Javoblandi:{' '}
          <span className={clsx('font-semibold', allAnswered ? 'text-green-400' : 'text-white')}>
            {answered}/{totalQ}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${((current + 1) / totalQ) * 100}%` }}
        />
      </div>

      {/* Savol navigatsiya (dot) */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            className={clsx(
              'h-8 w-8 rounded-lg text-xs font-semibold transition-colors',
              i === current
                ? 'bg-green-600 text-white'
                : answers[q.id]?.length
                ? 'bg-gray-700 text-green-400'
                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Savol */}
      {currentQ && (
        <QuestionCard
          question={currentQ}
          index={current}
          total={totalQ}
          selected={selectedChoices}
          onSelect={handleSelect}
        />
      )}

      {/* Navigatsiya */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Oldingi
        </button>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors',
              allAnswered
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-gray-700 hover:bg-gray-600'
            )}
          >
            {submitting
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />
            }
            {submitting ? 'Topshirilmoqda...' : 'Testni topshirish'}
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
          >
            Keyingi <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Topshirish eslatmasi */}
      {!allAnswered && isLast && (
        <p className="mt-3 text-center text-xs text-yellow-400">
          {totalQ - answered} ta savol javobsiz. Baribir topshirishingiz mumkin.
        </p>
      )}
    </div>
  )
}
