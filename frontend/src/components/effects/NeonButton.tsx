'use client'
import { useRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { gsap } from 'gsap'
import clsx from 'clsx'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  color?: 'blue' | 'green' | 'purple' | 'cyan'
  variant?: 'solid' | 'outline'
}

const COLORS = {
  blue:   { glow: '#3b82f6', border: 'border-blue-500',   bg: 'bg-blue-600 hover:bg-blue-500',   shadow: '0 0 20px rgba(59,130,246,0.7)'  },
  green:  { glow: '#22c55e', border: 'border-green-500',  bg: 'bg-green-600 hover:bg-green-500', shadow: '0 0 20px rgba(34,197,94,0.7)'   },
  purple: { glow: '#a855f7', border: 'border-purple-500', bg: 'bg-purple-600 hover:bg-purple-500',shadow:'0 0 20px rgba(168,85,247,0.7)'  },
  cyan:   { glow: '#06b6d4', border: 'border-cyan-500',   bg: 'bg-cyan-600 hover:bg-cyan-500',   shadow: '0 0 20px rgba(6,182,212,0.7)'   },
}

export default function NeonButton({
  children, color = 'blue', variant = 'solid',
  className, onClick, ...rest
}: NeonButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const c   = COLORS[color]

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current
    if (btn) {
      // ripple
      const rect = btn.getBoundingClientRect()
      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height)
      Object.assign(ripple.style, {
        position: 'absolute',
        width:    `${size}px`,
        height:   `${size}px`,
        left:     `${e.clientX - rect.left - size / 2}px`,
        top:      `${e.clientY - rect.top - size / 2}px`,
        background: `radial-gradient(circle, ${c.glow}66 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'scale(0)',
      })
      btn.appendChild(ripple)
      gsap.to(ripple, {
        scale: 2.5, opacity: 0, duration: 0.55,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      })

      // glow pulse
      gsap.timeline()
        .to(btn, { boxShadow: `0 0 35px ${c.glow}cc, 0 0 70px ${c.glow}55`, duration: 0.15 })
        .to(btn, { boxShadow: `0 0 8px ${c.glow}44`, duration: 0.4, ease: 'power2.out' })
    }
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={clsx(
        'relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-white',
        'transition-all duration-200',
        variant === 'solid'
          ? c.bg
          : `border ${c.border} bg-transparent hover:bg-white/5`,
        className,
      )}
      style={{ boxShadow: `0 0 8px ${c.glow}44` }}
      {...rest}
    >
      {children}
    </button>
  )
}
