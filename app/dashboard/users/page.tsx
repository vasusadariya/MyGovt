"use client"

import { useEffect, useState } from "react"
import { Navbar } from "../../../components/Navbar"
import { useSession } from "next-auth/react"
import withAuth from "../../../components/withAuth"
import { MessageSquare, Vote, PieChart, Bell, Calendar, TrendingUp, Shield, CheckCircle, Users, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import Link from "next/link"
import ComplaintCard from "../../../components/ComplaintCard"
import VoteCard from "../../../components/VoteCard"
import AddDocs from "../../../components/AddDocs"
import { motion } from "framer-motion"

interface UserStats {
  myComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  documentsUploaded: number
  votingStatus: "not-voted" | "voted"
}

function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats>({
    myComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    documentsUploaded: 0,
    votingStatus: "not-voted",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch complaints
        const complaintsResponse = await fetch("/api/complaints")
        if (complaintsResponse.ok) {
          const complaintsData = await complaintsResponse.json()
          const userComplaints = complaintsData.complaints || []
          const pendingComplaints = userComplaints.filter((c: any) => c.status === "Pending").length
          const resolvedComplaints = userComplaints.filter((c: any) => c.status === "Resolved").length

          // Fetch voting status
          const votesResponse = await fetch("/api/votes")
          const votesData = votesResponse.ok ? await votesResponse.json() : { hasVoted: false }

          // Fetch documents
          const documentsResponse = await fetch("/api/documents")
          const documentsData = documentsResponse.ok ? await documentsResponse.json() : { documents: [] }

          setStats({
            myComplaints: userComplaints.length,
            pendingComplaints,
            resolvedComplaints,
            documentsUploaded: documentsData.documents?.length || 0,
            votingStatus: votesData.hasVoted ? "voted" : "not-voted",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  const statCards = [
    {
      title: "My Complaints",
      value: stats.myComplaints,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Total complaints filed",
      trend: "+2 this month"
    },
    {
      title: "Pending Issues",
      value: stats.pendingComplaints,
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Awaiting resolution",
      trend: stats.pendingComplaints > 0 ? "Needs attention" : "All resolved"
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Successfully resolved",
      trend: "+1 this week"
    },
    {
      title: "Documents Stored",
      value: stats.documentsUploaded,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Securely on blockchain",
      trend: "Verified & secure"
    },
  ]

  const quickActions = [
    {
      component: ComplaintCard,
      delay: 0.1
    },
    {
      component: VoteCard,
      delay: 0.2
    },
    {
      component: AddDocs,
      delay: 0.3
    },
    {
      component: () => (
        <Link href="/Piechart">
          <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Election Results</h3>
              <p className="text-slate-600 text-center text-sm mb-4">
                View live voting analytics and results
              </p>
              <div className="flex items-center justify-center text-green-600 font-semibold">
                <span className="text-sm">View Results</span>
                <TrendingUp className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ),
      delay: 0.4
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
              <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        {/* Welcome Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Welcome back, {session?.user?.name || "Citizen"}! 👋
              </h1>
              <p className="text-xl text-slate-600">Your digital gateway to government services</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
              <Badge className={`px-3 py-1 ${stats.votingStatus === "voted" ? "bg-green-500" : "bg-orange-500"}`}>
                <Vote className="w-4 h-4 mr-1" />
                {stats.votingStatus === "voted" ? "Voted" : "Not Voted"}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-blue-100">
                Access essential government services with one click
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: action.delay }}
                  >
                    <action.component />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Status & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.pendingComplaints > 0 ? (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Pending Complaints</p>
                        <p className="text-sm text-slate-600">{stats.pendingComplaints} awaiting response</p>
                      </div>
                      <Badge className="bg-orange-500">Action Needed</Badge>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p>All your issues are resolved!</p>
                    </div>
                  )}

                  {stats.votingStatus === "not-voted" && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Election Active</p>
                        <p className="text-sm text-slate-600">Your vote matters - participate now</p>
                      </div>
                      <Badge className="bg-blue-500">Vote Now</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">All Services</p>
                      <p className="text-sm text-slate-600">Operating normally</p>
                    </div>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">IPFS Network</p>
                      <p className="text-sm text-slate-600">Document storage active</p>
                    </div>
                    <Badge className="bg-blue-500">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Blockchain</p>
                      <p className="text-sm text-slate-600">Secure verification enabled</p>
                    </div>
                    <Badge className="bg-purple-500">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)