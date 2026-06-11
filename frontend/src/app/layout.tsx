import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AuthProvider from '@/components/providers/AuthProvider'
import ClientEffects from '@/components/effects/ClientEffects'
import AnimatedBackground from '@/components/background/AnimatedBackground'
import FooterWrapper from '@/components/layout/FooterWrapper'

export const metadata: Metadata = {
  title: 'SOFENA — Fizika 3D Platformasi',
  description: 'Fizika fanini interaktiv 3D simulatsiyalar, sun\'iy intellekt va zamonaviy metodlar orqali o\'rganing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full" style={{ background: '#0c0c1e', colorScheme: 'dark' }}>
      <head>
        <style>{`html,body{background:#0c0c1e!important;color-scheme:dark}`}</style>
        <meta name="theme-color" content="#0c0c1e" />
        <link rel="icon" type="image/svg+xml" href="/sofena-icon.svg" />
        <link rel="apple-touch-icon" href="/sofena-icon.svg" />
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
