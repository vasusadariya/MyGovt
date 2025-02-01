"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Wallet, ShoppingCart, Cloud, BarChart2 } from "lucide-react"
import LoadingWrapper from "@/components/LoadingWrapper"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
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

const testimonials = [
  {
    name: "John Doe",
    role: "Investor",
    quote: "This platform has revolutionized the way I manage my investments.",
  },
  {
    name: "Jane Smith",
    role: "Entrepreneur",
    quote: "The commerce features have made it incredibly easy to run my online business.",
  },
  {
    name: "Alex Johnson",
    role: "Financial Analyst",
    quote: "The analytical tools provided are unparalleled in the industry.",
  },
  {
    name: "Love",
    role: "Financial Analyst",
    quote: "The analytical tools provided are unparalleled in the industry.",
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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        {/* Hero Section */}
        <section className="pt-20 md:pt-32 px-4 md:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to My Govt
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering your financial journey with cutting-edge solutions
          </motion.p>
          <Link href="/signup" className="flex justify-center items-center">
                  <button
                    className="px-4 py-2 flex justify-center items-center rounded-lg border-2 border-[#000000] bg-[#ae7aff]
                    text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                    dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                    hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <ArrowRight className="w-6 h-6" />
                    Get Started
                  </button>
                </Link>

        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Our Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <ProductCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl mb-8">
              Join thousands of satisfied users and take control of your financial future today.
            </p>
            <div className="flex justify-center">
              <button className="px-6 py-2 md:flex flex items-center justify-center gap-2 rounded-lg border-2 border-[#000000] bg-[#c2df44]
                      text-sm font-semibold text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] 
                      dark:shadow-[3px_3px_0px_0px_#4ade80] dark:hover:shadow-[1px_1px_0px_0px_#4ade80]
                      hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                onClick={() => {
                  router.push("/signup")
                }}>
                Start Your Journey <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial) => (
              <ProductCard title={testimonial.name} description={""} icon={Wallet} href={"#"} key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </section>
        <Footer />
      </div>
       </LoadingWrapper>
    </div>
  )
}

