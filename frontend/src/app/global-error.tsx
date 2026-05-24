'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="uz" style={{ background: '#000010', colorScheme: 'dark' }}>
      <body style={{
        background: '#000010',
        color: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        fontFamily: 'sans-serif',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#f87171', marginBottom: '0.75rem', fontSize: '1.25rem' }}>
            Xatolik yuz berdi
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Server bilan bog&apos;lanishda muammo bo&apos;ldi
          </p>
          <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '0.75rem' }}>
            Backend ishga tushganini tekshiring va qayta urinib ko&apos;ring
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                background: '#6d28d9',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Qayta urinish
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
