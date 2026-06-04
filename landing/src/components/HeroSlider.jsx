import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Slide1Welcome     from './slides/Slide1Welcome'
import Slide2Simulations from './slides/Slide2Simulations'
import Slide3AI          from './slides/Slide3AI'
import Slide4Courses     from './slides/Slide4Courses'
import Slide5CTA         from './slides/Slide5CTA'

const SLIDES    = [Slide1Welcome, Slide2Simulations, Slide3AI, Slide4Courses, Slide5CTA]
const INTERVAL  = 4000

const variants = {
  enter:  (d) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  exit:   (d) => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }),
}

export default function HeroSlider({ onLogin, onRegister }) {
  const [idx,    setIdx]    = useState(0)
  const [dir,    setDir]    = useState(1)
  const [paused, setPaused] = useState(false)
  const dirRef = useRef(1)

  const goTo = useCallback((next) => {
    const d = next > idx ? 1 : -1
    dirRef.current = d
    setDir(d)
    setIdx(next)
  }, [idx])

  const next = useCallback(() => {
    dirRef.current = 1
    setDir(1)
    setIdx(c => (c + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    dirRef.current = -1
    setDir(-1)
    setIdx(c => (c - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  // Auto-play
  useEffect(() => {
    if (paused) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [paused, next])

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [next, prev])

  const Slide = SLIDES[idx]

  return (
    <div
      style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={idx}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          <Slide onLogin={onLogin} onRegister={onRegister} />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: 'rgba(255,255,255,0.07)', zIndex: 10,
      }}>
        <motion.div
          key={`pb-${idx}`}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: 'linear' }}
          style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#FFB800)' }}
        />
      </div>

      {/* Dot navigation */}
      <div style={{
        position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 7, zIndex: 10, alignItems: 'center',
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
              width:      i === idx ? 26 : 8,
              background: i === idx ? '#FFB800' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      {[[-1, '❮', 'left'], [1, '❯', 'right']].map(([d, icon, side]) => (
        <button
          key={side}
          onClick={() => d === -1 ? prev() : next()}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [side]: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.55)', fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
