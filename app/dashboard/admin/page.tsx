"use client"

import { Navbar } from "../../../components/Navbar"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, BarChart, LogOut, Users, MessageSquare, Vote, FileText, TrendingUp, Calendar, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { motion } from "framer-motion"
import withAuth from "../../../components/withAuth"
import { signOut } from "next-auth/react"

interface AdminStats {
  totalUsers: number
  totalCandidates: number
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  totalVotes: number
  totalDocuments: number
}

function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCandidates: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalVotes: 0,
    totalDocuments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Registered citizens",
      trend: "+12% this month"
    },
    {
      title: "Active Candidates",
      value: stats.totalCandidates,
      icon: Vote,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Election participants",
      trend: "+3 new candidates"
    },
    {
      title: "Total Complaints",
      value: stats.totalComplaints,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Citizen complaints",
      trend: `${stats.pendingComplaints} pending`
    },
    {
      title: "Total Votes",
      value: stats.totalVotes,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Votes cast",
      trend: "Live counting"
    },
    {
      title: "Documents Stored",
      value: stats.totalDocuments,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Blockchain verified",
      trend: "Secure storage"
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedComplaints,
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Successfully resolved",
      trend: `${Math.round((stats.resolvedComplaints / Math.max(stats.totalComplaints, 1)) * 100)}% resolution rate`
    }
  ]

  const quickActions = [
    {
      title: "Manage Complaints",
      description: "Review and resolve citizen complaints",
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600",
      href: "/complaints",
      badge: stats.pendingComplaints > 0 ? `${stats.pendingComplaints} pending` : null
    },
    {
      title: "Election Monitoring",
      description: "Monitor live election results and analytics",
      icon: BarChart,
      color: "from-blue-500 to-blue-600",
      href: "/elections",
      badge: "Live"
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      href: "/admin/users",
      badge: null
    },
    {
      title: "System Analytics",
      description: "View comprehensive system analytics",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      href: "/Piechart",
      badge: null
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>
              <p className="text-xl text-slate-600">Comprehensive system management and oversight</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
              <Badge className="bg-green-500 px-3 py-1">
                <Shield className="w-4 h-4 mr-1" />
                System Online
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{stat.trend}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Administrative Actions</CardTitle>
              <p className="text-slate-200">Quick access to essential admin functions</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <Link href={action.href}>
                      <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-center text-slate-800 mb-2">{action.title}</h3>
                          <p className="text-slate-600 text-center text-sm mb-4">{action.description}</p>
                          {action.badge && (
                            <div className="flex justify-center">
                              <Badge className="bg-red-500 text-white">{action.badge}</Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.pendingComplaints > 0 ? (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Pending Complaints</p>
                        <p className="text-sm text-slate-600">{stats.pendingComplaints} require attention</p>
                      </div>
                      <Badge className="bg-orange-500">Action Required</Badge>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Shield className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p>All systems operating normally</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">System Uptime</p>
                      <p className="text-sm text-slate-600">99.9% availability</p>
                    </div>
                    <Badge className="bg-green-500">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Response Time</p>
                      <p className="text-sm text-slate-600">Average 1.2s</p>
                    </div>
                    <Badge className="bg-blue-500">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Security Status</p>
                      <p className="text-sm text-slate-600">All systems secure</p>
                    </div>
                    <Badge className="bg-purple-500">Protected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Logout Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Session Management</h3>
                  <p className="text-slate-600 text-sm mb-4">Securely end your administrative session</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Secure Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default withAuth(AdminDashboard, { requiredRole: "admin" })