"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Vote, 
  FileText, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Award,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

const features = [
  {
    href: "/dashboard/users/elections",
    icon: Vote,
    title: "Secure Digital Voting",
    description: "Participate in transparent and secure democratic processes with blockchain-verified voting technology.",
    color: "from-blue-500 to-blue-600",
    delay: 0.1
  },
  {
    href: "/complaints",
    icon: FileText,
    title: "Citizen Complaint Portal",
    description: "Submit and track your complaints efficiently through our AI-powered complaint management system.",
    color: "from-green-500 to-green-600",
    delay: 0.2
  },
  {
    href: "/document",
    icon: Shield,
    title: "Document Verification",
    description: "Store and verify official documents using IPFS and blockchain technology for maximum security.",
    color: "from-purple-500 to-purple-600",
    delay: 0.3
  },
  {
    href: "/Piechart",
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Access comprehensive data and insights about government performance and citizen engagement.",
    color: "from-orange-500 to-orange-600",
    delay: 0.4
  },
]

const stats = [
  {
    icon: Users,
    number: "50K+",
    label: "Active Citizens",
    description: "Registered users actively participating in digital governance",
    color: "text-blue-600"
  },
  {
    icon: Vote,
    number: "25+",
    label: "Elections Conducted",
    description: "Successful digital elections with 100% transparency",
    color: "text-green-600"
  },
  {
    icon: FileText,
    number: "10K+",
    label: "Complaints Resolved",
    description: "Citizen issues addressed through our efficient system",
    color: "text-purple-600"
  },
  {
    icon: CheckCircle,
    number: "98%",
    label: "Satisfaction Rate",
    description: "Citizens satisfied with our digital services",
    color: "text-orange-600"
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process requests and access services in seconds, not days"
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "Military-grade encryption protects all your sensitive data"
  },
  {
    icon: Globe,
    title: "24/7 Accessibility",
    description: "Access government services anytime, anywhere in the world"
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized globally for innovation in digital governance"
  }
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <motion.div
              className="text-left space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Next-Generation Digital Government Platform
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  MyGovt
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Revolutionizing citizen-government interaction through secure, transparent, and intelligent digital solutions powered by blockchain and AI.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Link href="/auth/signup">
                  <Button size="xl" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="xl" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                    Explore Features
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center space-x-6 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">Trusted by 50,000+ citizens</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Digital Innovation</h3>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Experience the future of governance with our cutting-edge platform that seamlessly connects citizens with government services.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl font-bold">24/7</div>
                        <div className="text-sm text-blue-200">Service Access</div>
                      </motion.div>
                      <motion.div
                        className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl font-bold">100%</div>
                        <div className="text-sm text-blue-200">Secure</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-blue-600">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform has transformed how citizens interact with government services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0 space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full" />
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500 rounded-full" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Government Services <span className="text-blue-600">Reimagined</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the next generation of digital governance with our comprehensive suite of secure, transparent, and efficient services designed for the modern citizen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={feature.href}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden group-hover:scale-105">
                    <CardContent className="p-8 space-y-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>

                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                        <span className="text-sm">Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Why Choose <span className="text-blue-600">MyGovt?</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We're revolutionizing how citizens interact with government services through cutting-edge technology and user-centric design.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                      <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                    
                    <p className="text-blue-100 text-lg leading-relaxed">
                      To create a seamless bridge between citizens and government services through innovative technology, ensuring transparency, efficiency, and accessibility for all.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                        <div className="text-lg font-bold">Instant</div>
                        <div className="text-xs text-blue-200">Response Time</div>
                      </div>
                      <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Shield className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                        <div className="text-lg font-bold">Secure</div>
                        <div className="text-xs text-blue-200">Data Protection</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-80 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Transform Your <span className="text-yellow-300">Government Experience?</span>
            </h2>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Join thousands of citizens who have already embraced the future of digital governance. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="xl" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-blue-200 text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}