import { NextRequest, NextResponse } from 'next/server'

const roles = [
  {
    name: 'Call Center',
    path: ['/dashboard', '/profile'],
  },
  {
    name: 'Fleet Manager',
    path: ['/drivers', '/vehicles', '/technician', '/ccenter', '/profile', '/logs'],
  },
  {
    name: 'Customer',
    path: ['/customer', '/profile', '/editCustomer'],
  },
  {
    name: 'Cost Center',
    path: ['/ccenter', '/profile', '/quotation', '/notification'],
  },
]

const publicRoutes = ['/login', '/signup', '/']

function getAllowedPaths(role: string): string[] {
  return roles.find(r => r.name === role)?.path || []
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = req.cookies.get('session')?.value
  const role = req.cookies.get('role')?.value

  const isAuthenticated = !!token
  const isPublicRoute = publicRoutes.includes(path)

  console.log(`[MIDDLEWARE] Path: ${path}`)
  console.log(`[MIDDLEWARE] Authenticated: ${isAuthenticated}, Role: ${role}`)

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    console.log('Not authenticated — redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Prevent authenticated users from accessing public routes again
  if (isAuthenticated && isPublicRoute && path !== '/dashboard') {
    console.log('Already authenticated — redirecting to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Authenticated + Role-specific route check
  if (isAuthenticated && role) {
    const allowedPaths = getAllowedPaths(role)
    const isAllowed = allowedPaths.some(p => path.startsWith(p))

    if (!isAllowed) {
      console.log(`Role "${role}" is not allowed to access "${path}" — redirecting to /dashboard`)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)).*)'],
}
