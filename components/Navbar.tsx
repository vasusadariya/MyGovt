"use client"
import Link from "next/link"
import { Binary, Menu, X, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const navigation = [
  { name: "Platform Solutions", href: "/platform" },
  { name: "Clients", href: "/clients" },
  { name: "Insights", href: "/insights" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session, status } = useSession()
  const [dashboardLink, setDashboardLink] = useState("/dashboard/users")
  const router = useRouter()

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
      className={`fixed top-0 left-0 right-0 z-50 bg-white bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-b transition-shadow ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold z-50">
            <Binary className="h-6 w-6 dark:text-green-400 text-purple-500" />
            <span className="dark:text-white">HackOps</span>
          </Link>

          {/* User Authentication Section */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              // Loading placeholder
              <div className="flex gap-4">
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ) : session ? (
              <>
                {/* Dashboard Button */}
                <Link href={dashboardLink}>
                  <button
                    className="px-6 py-2 hidden md:flex items-center justify-center gap-2 rounded-lg border-2 border-[#000000] 
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden md:inline">Dashboard</span>
                  </button>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex px-4 py-2 rounded-lg border-2 border-[#000000] bg-red-500 text-white
                    text-sm font-semibold shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Logout
                </button>

                {/* User Avatar */}
                <div className="relative group">
                  <Image
                    src={session.user?.image || "/default-avatar.svg"}
                    alt={session.user?.name || "User Avatar"}
                    width={50}
                    height={50}
                    className="rounded-full cursor-pointer"
                    aria-label="User Avatar"
                  />
                  {/* Optional Dropdown */}
                  <div className="absolute right-0 hidden w-48 p-2 mt-2 bg-white border rounded-lg shadow-lg group-hover:block">
                    <p className="text-sm text-gray-700">{session.user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                    <p className="text-xs text-blue-600 font-semibold capitalize">{session.user?.role}</p>
                    <hr className="my-2" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login and Sign-Up Buttons */}
                <Link href="/auth/signin">
                  <button
                    className="px-4 py-2 hidden md:flex rounded-lg border-2 border-[#000000] 
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button
                    className="px-4 py-2 hidden md:flex rounded-lg border-2 border-[#000000] 
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6 dark:text-white" />
          </button>

          {/* Mobile Menu */}
          <div
            className={`
            fixed inset-0 bg-white dark:bg-gray-900 z-40 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
            md:hidden
          `}
          >
            {/* Close button positioned at top-right */}
            <button
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 dark:text-white" />
            </button>

            <div className="flex flex-col h-full pt-20 px-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg justify-center mx-auto items-center font-medium text-foreground dark:text-white hover:dark:text-green-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-4 mt-8">
                {status === "loading" ? (
                  <div>Loading...</div>
                ) : session ? (
                  <>
                    {/* Dashboard Button */}
                    <Link href={dashboardLink}>
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-[#000000] 
                          text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                          hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg bg-red-500 border-2 border-[#000000] 
                        shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                        hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-auto px-2 py-2  text-white rounded-lg border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_#4ade80] transition-shadow duration-200">
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </button>
                    <button className="w-auto px-2 py-2 text-white rounded-lg border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_#4ade80] transition-shadow duration-200">
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        Sign up
                      </Link>
                    </button>
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
