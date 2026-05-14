'use client'
import { useEffect, useState } from 'react'
import { coursesApi } from '@/lib/api'
import { Course, Category } from '@/types'
import Link from 'next/link'
import { BookOpen, Clock, User, Video, Search, SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'

const LEVELS = [
  { value: '',             label: 'Barchasi'      },
  { value: 'beginner',     label: 'Boshlang\'ich' },
  { value: 'intermediate', label: 'O\'rta'        },
  { value: 'advanced',     label: 'Yuqori'        },
]

const LEVEL_COLOR: Record<string, string> = {
  beginner:     'text-green-400 bg-green-900/30',
  intermediate: 'text-yellow-400 bg-yellow-900/30',
  advanced:     'text-red-400 bg-red-900/30',
}

function CourseCard({ course }: { course: Course }) {
  const mins = course.total_duration_minutes ?? 0
  const duration = mins >= 60 ? `${Math.floor(mins / 60)}s ${mins % 60}d` : `${mins} daq`

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-blue-900/10"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          : <BookOpen className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-blue-300 opacity-40" />
        }
        {course.is_free && (
          <span className="absolute right-3 top-3 rounded-full bg-green-600/90 px-2 py-0.5 text-xs font-medium text-white">
            Bepul
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Meta */}
        <div className="mb-2 flex items-center gap-2">
          {course.category && (
            <span className="text-xs font-medium text-blue-400">{course.category.name}</span>
          )}
          {course.level && (
            <span className={clsx('rounded-full px-2 py-0.5 text-xs', LEVEL_COLOR[course.level])}>
              {LEVELS.find((l) => l.value === course.level)?.label}
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 font-semibold text-white group-hover:text-blue-300 transition-colors">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-400">{course.description}</p>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-800 pt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {course.teacher?.full_name ?? course.teacher?.username}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              {course.video_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CoursesPage() {
  const [courses, setCourses]       = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [level, setLevel]           = useState('')
  const [category, setCategory]     = useState('')

  useEffect(() => {
    coursesApi.categories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (search)   params.search   = search
    if (level)    params.level    = level
    if (category) params.category = category

    coursesApi.list(params)
      .then((r) => { setCourses(r.data.results ?? r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search, level, category])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Kurslar</h1>
        <p className="mt-1 text-gray-400">Fizika fanini chuqur o&apos;rganing</p>
      </div>

      {/* Filterlar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {/* Qidiruv */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs qidirish..."
            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Daraja */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm transition-colors',
                level === l.value
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Kategoriya */}
        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Barcha kategoriya</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Kurslar */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-800" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="py-24 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-700" />
          <p className="text-gray-400">Kurs topilmadi</p>
          {(search || level || category) && (
            <button
              onClick={() => { setSearch(''); setLevel(''); setCategory('') }}
              className="mt-3 text-sm text-blue-400 hover:underline"
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">{courses.length} ta kurs topildi</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
