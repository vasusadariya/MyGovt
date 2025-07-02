"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { useSession } from "next-auth/react"
import withAuth from "@/components/withAuth"
import { MessageSquare, Vote, PieChart, Bell, Calendar, TrendingUp, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import ComplaintCard from "@/components/ComplaintCard"
import VoteCard from "@/components/VoteCard"
import AddDocs from "@/components/AddDocs"

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

  useEffect(() => {
    // Fetch user-specific data
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]")
    const userComplaints = complaints.filter((c: any) => c.name === session?.user?.name)
    const pendingComplaints = userComplaints.filter((c: any) => c.status === "Pending").length
    const resolvedComplaints = userComplaints.filter((c: any) => c.status === "Resolved").length

    setStats({
      myComplaints: userComplaints.length,
      pendingComplaints,
      resolvedComplaints,
      documentsUploaded: Number.parseInt(localStorage.getItem("documentsUploaded") || "0"),
      votingStatus: localStorage.getItem("hasVoted") ? "voted" : "not-voted",
    })
  }, [session])

  const statCards = [
    {
      title: "My Complaints",
      value: stats.myComplaints,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Total complaints filed",
    },
    {
      title: "Pending Issues",
      value: stats.pendingComplaints,
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Awaiting resolution",
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Successfully resolved",
    },
    {
      title: "Documents Stored",
      value: stats.documentsUploaded,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Securely on blockchain",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        {/* Welcome Header */}
        <div className="mb-12">
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
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-blue-100">
              Access essential government services with one click
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ComplaintCard />
              <VoteCard />
              <AddDocs />
              <Link href="/Piechart">
                <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer">
                  <div className="flex items-center justify-center mb-4">
                    <PieChart className="w-12 h-12 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-center">View Results</h2>
                  <p className="text-gray-700 text-sm text-center">See live election results</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Service Status & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  )
}

export default withAuth(Dashboard, "user")
