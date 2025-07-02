"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

// Extend the session user type to include 'role'
// Type augmentation for next-auth should be done in /types/next-auth.d.ts only.
import { Menu, X, Home, Vote, FileText, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const navigation = [
    { name: "Dashboard", href: "/dashboard/users", icon: Home },
    { name: "Vote", href: "/dashboard/users/elections", icon: Vote },
    { name: "Documents", href: "/document", icon: FileText },
    { name: "Results", href: "/Piechart", icon: BarChart3 },
  ]

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/dashboard/admin", icon: Settings },
    { name: "Complaints", href: "/complaints", icon: FileText },
    { name: "Elections", href: "/elections", icon: Vote },
  ]

  const candidateNavigation = [
    { name: "Candidate Portal", href: "/dashboard/candidate", icon: Settings },
    { name: "Election Results", href: "/elections", icon: BarChart3 },
  ]

  const getNavigation = () => {
    switch (session?.user?.role) {
      case "admin":
        return adminNavigation
      case "candidate":
        return candidateNavigation
      default:
        return navigation
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 bg-white shadow-lg border-2 border-slate-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />

          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pt-16">
                <h2 className="text-xl font-bold">Government Portal</h2>
                {session?.user && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-100">{session.user.name}</p>
                    <p className="text-xs text-blue-200 capitalize">{session.user.role}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {getNavigation().map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              {session && (
                <div className="p-4 border-t border-slate-200">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
