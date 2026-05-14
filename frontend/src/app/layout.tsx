import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fizika Platformasi',
  description: 'Fizika fanini interaktiv, 3D animatsiya va AI yordamida o\'rganing',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full">
      <body className={`${inter.className} min-h-full bg-gray-950 text-gray-100`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
            © 2025 Fizika Platformasi
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
