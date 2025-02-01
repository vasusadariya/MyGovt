"use client"

import { useEffect, useState } from "react"
import "@/app/styles/animations.css"

interface LoadingProps {
  isVisible: boolean
}

export default function Loading({ isVisible }: LoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 10)

    return () => clearInterval(timer)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-300 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="relative bg-white p-8 rounded-lg transform rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_#4ade80] transition-all  loader-container">
        <div className="mb-8 ">
          <h1 className="text-5xl font-black mb-2 tracking-tighter dark:text-black">HackOps</h1>
          <p className="text-xl font-bold text-neutral-600">Hang tight...</p>
        </div>

        <div className="relative w-64 h-8 bg-neutral-100 border-4 border-black ">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-green-400 dark:to-green-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex dark:text-black items-center justify-center font-mono font-bold text-lg">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  )
}

