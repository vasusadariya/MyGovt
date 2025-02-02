"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, ShoppingCart, Cloud, BarChart2 } from "lucide-react"
import LoadingWrapper from "@/components/LoadingWrapper"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation"
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
];

export default function LandingPage() {
  const router = useRouter();
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
        <section className="pt-24 md:pt-32 py-24 px-6 md:px-12 text-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 text-white">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to MyGovt
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering citizens with seamless access to government services.
          </motion.p>
          <Link href="/signup">
            <button
              className="px-6 py-3 border-2 border-gray-300 text-white font-medium rounded-full hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 ease-in-out"
            >
              Get Started
            </button>



          </Link>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-12 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-12">
            Govt. Schemes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <motion.div
                  className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <feature.icon className="w-12 h-12 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-12">
          <div className="text-center">
            <p className="text-sm text-gray-300">&copy; 2025 MyGovt. All rights reserved.</p>
          </div>
          <Chatbot />
        </footer>
      </LoadingWrapper>
    </div>
  )
}
