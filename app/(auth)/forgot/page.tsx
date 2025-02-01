"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/app/firebase/config"


export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage({ type: "success", text: "if this email is registered you will receive an email. Check your inbox." })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send reset email. Please try again." })
      console.error("Error sending password reset email:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
        {/* <div className="flex items-center justify-center min-h-screen bg-gray-100"> */}
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
            <p className="text-gray-600 mb-6">Enter your email to reset your password</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reset Email
              </button>
            </form>
            {message && (
              <div
                className={`⁠mt-4 p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} `}
              >
                {message.text}
              </div>
            )}

    <p className="mt-4 text-sm text-center text-gray-600">
              Go to Login Page?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log in
              </a>
            </p>
          </div>
        {/* </div> */}
    </div>
  )
}