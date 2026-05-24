'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export default function PageTransition() {
  const ref      = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const first    = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (first.current) {
      first.current = false
      // first load — just fade in
      gsap.fromTo(el,
        { opacity: 1, clipPath: 'circle(100% at 50% 50%)' },
        { opacity: 0, clipPath: 'circle(0% at 50% 50%)',
          duration: 0.6, ease: 'power2.in',
          onComplete: () => { el.style.pointerEvents = 'none' },
        }
      )
      return
    }

    // route change — show portal then hide
    el.style.pointerEvents = 'all'
    const tl = gsap.timeline()
    tl.fromTo(el,
      { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
      { opacity: 1, clipPath: 'circle(100% at 50% 50%)',
        duration: 0.45, ease: 'power2.out' }
    ).to(el,
      { opacity: 0, clipPath: 'circle(0% at 50% 50%)',
        duration: 0.5, ease: 'power2.in', delay: 0.08,
        onComplete: () => { el.style.pointerEvents = 'none' },
      }
    )
  }, [pathname])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #1a0a3a 0%, #050010 60%, #000 100%)',
        opacity: 0,
      }}
    >
      {/* wormhole rings */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/30"
          style={{
            width:  `${(i + 1) * 18}vmin`,
            height: `${(i + 1) * 18}vmin`,
            animation: `spin ${3 + i * 0.8}s linear infinite`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            boxShadow: `0 0 ${8 + i * 4}px rgba(140,60,255,${0.4 - i * 0.08})`,
          }}
        />
      ))}
      {/* center glow */}
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(200,100,255,0.9) 0%, transparent 70%)' }}
      />
    </div>
  )
}
