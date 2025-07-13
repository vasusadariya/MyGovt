"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../../components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { 
  Server, 
  Database, 
  Shield, 
  Globe, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"

interface HealthStatus {
  status: string
  timestamp: string
  services: {
    database: string
    api: string
    auth: string
    ipfs: string
  }
  version: string
  uptime: number
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchHealthStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchHealthStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/health")
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      }
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching health status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "connected":
      case "operational":
        return "bg-green-100 text-green-800 border-green-200"
      case "degraded":
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "unhealthy":
      case "disconnected":
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "connected":
      case "operational":
        return <CheckCircle className="w-4 h-4" />
      case "degraded":
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "unhealthy":
      case "disconnected":
      case "error":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const services = [
    {
      name: "Database",
      icon: Database,
      status: health?.services.database || "unknown",
      description: "MongoDB connection and data storage"
    },
    {
      name: "API Services",
      icon: Server,
      status: health?.services.api || "unknown",
      description: "REST API endpoints and backend services"
    },
    {
      name: "Authentication",
      icon: Shield,
      status: health?.services.auth || "unknown",
      description: "User authentication and authorization"
    },
    {
      name: "IPFS Network",
      icon: Globe,
      status: health?.services.ipfs || "unknown",
      description: "Document storage and blockchain integration"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-800 mb-4">🔍 System Status</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Real-time monitoring of government digital services and infrastructure
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-3 py-1">
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Button onClick={fetchHealthStatus} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Activity className="w-6 h-6" />
                Overall System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : health ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Badge className={`${getStatusColor(health.status)} border text-lg px-4 py-2`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(health.status)}
                          {health.status.toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-slate-600">System Status</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                      {formatUptime(health.uptime)}
                    </div>
                    <p className="text-slate-600">System Uptime</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                      v{health.version}
                    </div>
                    <p className="text-slate-600">Current Version</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">Unable to Load Status</h3>
                  <p className="text-slate-500">Please try refreshing the page</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Service Components</CardTitle>
              <p className="text-blue-100">Individual service status and health monitoring</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <service.icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{service.name}</h3>
                              <p className="text-sm text-slate-600">{service.description}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(service.status)} border`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(service.status)}
                              {service.status}
                            </div>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-slate-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600">
                <div className="text-center">
                  <Server className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">High Availability</h4>
                  <p className="text-sm leading-relaxed">
                    Our systems are designed for 99.9% uptime with automatic failover and redundancy.
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">Security Monitoring</h4>
                  <p className="text-sm leading-relaxed">
                    Continuous security monitoring and threat detection protect all government data.
                  </p>
                </div>
                <div className="text-center">
                  <Activity className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">Real-time Updates</h4>
                  <p className="text-sm leading-relaxed">
                    Status information is updated in real-time to provide accurate service health data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}