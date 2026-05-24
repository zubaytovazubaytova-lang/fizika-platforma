'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'
import { aiApi } from '@/lib/api'
import { Conversation, Message } from '@/types'
import {
  Send, Plus, Loader2, Paperclip, Smile,
  ChevronLeft, ChevronRight, Sparkles, Zap, BookOpen,
  FlaskConical, LogIn, Star, Clock, ChevronDown,
  Copy, ThumbsUp, ThumbsDown, Check, X,
  BookMarked, Atom, Thermometer, Eye, GraduationCap,
} from 'lucide-react'
import clsx from 'clsx'

/* ══════════════════════════════════════════════════════
   KATEX — formula rendering
══════════════════════════════════════════════════════ */
let katexLoaded = false
let katexLib: typeof import('katex') | null = null

async function loadKatex() {
  if (katexLoaded) return katexLib
  try {
    katexLib = await import('katex')
    // inject katex CSS once
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link')
      link.id = 'katex-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
      document.head.appendChild(link)
    }
    katexLoaded = true
  } catch { /* no katex */ }
  return katexLib
}

function renderMath(text: string, katex: typeof import('katex') | null): string {
  if (!katex) return text
  try {
    return text
      .replace(/\$\$([^$]+)\$\$/g, (_, m) => {
        try { return `<span class="katex-display-wrap">${katex.default.renderToString(m, { displayMode: true, throwOnError: false })}</span>` }
        catch { return `$$${m}$$` }
      })
      .replace(/\$([^$\n]+)\$/g, (_, m) => {
        try { return katex.default.renderToString(m, { displayMode: false, throwOnError: false }) }
        catch { return `$${m}$` }
      })
  } catch { return text }
}

/* ══════════════════════════════════════════════════════
   PRESET TOPICS
══════════════════════════════════════════════════════ */
const TOPICS = [
  {
    id: 'mexanika', name: 'Mexanika', icon: Zap, color: '#00D4FF',
    questions: [
      "Nyutonning 3 ta qonunini misollar bilan tushuntir",
      "$F=ma$ formulasini izohlang va misol yozing",
      "Erkin tushish tezlanishi $g=9.8$ m/s² bo'lishini tushuntir",
      "Impuls va kuch orasidagi bog'liqlik",
      "Energiya saqlanish qonuni",
    ],
  },
  {
    id: 'elektr', name: 'Elektr', icon: Zap, color: '#8B5CF6',
    questions: [
      "Om qonuni $V=IR$ ni tushuntir",
      "Kondensator va sig'im nima?",
      "Elektr toki qanday vujudga keladi?",
      "Seriya va parallel ulanish farqi",
    ],
  },
  {
    id: 'optika', name: 'Optika', icon: Eye, color: '#FFB347',
    questions: [
      "Yorug'likning sinishi qonunini tushuntir",
      "Linzalar formulasi $\\frac{1}{f}=\\frac{1}{d_o}+\\frac{1}{d_i}$",
      "Interferensiya va difraksiya nima?",
      "Ranglar spektri haqida",
    ],
  },
  {
    id: 'termo', name: 'Termodinamika', icon: Thermometer, color: '#F97316',
    questions: [
      "Issiqlik miqdori formulasi $Q=mc\\Delta T$",
      "Termodinamikning 1-qonuni",
      "Ideal gaz qonunlari $PV=nRT$",
      "Entropiya nima?",
    ],
  },
  {
    id: 'kvant', name: 'Kvant fizika', icon: Atom, color: '#EC4899',
    questions: [
      "Kvant mexanikasining asosiy g'oyalari",
      "Fotoeffekt va $E=h\\nu$ formulasi",
      "De Broyl to'lqini nima?",
      "Geyzenberg noaniqlik prinsipi",
    ],
  },
]

const READ_MODES = [
  { id: 'simple', label: 'Oddiy',    icon: BookOpen,     desc: 'Sodda tilda, asosiy tushunchalar' },
  { id: 'deep',   label: 'Chuqur',   icon: BookMarked,   desc: "To'liq ilmiy tushuntirish" },
  { id: 'exam',   label: 'Imtihon',  icon: GraduationCap,desc: 'Test va masalalar bilan' },
]

const EMOJIS = ['😊','🤔','💡','📚','⚡','🔭','🧪','✅','❓','🎯','🌟','🔬','📐','🎲','🚀','🧲']

