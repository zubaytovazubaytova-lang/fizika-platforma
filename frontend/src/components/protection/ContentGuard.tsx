'use client'
import { useEffect, useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'

/* ── Toast notification ── */
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl"
      style={{
        background: 'rgba(8,8,25,0.97)',
        border: '1px solid rgba(239,68,68,0.35)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 40px rgba(239,68,68,0.15), 0 16px 48px rgba(0,0,0,0.6)',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '340px',
      }}
    >
      <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-bold text-red-300">Himoyalangan kontent</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{msg}</p>
      </div>
      <button onClick={onClose} className="text-gray-600 hover:text-gray-400 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ── Global watermark overlay ── */
function WatermarkOverlay() {
  /* SVG-encoded repeating diagonal text */
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120'>
    <text x='10' y='55' font-family='Arial' font-size='14' font-weight='bold'
      fill='rgba(0,212,255,0.045)' transform='rotate(-30 110 60)'>FizikaAI</text>
  </svg>`
  const encoded = encodeURIComponent(svg)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encoded}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '220px 120px',
      }}
    />
  )
}

/* ══════════════════════════════════════════ */
export default function ContentGuard() {
  const [toast, setToast] = useState<string | null>(null)

  const warn = (msg: string) => setToast(msg)

  useEffect(() => {
    /* ── Block right-click ── */
    const onContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      /* Allow right-click only on input/textarea fields */
      if (target.matches('input,textarea,[contenteditable]')) return
      e.preventDefault()
      warn("O'ng tugma bloklangan. Kontent mualliflik huquqi bilan himoyalangan.")
    }

    /* ── Keyboard shortcuts ── */
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      /* Ctrl+S — save */
      if (ctrl && e.key === 's') {
        e.preventDefault()
        warn("Saqlash bloklangan. Kontent mualliflik huquqi bilan himoyalangan.")
        return
      }
      /* Ctrl+P — print */
      if (ctrl && e.key === 'p') {
        e.preventDefault()
        warn("Chop etish bloklangan. Kontent mualliflik huquqi bilan himoyalangan.")
        return
      }
      /* Ctrl+U — view source */
      if (ctrl && e.key === 'u') {
        e.preventDefault()
        warn("Manba kodini ko'rish bloklangan.")
        return
      }
      /* F12 — devtools */
      if (e.key === 'F12') {
        e.preventDefault()
        warn("Ishlab chiquvchi vositalari bloklangan.")
        return
      }
      /* Ctrl+Shift+I/J/C — devtools */
      if (ctrl && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        warn("Ishlab chiquvchi vositalari bloklangan.")
        return
      }
    }

    /* ── Print media block ── */
    const onBeforePrint = () => {
      warn("Chop etish mualliflik huquqi bilan himoyalangan.")
    }

    /* ── Visibility change — approximates screenshot/screen-share detection ── */
    let lastHidden = 0
    const onVisChange = () => {
      if (document.hidden) {
        lastHidden = Date.now()
      } else {
        /* If window was hidden < 3 seconds — likely a screenshot or app switch */
        if (lastHidden && Date.now() - lastHidden < 3000) {
          warn("Bu kontent mualliflik huquqi bilan himoyalangan. Screenshot taqiqlangan.")
        }
      }
    }

    document.addEventListener('contextmenu', onContext)
    document.addEventListener('keydown', onKey)
    window.addEventListener('beforeprint', onBeforePrint)
    document.addEventListener('visibilitychange', onVisChange)

    /* Disable drag on images & videos */
    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement
      if (t.matches('img,video,iframe')) e.preventDefault()
    }
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('contextmenu', onContext)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('beforeprint', onBeforePrint)
      document.removeEventListener('visibilitychange', onVisChange)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return (
    <>
      <WatermarkOverlay />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Print block styles injected globally */}
      <style>{`
        @media print {
          body::before {
            content: 'Bu kontent mualliflik huquqi bilan himoyalangan — FizikaAI';
            display: block;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            padding: 40px;
          }
          main, .printable-block { display: none !important; }
        }
        /* Disable text selection on media content */
        video, iframe, canvas { user-select: none; -webkit-user-select: none; }
        img { -webkit-user-drag: none; user-select: none; pointer-events: none; }
        /* Allow pointer events on interactive images (buttons etc.) */
        button img, a img, label img { pointer-events: auto; }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
