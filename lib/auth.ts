import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'linkbiopro-secret-key-change-in-prod'
)
export const COOKIE = 'lbp_session'

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}
