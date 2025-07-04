import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/addDriver', '/addCustomer', '/profile', '/editDriver', '/editCustomer']
const publicRoutes = ['/login', '/signup']

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  const cookie = req.cookies.get('session')?.value
  const isAuthenticated = !!cookie

  if (isProtectedRoute && !isAuthenticated) {
    console.log('Redirecting to login')
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthenticated && isPublicRoute) {
    console.log('Redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
