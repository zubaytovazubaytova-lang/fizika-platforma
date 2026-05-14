export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'student' | 'teacher' | 'admin'
  avatar: string | null
  bio: string
  phone: string
  date_joined: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Video {
  id: number
  title: string
  source: 'youtube' | 'vimeo' | 'upload' | 'other'
  video_url: string
  embed_url: string
  video_id: string
  thumbnail: string | null
  duration_seconds: number
  duration_display: string
  order: number
  transcript: string
}

export interface Lesson {
  id: number
  title: string
  content: string
  lesson_type: 'text' | 'video' | 'mixed'
  order: number
  is_free_preview: boolean
  has_video: boolean
  total_duration_seconds: number
  videos: Video[]
  created_at: string
}

export interface Topic {
  id: number
  title: string
  description: string
  order: number
  lesson_count: number
  lessons: Lesson[]
}

export interface Course {
  id: number
  title: string
  slug: string
  description: string
  teacher: User
  category: Category
  level: 'beginner' | 'intermediate' | 'advanced'
  thumbnail: string | null
  topic_count: number
  lesson_count: number
  video_count: number
  total_duration_minutes: number
  is_free: boolean
  is_enrolled?: boolean
  topics?: Topic[]
  created_at: string
}

export interface Enrollment {
  id: number
  course: Course
  progress_percent: number
  enrolled_at: string
}

export interface LessonProgress {
  id: number
  lesson: number
  completed: boolean
  completed_at: string | null
  watch_seconds: number
}

export interface Choice {
  id: number
  text: string
  is_correct?: boolean
}

export interface Question {
  id: number
  text: string
  question_type: 'single' | 'multiple'
  points: number
  order: number
  choices: Choice[]
}

export interface Quiz {
  id: number
  title: string
  description: string
  time_limit_minutes: number
  pass_score: number
  question_count: number
  questions?: Question[]
}

export interface QuizAttempt {
  id: number
  quiz: number
  score: number
  is_passed: boolean
  started_at: string
  completed_at: string | null
  answers: UserAnswerResult[]
}

export interface UserAnswerResult {
  question_text: string
  chosen_choices: Choice[]
  correct_choices: Choice[]
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Conversation {
  id: number
  title: string
  last_message: Message | null
  created_at: string
  updated_at: string
  messages?: Message[]
}
