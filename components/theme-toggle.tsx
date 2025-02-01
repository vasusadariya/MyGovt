'use client'

import { useTheme } from './theme-provider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 mx-1 rounded-lg  border-2 border-black bg-yellow-200 dark:bg-green-400 "
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 text-black " /> : <Sun className="w-5 h-5 text-black" />}
    </button>
  )
}