// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log("MIDDLEARE: ", req)
  // Permitir todas as rotas de autenticação passarem
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    alert('asdasd')
    return NextResponse.next()
  }

  const token = await getToken({ req })
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname === '/auth/login'

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return null
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/api/auth/:path*']
}
