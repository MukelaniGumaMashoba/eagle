import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const roles = [
  {
    name: 'call centre',
    path: ['/dashboard', '/profile','/login', '/signup', '/', '/logout'],
  },
  {
    name: 'fleet manager',
    path: ['/dashboard', '/drivers', '/vehicles', '/technician', '/ccenter', '/profile', '/logs','/login', '/signup', '/', '/logout'],
  },
  {
    name: 'customer',
    path: ['/dashboard', '/profile', '/editCustomer', '/customer','/login', '/signup', '/', '/logout'],
  },
  {
    name: 'cost centre',
    path: ['/dashboard', '/ccenter', '/profile', '/quotation', '/notification','/login', '/signup', '/', '/logout'],
  },
]

const publicRoutes = ['/login', '/signup', '/', '/logout']

function getAllowedPaths(role: string): string[] {
  return roles.find(r => r.name === role)?.path || []
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  // Check for Supabase session cookies
  const accessToken = req.cookies.get('access_token')?.value
  const isAuthenticated = !!accessToken
  const isPublicRoute = publicRoutes.includes(path)

  // console.log(`[MIDDLEWARE] Path: ${path}`)
  // console.log(`[MIDDLEWARE] Authenticated: ${isAuthenticated}, Role: ${role}`)

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    console.log('Not authenticated — redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Prevent authenticated users from accessing public routes again
  // if (isAuthenticated && isPublicRoute && path !== '/dashboard') {
  //   console.log('Already authenticated — redirecting to /dashboard')
  //   return NextResponse.redirect(new URL('/dashboard', req.url))
  // }

  // If authenticated, get user role from database
  if (isAuthenticated) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log(user?.id)
      if (user) {
        // const role = req.cookies.get('role')?.value
        // console.log(role)
        const { error, data: userProfile } = await supabase.auth.getUser();
        console.log(userProfile.user?.user_metadata.role)
        const role = userProfile.user?.user_metadata.role
        if (error) {
          // console.error('Error fetching user profile:', error)
          return NextResponse.redirect(new URL('/login', req.url))
        }

        if (role) {
          const allowedPaths = getAllowedPaths(role)
          const isAllowed = allowedPaths.some(p => path.startsWith(p))

          if (!isAllowed) {
            console.log(`Role "${role}" is not allowed to access "${path}" — redirecting to /dashboard`)
            return NextResponse.redirect(new URL('/dashboard', req.url))
          }
        } else {
          console.log('No role found for user — redirecting to /dashboard')
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
    } catch (error) {
      console.error('Error in middleware:', error)
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)).*)'
  ],
}
