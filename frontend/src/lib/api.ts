import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getStoredAuth(): { accessToken?: string; refreshToken?: string } {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('fizika-auth')
    if (!raw) return {}
    return JSON.parse(raw)?.state ?? {}
  } catch {
    return {}
  }
}

function setStoredTokens(access: string, refresh?: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('fizika-auth')
    const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 }
    parsed.state.accessToken = access
    if (refresh) parsed.state.refreshToken = refresh
    localStorage.setItem('fizika-auth', JSON.stringify(parsed))
  } catch { /* ignore */ }
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const { accessToken } = getStoredAuth()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const { refreshToken } = getStoredAuth()
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: refreshToken })
          setStoredTokens(data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login/', { username, password }),
  register: (data: object) =>
    api.post('/auth/register/', data),
  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
  me: () => api.get('/auth/me/'),
  updateMe: (data: Partial<{ first_name: string; last_name: string; email: string; bio: string; phone: string }>) =>
    api.patch('/auth/me/', data),
  changePassword: (old_password: string, new_password: string, new_password2: string) =>
    api.post('/auth/change-password/', { old_password, new_password, new_password2 }),
}

// Courses
export const coursesApi = {
  list: (params?: Record<string, string>) =>
    api.get('/courses/', { params }),
  detail: (id: number) => api.get(`/courses/${id}/`),
  enroll: (id: number) => api.post(`/courses/${id}/enroll/`),
  lesson: (id: number) => api.get(`/courses/lesson/${id}/`),
  lessonDone: (id: number) => api.post(`/courses/lesson/${id}/done/`),
  watchTime: (id: number, watch_seconds: number) =>
    api.patch(`/courses/lesson/${id}/watch/`, { watch_seconds }),
  video: (id: number) => api.get(`/courses/video/${id}/`),
  myCourses: () => api.get('/courses/my/'),
  categories: () => api.get('/courses/categories/'),
}

// Tests
export const testsApi = {
  list: (params?: Record<string, string>) =>
    api.get('/tests/', { params }),
  detail: (id: number) => api.get(`/tests/${id}/`),
  submit: (id: number, answers: { question_id: number; choice_ids: number[] }[]) =>
    api.post(`/tests/${id}/submit/`, { answers }),
  attempts: () => api.get('/tests/attempts/'),
  attemptDetail: (id: number) => api.get(`/tests/attempts/${id}/`),
}

// AI Tutor
export const aiApi = {
  conversations: () => api.get('/ai/'),
  newConversation: () => api.post('/ai/'),
  conversation: (id: number) => api.get(`/ai/${id}/`),
  send: (id: number, message: string) =>
    api.post(`/ai/${id}/send/`, { message }),
  deleteConversation: (id: number) => api.delete(`/ai/${id}/`),
}
