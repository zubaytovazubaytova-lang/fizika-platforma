'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { coursesApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Lesson, Course, LessonProgress, Slide } from '@/types'
import VideoPlayer from '@/components/video/VideoPlayer'
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  Loader2, BookOpen, Play, FileText, Video,
  ChevronDown, Layers,
} from 'lucide-react'
import clsx from 'clsx'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

/* ── Slide Viewer ── */
function SlideViewer({ slides }: { slides: Slide[] }) {
  const [cur, setCur] = useState(0)
  if (!slides.length) return null
  const slide = slides[cur]

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-800"
      style={{ background: 'rgba(8,8,25,0.9)' }}>

      {/* Progress bar */}
      <div className="flex h-1">
        {slides.map((_, i) => (
          <div key={i}
            onClick={() => setCur(i)}
            className="flex-1 cursor-pointer transition-colors"
            style={{ background: i <= cur ? '#06b6d4' : 'rgba(255,255,255,0.1)', marginRight: 2 }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
          <Layers className="h-3.5 w-3.5" /> Slayd {cur + 1} / {slides.length}
        </span>
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === cur ? 20 : 6, background: i === cur ? '#06b6d4' : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="min-h-64 px-6 py-4">
        {slide.title && (
          <h2 className="mb-4 text-xl font-black text-white">{slide.title}</h2>
        )}
        {slide.image && (
          <div className="mb-4 overflow-hidden rounded-xl" style={{ maxHeight: 360, position: 'relative' }}>
            <Image
              src={slide.image.startsWith('http') ? slide.image : `${API_BASE}${slide.image}`}
              alt={slide.title || `Slayd ${cur + 1}`}
              width={800} height={450} unoptimized
              className="w-full rounded-xl object-contain"
            />
          </div>
        )}
        {slide.content && (
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm">
              {slide.content}
            </pre>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-800 px-5 py-3">
        <button
          onClick={() => setCur((v) => Math.max(0, v - 1))}
          disabled={cur === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}
        >
          <ChevronLeft className="h-4 w-4" /> Oldingi
        </button>

        <span className="text-xs text-gray-600">{cur + 1} / {slides.length}</span>

        <button
          onClick={() => setCur((v) => Math.min(slides.length - 1, v + 1))}
          disabled={cur === slides.length - 1}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-all disabled:opacity-30"
          style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}
        >
          Keyingi <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()
  const { loading: authLoading } = useRequireAuth()

  const [lesson, setLesson]     = useState<Lesson | null>(null)
  const [course, setCourse]     = useState<Course | null>(null)
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [loading, setLoading]   = useState(true)
  const [marking, setMarking]   = useState(false)
  const [activeVideo, setActiveVideo] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (authLoading) return
    Promise.all([
      coursesApi.lesson(Number(lessonId)),
      coursesApi.detail(Number(id)),
    ]).then(([lessonRes, courseRes]) => {
      setLesson(lessonRes.data)
      setCourse(courseRes.data)
      setLoading(false)
    }).catch(() => { router.replace(`/courses/${id}`); setLoading(false) })
  }, [id, lessonId, authLoading, router])

  // Ko'rish vaqtini 10 sekundda bir yuborish
  const handleProgress = useCallback((seconds: number) => {
    if (seconds % 10 === 0 && seconds > 0) {
      coursesApi.watchTime(Number(lessonId), seconds).catch(() => {})
    }
  }, [lessonId])

  const handleMarkDone = useCallback(async () => {
    if (marking || progress?.completed) return
    setMarking(true)
    try {
      const { data } = await coursesApi.lessonDone(Number(lessonId))
      setProgress(data)
    } finally {
      setMarking(false)
    }
  }, [marking, progress, lessonId])

  // Video tugaganda avtomatik "bajarildi"
  const handleVideoEnded = useCallback(() => {
    if (!progress?.completed) handleMarkDone()
  }, [progress, handleMarkDone])

  // Oldingi/keyingi darslarni topish
  const allLessons = course?.topics?.flatMap((t) => t.lessons ?? []) ?? []
  const currentIdx = allLessons.findIndex((l) => l.id === Number(lessonId))
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  if (loading || authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  )

  if (!lesson || !course) return null

  const currentVideo = lesson.videos?.[activeVideo] ?? null

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Chap sidebar: darslar ro'yxati ── */}
      <aside className={clsx(
        'flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300',
        sidebarOpen ? 'flex w-72 shrink-0' : 'hidden'
      )}>
        <div className="border-b border-gray-800 p-4">
          <Link href={`/courses/${id}`} className="mb-3 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Kursga qaytish
          </Link>
          <h2 className="font-semibold text-white line-clamp-2">{course.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.topics?.map((topic) => (
            <TopicList
              key={topic.id}
              topic={topic}
              courseId={Number(id)}
              activeLessonId={Number(lessonId)}
            />
          ))}
        </div>
      </aside>

      {/* ── Asosiy kontent ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <BookOpen className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-white line-clamp-1">{lesson.title}</span>
            {progress?.completed && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {prevLesson && (
              <Link
                href={`/courses/${id}/lesson/${prevLesson.id}`}
                className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" /> Oldingi
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/courses/${id}/lesson/${nextLesson.id}`}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
              >
                Keyingi <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Kontent */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-6">

            {/* ── Slaydlar ── */}
            {lesson.slides && lesson.slides.length > 0 && (
              <SlideViewer slides={lesson.slides} />
            )}

            {/* ── Video tablar (bir nechta video bo'lsa) ── */}
            {lesson.videos && lesson.videos.length > 1 && (
              <div className="mb-4 flex gap-2 overflow-x-auto">
                {lesson.videos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVideo(i)}
                    className={clsx(
                      'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
                      activeVideo === i
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    )}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {v.title}
                    <span className="text-xs opacity-60">{v.duration_display}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Video player ── */}
            {currentVideo && (
              <div className="mb-6">
                <VideoPlayer
                  video={currentVideo}
                  onProgress={handleProgress}
                  onEnded={handleVideoEnded}
                />
                {currentVideo.transcript && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                      Video matni (transcript)
                    </summary>
                    <p className="mt-2 rounded-xl bg-gray-900 p-4 text-sm leading-relaxed text-gray-400">
                      {currentVideo.transcript}
                    </p>
                  </details>
                )}
              </div>
            )}

            {/* ── Matn kontent ── */}
            {lesson.content && (
              <div className="prose prose-invert prose-sm max-w-none rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                  {lesson.content}
                </pre>
              </div>
            )}

            {/* ── Kontent yo'q ── */}
            {!currentVideo && !lesson.content && (!lesson.slides || lesson.slides.length === 0) && (
              <div className="py-16 text-center text-gray-500">
                Bu dars uchun kontent tez orada qo&apos;shiladi
              </div>
            )}

            {/* Bajarildi tugmasi */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
              <div>
                {progress?.completed ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Dars bajarildi!</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Darsni tugatdingizmi?</p>
                )}
              </div>

              <div className="flex gap-2">
                {!progress?.completed && (
                  <button
                    onClick={handleMarkDone}
                    disabled={marking}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-60"
                  >
                    {marking
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <CheckCircle2 className="h-4 w-4" />
                    }
                    Bajarildi deb belgilash
                  </button>
                )}
                {nextLesson && (
                  <Link
                    href={`/courses/${id}/lesson/${nextLesson.id}`}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    Keyingi dars <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopicList({
  topic,
  courseId,
  activeLessonId,
}: {
  topic: NonNullable<Course['topics']>[number]
  courseId: number
  activeLessonId: number
}) {
  const hasActive = topic.lessons?.some((l) => l.id === activeLessonId)
  const [open, setOpen] = useState(!!hasActive)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50"
      >
        <span className="text-sm font-medium text-gray-300 line-clamp-2">{topic.title}</span>
        <ChevronDown className={clsx('h-4 w-4 shrink-0 text-gray-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div>
          {topic.lessons?.map((lesson) => {
            const isActive = lesson.id === activeLessonId
            const Icon = lesson.lesson_type === 'slide' ? Layers : lesson.lesson_type === 'text' ? FileText : lesson.has_video ? Play : Video
            return (
              <Link
                key={lesson.id}
                href={`/courses/${courseId}/lesson/${lesson.id}`}
                className={clsx(
                  'flex items-start gap-2 px-5 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                )}
              >
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">{lesson.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
