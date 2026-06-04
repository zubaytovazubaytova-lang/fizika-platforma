const bullets = [
  { icon: '⚡', text: 'Real vaqtda javob' },
  { icon: '📐', text: 'Formulalar bilan tushuntirish' },
  { icon: '🌐', text: "O'zbek tilida to'liq qo'llab-quvvatlash" },
  { icon: '🔢', text: 'Masala yechimlari bosqichma-bosqich' },
]

function ChatBubble({ role, text, delay }) {
  const isUser = role === 'user'
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      animation: `chat-in 0.4s ease ${delay}s both`,
    }}>
      <div style={{
        maxWidth: '78%', padding: '9px 14px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.08)',
        fontSize: 13, lineHeight: 1.55, color: 'white',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
      }}>
        {text}
      </div>
    </div>
  )
}

export default function Slide3AI() {
  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(24px,6vw,80px)', gap: 'clamp(32px,6vw,72px)',
    }}>
      {/* Left: content */}
      <div style={{ maxWidth: 460 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', letterSpacing: '0.14em' }}>AI O&apos;QITUVCHI</span>
        </div>

        <h2 style={{ fontSize: 'clamp(20px,3vw,40px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20, textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
          <span style={{ color: '#ffffff' }}>Sun&apos;iy intellekt</span>
          <br />
          <span className="grad-purple">o&apos;qituvchingiz</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>{b.icon}</div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat mockup */}
      <div className="glass" style={{ width: 280, padding: 18, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(8,15,35,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}>
        {/* Chat header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Fizika AI</div>
            <div style={{ fontSize: 11, color: '#4ade80' }}>● Online</div>
          </div>
        </div>
        <ChatBubble role="user" text="Nyuton qonuni nima?" delay={0} />
        <ChatBubble role="ai"   text="F = ma — kuch, massa va tezlanish o'rtasidagi bog'liqlik." delay={0.3} />
        <ChatBubble role="user" text="Misol keltirsangiz?" delay={0.6} />
        <ChatBubble role="ai"   text="2 kg jism 3 m/s² tezlansa: F = 2×3 = 6 N 💡" delay={0.9} />
        {/* Typing indicator */}
        <div style={{ display: 'flex', gap: 4, paddingLeft: 4 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(168,85,247,0.7)',
              animation: `float-y 1.2s ease-in-out ${i*0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