/* ══════════════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-4 md:px-6">
      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-sm"
        style={{ boxShadow: '0 0 14px rgba(0,212,255,0.3)' }}>🤖</div>
      <div className="rounded-2xl rounded-bl-sm px-4 py-3"
        style={{ background: 'linear-gradient(135deg, rgba(0,30,60,0.9), rgba(30,10,60,0.8))', border: '1px solid rgba(0,212,255,0.15)' }}>
        <div className="flex items-center gap-1.5">
          {[0,1,2].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-cyan-400"
              style={{ animation: `blink 1.4s ${i*0.2}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════════════ */
interface BubbleProps {
  msg:        Message
  idx:        number
  katex:      typeof import('katex') | null
  favorites:  Set<number>
  onFav:      (id: number) => void
}

function Bubble({ msg, idx, katex, favorites, onFav }: BubbleProps) {
  const isUser   = msg.role === 'user'
  const [liked,   setLiked]   = useState<boolean | null>(null)
  const [copied,  setCopied]  = useState(false)
  const time = new Date(msg.created_at).toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' })

  const rendered = useMemo(() => renderMath(msg.content, katex), [msg.content, katex])

  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (isUser) return (
    <div className="flex items-end justify-end gap-2.5 px-4 md:px-6 bubble-in"
      style={{ animationDelay: `${Math.min(idx*30,300)}ms` }}>
      <div className="max-w-[72%]">
        <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed text-white"
          style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
          {msg.content}
        </div>
        <p className="mt-1 text-right text-xs text-gray-600">{time}</p>
      </div>
      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">S</div>
    </div>
  )

  return (
    <div className="flex items-start gap-2.5 px-4 md:px-6 bubble-in" style={{ animationDelay: `${Math.min(idx*30,300)}ms` }}>
      <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-sm mt-1"
        style={{ boxShadow: '0 0 14px rgba(0,212,255,0.25)' }}>🤖</div>

      <div className="max-w-[76%]">
        {/* Bubble */}
        <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-gray-100"
          style={{ background: 'linear-gradient(135deg,rgba(0,30,60,0.9),rgba(30,10,60,0.8))', border:'1px solid rgba(0,212,255,0.12)', boxShadow:'0 4px 20px rgba(0,0,0,0.35)' }}>
          {/* KaTeX rendered content */}
          <div
            className="prose-sm whitespace-pre-wrap [&_.katex-display-wrap]:block [&_.katex-display-wrap]:my-2 [&_.katex-display-wrap]:text-center"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>

        {/* Actions */}
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-xs text-gray-600 mr-1">{time}</span>
          <button onClick={() => setLiked(true)}
            className={clsx('flex h-6 w-6 items-center justify-center rounded-lg text-xs transition-all hover:bg-gray-800',
              liked === true ? 'text-green-400' : 'text-gray-600')}>
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setLiked(false)}
            className={clsx('flex h-6 w-6 items-center justify-center rounded-lg text-xs transition-all hover:bg-gray-800',
              liked === false ? 'text-red-400' : 'text-gray-600')}>
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button onClick={copy}
            className="flex h-6 items-center gap-1 rounded-lg px-1.5 text-xs text-gray-600 transition-all hover:bg-gray-800 hover:text-gray-300">
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Nusxalandi' : 'Nusxa'}</span>
          </button>
          <button onClick={() => onFav(msg.id)}
            className={clsx('flex h-6 w-6 items-center justify-center rounded-lg transition-all hover:bg-gray-800',
              favorites.has(msg.id) ? 'text-yellow-400' : 'text-gray-600')}>
            <Star className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
type SideTab = 'topics' | 'history' | 'favorites'

interface SidebarFullProps {
  open:       boolean
  onToggle:   () => void
  convs:      Conversation[]
  active:     number | null
  favMsgs:    Message[]
  readMode:   string
  onMode:     (m: string) => void
  onSelect:   (id: number) => void
  onNew:      () => void
  onDelete:   (id: number, e: React.MouseEvent) => void
  onQuestion: (q: string) => void
}

function SidebarFull({ open, onToggle, convs, active, favMsgs, readMode, onMode, onSelect, onNew, onDelete, onQuestion }: SidebarFullProps) {
  const [tab, setTab]         = useState<SideTab>('topics')
  const [expanded, setExpanded] = useState<string | null>('mexanika')

  return (
    <aside className={clsx('flex flex-col border-r shrink-0 transition-all duration-300', open ? 'w-72' : 'w-14')}
      style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(5,5,20,0.85)', backdropFilter:'blur(12px)' }}>

      {/* Toggle + New */}
      <div className={clsx('flex items-center gap-2 border-b p-3', open ? 'justify-between' : 'flex-col justify-center')}
        style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <button onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-800/60 hover:text-white transition-all">
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <button onClick={onNew}
          className={clsx('flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all', open ? 'flex-1 py-2 px-3' : 'h-8 w-8')}
          style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border:'1px solid rgba(0,212,255,0.25)', boxShadow:'0 0 12px rgba(0,212,255,0.15)' }}>
          <Plus className="h-4 w-4 shrink-0 text-cyan-400" />
          {open && <span>Yangi suhbat</span>}
        </button>
      </div>

      {open && (
        <>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            {([['topics','Mavzu'],['history','Tarix'],['favorites','Sevimli']] as [SideTab,string][]).map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx('flex-1 py-2 text-xs font-semibold transition-all',
                  tab===t ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300')}>
                {l}
              </button>
            ))}
          </div>

          {/* Reading mode */}
          <div className="border-b px-3 py-2.5" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
            <p className="mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">O&apos;qish rejimi</p>
            <div className="flex gap-1">
              {READ_MODES.map((m) => (
                <button key={m.id} onClick={() => onMode(m.id)} title={m.desc}
                  className={clsx('flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all',
                    readMode===m.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-300 border border-transparent')}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">

            {/* TOPICS */}
            {tab==='topics' && (
              <div className="p-2 space-y-1">
                {TOPICS.map((topic) => {
                  const Icon = topic.icon
                  const isOpen = expanded===topic.id
                  return (
                    <div key={topic.id}>
                      <button onClick={() => setExpanded(isOpen ? null : topic.id)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-800/50 text-gray-300 hover:text-white">
                        <div className="h-6 w-6 shrink-0 rounded-lg flex items-center justify-center"
                          style={{ background:`${topic.color}18` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color:topic.color }} />
                        </div>
                        <span className="flex-1 text-left">{topic.name}</span>
                        <ChevronDown className={clsx('h-3.5 w-3.5 text-gray-600 transition-transform', isOpen && 'rotate-180')} />
                      </button>
                      {isOpen && (
                        <div className="ml-9 mr-2 mb-1 space-y-0.5">
                          {topic.questions.map((q) => (
                            <button key={q} onClick={() => onQuestion(q)}
                              className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-800/60 hover:text-white transition-all leading-snug">
                              {/* Strip latex for display */}
                              {q.replace(/\$[^$]*\$/g, '').trim() || q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* HISTORY */}
            {tab==='history' && (
              <div className="p-2 space-y-0.5">
                {convs.length===0 && <p className="py-8 text-center text-xs text-gray-600">Hali suhbat yo&apos;q</p>}
                {convs.map((c) => {
                  const date = new Date(c.updated_at ?? c.created_at)
                  const timeStr = date.toLocaleDateString('uz-UZ', { day:'2-digit', month:'short' }) + ' ' +
                    date.toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' })
                  return (
                    <div key={c.id} onClick={() => onSelect(c.id)}
                      className={clsx('group flex items-start gap-2 rounded-xl p-2.5 cursor-pointer transition-all',
                        active===c.id ? 'bg-cyan-500/15 border border-cyan-500/20' : 'hover:bg-gray-800/50 border border-transparent')}>
                      <Sparkles className={clsx('h-4 w-4 shrink-0 mt-0.5', active===c.id ? 'text-cyan-400' : 'text-gray-600')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{c.title || 'Yangi suhbat'}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <p className="text-xs text-gray-600">{timeStr}</p>
                        </div>
                        {c.last_message && <p className="text-xs text-gray-600 truncate mt-0.5">{c.last_message.content}</p>}
                      </div>
                      <button onClick={(e) => onDelete(c.id, e)} className="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity mt-0.5">
                        <X className="h-3.5 w-3.5 text-gray-600 hover:text-red-400" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* FAVORITES */}
            {tab==='favorites' && (
              <div className="p-2">
                {favMsgs.length===0
                  ? (
                    <div className="py-8 text-center">
                      <Star className="mx-auto mb-2 h-8 w-8 text-gray-700" />
                      <p className="text-xs text-gray-600">Yulduzcha bosib sevimli savollarni saqlang</p>
                    </div>
                  )
                  : favMsgs.map((m) => (
                    <div key={m.id} className="rounded-xl border border-yellow-900/30 bg-yellow-900/10 p-3 mb-2">
                      <p className="text-xs text-gray-300 leading-snug">{m.content.slice(0,120)}{m.content.length>120 && '...'}</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </>
      )}

      {/* Collapsed icons */}
      {!open && (
        <div className="flex flex-col items-center gap-2 py-3">
          {([['topics', Zap], ['history', Clock], ['favorites', Star]] as [SideTab, React.ComponentType<{className?:string}>][]).map(([t, Icon]) => (
            <button key={t} onClick={() => { onToggle(); setTab(t) }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-800/60 hover:text-gray-300 transition-all">
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}

/* ══════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════ */
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-10 gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(139,92,246,0.15))', border:'1px solid rgba(0,212,255,0.25)', boxShadow:'0 0 40px rgba(0,212,255,0.12)' }}>
          🤖
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">FizikaAI Yordamchi</h2>
          <p className="text-gray-400 mt-1 text-sm">Chap paneldan mavzu tanlang yoki savol yozing</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {[
          { icon:FlaskConical, text:"Nyutonning 2-qonunini $F=ma$ bilan tushuntir", color:'#00D4FF' },
          { icon:Zap,          text:"Elektr toki va $V=IR$ formulasi haqida", color:'#8B5CF6' },
          { icon:BookOpen,     text:"Kvant mexanikasida $E=h\\nu$ nimani anglatadi?", color:'#FFB347' },
          { icon:Atom,         text:"$E=mc^2$ Eynshteyn formulasi nima?", color:'#34D399' },
        ].map(({ icon:Icon, text, color }) => (
          <button key={text} onClick={onNew}
            className="flex items-start gap-3 rounded-2xl p-4 text-left text-sm text-gray-300 hover:text-white transition-all"
            style={{ background:'rgba(10,10,30,0.6)', border:`1px solid ${color}18` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor=`${color}40` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor=`${color}18` }}>
            <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background:`${color}18` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="leading-snug">{text.replace(/\$[^$]*\$/g,'').trim()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   INPUT BAR
══════════════════════════════════════════════════════ */
interface InputBarProps {
  value:    string
  onChange: (v:string) => void
  onSend:   () => void
  disabled: boolean
  sending:  boolean
}
function InputBar({ value, onChange, onSend, disabled, sending }: InputBarProps) {
  const ref       = useRef<HTMLTextAreaElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  useEffect(() => {
    const t = ref.current; if (!t) return
    t.style.height = 'auto'
    t.style.height = `${Math.min(t.scrollHeight,180)}px`
  }, [value])

  const addEmoji = (emoji: string) => {
    onChange(value + emoji)
    setShowEmoji(false)
    ref.current?.focus()
  }

  return (
    <div className="px-4 pb-4 pt-3 md:px-6">
      <div className="relative flex items-end gap-2 rounded-2xl p-2"
        style={{ background:'rgba(12,12,35,0.85)', border:'1px solid rgba(0,212,255,0.18)', boxShadow:'0 0 0 1px rgba(0,212,255,0.05), 0 8px 32px rgba(0,0,0,0.5)', backdropFilter:'blur(16px)' }}>

        {/* Attach */}
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-800/60 hover:text-gray-300 transition-all">
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Textarea */}
        <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKey}
          placeholder="FizikaAI ga yozing... (Enter=yuborish, Shift+Enter=yangi qator, $F=ma$ LaTeX ishlaydi)"
          rows={1}
          className="flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder-gray-600 focus:outline-none leading-relaxed"
          style={{ maxHeight:'180px', minHeight:'36px' }} />

        {/* Emoji toggle */}
        <div className="relative shrink-0">
          <button onClick={() => setShowEmoji((v)=>!v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-800/60 hover:text-gray-300 transition-all">
            <Smile className="h-4 w-4" />
          </button>
          {showEmoji && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                padding: '10px',
                borderRadius: '16px',
                background: 'rgba(10,10,30,0.97)',
                border: '1px solid rgba(0,212,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                backdropFilter: 'blur(16px)',
                width: '168px',
                zIndex: 50,
              }}
            >
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  onClick={() => addEmoji(em)}
                  style={{
                    fontSize: '20px',
                    lineHeight: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, background 0.15s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send */}
        <button onClick={onSend} disabled={disabled || sending}
          className={clsx('relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-all', !disabled ? 'text-white cursor-pointer' : 'text-gray-600 cursor-not-allowed')}
          style={!disabled ? { background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 20px rgba(0,212,255,0.4)' } : { background:'rgba(30,30,50,0.6)' }}>
          {!disabled && <span className="shimmer absolute inset-0" />}
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-700">
        $LaTeX$ formulalar avtomatik render bo&apos;ladi · Enter — yuborish
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   LOGIN OVERLAY
══════════════════════════════════════════════════════ */
function LoginOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center"
      style={{ backdropFilter:'blur(10px)', background:'rgba(5,5,16,0.78)' }}>
      <div className="flex flex-col items-center gap-6 rounded-3xl p-10 text-center max-w-sm w-full mx-4"
        style={{ background:'rgba(10,10,30,0.92)', border:'1px solid rgba(0,212,255,0.20)', boxShadow:'0 0 60px rgba(0,212,255,0.08), 0 30px 60px rgba(0,0,0,0.6)' }}>
        <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border:'1px solid rgba(0,212,255,0.25)', boxShadow:'0 0 30px rgba(0,212,255,0.15)' }}>
          🤖
        </div>
        <div>
          <h2 className="text-xl font-black text-white mb-2">FizikaAI Yordamchi</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            AI yordamchidan foydalanish uchun{' '}
            <span className="text-cyan-400 font-semibold">hisobingizga kirishingiz</span> kerak
          </p>
        </div>
        <ul className="space-y-2 text-left w-full">
          {['Fizika savollariga darhol javob','Masalalarni bosqichma-bosqich yechish',"O'zbek tilida 24/7 yordam"].map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-sm text-gray-300">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 w-full">
          <Link href="/login?next=/ai-tutor"
            className="relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl py-3 font-bold text-white"
            style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow:'0 0 25px rgba(0,212,255,0.35)' }}>
            <span className="shimmer absolute inset-0" />
            <LogIn className="h-4 w-4" /> Kirish
          </Link>
          <Link href="/register?next=/ai-tutor"
            className="flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-gray-300 hover:text-white transition-all"
            style={{ border:'1px solid rgba(255,255,255,0.10)', background:'rgba(255,255,255,0.03)' }}>
            Ro&apos;yxatdan o&apos;tish — bepul
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function AITutorPage() {
  const user        = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)

  const [convs,       setConvs]       = useState<Conversation[]>([])
  const [active,      setActive]      = useState<number | null>(null)
  const [messages,    setMessages]    = useState<Message[]>([])
  const [input,       setInput]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [typing,      setTyping]      = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [readMode,    setReadMode]    = useState('simple')
  const [favorites,   setFavorites]   = useState<Set<number>>(new Set())
  const [katexLib,    setKatexLib]    = useState<typeof import('katex') | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isGuest = initialized && !user

  // Load KaTeX
  useEffect(() => { loadKatex().then(setKatexLib) }, [])

  useEffect(() => {
    if (!user) return
    aiApi.conversations()
      .then((r) => { setConvs(r.data.results ?? r.data); setLoadingPage(false) })
      .catch(() => setLoadingPage(false))
  }, [user])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, typing])

  const openConv = useCallback(async (id: number) => {
    setActive(id); setMessages([])
    const r = await aiApi.conversation(id)
    setMessages(r.data.messages ?? [])
  }, [])

  const newConv = useCallback(async () => {
    const r = await aiApi.newConversation()
    setConvs((p) => [r.data, ...p])
    setActive(r.data.id); setMessages([])
  }, [])

  const delConv = useCallback(async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    await aiApi.deleteConversation(id)
    setConvs((p) => p.filter((c) => c.id !== id))
    if (active === id) { setActive(null); setMessages([]) }
  }, [active])

  const toggleFav = useCallback((id: number) => {
    setFavorites((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }, [])

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || sending) return

    // Suhbat yo'q bo'lsa yangi yaratamiz
    let convId = active
    if (!convId) {
      try {
        const r = await aiApi.newConversation()
        setConvs((p) => [r.data, ...p])
        convId = r.data.id
        setActive(convId)
      } catch { return }
    }

    setInput('')
    const now = new Date().toISOString()
    const userId  = Date.now()
    const aiId    = Date.now() + 1

    // User xabari qo'shiladi
    const userMsg: Message = { id: userId, role: 'user', content: msg, created_at: now }
    // AI xabari bo'sh holda qo'shiladi — streaming to'ldiradi
    const aiMsg: Message   = { id: aiId,   role: 'assistant', content: '', created_at: now }

    setMessages((p) => [...p, userMsg, aiMsg])
    setSending(true)
    setTyping(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          // Kontekst uchun oxirgi 10 xabar
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          mode: readMode,
        }),
      })

      if (!res.ok || !res.body) {
        const errJson = await res.json().catch(() => ({}))
        const errText = errJson.error ?? `HTTP ${res.status}`
        setMessages((p) => p.map((m) => m.id === aiId ? { ...m, content: `⚠️ ${errText}` } : m))
        return
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let firstChunk = true

      while (true) { // stream loop
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        if (firstChunk) {
          setTyping(false)  // typing dots o'chadi, matn boshlanadi
          firstChunk = false
        }

        // Streaming matnni AI xabariga qo'shamiz
        setMessages((p) => p.map((m) =>
          m.id === aiId ? { ...m, content: m.content + chunk } : m
        ))
      }

      // Sidebar'da so'nggi xabarni yangilaymiz
      setMessages((current) => {
        const last = current.find((m) => m.id === aiId)
        if (last) {
          setConvs((p) => p.map((c) => c.id === convId
            ? { ...c, title: c.title || msg.slice(0, 40), last_message: last }
            : c
          ))
        }
        return current
      })

    } catch (err) {
      setTyping(false)
      const errMsg = err instanceof Error ? err.message : 'Tarmoq xatosi'
      setMessages((p) => p.map((m) => m.id === aiId ? { ...m, content: `⚠️ ${errMsg}` } : m))
    } finally {
      setSending(false)
      setTyping(false)
    }
  }, [input, active, sending, messages, readMode])

  const handleQuestion = useCallback((q: string) => {
    // send() endi o'zi suhbat yaratadi agar yo'q bo'lsa
    setInput('')
    send(q)
  }, [send])

  const favMessages = useMemo(() => messages.filter((m) => favorites.has(m.id)), [messages, favorites])

  if (!initialized) return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
    </div>
  )

  return (
    <div className="relative flex" style={{ height:'calc(100vh - 64px)' }}>

      {/* Login overlay */}
      {isGuest && <LoginOverlay />}

      {/* Sidebar */}
      <SidebarFull
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v)=>!v)}
        convs={convs}
        active={active}
        favMsgs={favMessages}
        readMode={readMode}
        onMode={setReadMode}
        onSelect={openConv}
        onNew={newConv}
        onDelete={delConv}
        onQuestion={handleQuestion}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0" style={{ background:'rgba(5,5,16,0.95)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b shrink-0"
          style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(7,7,22,0.92)', backdropFilter:'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-base"
              style={{ boxShadow:'0 0 14px rgba(0,212,255,0.3)' }}>🤖</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-sm">FizikaAI</h1>
                <span className="flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/25 px-2 py-0.5 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Faol
                </span>
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-gray-500 border border-gray-800">
                  {READ_MODES.find((m)=>m.id===readMode)?.label} rejim
                </span>
              </div>
              <p className="text-xs text-gray-500">Claude AI · Fizika mutaxassisi · $LaTeX$ qo&apos;llab-quvvatlanadi</p>
            </div>
          </div>
          {active !== null && <span className="text-xs text-gray-600">{messages.length} xabar</span>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto py-6 space-y-4">
          {loadingPage && user ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
          ) : active===null ? (
            <EmptyState onNew={newConv} />
          ) : (
            <>
              {messages.length===0 && !typing && (
                <p className="text-center text-gray-600 text-sm py-12">Suhbatni boshlang — savolingizni yozing</p>
              )}
              {messages.map((m,i) => (
                <Bubble key={m.id} msg={m} idx={i} katex={katexLib} favorites={favorites} onFav={toggleFav} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <InputBar
          value={input}
          onChange={setInput}
          onSend={() => send()}
          disabled={active===null || !input.trim()}
          sending={sending}
        />
      </div>
    </div>
  )
}
