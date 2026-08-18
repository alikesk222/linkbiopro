import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const RAW_SECRET = process.env.JWT_SECRET
if (!RAW_SECRET) {
  throw new Error('JWT_SECRET ortam değişkeni tanımlı olmalı')
}
// Ayrı ADMIN_JWT_SECRET tanımlanabilir; yoksa kullanıcı secret'ından türetilir
// (mevcut admin oturumlarıyla geriye uyumlu).
const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || RAW_SECRET + '-admin'
)
export const ADMIN_COOKIE = 'lbp_admin'

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 8,
  path: '/',
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return false
  return verifyAdminToken(token)
}
