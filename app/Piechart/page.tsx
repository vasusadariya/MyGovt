"use client"

import React, { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Navbar } from "../../components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { TrendingUp, Users, Vote, Award, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"

interface Candidate {
  _id: string
  name: string
  votes: number
  party: string
}

interface ChartData {
  name: string
  votes: number
  percentage: number
  party: string
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

export default function PieChartComponent() {
  const [data, setData] = useState<ChartData[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalVotes, setTotalVotes] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchCandidates()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCandidates, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchCandidates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/candidates")
      if (response.ok) {
        const result = await response.json()
        const candidatesData = result.candidates || []
        setCandidates(candidatesData)
        
        const total = candidatesData.reduce((sum: number, candidate: Candidate) => sum + candidate.votes, 0)
        setTotalVotes(total)

        const formattedData = candidatesData.map((candidate: Candidate) => ({
          name: candidate.name,
          votes: candidate.votes,
          percentage: total > 0 ? Math.round((candidate.votes / total) * 100) : 0,
          party: candidate.party,
        }))

        setData(formattedData)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const leadingCandidate = candidates.length > 0 ? candidates[0] : null
  const participationRate = Math.min(Math.round((totalVotes / 1000) * 100), 100) // Assuming 1000 eligible voters

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{data.name}</p>
          <p className="text-blue-600">Party: {data.party}</p>
          <p className="text-green-600">Votes: {data.votes}</p>
          <p className="text-purple-600">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading election results...</p>
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
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-800 mb-4">📊 Live Election Results</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Real-time voting analytics and comprehensive election statistics
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-3 py-1">
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Button onClick={fetchCandidates} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Votes</p>
                    <p className="text-3xl font-bold text-slate-800">{totalVotes}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Vote className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Candidates</p>
                    <p className="text-3xl font-bold text-slate-800">{candidates.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Leading</p>
                    <p className="text-lg font-bold text-slate-800">{leadingCandidate?.name || "None"}</p>
                    <p className="text-sm text-slate-500">{leadingCandidate?.votes || 0} votes</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-50">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Participation</p>
                    <p className="text-3xl font-bold text-slate-800">{participationRate}%</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Vote Distribution</CardTitle>
                <p className="text-blue-100">Percentage breakdown by candidate</p>
              </CardHeader>
              <CardContent className="p-6">
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {data.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-96 text-slate-500">
                    <div className="text-center">
                      <Vote className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-lg">No voting data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Vote Comparison</CardTitle>
                <p className="text-green-100">Absolute vote counts by candidate</p>
              </CardHeader>
              <CardContent className="p-6">
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-96 text-slate-500">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-lg">No voting data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Detailed Results</CardTitle>
              <p className="text-slate-200">Complete candidate performance breakdown</p>
            </CardHeader>
            <CardContent className="p-0">
              {candidates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Candidate</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Party</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Votes</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Percentage</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.map((candidate, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {index === 0 && <Award className="w-5 h-5 text-yellow-500 mr-2" />}
                              <span className="font-semibold text-slate-700">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">{candidate.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{candidate.party}</Badge>
                          </td>
                          <td className="px-6 py-4 font-bold text-blue-600">{candidate.votes}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${candidate.percentage}%` }}
                                ></div>
                              </div>
                              <span className="font-medium">{candidate.percentage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={index === 0 ? "bg-green-500" : "bg-blue-500"}>
                              {index === 0 ? "Leading" : "Active"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No election data available</p>
                  <p className="text-slate-500">Results will appear here once voting begins</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}