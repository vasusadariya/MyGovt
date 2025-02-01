'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme | null
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null) // Initially null to prevent flicker

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

    setTheme(preferredTheme) // Apply correct theme
    document.documentElement.classList.toggle('dark', preferredTheme === 'dark')
  }, [])

  useEffect(() => {
    if (theme !== null) {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Prevent rendering until theme is set
  if (theme === null) return null

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
