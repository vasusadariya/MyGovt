"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useToast } from "../hooks/use-toast"

interface NewsletterSubscriptionProps {
  variant?: "footer" | "inline" | "modal"
  className?: string
}

export function NewsletterSubscription({ 
  variant = "footer", 
  className = "" 
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed")
      }

      setIsSubscribed(true)
      setEmail("")
      setName("")
      
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive the latest government updates and policy changes.",
        variant: "default",
      })

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 5000)

    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "footer") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Stay Updated with Government News
          </h3>
          <p className="text-blue-200">
            Get the latest updates on digital government services and policy changes.
          </p>
        </div>
        
        {isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-400 rounded-lg"
          >
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-100 font-semibold">Successfully Subscribed!</p>
              <p className="text-green-200 text-sm">Thank you for joining our newsletter.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-blue-700 text-white placeholder:text-blue-300 focus:border-blue-500 focus:bg-white/15"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit"
                disabled={isLoading || !email.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-blue-300">
              By subscribing, you agree to receive government updates and can unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 ${className}`}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Stay Informed with Government Updates
            </h3>
            <p className="text-gray-600">
              Subscribe to receive the latest news on digital services, policy changes, and civic engagement opportunities.
            </p>
          </div>

          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 p-4 bg-green-100 border border-green-300 rounded-lg"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">Welcome to our newsletter!</p>
                <p className="text-green-700 text-sm">Check your email for a confirmation message.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading || !email.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe to Newsletter"
                )}
              </Button>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    )
  }

  return null
}