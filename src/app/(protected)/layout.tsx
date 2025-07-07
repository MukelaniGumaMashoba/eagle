'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getUser } from '@/lib/action/auth'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

// Role-based navigation configuration
const roleNavigation = {
  'fleet manager': [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'C-Center', href: '/ccenter', icon: '🏢' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ],
  'call centre': [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Drivers', href: '/drivers', icon: '🚗' },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗' },
  ],
  'customer': [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Drivers', href: '/drivers', icon: '🚗' },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗' },
    { name: 'Technician', href: '/technician', icon: '🔧' },
    { name: 'Customer', href: '/customer', icon: '👥' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ],
  'cost%20centre': [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'C-Center', href: '/ccenter', icon: '🏢' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ],
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [navigation, setNavigation] = useState<any[]>([])
  const pathname = usePathname()

  useEffect(() => {
    // Get user role from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const role = getCookie('role')
    const session = getCookie('session')
    
    console.log('Layout - Session cookie:', session ? 'exists' : 'missing')
    console.log('Layout - Role cookie:', role || 'missing')
    
    if (role) {
      setUserRole(role)
      // Set navigation based on role
      const roleNav = roleNavigation[role as keyof typeof roleNavigation] || []
      setNavigation(roleNav)
      console.log('Layout - Navigation set for role:', role, 'Items:', roleNav.length)
    } else {
      console.log('Layout - No role found, redirecting to login')
      window.location.href = '/login'
    }
  }, [])

  const handleLogout = () => {
    window.location.href = '/logout'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden w-full"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Eagle Eye</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              ✕
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="mb-2 text-xs text-gray-500 text-center">
              Role: {userRole}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              🚪 Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              ☰
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back 
                {/* {user?.firstName} {user?.surname} */}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 w-full">
          <Card className="p-6">
            {children}
          </Card>
        </main>
      </div>
    </div>
  )
}
