'use client'
import { useEffect, useRef, useState } from 'react'
import { aiApi } from '@/lib/api'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Conversation, Message } from '@/types'
import {
  Bot, Send, Plus, Trash2, ChevronRight,
  Loader2, MessageSquare, Sparkles,
} from 'lucide-react'
import clsx from 'clsx'

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={clsx(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
        isUser ? 'bg-blue-600' : 'bg-purple-900/60 border border-purple-700/50'
      )}>
        {isUser
          ? <span className="text-xs font-bold text-white">S</span>
          : <Bot className="h-4 w-4 text-purple-400" />
        }
      </div>
      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm'
      )}>
        <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
        <p className={clsx('mt-1 text-xs', isUser ? 'text-blue-200' : 'text-gray-500')}>
          {new Date(msg.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default function AiTutorPage() {
  const { loading: authLoading } = useRequireAuth()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId]           = useState<number | null>(null)
  const [messages, setMessages]           = useState<Message[]>([])
  const [input, setInput]                 = useState('')
  const [sending, setSending]             = useState(false)
  const [loadingConvs, setLoadingConvs]   = useState(true)
  const [loadingMsgs, setLoadingMsgs]     = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(true)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (authLoading) return
    aiApi.conversations()
      .then((r) => { setConversations(r.data.results ?? r.data); setLoadingConvs(false) })
      .catch(() => setLoadingConvs(false))
  }, [authLoading])

  useEffect(() => {
    if (!activeId) return
    setLoadingMsgs(true)
    aiApi.conversation(activeId)
      .then((r) => { setMessages(r.data.messages ?? []); setLoadingMsgs(false) })
      .catch(() => setLoadingMsgs(false))
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleNewConversation() {
    try {
      const { data } = await aiApi.newConversation()
      setConversations((prev) => [data, ...prev])
      setActiveId(data.id)
      setMessages([])
    } catch { /* ignore */ }
  }

  async function handleDelete(convId: number, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await aiApi.deleteConversation(convId)
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (activeId === convId) { setActiveId(null); setMessages([]) }
    } catch { /* ignore */ }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || sending || !activeId) return
    const optimistic: Message = {
      id: Date.now(), role: 'user', content: text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setInput('')
    setSending(true)
    try {
      const { data } = await aiApi.send(activeId, text)
      setMessages((prev) => [...prev, data])
      setConversations((prev) =>
        prev.map((c) => c.id === activeId
          ? { ...c, last_message: data, updated_at: new Date().toISOString() } : c)
      )
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (authLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">

      {/* Sidebar */}
      <aside className={clsx(
        'flex flex-col border-r border-gray-800 bg-gray-950 transition-all duration-300',
        sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
      )}>
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold text-white">Suhbatlar</h2>
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600/20 px-3 py-1.5 text-xs font-medium text-purple-400 hover:bg-purple-600/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Yangi
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {loadingConvs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-700" />
              <p className="text-xs text-gray-500">Hali suhbat yo&apos;q</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={clsx(
                    'group flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors',
                    activeId === conv.id
                      ? 'bg-purple-900/30 text-white'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {conv.title || `Suhbat #${conv.id}`}
                    </p>
                    {conv.last_message && (
                      <p className="truncate text-xs text-gray-600">{conv.last_message.content}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="shrink-0 rounded p-0.5 text-gray-600 opacity-0 hover:text-red-400 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Chat */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ChevronRight className={clsx('h-5 w-5 transition-transform', sidebarOpen && 'rotate-180')} />
          </button>
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="font-semibold">Fizika AI Tutor</span>
          <span className="ml-auto text-xs text-gray-500">Enter — yuborish · Shift+Enter — yangi qator</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!activeId ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-700/30 bg-purple-900/30">
                <Bot className="h-10 w-10 text-purple-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Fizika AI Tutor</h2>
              <p className="mb-8 max-w-sm text-gray-400">
                Fizika bo&apos;yicha har qanday savolingizni bering.
                Formulalar, masalalar, tushuntirishlar — hammasi o&apos;zbek tilida.
              </p>
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500 transition-colors"
              >
                <Plus className="h-5 w-5" /> Yangi suhbat boshlash
              </button>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Nyutonning ikkinchi qonunini tushuntiring",
                  "Ohm qonuni nima?",
                  "Yorug'lik tezligi nima uchun muhim?",
                  "Termodinamikaning birinchi qonuni",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={async () => {
                      const { data } = await aiApi.newConversation()
                      setConversations((prev) => [data, ...prev])
                      setActiveId(data.id)
                      setMessages([])
                      setInput(q)
                      setTimeout(() => inputRef.current?.focus(), 100)
                    }}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-left text-sm text-gray-300 hover:border-gray-700 hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : loadingMsgs ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-700/50 bg-purple-900/60">
                    <Bot className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {activeId && (
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-end gap-3 rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 focus-within:border-purple-600/60 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Savolingizni yozing..."
                disabled={sending}
                className="flex-1 resize-none bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                style={{ maxHeight: '120px' }}
                onInput={(e) => {
                  const t = e.currentTarget
                  t.style.height = 'auto'
                  t.style.height = `${Math.min(t.scrollHeight, 120)}px`
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40 transition-colors"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
