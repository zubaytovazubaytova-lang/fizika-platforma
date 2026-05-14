'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Course } from '@/types'
import {
  BookOpen, Clock, User, Play, ChevronDown, ChevronRight,
  CheckCircle2, Lock, Loader2, BarChart3, Video, FileText,
} from 'lucide-react'
import clsx from 'clsx'

const LEVEL_LABEL: Record<string, string> = {
  beginner:     'Boshlang\'ich',
  intermediate: 'O\'rta',
  advanced:     'Yuqori',
}
const LEVEL_COLOR: Record<string, string> = {
  beginner:     'bg-green-900/40 text-green-400',
  intermediate: 'bg-yellow-900/40 text-yellow-400',
  advanced:     'bg-red-900/40 text-red-400',
}

function TopicAccordion({
  topic,
  index,
  courseId,
}: {
  topic: NonNullable<Course['topics']>[number]
  index: number
  courseId: number
}) {
  const [open, setOpen] = useState(index === 0)

  const totalSecs = topic.lessons?.reduce((s, l) => s + (l.total_duration_seconds ?? 0), 0) ?? 0
  const mins = Math.round(totalSecs / 60)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-gray-900 px-5 py-4 text-left hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900/50 text-xs font-bold text-blue-300">
            {index + 1}
          </span>
          <div>
            <p className="font-medium text-white">{topic.title}</p>
            <p className="text-xs text-gray-500">
              {topic.lesson_count} dars {mins > 0 && `· ${mins} daqiqa`}
            </p>
          </div>
        </div>
        <ChevronDown className={clsx('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="divide-y divide-gray-800/50 border-t border-gray-800">
          {topic.lessons?.map((lesson, li) => {
            const lessonMins = Math.round((lesson.total_duration_seconds ?? 0) / 60)
            const Icon = lesson.lesson_type === 'video' ? Play : lesson.lesson_type === 'text' ? FileText : Video
            return (
              <Link
                key={lesson.id}
                href={lesson.is_free_preview ? `/courses/${courseId}/lesson/${lesson.id}` : '#'}
                className={clsx(
                  'flex items-center gap-3 px-5 py-3 text-sm transition-colors',
                  lesson.is_free_preview
                    ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white cursor-pointer'
                    : 'text-gray-500 cursor-default'
                )}
              >
                <span className="text-xs text-gray-600 w-5 shrink-0">{li + 1}.</span>
                <Icon className={clsx('h-4 w-4 shrink-0', lesson.is_free_preview ? 'text-blue-400' : 'text-gray-600')} />
                <span className="flex-1">{lesson.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {lessonMins > 0 && <span className="text-xs text-gray-500">{lessonMins} daq</span>}
                  {lesson.is_free_preview
                    ? <span className="rounded-full bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300">Bepul</span>
                    : <Lock className="h-3.5 w-3.5 text-gray-600" />
                  }
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CourseDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)

  const [course, setCourse]     = useState<Course | null>(null)
  const [loading, setLoading]   = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError]       = useState(false)

  useEffect(() => {
    coursesApi.detail(Number(id))
      .then((r) => { setCourse(r.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return }
    setEnrolling(true)
    try {
      await coursesApi.enroll(Number(id))
      setCourse((c) => c ? { ...c, is_enrolled: true } : c)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
  )

  if (error || !course) return (
    <div className="py-32 text-center text-gray-400">
      Kurs topilmadi.{' '}
      <Link href="/courses" className="text-blue-400 hover:underline">Orqaga</Link>
    </div>
  )

  const firstFreeLesson = course.topics
    ?.flatMap((t) => t.lessons ?? [])
    .find((l) => l.is_free_preview)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">

        {/* ── Chap: kurs tafsiloti ── */}
        <div className="lg:col-span-2">

          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/courses" className="hover:text-gray-300">Kurslar</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-300 truncate">{course.title}</span>
          </div>

          {/* Sarlavha */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {course.category && (
              <span className="rounded-full bg-blue-900/40 px-3 py-1 text-xs text-blue-300">
                {course.category.name}
              </span>
            )}
            {course.level && (
              <span className={clsx('rounded-full px-3 py-1 text-xs', LEVEL_COLOR[course.level])}>
                {LEVEL_LABEL[course.level]}
              </span>
            )}
            {course.is_free && (
              <span className="rounded-full bg-green-900/40 px-3 py-1 text-xs text-green-400">
                Bepul
              </span>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight">{course.title}</h1>
          <p className="mb-6 text-gray-400 leading-relaxed">{course.description}</p>

          {/* Stats */}
          <div className="mb-8 flex flex-wrap gap-6 text-sm text-gray-400">
            {[
              { icon: BookOpen, label: `${course.topic_count ?? 0} mavzu` },
              { icon: FileText, label: `${course.lesson_count ?? 0} dars` },
              { icon: Video,    label: `${course.video_count ?? 0} video` },
              { icon: Clock,    label: `${course.total_duration_minutes ?? 0} daqiqa` },
              { icon: User,     label: course.teacher?.full_name ?? course.teacher?.username ?? '' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-blue-400" />{label}
              </span>
            ))}
          </div>

          {/* Mavzular */}
          <h2 className="mb-4 text-xl font-semibold">Kurs tarkibi</h2>
          {course.topics && course.topics.length > 0 ? (
            <div className="space-y-3">
              {course.topics.map((topic, i) => (
                <TopicAccordion key={topic.id} topic={topic} index={i} courseId={course.id} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              Darslar tez orada qo&apos;shiladi
            </p>
          )}
        </div>

        {/* ── O'ng: yozilish kartasi ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            {/* Thumbnail */}
            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
              {course.thumbnail
                ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                : <BookOpen className="h-16 w-16 text-blue-300 opacity-40" />
              }
            </div>

            <div className="p-5">
              {/* Progress (yozilgan bo'lsa) */}
              {course.is_enrolled && (
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Jarayon</span>
                    <span className="font-medium text-white">0%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full w-0 rounded-full bg-blue-500" />
                  </div>
                </div>
              )}

              {/* Narx */}
              <p className="mb-4 text-center text-2xl font-bold">
                {course.is_free ? (
                  <span className="text-green-400">Bepul</span>
                ) : (
                  <span>Pullik</span>
                )}
              </p>

              {/* Tugmalar */}
              {course.is_enrolled ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-green-900/30 py-2.5 text-sm font-medium text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Yozilgansiz
                  </div>
                  {firstFreeLesson && (
                    <Link
                      href={`/courses/${course.id}/lesson/${firstFreeLesson.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      <Play className="h-4 w-4" /> O&apos;qishni davom ettirish
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    {enrolling
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <BarChart3 className="h-4 w-4" />
                    }
                    {enrolling ? 'Yozilmoqda...' : 'Kursga yozilish'}
                  </button>
                  {firstFreeLesson && (
                    <Link
                      href={`/courses/${course.id}/lesson/${firstFreeLesson.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 py-2.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white"
                    >
                      <Play className="h-4 w-4" /> Bepul ko&apos;rish
                    </Link>
                  )}
                </div>
              )}

              {/* Kurs haqida */}
              <div className="mt-5 space-y-2 border-t border-gray-800 pt-4 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>O&apos;qituvchi</span>
                  <span className="font-medium text-white">
                    {course.teacher?.full_name ?? course.teacher?.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daraja</span>
                  <span className="font-medium text-white">
                    {LEVEL_LABEL[course.level ?? 'beginner']}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mavzular</span>
                  <span className="font-medium text-white">{course.topic_count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Darslar</span>
                  <span className="font-medium text-white">{course.lesson_count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Videolar</span>
                  <span className="font-medium text-white">{course.video_count ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
