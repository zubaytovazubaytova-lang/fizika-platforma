import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AuthProvider from '@/components/providers/AuthProvider'
import ClientEffects from '@/components/effects/ClientEffects'
import AnimatedBackground from '@/components/background/AnimatedBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fizika Platformasi',
  description: 'Fizika fanini interaktiv, 3D animatsiya va AI yordamida o\'rganing',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full" style={{ background: '#070d2a', colorScheme: 'dark' }}>
      <head>
        <style>{`html,body{background:#070d2a!important;color-scheme:dark}`}</style>
        <meta name="theme-color" content="#070d2a" />
      </head>
      <body className={`${inter.className} min-h-full text-gray-100`} style={{ background: 'transparent', position: 'relative' }}>

        {/* ── Animatsion fon ── */}
        <AnimatedBackground />

        {/* ── Asosiy kontent ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>
            <ClientEffects />
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
              © 2026 Fizika Platformasi
            </footer>
          </AuthProvider>
        </div>

      </body>
    </html>
  )
}
