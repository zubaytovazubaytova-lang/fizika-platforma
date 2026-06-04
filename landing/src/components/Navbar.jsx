import AtomSVG from './AtomSVG'

export default function Navbar({ onLogin, onRegister }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5,13,26,0.45)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 24px',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <AtomSVG size={42} />
        <span style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
          Fizika <span style={{ color: '#a855f7' }}>AI</span>
        </span>
      </div>

      {/* Right: buttons + atom decoration */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onLogin}
          style={{
            padding: '8px 20px', borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          Kirish
        </button>
        <button
          onClick={onRegister}
          style={{
            padding: '8px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            border: 'none',
            color: 'white', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 0 16px rgba(124,58,237,0.35)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Ro&apos;yxatdan o&apos;tish
        </button>
        <div style={{ opacity: 0.5, marginLeft: 4 }}>
          <AtomSVG size={36} />
        </div>
      </div>
    </nav>
  )
}
