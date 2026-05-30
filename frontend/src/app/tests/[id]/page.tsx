'use client'
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { testsApi } from '@/lib/api'
import { Quiz, Question } from '@/types'
import { Clock, ChevronLeft, ChevronRight, Send, Loader2, CheckCircle2, RotateCcw } from 'lucide-react'
import clsx from 'clsx'

function Timer({ totalSecs, onExpire }: { totalSecs: number; onExpire: () => void }) {
  const [left, setLeft] = useState(totalSecs)
  const cb = useRef(onExpire)
  useEffect(() => { cb.current = onExpire })
  useEffect(() => {
    if (!totalSecs) return
    const id = setInterval(() => setLeft((s) => { if (s<=1){clearInterval(id);cb.current();return 0} return s-1 }),1000)
    return () => clearInterval(id)
  }, [totalSecs])
  if (!totalSecs) return null
  const m=Math.floor(left/60), s=left%60, pct=left/totalSecs
  const color = pct>.5?'#34D399':pct>.25?'#FFB347':'#EF4444'
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-mono font-bold"
      style={{ background:`${color}15`, border:`1px solid ${color}40`, color }}>
      <Clock className="h-4 w-4" />
      {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </div>
  )
}

function ResultScreen({ score, passed, total, correct, quizId }:
  { score:number; passed:boolean; total:number; correct:number; quizId:string }) {
  const color = passed ? '#34D399' : '#EF4444'
  const r=54, circ=2*Math.PI*r
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background:'rgba(8,8,25,0.9)', border:`1px solid ${color}30`, boxShadow:`0 0 60px ${color}15` }}>
        <div className="py-4 text-center font-bold text-sm" style={{ background:`${color}20`, color }}>
          {passed ? '🎉 Tabriklaymiz! Test muvaffaqiyatli topshirildi!' : "😔 Test o'tilmadi. Yana urinib ko'ring!"}
        </div>
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="relative h-40 w-40 flex items-center justify-center">
            <svg className="absolute -rotate-90" width="140" height="140">
              <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
              <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round" className="transition-all duration-1000"/>
            </svg>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color }}>{score}%</div>
              <div className="text-xs text-gray-500">natija</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full text-center">
            {[["To'g'ri",correct,'#34D399'],["Noto'g'ri",total-correct,'#EF4444'],['Jami',total,'#00D4FF']].map(([l,v,c])=>(
              <div key={l as string} className="rounded-2xl p-3" style={{ background:`${c}10`, border:`1px solid ${c}20` }}>
                <div className="text-2xl font-black" style={{ color: c as string }}>{v as number}</div>
                <div className="text-xs text-gray-500 mt-0.5">{l as string}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 w-full">
            <Link href={`/tests/${quizId}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-bold text-white text-sm"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 20px rgba(0,212,255,0.25)' }}>
              <RotateCcw className="h-4 w-4"/> Qayta
            </Link>
            <Link href="/tests"
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-gray-300 text-sm"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
              Testlar <ChevronRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const OPTS = ['A','B','C','D']

export default function TestPage() {
  const { id } = useParams<{ id:string }>()
  const router  = useRouter()
  const [quiz,     setQuiz]    = useState<Quiz|null>(null)
  const [loading,  setLoading] = useState(true)
  const [started,  setStarted] = useState(false)
  const [current,  setCurrent] = useState(0)
  const [answers,  setAnswers] = useState<Record<number,number[]>>({})
  const [submitting,setSubmit] = useState(false)
  const [result,   setResult]  = useState<{score:number;passed:boolean;total:number;correct:number}|null>(null)

  useEffect(() => {
    testsApi.detail(Number(id))
      .then((r) => { setQuiz(r.data); setLoading(false) })
      .catch(() => { router.replace('/tests'); setLoading(false) })
  }, [id, router])

  const questions = useMemo<Question[]>(() => quiz?.questions ?? [], [quiz])
  const q         = questions[current]
  const answered  = Object.keys(answers).length
  const isLast    = current === questions.length - 1
  const selected  = answers[q?.id] ?? []

  const select = useCallback((cid: number) => {
    if (!q) return
    setAnswers((p) => {
      const ex = p[q.id]??[]
      if (q.question_type==='multiple')
        return { ...p, [q.id]: ex.includes(cid)?ex.filter(x=>x!==cid):[...ex,cid] }
      return { ...p, [q.id]: [cid] }
    })
  }, [q])

  const submit = useCallback(async () => {
    if (!quiz) return; setSubmit(true)
    try {
      const payload = questions.map((q)=>({ question_id:q.id, choice_ids:answers[q.id]??[] }))
      const { data } = await testsApi.submit(quiz.id, payload)

      // Server javobidagi answers dan to'g'ri/noto'g'ri hisoblash
      let correct = 0
      if (Array.isArray(data.answers)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.answers.forEach((ans: any) => {
          const chosenIds  = new Set((ans.chosen_choices  ?? []).map((c: any) => c.id))
          const correctIds = new Set((ans.correct_choices ?? []).map((c: any) => c.id))
          if (
            chosenIds.size === correctIds.size &&
            chosenIds.size > 0 &&
            [...chosenIds].every((id) => correctIds.has(id))
          ) correct++
        })
      }

      setResult({ score:data.score, passed:data.is_passed, total:questions.length, correct })
    } catch { setSubmit(false) }
  }, [quiz, questions, answers])

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-cyan-400"/></div>
  if (!quiz) return null
  if (result) return <ResultScreen {...result} quizId={id}/>

  if (!started) return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl p-8"
        style={{ background:'rgba(8,8,25,0.9)', border:'1px solid rgba(0,212,255,0.2)', boxShadow:'0 0 60px rgba(0,212,255,0.08)' }}>
        <div className="mb-6 h-16 w-16 rounded-2xl flex items-center justify-center text-3xl mx-auto"
          style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border:'1px solid rgba(0,212,255,0.3)' }}>📝</div>
        <h1 className="text-2xl font-black text-white text-center mb-2">{quiz.title}</h1>
        {quiz.description && <p className="text-gray-400 text-center text-sm mb-6">{quiz.description}</p>}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['Savol',quiz.question_count,'#00D4FF'],['Vaqt',quiz.time_limit_minutes>0?`${quiz.time_limit_minutes}m`:'∞','#FFB347'],["O'tish",`${quiz.pass_score}%`,'#34D399']].map(([l,v,c])=>(
            <div key={l as string} className="rounded-2xl p-3 text-center" style={{ background:`${c}10`, border:`1px solid ${c}25` }}>
              <div className="text-xl font-black" style={{ color:c as string }}>{v as string|number}</div>
              <div className="text-xs text-gray-500 mt-0.5">{l as string}</div>
            </div>
          ))}
        </div>
        <div className="mb-6 rounded-2xl p-4 text-sm text-yellow-300"
          style={{ background:'rgba(255,179,71,0.08)', border:'1px solid rgba(255,179,71,0.2)' }}>
          ⚠️ Test boshlangandan sahifani tark etmang.
        </div>
        <button onClick={()=>setStarted(true)}
          className="relative w-full overflow-hidden rounded-2xl py-3.5 font-black text-white text-base"
          style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 30px rgba(0,212,255,0.35)' }}>
          <span className="shimmer absolute inset-0"/><span className="relative">🚀 Testni boshlash</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            <span className="text-xl font-black text-white">{current+1}</span>/{questions.length}
            <span className="ml-3 text-xs">Javoblandi: <span className={clsx('font-bold',answered===questions.length?'text-green-400':'text-white')}>{answered}</span></span>
          </span>
          <Timer totalSecs={quiz.time_limit_minutes*60} onExpire={submit}/>
        </div>

        <div className="mb-5 h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width:`${((current+1)/questions.length)*100}%`, background:'linear-gradient(90deg,#06b6d4,#3b82f6)' }}/>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {questions.map((q2,i)=>{
            const ans=!!answers[q2.id]?.length, cur=i===current
            return (
              <button key={q2.id} onClick={()=>setCurrent(i)}
                className="h-8 w-8 rounded-lg text-xs font-bold transition-all"
                style={{
                  background:cur?'linear-gradient(135deg,#06b6d4,#3b82f6)':ans?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.06)',
                  border:`1px solid ${cur?'#06b6d4':ans?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.1)'}`,
                  color:cur?'#fff':ans?'#34D399':'#6b7280',
                  boxShadow:cur?'0 0 12px rgba(0,212,255,0.3)':'none',
                }}>{i+1}</button>
            )
          })}
        </div>

        {q && (
          <>
            <div className="mb-5 rounded-3xl p-6"
              style={{ background:'rgba(8,8,25,0.85)', border:'1px solid rgba(0,212,255,0.12)', backdropFilter:'blur(12px)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-cyan-400">{q.question_type==='multiple'?'☑️ Ko\'p javobli':'⭕ Bir javobli'}</span>
                <span className="text-xs text-gray-600">· {q.points} ball</span>
              </div>
              <p className="text-lg font-semibold text-white leading-relaxed">{q.text}</p>
            </div>

            <div className="mb-5 space-y-3">
              {q.choices.map((c,i)=>{
                const sel=selected.includes(c.id)
                return (
                  <button key={c.id} onClick={()=>select(c.id)}
                    className="flex items-center gap-4 w-full rounded-2xl p-4 text-left text-sm font-medium transition-all duration-200"
                    style={{
                      background:sel?'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(139,92,246,0.15))':'rgba(8,8,25,0.7)',
                      border:`1px solid ${sel?'rgba(0,212,255,0.5)':'rgba(255,255,255,0.08)'}`,
                      color:sel?'#fff':'#9ca3af', transform:sel?'scale(1.01)':'none',
                    }}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                      style={{ background:sel?'linear-gradient(135deg,#06b6d4,#3b82f6)':'rgba(255,255,255,0.07)', color:sel?'#fff':'#6b7280' }}>
                      {OPTS[i]}
                    </span>
                    <span className="flex-1 leading-snug">{c.text}</span>
                    {sel && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-cyan-400"/>}
                  </button>
                )
              })}
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <button onClick={()=>setCurrent(c=>Math.max(0,c-1))} disabled={current===0}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-gray-400 disabled:opacity-30"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <ChevronLeft className="h-4 w-4"/> Oldingi
          </button>
          {isLast ? (
            <button onClick={submit} disabled={submitting}
              className="relative overflow-hidden flex items-center gap-2 rounded-2xl px-6 py-2.5 font-bold text-white text-sm"
              style={{ background:answered===questions.length?'linear-gradient(135deg,#06b6d4,#3b82f6)':'rgba(55,65,81,1)', boxShadow:answered===questions.length?'0 0 24px rgba(0,212,255,0.3)':'none' }}>
              {answered===questions.length && <span className="shimmer absolute inset-0"/>}
              {submitting?<Loader2 className="h-4 w-4 animate-spin"/>:<Send className="h-4 w-4"/>}
              {submitting?'Topshirilmoqda...':'Testni topshirish'}
            </button>
          ) : (
            <button onClick={()=>setCurrent(c=>Math.min(questions.length-1,c+1))}
              className="relative overflow-hidden flex items-center gap-2 rounded-2xl px-5 py-2.5 font-bold text-white text-sm"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 16px rgba(0,212,255,0.25)' }}>
              <span className="shimmer absolute inset-0"/> Keyingi <ChevronRight className="h-4 w-4"/>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
