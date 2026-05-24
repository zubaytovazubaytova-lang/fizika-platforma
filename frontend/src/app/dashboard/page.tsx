'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { coursesApi, testsApi } from '@/lib/api'
import { Enrollment, QuizAttempt } from '@/types'
import { Home, BookOpen, Zap, Bot, Trophy, Heart, Settings, LogOut, Star, TrendingUp, Clock, ChevronRight, BarChart2 } from 'lucide-react'
import clsx from 'clsx'

/* ── Counter hook ── */
function useCounter(target: number, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let cur = 0; const step = target / 50
      const id = setInterval(() => { cur+=step; if(cur>=target){setVal(target);clearInterval(id)}else setVal(Math.floor(cur)) },20)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return val
}

/* ── Progress bar ── */
function AnimBar({ pct, color }: { pct: number; color: string }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t=setTimeout(()=>setW(pct),500); return ()=>clearTimeout(t) }, [pct])
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width:`${w}%`, background:color }}/>
    </div>
  )
}

/* ── Weekly chart ── */
function WeekChart({ data }: { data: number[] }) {
  const days = ['Du','Se','Cho','Pa','Ju','Sha','Ya']
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {data.map((v,i)=>(
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-lg transition-all duration-700"
            style={{ height:`${(v/max)*80}px`, minHeight:'4px', background:i===new Date().getDay()-1?'linear-gradient(180deg,#06b6d4,#3b82f6)':'rgba(0,212,255,0.2)' }}/>
          <span className="text-xs text-gray-600">{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

const NAV = [
  { icon:Home,     label:'Bosh sahifa', href:'/dashboard', match:'/dashboard' },
  { icon:BookOpen, label:'Kurslar',     href:'/courses',   match:'/courses'   },
  { icon:Zap,      label:'Testlar',     href:'/tests',     match:'/tests'     },
  { icon:Bot,      label:'AI Tutor',    href:'/ai-tutor',  match:'/ai-tutor'  },
  { icon:Trophy,   label:'Yutuqlar',    href:'/profile',   match:'/profile'   },
  { icon:Heart,    label:'Sevimlilar',  href:'/profile',   match:''           },
]

export default function DashboardPage() {
  const router      = useRouter()
  const user        = useAuthStore((s)=>s.user)
  const initialized = useAuthStore((s)=>s.initialized)
  const logout      = useAuthStore((s)=>s.logout)

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [attempts,    setAttempts]    = useState<QuizAttempt[]>([])

  useEffect(() => {
    if (initialized && !user) { router.replace('/login'); return }
    if (!user) return
    coursesApi.myCourses().then((r)=>setEnrollments(r.data.results??r.data)).catch(()=>{})
    testsApi.attempts().then((r)=>setAttempts(r.data.results??r.data)).catch(()=>{})
  }, [user, initialized, router])

  const totalCourses = useCounter(enrollments.length, 200)
  const totalTests   = useCounter(attempts.length, 350)
  const passed       = useCounter(attempts.filter(a=>a.is_passed).length, 500)
  const avgScore     = useCounter(attempts.length ? Math.round(attempts.reduce((s,a)=>s+a.score,0)/attempts.length) : 0, 650)

  const handleLogout = async () => { await logout(); router.push('/') }

  if (!initialized) return null
  if (!user) return null

  const weekData = [30,60,45,80,55,90,40]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r"
        style={{ background:'rgba(5,5,18,0.9)', borderColor:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)' }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm"
              style={{ boxShadow:'0 0 14px rgba(0,212,255,0.3)' }}>⚛️</div>
            <span className="font-black text-white">Fizika <span className="text-cyan-400">AI</span></span>
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm font-black text-white">
              {(user.first_name?.[0]??user.username[0]).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{user.first_name?`${user.first_name} ${user.last_name}`.trim():user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({icon:Icon,label,href,match})=>{
            const active = typeof window!=='undefined' && window.location.pathname===match
            return (
              <Link key={label} href={href}
                className={clsx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active ? 'text-cyan-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white')}
                style={active?{ background:'rgba(0,212,255,0.12)', border:'1px solid rgba(0,212,255,0.2)', boxShadow:'0 0 10px rgba(0,212,255,0.1)' }:{ border:'1px solid transparent' }}>
                <Icon className="h-4 w-4 shrink-0"/> {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
          <Link href="/profile/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all"
            style={{ border:'1px solid transparent' }}>
            <Settings className="h-4 w-4"/> Sozlamalar
          </Link>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-all"
            style={{ border:'1px solid transparent' }}>
            <LogOut className="h-4 w-4"/> Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-7" style={{ background:'rgba(4,4,14,0.95)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="slide-up">
            <h1 className="text-2xl font-black text-white">
              Salom, {user.first_name||user.username}! 👋
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Bugun ham yangi bilim olasizmi?</p>
          </div>
          <div className="flex gap-2 slide-up-d1">
            <Link href="/ai-tutor"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-green-400"
              style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"/> AI faol
            </Link>
            <Link href="/courses"
              className="relative overflow-hidden rounded-xl px-4 py-2 text-xs font-bold text-white"
              style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 16px rgba(0,212,255,0.25)' }}>
              <span className="shimmer absolute inset-0"/> + Yangi dars
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {[
            { label:"O'rganilgan kurs", value:totalCourses, color:'#00D4FF', icon:'📚', sub:'kurs' },
            { label:"O'tgan testlar",   value:totalTests,   color:'#8B5CF6', icon:'📝', sub:'test' },
            { label:"O'tilgan testlar", value:passed,        color:'#34D399', icon:'🏆', sub:'muvaffaq' },
            { label:"O'rtacha ball",    value:`${avgScore}%`,color:'#FFB347', icon:'⭐', sub:'natija' },
          ].map(({ label,value,color,icon,sub })=>(
            <div key={label} className="rounded-2xl p-5 slide-up"
              style={{ background:'rgba(8,8,25,0.8)', border:`1px solid ${color}20`, backdropFilter:'blur(12px)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-xl">{icon}</span>
              </div>
              <div className="text-3xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Continue learning */}
          <div className="rounded-2xl p-5 slide-up-d2"
            style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(12px)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> Davom etish
            </h2>
            {enrollments.length===0 ? (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-700"/>
                <p className="text-gray-500 text-sm mb-3">Hali kurs yo&apos;q</p>
                <Link href="/courses" className="text-cyan-400 text-sm hover:underline">Kurslarni ko&apos;rish →</Link>
              </div>
            ) : enrollments.slice(0,3).map((e)=>(
              <div key={e.id} className="flex items-center gap-4 mb-4 last:mb-0">
                <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-lg"
                  style={{ background:'rgba(0,212,255,0.1)' }}>📚</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{e.course.title}</p>
                  <div className="mt-1.5">
                    <AnimBar pct={e.progress_percent} color="linear-gradient(90deg,#06b6d4,#3b82f6)"/>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{e.progress_percent}% bajarildi</p>
                </div>
                <span className="text-sm font-bold text-cyan-400 shrink-0">{e.progress_percent}%</span>
              </div>
            ))}
            <Link href="/courses"
              className="relative mt-4 w-full overflow-hidden flex justify-center rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ background:'linear-gradient(135deg,rgba(6,182,212,0.2),rgba(59,130,246,0.2))', border:'1px solid rgba(0,212,255,0.25)' }}>
              Barcha kurslar <ChevronRight className="h-4 w-4"/>
            </Link>
          </div>

          {/* Weekly progress */}
          <div className="rounded-2xl p-5 slide-up-d2"
            style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(12px)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-purple-400"/> Haftalik progress
            </h2>
            <WeekChart data={weekData}/>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label:'Bu hafta',  value:'6 dars',  color:'#8B5CF6' },
                { label:"O'tkazildi", value:'2 test', color:'#FFB347' },
                { label:'Streak',     value:'🔥 5 kun', color:'#EF4444' },
              ].map(({ label,value,color })=>(
                <div key={label} className="rounded-xl p-2.5" style={{ background:`${color}10`, border:`1px solid ${color}20` }}>
                  <div className="text-sm font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tests */}
          <div className="rounded-2xl p-5 slide-up-d3"
            style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(12px)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400"/> Tezkor testlar
            </h2>
            <div className="space-y-3">
              {[
                { title:'Kinematika mini-test',  meta:'10 savol · 15 daq',  color:'#00D4FF', id:1 },
                { title:'Elektr toki asoslari',  meta:'15 savol · 20 daq',  color:'#8B5CF6', id:6 },
                { title:'Optika: linza va ko\'zgu',meta:'12 savol · 18 daq', color:'#FFB347', id:9 },
              ].map((t)=>(
                <div key={t.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-800/30 transition-colors">
                  <div className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-lg"
                    style={{ background:`${t.color}15` }}>📝</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.meta}</p>
                  </div>
                  <Link href={`/tests/${t.id}`}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                    style={{ background:`linear-gradient(135deg,${t.color}bb,${t.color}88)`, boxShadow:`0 0 10px ${t.color}33` }}>
                    Start
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl p-5 slide-up-d3"
            style={{ background:'rgba(8,8,25,0.8)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(12px)' }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400"/> So&apos;nggi faollik
            </h2>
            <div className="space-y-3">
              {attempts.length===0 ? (
                <p className="text-center text-sm text-gray-500 py-4">Hali faollik yo&apos;q</p>
              ) : attempts.slice(0,4).map((a)=>(
                <div key={a.id} className="flex items-center gap-3">
                  <div className={clsx('h-2 w-2 shrink-0 rounded-full',a.is_passed?'bg-green-400':'bg-red-400')}/>
                  <p className="flex-1 text-sm text-gray-300 truncate">Test #{a.quiz}</p>
                  <span className={clsx('text-sm font-bold shrink-0',a.is_passed?'text-green-400':'text-red-400')}>{a.score}%</span>
                  <span className="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                    <Clock className="h-3 w-3"/>{new Date(a.started_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
