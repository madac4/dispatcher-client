'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/authStore'
import { Clock, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from './logo'

export function Header() {
  const { isAuthenticated, logout } = useAuthStore()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [isAuthenticated])

  return (
    <header className="border-b">
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="fluid-container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Mon-Sat 7am-7pm
            </div>
            <Link href="tel:8335530483" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500" />
              Call us 833.553.0483
            </Link>
            <Link href="mailto:sales@osow.express" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500" />
              sales@osow.express
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="fluid-container py-4 flex justify-between items-center">
          <Logo />

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              About Us
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Services
            </Link>
            <Link href="/permits" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Permits
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuth ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={logout} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">
                  Login
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
