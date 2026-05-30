'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, CheckCircle, Play, PlayCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

const GravitySim     = dynamic(() => import('@/components/3d/GravitySim'),     { ssr: false, loading: () => <SimLoading /> })
const PendulumSim    = dynamic(() => import('@/components/3d/PendulumSim'),    { ssr: false, loading: () => <SimLoading /> })
const ElektroskopSim = dynamic(() => import('@/components/3d/ElektroskopSim'), { ssr: false, loading: () => <SimLoading /> })

function SimLoading() {
  return (
    <div style={{
      width: '100%', height: 420, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'rgba(6,8,22,0.9)',
      borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⚛️</div>
        <p style={{ fontSize: 13 }}>Simulatsiya yuklanmoqda...</p>
      </div>
    </div>
  )
}

const SIMS = [
  { id: 'gravity',     label: "g = 9.8 — Yerning Imzosi",  icon: '🌍', color: '#6366f1', desc: '6 sahnali interaktiv gravitatsiya simulatsiyasi' },
  { id: 'pendulum',    label: 'Matematik mayatnik',         icon: '🕰️', color: '#60a5fa', desc: 'Uzunlik va burchakni o\'zgartirib kuzating' },
  { id: 'elektroskop', label: 'Elektroskop',                icon: '⚡', color: '#fbbf24', desc: 'Elektr zaryadlarni 3D da kuzating' },
]

const SECTIONS = [
  { id: 1,  color: '#00D4FF' }, { id: 2,  color: '#8B5CF6' },
  { id: 3,  color: '#34D399' }, { id: 4,  color: '#FFB347' },
  { id: 5,  color: '#3B82F6' }, { id: 6,  color: '#EC4899' },
  { id: 7,  color: '#06B6D4' }, { id: 8,  color: '#F97316' },
  { id: 9,  color: '#EAB308' }, { id: 10, color: '#10B981' },
  { id: 11, color: '#A78BFA' }, { id: 12, color: '#EF4444' },
  { id: 13, color: '#F59E0B' }, { id: 14, color: '#6366F1' },
  { id: 15, color: '#8B5CF6' },
]

type Lang = 'uz' | 'ru' | 'en'

interface LangContent {
  text: string
  videoUrl: string
}

interface TopicContent {
  uz: LangContent
  ru: LangContent
  en: LangContent
}

const EMPTY_CONTENT: TopicContent = {
  uz: { text: '', videoUrl: '' },
  ru: { text: '', videoUrl: '' },
  en: { text: '', videoUrl: '' },
}

const LANGS: { key: Lang; label: string; flag: string; color: string; placeholder: string; videoPlaceholder: string }[] = [
  {
    key: 'uz', label: "O'zbek", flag: '🇺🇿', color: '#34d399',
    placeholder: "O'zbek tilida mavzu matnini kiriting...",
    videoPlaceholder: "O'zbek tilidagi YouTube havolasi...",
  },
  {
    key: 'ru', label: 'Русский', flag: '🇷🇺', color: '#60a5fa',
    placeholder: 'Введите текст темы на русском языке...',
    videoPlaceholder: 'Ссылка на YouTube на русском языке...',
  },
  {
    key: 'en', label: 'English', flag: '🇬🇧', color: '#a78bfa',
    placeholder: 'Enter topic text in English...',
    videoPlaceholder: 'YouTube link in English...',
  },
]

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sectionId = params.id as string
  const topicId   = params.topicId as string

  const section = SECTIONS.find(s => s.id === Number(sectionId))
  const accentColor = section?.color ?? '#00D4FF'

  const [lang, setLang]           = useState<Lang>('uz')
  const [content, setContent]     = useState<TopicContent>(EMPTY_CONTENT)
  const [topicTitle, setTopicTitle] = useState('')
  const [saved, setSaved]         = useState(false)
  const [activeSim, setActiveSim] = useState<string | null>(null)
  const [simOpen, setSimOpen]     = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`bolim-topics-${sectionId}`)
    if (stored) {
      try {
        const topics = JSON.parse(stored)
        const topic = topics.find((t: { id: string; title: string }) => t.id === topicId)
        if (topic) setTopicTitle(topic.title)
      } catch { /* ignore */ }
    }
    const storedContent = localStorage.getItem(`bolim-content-${topicId}`)
    if (storedContent) {
      try { setContent(JSON.parse(storedContent)) } catch { /* ignore */ }
    }
  }, [sectionId, topicId])

  const updateField = (field: keyof LangContent, value: string) => {
    setSaved(false)
    setContent(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }))
  }

  const saveAll = () => {
    localStorage.setItem(`bolim-content-${topicId}`, JSON.stringify(content))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const current    = content[lang]
  const langConfig = LANGS.find(l => l.key === lang)!
  const videoId    = extractYouTubeId(current.videoUrl)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">

      {/* Back */}
      <button
        onClick={() => router.push(`/bo-lim/${sectionId}`)}
        className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Mavzular ro&apos;yxati
      </button>

      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
            Mavzu
          </p>
          <h1 className="text-3xl font-black text-white">{topicTitle || '—'}</h1>
        </div>
        <button
          onClick={saveAll}
          className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all"
          style={{
            background: saved
              ? 'rgba(52,211,153,0.15)'
              : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: saved ? '#34d399' : '#000',
            border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
            boxShadow: saved ? 'none' : `0 4px 20px ${accentColor}40`,
          }}
        >
          {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saqlandi!' : 'Saqlash'}
        </button>
      </div>

      {/* Language tabs */}
      <div
        className="flex rounded-xl p-1 gap-1 mb-6 w-fit"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {LANGS.map(l => (
          <button
            key={l.key}
            onClick={() => setLang(l.key)}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all"
            style={{
              background: lang === l.key ? `${l.color}18` : 'transparent',
              color: lang === l.key ? l.color : '#6b7280',
              border: lang === l.key ? `1px solid ${l.color}30` : '1px solid transparent',
            }}
          >
            <span>{l.flag}</span>
            {l.label}
            {content[l.key].text.trim() && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: l.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Left: text content */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: 'rgba(8,8,25,0.8)',
            border: `1px solid ${langConfig.color}20`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{langConfig.flag}</span>
            <span className="text-sm font-bold" style={{ color: langConfig.color }}>
              {langConfig.label} — Mavzu matni
            </span>
          </div>
          <textarea
            value={current.text}
            onChange={e => updateField('text', e.target.value)}
            placeholder={langConfig.placeholder}
            rows={14}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none leading-relaxed transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${current.text ? langConfig.color + '35' : 'rgba(255,255,255,0.07)'}`,
              minHeight: '280px',
            }}
          />
          <p className="text-xs text-gray-600">
            {current.text.length} belgi
          </p>
        </div>

        {/* Right: video */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: 'rgba(8,8,25,0.8)',
            border: `1px solid ${langConfig.color}20`,
          }}
        >
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" style={{ color: langConfig.color }} />
            <span className="text-sm font-bold" style={{ color: langConfig.color }}>
              {langConfig.label} — Video dars
            </span>
          </div>

          {/* Video URL input */}
          <div className="relative">
            <Play className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={current.videoUrl}
              onChange={e => updateField('videoUrl', e.target.value)}
              placeholder={langConfig.videoPlaceholder}
              className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${current.videoUrl ? langConfig.color + '40' : 'rgba(255,255,255,0.08)'}`,
              }}
            />
          </div>

          {/* Video player */}
          {videoId ? (
            <div className="rounded-xl overflow-hidden aspect-video"
              style={{ border: `1px solid ${langConfig.color}20` }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="rounded-xl aspect-video flex flex-col items-center justify-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.07)',
              }}
            >
              <PlayCircle className="h-10 w-10 text-gray-700" />
              <p className="text-gray-600 text-sm text-center">
                YouTube havolasini yuqoriga kiriting
              </p>
              <p className="text-gray-700 text-xs">
                Masalan: https://youtu.be/xxxxx
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Simulatsiyalar bo'limi ── */}
      <div className="mt-6 rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,102,241,0.22)', background: 'rgba(6,6,20,0.85)' }}>

        {/* Header — ochish/yopish */}
        <button
          onClick={() => setSimOpen(v => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
        >
          <span style={{ fontSize: 20 }}>🎮</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Simulatsiyalar</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeSim ? SIMS.find(s => s.id === activeSim)?.label : '3D interaktiv tajribalar'}
            </p>
          </div>
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 700,
          }}>
            {SIMS.filter(s => ['gravity', 'pendulum', 'elektroskop'].includes(s.id)).length} ta
          </span>
          <span style={{ color: '#6366f1', fontSize: 18, marginLeft: 4 }}>
            {simOpen ? '▲' : '▼'}
          </span>
        </button>

        {simOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

            {/* Sim tanlash kartochkalari */}
            <div className="flex gap-3 p-4 flex-wrap">
              {SIMS.map(sim => (
                <button key={sim.id}
                  onClick={() => setActiveSim(activeSim === sim.id ? null : sim.id)}
                  style={{
                    padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                    background: activeSim === sim.id ? `${sim.color}22` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeSim === sim.id ? sim.color : 'rgba(255,255,255,0.09)'}`,
                    color: activeSim === sim.id ? sim.color : 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s', textAlign: 'left', minWidth: 170,
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{sim.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{sim.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.55, lineHeight: 1.4 }}>{sim.desc}</div>
                </button>
              ))}
            </div>

            {/* Tanlangan simulatsiya */}
            {activeSim && (
              <div style={{ height: 480, margin: '0 16px 16px', borderRadius: 14, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)' }}>
                {activeSim === 'gravity'     && <GravitySim />}
                {activeSim === 'pendulum'    && (
                  <PendulumSim length={2} angleDeg={30} paused={false} speed={1} simKey={0} boardMode={false} />
                )}
                {activeSim === 'elektroskop' && (
                  <ElektroskopSim showLabels={false} onToggle={() => {}} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* All languages overview */}
      <div
        className="mt-6 rounded-2xl p-5"
        style={{ background: 'rgba(8,8,25,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Barcha tillar holati
        </p>
        <div className="grid grid-cols-3 gap-3">
          {LANGS.map(l => {
            const c = content[l.key]
            const hasText  = c.text.trim().length > 0
            const hasVideo = extractYouTubeId(c.videoUrl) !== null
            return (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className="rounded-xl p-3 text-left transition-all hover:brightness-110"
                style={{
                  background: lang === l.key ? `${l.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${lang === l.key ? l.color + '30' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{l.flag}</span>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.label}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs rounded px-1.5 py-0.5 ${hasText ? 'text-green-400 bg-green-400/10' : 'text-gray-600 bg-gray-800'}`}>
                    Matn {hasText ? '✓' : '—'}
                  </span>
                  <span className={`text-xs rounded px-1.5 py-0.5 ${hasVideo ? 'text-green-400 bg-green-400/10' : 'text-gray-600 bg-gray-800'}`}>
                    Video {hasVideo ? '✓' : '—'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
