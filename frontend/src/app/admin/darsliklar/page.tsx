'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { darsliklarApi } from '@/lib/api'
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  BookMarked,
} from 'lucide-react'

interface Darslik {
  id?: number
  grade: number
  subject: string
  subtitle: string
  icon: string
  color: string
  accent: string
  formulas: string[]
  chapters: number
  pages: number
  pdf_file?: string | null
  is_published: boolean
  order: number
}

const EMPTY: Darslik = {
  grade: 7, subject: '', subtitle: '', icon: '📚',
  color: '#34D399', accent: '#059669', formulas: [],
  chapters: 0, pages: 0, is_published: true, order: 0,
}

const COLORS = [
  { color: '#34D399', accent: '#059669', label: 'Yashil' },
  { color: '#60a5fa', accent: '#2563eb', label: 'Ko\'k' },
  { color: '#a78bfa', accent: '#7c3aed', label: 'Binafsha' },
  { color: '#fb923c', accent: '#c2410c', label: 'To\'q sariq' },
  { color: '#f472b6', accent: '#be185d', label: 'Pushti' },
]

/* ── Formula list editor ── */
function FormulaEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !value.includes(v)) { onChange([...value, v]); setInput('') }
  }
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Masalan: F = ma"
          className="flex-1 rounded-lg px-3 py-2 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-cyan-500"
        />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors">
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((f) => (
          <span key={f}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold bg-gray-700 text-cyan-300">
            {f}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== f))}
              className="text-gray-500 hover:text-red-400 transition-colors">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Darslik form ── */
