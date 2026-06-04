'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Play, PlayCircle, FileText, Maximize2, X, BookOpen } from 'lucide-react'
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
  { id: 'pendulum',    label: 'Matematik mayatnik',         icon: '🕰️', color: '#60a5fa', desc: "Uzunlik va burchakni o'zgartirib kuzating" },
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
  pdfData: string
  pdfName: string
  videoUrl: string
}

interface TopicContent {
  uz: LangContent
  ru: LangContent
  en: LangContent
}

const LANGS: { key: Lang; label: string; flag: string; flagCode: string; color: string }[] = [
  { key: 'uz', label: "O'zbek",  flag: '🇺🇿', flagCode: 'UZ', color: '#34d399' },
  { key: 'ru', label: 'Русский', flag: '🇷🇺', flagCode: 'RU', color: '#60a5fa' },
  { key: 'en', label: 'English', flag: '🇬🇧', flagCode: 'EN', color: '#a78bfa' },
]

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function TopicDetailPage() {
  const params    = useParams()
  const router    = useRouter()
  const sectionId = params.id as string
  const topicId   = params.topicId as string

  const section     = SECTIONS.find(s => s.id === Number(sectionId))
  const accentColor = section?.color ?? '#00D4FF'

  const [lang, setLang]             = useState<Lang>('uz')
  const [content, setContent]       = useState<TopicContent>({
    uz: { pdfData: '', pdfName: '', videoUrl: '' },
    ru: { pdfData: '', pdfName: '', videoUrl: '' },
    en: { pdfData: '', pdfName: '', videoUrl: '' },
  })
  const [topicTitle, setTopicTitle] = useState('')
  const [activeSim, setActiveSim]   = useState<string | null>(null)
  const [simOpen, setSimOpen]       = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`bolim-topics-${sectionId}`)
    if (stored) {
      try {
        const topics = JSON.parse(stored)
        const topic  = topics.find((t: { id: string; title: string }) => t.id === topicId)
        if (topic) setTopicTitle(topic.title)
      } catch { /* ignore */ }
    }
    const storedContent = localStorage.getItem(`bolim-content-${topicId}`)
    if (storedContent) {
      try { setContent(JSON.parse(storedContent)) } catch { /* ignore */ }
    }
  }, [sectionId, topicId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current    = content[lang]
  const langConfig = LANGS.find(l => l.key === lang)!
  const videoId    = extractYouTubeId(current.videoUrl)
  const pdfSrc     = current.pdfData ? `data:application/pdf;base64,${current.pdfData}` : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">

      {/* ── Fullscreen PDF ── */}
      {fullscreen && pdfSrc && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#05050f' }}>
          {/* toolbar */}
          <div
            className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
            style={{ background: 'rgba(8,8,25,0.98)', borderBottom: `1px solid ${langConfig.color}25` }}
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${langConfig.color}18`, border: `1px solid ${langConfig.color}30` }}
            >
              <FileText className="h-4 w-4" style={{ color: langConfig.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{current.pdfName || topicTitle}</p>
              <p className="text-xs" style={{ color: langConfig.color }}>{langConfig.label}</p>
            </div>
            <button
              onClick={() => setFullscreen(false)}
              className="h-9 w-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              title="Yopish (Esc)"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* PDF */}
          <iframe
            ref={iframeRef}
            src={`${pdfSrc}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            className="flex-1 w-full"
            title={current.pdfName}
          />
        </div>
      )}

      {/* Back */}
      <button
        onClick={() => router.push(`/bo-lim/${sectionId}`)}
        className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Mavzular ro&apos;yxati
      </button>

      {/* Title */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
          Mavzu
        </p>
        <h1 className="text-3xl font-black text-white">{topicTitle || '—'}</h1>
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
            <span className="text-xs font-black">{l.flagCode}</span>
            {l.label}
            {content[l.key].pdfData && (
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
            )}
          </button>
        ))}
      </div>

      {/* Two-column */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Left: PDF reader */}
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'rgba(8,8,25,0.8)', border: `1px solid ${langConfig.color}20` }}
        >
          {/* card header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${langConfig.color}15` }}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" style={{ color: langConfig.color }} />
              <span className="text-sm font-bold" style={{ color: langConfig.color }}>
                {langConfig.flag} {langConfig.label} — Dars materiali
              </span>
            </div>
            {pdfSrc && (
              <button
                onClick={() => setFullscreen(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:brightness-125"
                style={{
                  background: `${langConfig.color}18`,
                  color: langConfig.color,
                  border: `1px solid ${langConfig.color}30`,
                }}
                title="To'liq ekranda ochish"
              >
                <Maximize2 className="h-3 w-3" />
                Kengaytirish
              </button>
            )}
          </div>

          {pdfSrc ? (
            /* ── PDF viewer ── */
            <div className="relative flex-1">
              <iframe
                src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full"
                style={{ height: 420 }}
                title={current.pdfName}
              />
              {/* bottom open-fullscreen bar */}
              <button
                onClick={() => setFullscreen(true)}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all"
                style={{
                  background: `linear-gradient(to top, rgba(8,8,25,0.96) 60%, transparent)`,
                  color: langConfig.color,
                }}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                To&apos;liq ekranda o&apos;qish
              </button>
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <FileText className="h-7 w-7 text-gray-700" />
              </div>
              <p className="text-gray-500 text-sm font-semibold">Dars materiali hali yuklanmagan</p>
              <p className="text-gray-700 text-xs">Tez orada qo&apos;shiladi</p>
            </div>
          )}
        </div>

        {/* Right: video */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'rgba(8,8,25,0.8)', border: `1px solid ${langConfig.color}20` }}
        >
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" style={{ color: langConfig.color }} />
            <span className="text-sm font-bold" style={{ color: langConfig.color }}>
              {langConfig.flag} {langConfig.label} — Video dars
            </span>
          </div>

          <div className="relative">
            <Play className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={current.videoUrl}
              readOnly
              placeholder="Video hali qo'shilmagan"
              className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none cursor-default"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${current.videoUrl ? langConfig.color + '30' : 'rgba(255,255,255,0.06)'}`,
              }}
            />
          </div>

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
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
            >
              <PlayCircle className="h-10 w-10 text-gray-700" />
              <p className="text-gray-600 text-sm">Video hali qo&apos;shilmagan</p>
              <p className="text-gray-700 text-xs">Tez orada qo&apos;shiladi</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulatsiyalar */}
      <div className="mt-6 rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,102,241,0.22)', background: 'rgba(6,6,20,0.85)' }}>

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
            {SIMS.length} ta
          </span>
          <span style={{ color: '#6366f1', fontSize: 18, marginLeft: 4 }}>
            {simOpen ? '▲' : '▼'}
          </span>
        </button>

        {simOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
            {activeSim && (
              <div style={{ height: 480, margin: '0 16px 16px', borderRadius: 14, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)' }}>
                {activeSim === 'gravity'     && <GravitySim />}
                {activeSim === 'pendulum'    && <PendulumSim length={2} angleDeg={30} paused={false} speed={1} simKey={0} boardMode={false} />}
                {activeSim === 'elektroskop' && <ElektroskopSim showLabels={false} onToggle={() => {}} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
