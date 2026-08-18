import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE } from './lib/auth'
import { verifyAdminToken, ADMIN_COOKIE } from './lib/admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin panel protection
  if (pathname.startsWith('/admin/panel')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value
    if (!adminToken || !(await verifyAdminToken(adminToken))) {
      return NextResponse.redirect(new URL('/admin/giris', request.url))
    }
    return NextResponse.next()
  }

  // User auth
  const token = request.cookies.get(COOKIE)?.value
  const valid = token ? await verifyToken(token) : null

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    if (!valid) {
      return NextResponse.redirect(new URL('/giris', request.url))
    }
  }

  if ((pathname === '/giris' || pathname === '/kayit') && valid) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/giris', '/kayit', '/admin/panel/:path*', '/onboarding'],
}
