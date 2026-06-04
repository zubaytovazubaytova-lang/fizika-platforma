const courses = [
  { icon: '⚙️',  name: 'Mexanika',           count: 120, color: '#FFB800', pct: 92 },
  { icon: '⚡',  name: 'Elektr va Magnit',    count: 95,  color: '#00BCD4', pct: 76 },
  { icon: '🌊',  name: "To'lqin va Optika",   count: 80,  color: '#60a5fa', pct: 64 },
  { icon: '🔥',  name: 'Termodinamika',        count: 75,  color: '#f97316', pct: 60 },
  { icon: '⚛️',  name: 'Kvant Fizika',         count: 65,  color: '#a855f7', pct: 52 },
  { icon: '🚀',  name: 'Nisbiylik',            count: 40,  color: '#34d399', pct: 32 },
]

export default function Slide4Courses() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(20px,5vw,60px)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.25)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 12,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FFB800', letterSpacing: '0.14em' }}>📚 KURSLAR</span>
        </div>
        <h2 style={{ fontSize: 'clamp(22px,3.5vw,44px)', fontWeight: 900, textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
          <span className="grad-gold">500+ dars</span>
          <span style={{ color: '#ffffff' }}> va mashqlar</span>
        </h2>
      </div>

      {/* Course grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, width: '100%', maxWidth: 720,
      }}>
        {courses.map((c, i) => (
          <div key={i} style={{ padding: '14px 16px', background: 'rgba(8,15,35,0.60)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, backdropFilter: 'blur(16px)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 3, textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>{c.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{c.count} ta dars</div>
            {/* Progress bar */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${c.pct}%`,
                background: `linear-gradient(90deg, ${c.color}88, ${c.color})`,
                borderRadius: 2,
                animation: 'bar-grow 1.2s cubic-bezier(0.4,0,0.2,1) both',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
