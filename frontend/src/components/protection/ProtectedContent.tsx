'use client'
import { useRef, useEffect } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** disable text selection (for PDF viewer, course content) */
  noSelect?: boolean
  /** add diagonal watermark over this block */
  watermark?: boolean
}

export default function ProtectedContent({ children, className, style, noSelect, watermark }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Block right-click locally (ContentGuard handles globally,
       but this ensures no event propagation issues) */
    const stop = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).matches('input,textarea,[contenteditable]'))
        e.preventDefault()
    }
    el.addEventListener('contextmenu', stop)
    return () => el.removeEventListener('contextmenu', stop)
  }, [])

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100'>
    <text x='5' y='50' font-family='Arial' font-size='13' font-weight='bold'
      fill='rgba(0,212,255,0.06)' transform='rotate(-28 100 50)'>FizikaAI</text>
  </svg>`

  return (
    <div
      ref={ref}
      className={className}
      style={{
        userSelect: noSelect ? 'none' : undefined,
        WebkitUserSelect: noSelect ? 'none' : undefined,
        position: 'relative',
        ...style,
      }}
    >
      {children}

      {watermark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}
