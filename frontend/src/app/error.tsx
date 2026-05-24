'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PageError]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '0.75rem',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '2.5rem' }}>⚠️</div>
      <h2 style={{ color: '#f87171', margin: 0, fontSize: '1.125rem' }}>
        Xatolik yuz berdi
      </h2>
      <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem', textAlign: 'center' }}>
        Server bilan bog&apos;lanishda muammo. Backend ishga tushganini tekshiring.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
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
  )
}