function DarslikForm({
  initial, onSave, onCancel,
}: {
  initial: Darslik
  onSave: (d: Darslik, file?: File | null) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<Darslik>(initial)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const f = <K extends keyof Darslik>(k: K) => (v: Darslik[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form, file) }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: 'rgba(8,8,25,0.95)', border: '1px solid rgba(0,212,255,0.2)' }}>

      <div className="grid grid-cols-2 gap-4">
        {/* Sinf */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Sinf</label>
          <select value={form.grade} onChange={(e) => f('grade')(Number(e.target.value))}
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white outline-none focus:border-cyan-500">
            {[7, 8, 9, 10, 11].map((g) => (
              <option key={g} value={g}>{g}-sinf</option>
            ))}
          </select>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Emoji</label>
          <input value={form.icon} onChange={(e) => f('icon')(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-2xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-cyan-500" />
        </div>

        {/* Subject */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Fan nomi</label>
          <input value={form.subject} onChange={(e) => f('subject')(e.target.value)} required
            placeholder="Masalan: Mexanika"
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-cyan-500" />
        </div>

        {/* Subtitle */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Qo&apos;shimcha sarlavha</label>
          <input value={form.subtitle} onChange={(e) => f('subtitle')(e.target.value)}
            placeholder="Masalan: Harakat, Kuch va Energiya"
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-cyan-500" />
        </div>

        {/* Chapters */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Boblar soni</label>
          <input type="number" min={0} value={form.chapters} onChange={(e) => f('chapters')(Number(e.target.value))}
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white outline-none focus:border-cyan-500" />
        </div>

        {/* Pages */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Sahifalar soni</label>
          <input type="number" min={0} value={form.pages} onChange={(e) => f('pages')(Number(e.target.value))}
            className="w-full rounded-lg px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white outline-none focus:border-cyan-500" />
        </div>

        {/* Color */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Rang</label>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button key={c.color} type="button"
                onClick={() => setForm((p) => ({ ...p, color: c.color, accent: c.accent }))}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                style={{
                  background: form.color === c.color ? `${c.color}25` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${form.color === c.color ? c.color : 'rgba(255,255,255,0.1)'}`,
                  color: form.color === c.color ? c.color : '#6b7280',
                }}>
                <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Formulalar */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
          Formulalar (Enter bilan qo&apos;shish)
        </label>
        <FormulaEditor value={form.formulas} onChange={f('formulas')} />
      </div>

      {/* PDF */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">PDF fayl (ixtiyoriy)</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#67e8f9' }}>
            Fayl tanlash
          </button>
          <span className="text-sm text-gray-500">
            {file ? file.name : form.pdf_file ? 'Mavjud PDF bor' : 'Fayl tanlanmagan'}
          </span>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
      </div>

      {/* Published + Order */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div onClick={() => f('is_published')(!form.is_published)}
            className="flex h-5 w-5 items-center justify-center rounded transition-all"
            style={{
              background: form.is_published ? '#06b6d4' : 'transparent',
              border: `1.5px solid ${form.is_published ? '#06b6d4' : '#374151'}`,
            }}>
            {form.is_published && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="text-sm text-gray-300">Chop etilgan</span>
        </label>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tartib</label>
          <input type="number" min={0} value={form.order} onChange={(e) => f('order')(Number(e.target.value))}
            className="w-20 rounded-lg px-2 py-1.5 text-sm bg-gray-800 border border-gray-700 text-white outline-none focus:border-cyan-500" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 16px rgba(0,212,255,0.25)' }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <X className="h-4 w-4" /> Bekor
        </button>
      </div>
    </form>
  )
}

/* ── Darslik row ── */
function DarslikRow({
  book, onEdit, onDelete,
}: {
  book: Darslik
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all hover:bg-gray-800/30"
      style={{ border: `1px solid ${book.color}20` }}>
      <div className="h-10 w-10 flex items-center justify-center rounded-xl text-2xl shrink-0"
        style={{ background: `${book.color}18` }}>
        {book.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm">
          <span className="text-cyan-400 mr-1">{book.grade}-sinf</span>
          {book.subject}
        </p>
        <p className="text-xs text-gray-500 truncate">{book.subtitle}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {(book.formulas ?? []).slice(0, 3).map((f) => (
            <span key={f} className="rounded px-1.5 py-0.5 text-xs font-mono"
              style={{ background: `${book.color}15`, color: book.color }}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
        <span>{book.chapters} bob</span>
        <span>{book.pages} bet</span>
        <span className={book.is_published ? 'text-green-400' : 'text-red-400'}>
          {book.is_published ? '● Aktiv' : '○ Yashirin'}
        </span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{ background: 'rgba(0,212,255,0.1)', color: '#67e8f9', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Pencil className="h-3.5 w-3.5" /> Tahrir
        </button>
        <button onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Trash2 className="h-3.5 w-3.5" /> O&apos;chir
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════ PAGE ══════════════════════════════ */
export default function AdminDarsliklarPage() {
  const router = useRouter()
  const user   = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)

  const [books,   setBooks]   = useState<Darslik[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Darslik | null>(null)
  const [adding,  setAdding]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  /* Admin tekshiruvi */
  useEffect(() => {
    if (!initialized) return
    if (!user) { router.replace('/login'); return }
    if (!user.is_staff && user.role !== 'admin') { router.replace('/'); return }
    async function load() {
      try {
        const r = await darsliklarApi.list()
        setBooks(r.data?.results ?? r.data ?? [])
      } catch {
        setError('Darsliklarni yuklashda xatolik')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [initialized, user, router])

  async function handleSave(form: Darslik, file?: File | null) {
    setError(null)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'pdf_file') return
      if (k === 'formulas') fd.append(k, JSON.stringify(v))
      else fd.append(k, String(v))
    })
    if (file) fd.append('pdf_file', file)

    try {
      if (form.id) {
        const r = await darsliklarApi.update(form.id, fd)
        setBooks((p) => p.map((b) => (b.id === form.id ? r.data : b)))
      } else {
        const r = await darsliklarApi.create(fd)
        setBooks((p) => [...p, r.data])
      }
      setEditing(null)
      setAdding(false)
    } catch {
      setError('Saqlashda xatolik yuz berdi')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return
    try {
      await darsliklarApi.remove(id)
      setBooks((p) => p.filter((b) => b.id !== id))
    } catch {
      setError('O\'chirishda xatolik')
    }
  }

  if (!initialized || loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: 'rgba(4,4,14,0.98)' }}>
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Admin panel</span>
            </div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <BookMarked className="h-7 w-7 text-cyan-400" />
              Darsliklarni boshqarish
            </h1>
            <p className="text-gray-500 text-sm mt-1">{books.length} ta darslik</p>
          </div>
          <button
            onClick={() => { setAdding(true); setEditing(null) }}
            disabled={adding}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(0,212,255,0.25)' }}>
            <Plus className="h-4 w-4" /> Yangi darslik
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center justify-between"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            {error}
            <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Add form */}
        {adding && (
          <div className="mb-6">
            <DarslikForm
              initial={EMPTY}
              onSave={handleSave}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {books.length === 0 && !adding ? (
            <div className="py-20 text-center text-gray-600">
              <BookMarked className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Hali darslik qo&apos;shilmagan</p>
            </div>
          ) : books.map((book) => (
            <div key={book.id}>
              {editing?.id === book.id ? (
                <DarslikForm
                  initial={editing!}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <DarslikRow
                  book={book}
                  onEdit={() => { setEditing(book); setAdding(false) }}
                  onDelete={() => book.id && handleDelete(book.id)}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
