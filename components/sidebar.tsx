"use client"

import Link from "next/link"
import { InboxIcon, HomeIcon as House, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Home", icon: House, href: "/" },
  { name: "Inbox", icon: InboxIcon, href: "/Inbox" },
]

export function Sidebar() {


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <div className="mt-16 fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg border-r border-gray-300 dark:border-gray-700">
      <div className="space-y-4">
        <p className="text-xs font-semibold text-black uppercase mb-4">Navigation</p>

        {navigation.map((item) => (
          <Link href={item.href} key={item.name}>
            <button className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-green-400 transition-all duration-200">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          </Link>
        ))}

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
