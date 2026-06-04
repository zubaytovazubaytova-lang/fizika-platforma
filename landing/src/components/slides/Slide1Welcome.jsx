import AtomSVG from '../AtomSVG'

export default function Slide1Welcome() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 24px', gap: 16,
    }}>
      {/* Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'badge-glow 2.5s ease-in-out infinite',
      }}>
        <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg,transparent,#FFB800)' }} />
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.18em',
          color: '#FFB800', textTransform: 'uppercase',
        }}>XUSH KELIBSIZ</span>
        <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg,#FFB800,transparent)' }} />
      </div>

      {/* Atom */}
      <div style={{ animation: 'float-y 3.5s ease-in-out infinite', marginBottom: 4 }}>
        <AtomSVG size={160} />
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(32px,5vw,58px)', fontWeight: 900,
        lineHeight: 1.1,
      }}>
        <span className="grad-gold">Assalomu Alaykum! 👋</span>
      </h1>

      {/* Subtitle */}
      <h2 style={{
        fontSize: 'clamp(20px,3vw,36px)', fontWeight: 800,
        color: '#ffffff', letterSpacing: '-0.5px',
        textShadow: '0 2px 12px rgba(0,0,0,0.95)',
      }}>
        Fizikani yangicha his qiling
      </h2>

      {/* Quote */}
      <p style={{
        fontStyle: 'italic', fontSize: 15,
        color: 'rgba(255,255,255,0.85)', maxWidth: 460,
        lineHeight: 1.7, textShadow: '0 2px 8px rgba(0,0,0,0.9)',
      }}>
        &ldquo;Har bir savol — yangi kashfiyotning boshlanishi&rdquo;
      </p>

    </div>
  )
}
