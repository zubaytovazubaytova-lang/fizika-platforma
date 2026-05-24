'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Course } from '@/types'
import { BookOpen, Play, FileText, Zap, ChevronRight, CheckCircle2, Lock, Loader2, Users, Clock, Star, Layers } from 'lucide-react'
import clsx from 'clsx'
import ProtectedContent from '@/components/protection/ProtectedContent'

const LEVEL_CFG: Record<string,{label:string;color:string}> = {
  beginner:     { label:"Boshlang'ich", color:'#34D399' },
  intermediate: { label:"O'rta",        color:'#FFB347' },
  advanced:     { label:'Yuqori',        color:'#EF4444' },
}

const LESSON_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Play, text: FileText, mixed: Zap, slide: Layers,
}

/* ── Demo lesson for preview ── */
const DEMO_FORMULAS = [
  { name: "Nyuton 2-qonuni",      formula: "F = ma",                desc: "Kuch = massa × tezlanish"         },
  { name: "Kinematika",           formula: "v = v₀ + at",           desc: "Tezlik vaqt funksiyasi"           },
  { name: "Bosib bosgan yo'l",    formula: "s = v₀t + ½at²",        desc: "Ko'chish formulasi"               },
  { name: "Energiya saqlanishi",  formula: "E = Ek + Ep = const",   desc: "Mexanik energiya saqlanishi"      },
]

