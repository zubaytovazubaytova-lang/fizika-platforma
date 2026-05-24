import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Token tekshirishdan ozod sahifalar
const PUBLIC = new Set(['/login', '/register'])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = !!request.cookies.get('fizika-access')?.value

  // Root sahifa: token bo'lsa dashboard ga, bo'lmasa landing page ko'rsatilsin
  if (pathname === '/') {
    if (hasToken) return NextResponse.redirect(new URL('/dashboard', request.url))
    return NextResponse.next()
  }

  // /login va /register: token bo'lsa /dashboard ga (yoki ?next sahifasiga)
  if (PUBLIC.has(pathname)) {
    if (hasToken) {
      const next = request.nextUrl.searchParams.get('next')
      const target = next && next.startsWith('/') ? next : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }
    return NextResponse.next()
  }

  // Boshqa barcha sahifalar — himoyalangan
  if (!hasToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot|mp4|mp3|pdf|txt)$).*)',
  ],
}
