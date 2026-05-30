import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AuthProvider from '@/components/providers/AuthProvider'
import ClientEffects from '@/components/effects/ClientEffects'
import AnimatedBackground from '@/components/background/AnimatedBackground'
import FooterWrapper from '@/components/layout/FooterWrapper'

export const metadata: Metadata = {
  title: 'Fizika AI Platformasi',
  description: 'Fizika fanini interaktiv, 3D animatsiya va Claude AI yordamida o\'rganing',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full" style={{ background: '#0c0c1e', colorScheme: 'dark' }}>
      <head>
        <style>{`html,body{background:#0c0c1e!important;color-scheme:dark}`}</style>
        <meta name="theme-color" content="#0c0c1e" />
      </head>
      <body className="min-h-full text-gray-100" style={{ background: 'transparent', position: 'relative', fontFamily: "'Inter', Arial, sans-serif" }}>

        {/* ── Animatsion fon ── */}
        <AnimatedBackground />

        {/* ── Asosiy kontent ── */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AuthProvider>
            <ClientEffects />
            <Navbar />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </AuthProvider>
        </div>

      </body>
    </html>
  )
}
