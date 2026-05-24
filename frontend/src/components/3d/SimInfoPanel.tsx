'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SIM_INFO } from './SimInfoData'

/* ── Accordion section ── */
function Section({
  icon, title, color, children, defaultOpen = false,
}: {
  icon: string; title: string; color: string
  children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-xl shrink-0">{icon}</span>
        <span className="flex-1 text-sm font-bold" style={{ color }}>{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-gray-600 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? 3000 : 0 }}
      >
        <div className="px-5 pb-5 pt-1 space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── Formula chip ── */
function Formula({ expr, desc }: { expr: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <code
        className="rounded-lg px-3 py-1.5 text-sm font-mono font-bold"
        style={{ background: 'rgba(96,165,250,0.12)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.25)' }}
      >
        {expr}
      </code>
      <span className="pt-1.5 text-xs text-gray-400">{desc}</span>
    </div>
  )
}

/* ── Main panel ── */
export default function SimInfoPanel({ simId }: { simId: string }) {
  const info = SIM_INFO[simId]
  if (!info) return null

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sip-enter { animation: slideUp 0.4s ease; }
      `}</style>

      <div
        key={simId}
        className="sip-enter overflow-hidden rounded-2xl"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(6,6,18,0.97)' }}
      >
        {/* ── Header ── */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">{info.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{info.subtitle}</p>
            </div>
            <div
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-right shrink-0"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}
            >
              <div>{info.year}</div>
              <div className="text-gray-500 font-normal mt-0.5">{info.country}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600">Kashf etgan:</span>
            <span className="text-xs font-semibold text-gray-300">{info.discoverer}</span>
          </div>
        </div>

        {/* ── 1. Tarix ── */}
        <Section icon="📖" title="Tarix va kashfiyot" color="#fbbf24" defaultOpen>
          <p className="text-sm text-gray-300 leading-relaxed">{info.historyStory}</p>
          <div className="mt-3 space-y-1.5">
            {info.historyDev.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="mt-0.5 text-yellow-500">▸</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 2. Jarayon nima ── */}
        <Section icon="🔬" title="Jarayon nima?" color="#60a5fa">
          <div className="space-y-3">
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
            >
              <p className="mb-1 text-xs font-bold text-blue-400">Sodda tushuntirish</p>
              <p className="text-sm text-gray-300 leading-relaxed">{info.whatSimple}</p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="mb-1 text-xs font-bold text-gray-400">Ilmiy tushuntirish</p>
              <p className="text-sm text-gray-300 leading-relaxed">{info.whatScientific}</p>
            </div>
            {info.formulas.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">Asosiy formulalar</p>
                <div className="space-y-2">
                  {info.formulas.map((f, i) => <Formula key={i} {...f} />)}
                </div>
              </div>
            )}
            {info.visual && (
              <pre
                className="rounded-lg px-4 py-3 text-xs leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#9ca3af', fontFamily: 'monospace' }}
              >
                {info.visual}
              </pre>
            )}
          </div>
        </Section>

        {/* ── 3. Kundalik hayot ── */}
        <Section icon="🌍" title="Kundalik hayotda qayerlarda?" color="#34d399">
          <div className="grid gap-2 sm:grid-cols-2">
            {info.daily.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 4. Sohalar ── */}
        <Section icon="🏭" title="Qaysi sohalarda ishlatiladi?" color="#a78bfa">
          <div className="grid gap-2 sm:grid-cols-2">
            {info.fields.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)' }}
              >
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-purple-300">{f.field}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Nima uchun muhim ── */}
        <Section icon="💡" title="Nima uchun muhim?" color="#f87171">
          <p className="text-sm text-gray-300 leading-relaxed">{info.whyText}</p>
          <div
            className="mt-3 rounded-xl p-4"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <p className="text-xs font-bold text-red-400 mb-1">Bu kashfiyotsiz...</p>
            <p className="text-sm text-gray-400">{info.withoutIt}</p>
          </div>
          <div
            className="mt-2 rounded-xl p-4"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            <p className="text-xs font-bold text-yellow-400 mb-1">🔮 Kelajak</p>
            <p className="text-sm text-gray-400">{info.future}</p>
          </div>
          {info.facts.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-bold text-gray-500">🌟 Qiziqarli faktlar</p>
              {info.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-500 shrink-0 mt-0.5">✦</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── 6. Tajriba ── */}
        <Section icon="🧪" title="O'zingiz sinab ko'ring" color="#22d3ee">
          <div className="space-y-3">
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}
            >
              <p className="mb-1 text-xs font-bold text-cyan-400">🏠 Uyda</p>
              <p className="text-sm text-gray-300 leading-relaxed">{info.homeExp}</p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.1)' }}
            >
              <p className="mb-1 text-xs font-bold text-cyan-500">🔬 Laboratoriyada</p>
              <p className="text-sm text-gray-300 leading-relaxed">{info.labExp}</p>
            </div>
            <div
              className="flex items-start gap-2 rounded-xl p-3"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              <span className="text-base shrink-0">⚠️</span>
              <p className="text-xs text-gray-400">{info.safety}</p>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
