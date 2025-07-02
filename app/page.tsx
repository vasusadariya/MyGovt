"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, ShoppingCart, Cloud, BarChart2 } from "lucide-react"
import LoadingWrapper from "@/components/LoadingWrapper"
import { Navbar } from "@/components/Navbar"
import Link from "next/link"
import Chatbot from "@/components/Chatbox"

const features = [
  {
    href: "/wallet",
    icon: Wallet,
    title: "Secure Wallet",
    description: "Keep your assets safe with our state-of-the-art wallet technology.",
  },
  {
    href: "/commerce",
    icon: ShoppingCart,
    title: "Easy Commerce",
    description: "Seamlessly buy and sell with our user-friendly marketplace.",
  },
  {
    href: "/cloud",
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Access your financial data anytime, anywhere with our cloud services.",
  },
  {
    href: "/trading",
    icon: BarChart2,
    title: "Advanced Analytics",
    description: "Make informed decisions with our powerful analytical tools.",
  },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <LoadingWrapper>
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 md:pt-32 py-24 px-6 md:px-12 text-center bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to MyGovt
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering citizens with seamless access to digital government services through secure, transparent, and
            efficient technology.
          </motion.p>
          <Link href="/auth/signup">
            <button className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-slate-800 transition-all duration-200 ease-in-out shadow-lg">
              Get Started Today
            </button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-4">Government Services</h2>
          <p className="text-xl text-center text-slate-600 mb-12 max-w-3xl mx-auto">
            Access essential government services and participate in democratic processes with our comprehensive digital
            platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <motion.div
                  className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-blue-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-2 text-slate-800 text-center">{feature.title}</h3>
                  <p className="text-slate-600 text-center">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">MyGovt Digital Services</h3>
            <p className="text-slate-300 mb-4">Secure • Transparent • Efficient</p>
            <p className="text-sm text-slate-400">&copy; 2025 MyGovt. All rights reserved.</p>
          </div>
          <Chatbot />
        </footer>
      </LoadingWrapper>
    </div>
  )
}
