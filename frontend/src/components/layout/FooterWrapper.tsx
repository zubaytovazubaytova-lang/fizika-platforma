'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const platform = [
  { label: 'Kurslar',           href: '/courses' },
  { label: 'Darsliklar',        href: '/darsliklar' },
  { label: 'Testlar',           href: '/tests' },
  { label: '3D Simulatsiyalar', href: '/simulations' },
]
const resources = [
  { label: 'Formulalar',   href: '/formulalar' },
  { label: 'Kattaliklar',  href: '/fizik-kattaliklar' },
  { label: 'Kashfiyotlar', href: '/kashfiyotlar' },
  { label: 'AI Tutor',     href: '/ai-tutor' },
]

/* Footer faqat shu sahifalarda ko'rinadi */
const FOOTER_PAGES = ['/', '/login', '/register']

export default function FooterWrapper() {
  const pathname = usePathname()
  if (!FOOTER_PAGES.includes(pathname)) return null

  return (
    <footer style={{
      borderTop: '1px solid rgba(124,58,237,0.22)',
      background: 'rgba(10,10,24,0.97)',
      backdropFilter: 'blur(24px)',
      position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 1px 0 rgba(124,58,237,0.15), 0 -8px 40px rgba(124,58,237,0.06)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '50%', height: '1px',
        background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.5),transparent)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 24px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 48, marginBottom: 36, alignItems: 'start' }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sofena-icon.svg"
                alt="SOFENA"
                style={{ height: 48, width: 48, borderRadius: 13 }}
              />
              <span style={{
                fontSize: 20, fontWeight: 900, letterSpacing: '0.07em',
                background: 'linear-gradient(135deg,#b8d8ff,#6699ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>SOFENA</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
              Fizika fanini interaktiv 3D simulatsiyalar, sun&apos;iy intellekt va zamonaviy metodlar orqali o&apos;rganing.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {['E = mc²', 'F = ma', 'λ = v/f'].map(f => (
                <span key={f} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                  color: 'rgba(167,139,250,0.7)', fontFamily: 'monospace',
                }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Platforma */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
              Platforma
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {platform.map(l => <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>)}
            </div>
          </div>

          {/* Resurslar */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
              Resurslar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {resources.map(l => <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>)}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>
            © 2026 SOFENA — Fizika 3D Platformasi.
          </span>
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>
            Claude AI bilan ishlaydi 🤖
          </span>
        </div>
      </div>
    </footer>
  )
}
