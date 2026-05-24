'use client'
import { useState, useRef, useEffect } from 'react'
import { Bot, SendHorizontal, Loader2, Trash2, ChevronDown } from 'lucide-react'

interface Msg { role: 'user' | 'assistant'; content: string }

interface SimChatProps {
  simId: string
  simTitle: string
}

export default function SimChat({ simId, simTitle }: SimChatProps) {
  const [msgs, setMsgs]       = useState<Msg[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(true)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  const scrollDown = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)

  useEffect(() => { scrollDown() }, [msgs.length])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const next: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(next)
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: next.slice(-8),
          mode: ({ electric: 'electric_field' } as Record<string, string>)[simId] ?? 'simple',
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMsgs(p => [...p, { role: 'assistant', content: err.error ?? 'Xatolik yuz berdi.' }])
        return
      }

      const reader = res.body!.getReader()
      const dec    = new TextDecoder()
      let buf = ''
      setMsgs(p => [...p, { role: 'assistant', content: '' }])

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        setMsgs(p => {
          const copy = [...p]
          copy[copy.length - 1] = { role: 'assistant', content: buf }
          return copy
        })
        scrollDown()
      }
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: "Tarmoq xatosi. Qaytadan urinib ko'ring." }])
    } finally {
      setLoading(false)
      scrollDown()
    }
  }

  const QUICK_MAP: Record<string, string[]> = {
    pendulum: [
      'Mayatnik davri nima?',
      "T=2π√(L/g) formulasini tushuntir",
      "Uzunlik 4 marta oshsa davr qanday o'zgaradi?",
      "Nega massa ta'sir qilmaydi?",
    ],
    electric: [
      'Elektr maydon nima?',
      'Kulon qonunini tushuntir',
      'Musbat va manfiy zaryadlar farqi?',
      'Maydon chiziqlari nima?',
    ],
    general: [
      "Nyuton qonunlarini tushuntir",
      'Energiya nima?',
      'Elektr zaryad nima?',
      "To'lqin va tebranish farqi?",
    ],
  }
  const QUICK = QUICK_MAP[simId] ?? QUICK_MAP.general

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(6,6,20,0.97)' }}>

      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-4"
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => e.key === 'Enter' && setOpen(v => !v)}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <Bot className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-white text-sm">🤖 AI Fizika O&apos;qituvchisi</p>
          <p className="text-xs text-gray-500">{simTitle} haqida savol bering</p>
        </div>
        <ChevronDown
          className="h-4 w-4 text-gray-500 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
        {msgs.length > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setMsgs([]) }}
            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title="Tarixni o'chirish"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="border-t border-white/[0.06]">
          {/* Messages */}
          <div
            className="px-4 py-3 space-y-3"
            style={{ minHeight: 80, maxHeight: 340, overflowY: 'auto' }}
          >
            {msgs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-600 mb-3">Quyidagi savollardan birini tanlang yoki o&apos;zingiz yozing</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK.map(q => (
                    <button key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus() }}
                      className="rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: 'rgba(251,191,36,0.08)',
                        border: '1px solid rgba(251,191,36,0.2)',
                        color: '#fbbf24',
                      }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              msgs.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {m.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl mt-0.5"
                      style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
                      <Bot className="h-3.5 w-3.5 text-yellow-400" />
                    </div>
                  )}
                  <div
                    className="max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: m.role === 'user'
                        ? 'linear-gradient(135deg,rgba(59,130,246,0.4),rgba(37,99,235,0.3))'
                        : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.1)'}`,
                      color: m.role === 'user' ? '#e2e8f0' : '#d1d5db',
                      borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.content
                      || (loading && i === msgs.length - 1
                        ? <span className="inline-flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                          </span>
                        : null)
                    }
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.05] px-4 py-3">
            <div className="flex gap-2 items-center">
              <div className="flex flex-1 items-center gap-2 rounded-2xl px-4 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Simulatsiya haqida savol bering..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
                />
                {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-yellow-400" />}
              </div>
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-35"
                style={{
                  background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(245,158,11,0.2))',
                  border: '1px solid rgba(251,191,36,0.4)',
                }}
              >
                <SendHorizontal className="h-4 w-4 text-yellow-300" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-xs text-gray-700">
              Enter = yuborish · AI claude-sonnet-4-6 modelida ishlaydi
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
