function PendulumSVG() {
  return (
    <svg width="120" height="220" viewBox="0 0 120 220" style={{ overflow: 'visible' }}>
      {/* Pivot */}
      <circle cx="60" cy="12" r="5" fill="rgba(255,255,255,0.4)" />
      {/* Arm + Bob — animated group */}
      <g className="pendulum-group">
        <line x1="60" y1="12" x2="60" y2="168" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="176" r="22" fill="url(#bob-grad)"
          style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.7))' }}
        />
        {/* Bob shine */}
        <ellipse cx="53" cy="168" rx="7" ry="5" fill="rgba(255,255,255,0.2)" />
      </g>
      <defs>
        <radialGradient id="bob-grad" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      {/* Base line */}
      <line x1="10" y1="10" x2="110" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    </svg>
  )
}

export default function Slide2Simulations() {
  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(24px,6vw,80px)', gap: 'clamp(32px,6vw,80px)',
    }}>
      {/* Left: pendulum animation */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <PendulumSVG />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>MAYATNIK</span>
      </div>

      {/* Right: content */}
      <div style={{ maxWidth: 520 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,188,212,0.12)', border: '1px solid rgba(0,188,212,0.3)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>🔬</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#00BCD4', letterSpacing: '0.14em' }}>3D SIMULATSIYALAR</span>
        </div>

        <h2 style={{ fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
          <span style={{ color: '#ffffff' }}>3D Interaktiv</span>{' '}
          <br />
          <span className="grad-purple">Simulatsiyalar</span>
        </h2>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 28, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#FFB800' }}>100+</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Simulatsiya</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#00BCD4' }}>5 soha</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Fizika bo&apos;limlari</div>
          </div>
        </div>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          Mayatnikdan tortib elektr maydonigacha — hamma jarayonni
          real vaqtda kuzating, parametrlarni o&apos;zgartiring
          va fizika qonunlarini o&apos;z ko&apos;zingiz bilan his qiling.
        </p>
      </div>
    </div>
  )
}
