"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Vote, FileText, BarChart3, Shield, CheckCircle } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import Link from "next/link"

const features = [
  {
    href: "/voting",
    icon: Vote,
    title: "Secure Voting",
    description: "Participate in transparent and secure democratic processes with our advanced voting system.",
  },
  {
    href: "/complaints",
    icon: FileText,
    title: "Citizen Complaints",
    description: "Submit and track your complaints efficiently through our streamlined complaint management system.",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    title: "Government Analytics",
    description: "Access comprehensive data and insights about government performance and citizen engagement.",
  },
  {
    href: "/services",
    icon: Shield,
    title: "Digital Services",
    description: "Access essential government services digitally with enhanced security and convenience.",
  },
]

const stats = [
  {
    icon: Users,
    number: "50K+",
    label: "Active Citizens",
  },
  {
    icon: Vote,
    number: "25+",
    label: "Elections Conducted",
  },
  {
    icon: FileText,
    number: "10K+",
    label: "Complaints Resolved",
  },
  {
    icon: CheckCircle,
    number: "98%",
    label: "Satisfaction Rate",
  },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 px-6 md:px-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                Digital Government Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                Welcome to <span className="text-blue-600">MyGovt</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                Bridging the gap between citizens and government through secure, transparent, and efficient digital
                solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <button className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Register Now!
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Innovating for Tomorrow</h3>
                <p className="text-blue-100 mb-6">
                  Transforming government services into seamless digital experiences for every citizen.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-blue-200">Service Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm text-blue-200">Secure</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Government Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access essential government services and participate in democratic processes with our comprehensive
              digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <motion.div
                  className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl font-bold text-blue-600 mb-6">About MyGovt</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                MyGovt, established as a pioneering digital platform, is dedicated to excellence in citizen services and
                democratic participation. Over the years, we have consistently contributed to transparent governance and
                efficient public service delivery.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Empowering Citizens:</h4>
                    <p className="text-gray-600">
                      Support democratic participation and transparent governance through innovative digital solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure Technology:</h4>
                    <p className="text-gray-600">
                      Implement cutting-edge security measures to protect citizen data and ensure system integrity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-blue-100 mb-6">
                  To create a seamless bridge between citizens and government services through innovative technology and
                  transparent processes.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold mb-1">Secure</div>
                    <div className="text-sm text-blue-200">End-to-end encryption</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-1">Transparent</div>
                    <div className="text-sm text-blue-200">Open governance</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">MyGovt</h3>
              <p className="text-blue-200 mb-4">Research and Innovation Affairs Council</p>
              <p className="text-blue-300 text-sm">Digital Government Solutions, India</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact & Connect</h4>
              <div className="space-y-2 text-blue-200">
                <p>📧 contact@mygovt.in</p>
                <p>🌐 MyGovt Website</p>
                <p>💼 LinkedIn</p>
                <p>📱 Instagram</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/voting" className="block text-blue-200 hover:text-white transition-colors">
                  Voting
                </Link>
                <Link href="/complaints" className="block text-blue-200 hover:text-white transition-colors">
                  Complaints
                </Link>
                <Link href="/contact" className="block text-blue-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 text-center">
            <p className="text-blue-300 mb-2">&copy; 2025 MyGovt, Digital India Initiative</p>
            <p className="text-sm text-blue-400">
              Developed and maintained by Digital Innovation Team & Web Development Committee
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
