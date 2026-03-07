import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value
  const valid = token ? await verifyToken(token) : null

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!valid) {
      return NextResponse.redirect(new URL('/giris', request.url))
    }
  }

  if (
    (request.nextUrl.pathname === '/giris' ||
      request.nextUrl.pathname === '/kayit') &&
    valid
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/giris', '/kayit'],
}
