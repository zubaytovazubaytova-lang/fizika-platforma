import AtomSVG from '../AtomSVG'

const checks = [
  'Bepul ro\'yxatdan o\'tish',
  'Kredit karta talab qilinmaydi',
  'Istalgan vaqt bekor qilish',
]

export default function Slide5CTA({ onRegister, onLogin }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 24px', gap: 18,
    }}>
      {/* Large atom */}
      <div style={{ animation: 'float-y 4s ease-in-out infinite' }}>
        <AtomSVG size={180} />
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(30px,5.5vw,64px)', fontWeight: 900,
        color: '#ffffff', lineHeight: 1.05, letterSpacing: '-1px',
        textShadow: '0 2px 12px rgba(0,0,0,0.95)',
      }}>
        Hoziroq boshlang!
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(14px,1.6vw,18px)',
        color: 'rgba(255,255,255,0.85)', maxWidth: 500, lineHeight: 1.7,
        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
      }}>
        Fizika olamiga yangicha ko&apos;z bilan qarang —
        minglab o&apos;quvchilar allaqachon boshlagan
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onRegister}
          style={{
            padding: '13px 32px', borderRadius: 50,
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            border: 'none', color: 'white',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 0 28px rgba(124,58,237,0.5)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          🚀 Bepul ro&apos;yxatdan o&apos;ting
        </button>
        <button
          onClick={onLogin}
          style={{
            padding: '13px 32px', borderRadius: 50,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            color: 'white', fontWeight: 600, fontSize: 15,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          Kirish
        </button>
      </div>

      {/* Checks */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {checks.map((t, i) => (
          <span key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span> {t}
          </span>
        ))}
      </div>
    </div>
  )
}