export default function CourseDetailPage() {
  const { id } = useParams<{ id:string }>()
  const router  = useRouter()
  const user    = useAuthStore((s)=>s.user)
  const initialized = useAuthStore((s)=>s.initialized)

  const [course,     setCourse]     = useState<Course|null>(null)
  const [loading,    setLoading]    = useState(true)
  const [enrolled,   setEnrolled]   = useState(false)
  const [enrolling,  setEnrolling]  = useState(false)
  const [activeLesson, setActiveLesson] = useState<number|null>(null)
  const [openTopic,  setOpenTopic]  = useState<number>(0)
  const [completed,  setCompleted]  = useState<Set<number>>(new Set())

  useEffect(() => {
    coursesApi.detail(Number(id))
      .then((r) => { setCourse(r.data); setEnrolled(!!r.data.is_enrolled); setLoading(false) })
      .catch(() => { router.replace('/courses'); setLoading(false) })
  }, [id, router])

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return }
    setEnrolling(true)
    try { await coursesApi.enroll(Number(id)); setEnrolled(true) }
    finally { setEnrolling(false) }
  }

  const markDone = async (lessonId: number) => {
    try { await coursesApi.lessonDone(lessonId); setCompleted((p)=>new Set([...p,lessonId])) }
    catch { /* ignore */ }
  }

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-cyan-400"/></div>
  if (!course) return null

  const topics  = course.topics ?? []
  const allLessons = topics.flatMap((t)=>t.lessons??[])
  const doneCount  = completed.size
  const totalLessons = allLessons.length
  const progress = totalLessons ? Math.round((doneCount/totalLessons)*100) : 0
  const level = LEVEL_CFG[course.level]

  // Active lesson object
  const activeLessonObj = allLessons.find((l)=>l.id===activeLesson)

  return (
    <div className="min-h-screen">
      {/* Top banner */}
      <div className="relative overflow-hidden px-4 py-10"
        style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(139,92,246,0.06))', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <Link href="/courses" className="hover:text-cyan-400 transition-colors">Kurslar</Link>
            <ChevronRight className="h-4 w-4"/>
            <span className="text-white">{course.title}</span>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              {level && (
                <span className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-3"
                  style={{ background:`${level.color}18`, color:level.color, border:`1px solid ${level.color}30` }}>
                  {level.label}
                </span>
              )}
              <h1 className="text-3xl font-black text-white mb-3">{course.title}</h1>
              <p className="text-gray-400 mb-5 leading-relaxed max-w-2xl">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-cyan-400"/> {course.lesson_count} dars</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple-400"/> {course.total_duration_minutes} daqiqa</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-green-400"/> {course.teacher?.full_name??course.teacher?.username}</span>
                {course.is_free && <span className="flex items-center gap-1.5 text-green-400"><Star className="h-4 w-4"/> Bepul</span>}
              </div>
            </div>
            {/* Enroll card */}
            <div className="w-full lg:w-72 shrink-0 rounded-2xl p-5"
              style={{ background:'rgba(8,8,25,0.9)', border:'1px solid rgba(0,212,255,0.2)', backdropFilter:'blur(12px)' }}>
              {enrolled ? (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400 font-bold">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width:`${progress}%`, background:'linear-gradient(90deg,#06b6d4,#3b82f6)' }}/>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{doneCount}/{totalLessons} dars bajarildi</p>
                  </div>
                  {allLessons[0] && (
                    <Link href={`/courses/${course.id}/lesson/${allLessons[0].id}`}
                      className="relative flex items-center justify-center gap-2 w-full overflow-hidden rounded-2xl py-3 font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 24px rgba(0,212,255,0.3)' }}>
                      <Play className="h-4 w-4"/>
                      {doneCount > 0 ? 'Davom etish' : 'Boshlash'}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <div className="text-3xl font-black text-white mb-1">{course.is_free ? 'Bepul' : 'Pro'}</div>
                  <p className="text-gray-400 text-sm mb-4">To&apos;liq kirish uchun yoziling</p>
                  <button onClick={handleEnroll} disabled={enrolling||!initialized}
                    className="relative w-full overflow-hidden rounded-2xl py-3 font-bold text-white"
                    style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 24px rgba(0,212,255,0.3)' }}>
                    <span className="shimmer absolute inset-0"/>
                    {enrolling ? <Loader2 className="h-5 w-5 animate-spin mx-auto"/> : "Kursga yozilish"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left: lesson list */}
        <aside className="w-full lg:w-80 shrink-0">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400"/> Mavzular
          </h2>
          <div className="space-y-2">
            {topics.length===0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background:'rgba(8,8,25,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-gray-500 text-sm">Darslar tez orada qo&apos;shiladi</p>
              </div>
            ) : topics.map((topic,ti)=>(
              <div key={topic.id} className="rounded-2xl overflow-hidden"
                style={{ background:'rgba(8,8,25,0.7)', border:`1px solid ${openTopic===ti?'rgba(0,212,255,0.25)':'rgba(255,255,255,0.07)'}` }}>
                <button onClick={()=>setOpenTopic(openTopic===ti?-1:ti)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ background:'rgba(0,212,255,0.15)', color:'#00D4FF' }}>{ti+1}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{topic.title}</p>
                      <p className="text-xs text-gray-500">{topic.lesson_count} dars</p>
                    </div>
                  </div>
                  <ChevronRight className={clsx('h-4 w-4 text-gray-500 transition-transform',openTopic===ti&&'rotate-90')}/>
                </button>
                {openTopic===ti && (
                  <div className="border-t border-gray-800/50 divide-y divide-gray-800/30">
                    {(topic.lessons??[]).map((lesson)=>{
                      const Icon = LESSON_ICON[lesson.lesson_type]??Play
                      const isDone = completed.has(lesson.id)
                      const canOpen = lesson.is_free_preview||enrolled
                      return (
                        <button key={lesson.id}
                          onClick={()=>{ if(canOpen){ setActiveLesson(lesson.id) } }}
                          className={clsx('flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                            activeLesson===lesson.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/30',
                            !canOpen && 'opacity-50 cursor-not-allowed')}
                        >
                          <div className={clsx('h-7 w-7 shrink-0 rounded-lg flex items-center justify-center',
                            isDone ? 'bg-green-500/20' : activeLesson===lesson.id ? 'bg-cyan-500/20' : 'bg-gray-800')}>
                            {isDone
                              ? <CheckCircle2 className="h-4 w-4 text-green-400"/>
                              : canOpen ? <Icon className="h-3.5 w-3.5 text-cyan-400"/> : <Lock className="h-3.5 w-3.5 text-gray-600"/>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={clsx('text-xs font-medium truncate', activeLesson===lesson.id?'text-cyan-300':'text-gray-300')}>{lesson.title}</p>
                            {lesson.total_duration_seconds>0 && (
                              <p className="text-xs text-gray-600 mt-0.5">{Math.round(lesson.total_duration_seconds/60)} daq</p>
                            )}
                          </div>
                          {lesson.is_free_preview && !enrolled && (
                            <span className="text-xs text-green-400 shrink-0">Bepul</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Right: content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeLessonObj ? (
            <>
              {/* Video player — protected, no download */}
              {activeLessonObj.has_video && activeLessonObj.videos?.[0] && (
                <ProtectedContent className="rounded-2xl overflow-hidden aspect-video"
                  style={{ background:'#000', border:'1px solid rgba(255,255,255,0.08)' }} watermark>
                  <iframe
                    src={activeLessonObj.videos[0].embed_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents:'auto' }}
                  />
                </ProtectedContent>
              )}
              {/* Lesson info */}
              <ProtectedContent noSelect className="rounded-2xl p-5"
                style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)' }} watermark>
                <h2 className="text-xl font-black text-white mb-2">{activeLessonObj.title}</h2>
                {activeLessonObj.content && <p className="text-gray-400 leading-relaxed">{activeLessonObj.content}</p>}
                {enrolled && !completed.has(activeLessonObj.id) && (
                  <button onClick={()=>markDone(activeLessonObj.id)}
                    className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-green-400"
                    style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', userSelect:'none' }}>
                    <CheckCircle2 className="h-4 w-4"/> Darsni tugatdim
                  </button>
                )}
              </ProtectedContent>
            </>
          ) : (
            /* Default: video demo + formulas */
            <>
              <div className="rounded-2xl overflow-hidden aspect-video"
                style={{ background:'rgba(0,0,0,0.8)', border:'1px solid rgba(0,212,255,0.15)' }}>
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="text-5xl">🎬</div>
                  <p className="text-gray-400 text-sm">Dars tanlang yoki kursga yoziling</p>
                  {!enrolled && (
                    <button onClick={handleEnroll}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                      style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
                      <Play className="h-4 w-4"/> Boshlash
                    </button>
                  )}
                </div>
              </div>

              {/* Formulas */}
              <div className="rounded-2xl p-5" style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400"/> Asosiy formulalar
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {DEMO_FORMULAS.map((f)=>(
                    <div key={f.name} className="rounded-xl p-4"
                      style={{ background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.12)' }}>
                      <p className="text-xs text-gray-500 mb-1">{f.name}</p>
                      <p className="font-mono text-lg font-black text-cyan-300 mb-1">{f.formula}</p>
                      <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
