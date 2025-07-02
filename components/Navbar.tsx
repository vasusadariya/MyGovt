"use client"

import Link from "next/link"
import { Menu, X, LayoutDashboard, Vote } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Voting", href: "/election" },
  { name: "Complaints", href: "/complaints" },
  { name: "Documents", href: "/document" },
]

interface SessionUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

interface SessionType {
  user?: SessionUser
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: sessionData, status } = useSession()
  const session = sessionData as SessionType | null
  const [dashboardLink, setDashboardLink] = useState("/dashboard/users")

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Set dashboard link based on user role
  useEffect(() => {
    if (session?.user?.role) {
      switch (session.user.role) {
        case "candidate":
          setDashboardLink("/dashboard/candidate")
          break
        case "admin":
          setDashboardLink("/dashboard/admin")
          break
        default:
          setDashboardLink("/dashboard/users")
          break
      }
    }
  }, [session])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-shadow ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold z-50">
            <Vote className="h-8 w-8 text-blue-600" />
            <span className="text-gray-900">MyGovt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Authentication Section */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              // Loading placeholder
              <div className="flex gap-3">
                <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : session ? (
              <>
                {/* Dashboard Button */}
                <Link href={dashboardLink}>
                  <button className="hidden md:flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </button>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  Logout
                </button>

                {/* User Avatar */}
                <div className="relative group">
                  <Image
                    src={session.user?.image || "/placeholder.svg?height=40&width=40"}
                    alt={session.user?.name || "User Avatar"}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer border-2 border-gray-200"
                    aria-label="User Avatar"
                  />
                  {/* Dropdown */}
                  <div className="absolute right-0 hidden w-48 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg group-hover:block">
                    <p className="text-sm font-semibold text-gray-900">{session.user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                    <p className="text-xs text-blue-600 font-semibold capitalize mt-1">{session.user?.role}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login and Sign-Up Buttons */}
                <Link href="/auth/signin">
                  <button className="hidden md:flex px-4 py-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="hidden md:flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex flex-col h-full pt-20 px-6">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-6 mb-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-4">
                {status === "loading" ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : session ? (
                  <>
                    <Link href={dashboardLink}>
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="px-4 py-3 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <button
                        className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </button>
                    </Link>
                    <Link href="/auth/signup">
                      <button
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
