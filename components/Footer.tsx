"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Vote, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  ArrowRight,
  Shield,
  Award,
  Users,
  Globe
} from "lucide-react"
import { NewsletterSubscription } from "./NewsletterSubscription"

const footerSections = [
  {
    title: "Services",
    links: [
      { name: "Digital Voting", href: "/dashboard/users/elections" },
      { name: "Complaint Portal", href: "/complaints" },
      { name: "Document Verification", href: "/document" },
      { name: "Analytics Dashboard", href: "/Piechart" },
    ]
  },
  {
    title: "Government",
    links: [
      { name: "About MyGovt", href: "/about" },
      { name: "Transparency", href: "/transparency" },
      { name: "Public Records", href: "/records" },
      { name: "Contact Officials", href: "/officials" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "User Guide", href: "/guide" },
      { name: "Technical Support", href: "/support" },
      { name: "Report Issue", href: "/report" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security Policy", href: "/security" },
      { name: "Accessibility", href: "/accessibility" },
    ]
  }
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/mygovt", color: "hover:text-blue-600" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/mygovt", color: "hover:text-blue-400" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/mygovt", color: "hover:text-blue-700" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/mygovt", color: "hover:text-pink-600" },
  { name: "GitHub", icon: Github, href: "https://github.com/mygovt", color: "hover:text-gray-900" },
]

const achievements = [
  { icon: Award, label: "Digital Excellence Award 2024" },
  { icon: Shield, label: "ISO 27001 Certified" },
  { icon: Users, label: "50K+ Active Citizens" },
  { icon: Globe, label: "Available 24/7 Worldwide" },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center gap-3 text-2xl font-bold mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Vote className="h-7 w-7 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    MyGovt
                  </span>
                </Link>

                <p className="text-blue-200 text-lg leading-relaxed mb-6">
                  Revolutionizing citizen-government interaction through secure, transparent, and intelligent digital solutions.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-200">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span>contact@mygovt.gov</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Digital Government Center, Washington DC</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-blue-200 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                          >
                            <span>{link.name}</span>
                            <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            className="mt-16 pt-12 border-t border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <NewsletterSubscription variant="footer" />
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            className="mt-12 pt-8 border-t border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Recognized Excellence
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <achievement.icon className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-blue-200 font-medium">
                    {achievement.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-blue-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-blue-200 mb-2">
                © 2025 MyGovt, Digital Government Initiative. All rights reserved.
              </p>
              <p className="text-sm text-blue-300">
                Developed and maintained by{" "}
                <span className="text-blue-400 font-semibold">HackOps Development Team</span>
                {" "}&{" "}
                <span className="text-blue-400 font-semibold">Digital Innovation Committee</span>
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white/10 rounded-full text-blue-200 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Government Disclaimer */}
          <motion.div
            className="mt-8 pt-6 border-t border-blue-800 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-blue-300 leading-relaxed max-w-4xl mx-auto">
              This is an official government website. Information and services provided are subject to government policies and regulations. 
              All data is protected under federal privacy laws. For technical support or accessibility issues, please contact our support team.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}