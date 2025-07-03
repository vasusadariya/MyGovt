"use client"

import { Navbar } from "../../../components/Navbar"
import { useState, useEffect } from "react"
import withAuth from "../../../components/withAuth"
import { X, UserPlus, Users, TrendingUp, Award, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { motion } from "framer-motion"
import { useToast } from "../../../hooks/use-toast"

interface Candidate {
  _id: string
  name: string
  gender: string
  age: number
  promises: string
  party: string
  votingId: number
  votes: number
}

interface FormData {
  name: string
  gender: string
  age: number | string
  promises: string
  party: string
  votingId: number | string
}

function CandidateDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    age: "",
    promises: "",
    party: "",
    votingId: "",
  })

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/candidates")
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates || [])
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch candidates data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if ((name === "age" || name === "votingId") && value.startsWith("0")) {
      setFormData({ ...formData, [name]: value.replace(/^0+/, "") })
    } else {
      setFormData({ ...formData, [name]: name === "age" || name === "votingId" ? Number(value) || "" : value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register candidate")
      }

      toast({
        title: "Success!",
        description: "Candidate registered successfully",
        variant: "default",
      })

      // Reset form and close modal
      setFormData({
        name: "",
        gender: "",
        age: "",
        promises: "",
        party: "",
        votingId: "",
      })
      setShowForm(false)
      
      // Refresh candidates list
      fetchCandidates()

    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const leadingCandidate = candidates.length > 0 ? candidates.reduce((prev, current) => (prev.votes > current.votes) ? prev : current) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-24 px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Candidate Portal</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Register as a candidate and manage your election campaign through our secure digital platform
          </p>
        </motion.div>

        {/* Stats Cards */}
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
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Candidates</p>
                    <p className="text-3xl font-bold text-slate-800">{candidates.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Users className="w-6 h-6 text-blue-600" />
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
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Votes</p>
                    <p className="text-3xl font-bold text-slate-800">{totalVotes}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <TrendingUp className="w-6 h-6 text-green-600" />
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
                    <p className="text-sm font-medium text-slate-600 mb-1">Leading Candidate</p>
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
                    <p className="text-sm font-medium text-slate-600 mb-1">Election Status</p>
                    <p className="text-lg font-bold text-slate-800">Active</p>
                    <p className="text-sm text-slate-500">Voting in progress</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Register Button */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card
            className="max-w-md mx-auto cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white"
            onClick={() => setShowForm(true)}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4">
                <UserPlus className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">Register as Candidate</h2>
                  <p className="text-blue-100">Join the democratic process</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">Candidate Registration</h2>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-slate-700 font-semibold">Full Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        variant="government"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-700 font-semibold">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-700 font-semibold">Age</label>
                      <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        variant="government"
                        min="18"
                        max="100"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-700 font-semibold">Voting ID</label>
                      <Input
                        type="number"
                        name="votingId"
                        value={formData.votingId}
                        onChange={handleChange}
                        placeholder="Enter your voting ID"
                        variant="government"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-700 font-semibold">Political Party</label>
                    <Input
                      type="text"
                      name="party"
                      value={formData.party}
                      onChange={handleChange}
                      placeholder="Enter your political party"
                      variant="government"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-700 font-semibold">Campaign Promises</label>
                    <textarea
                      name="promises"
                      value={formData.promises}
                      onChange={handleChange}
                      placeholder="Describe your campaign promises and vision..."
                      className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="government"
                      disabled={isSubmitting || !formData.name || !formData.gender || !formData.age || !formData.promises || !formData.party || !formData.votingId}
                    >
                      {isSubmitting ? "Registering..." : "Register Candidate"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Candidates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
              <CardTitle className="text-2xl font-bold">Registered Candidates</CardTitle>
              <p className="text-slate-200">Current election participants and their performance</p>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No candidates registered yet</p>
                  <p className="text-slate-500">Be the first to register!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold">Candidate Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Political Party</th>
                        <th className="px-6 py-4 text-left font-semibold">Age</th>
                        <th className="px-6 py-4 text-left font-semibold">Voting ID</th>
                        <th className="px-6 py-4 text-left font-semibold">Current Votes</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {candidates.map((candidate, index) => (
                        <tr key={candidate._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {index === 0 && <Award className="w-5 h-5 text-yellow-500 mr-2" />}
                              <span className="font-semibold text-slate-700">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-slate-800">{candidate.name}</p>
                              <p className="text-sm text-slate-500">{candidate.gender}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="font-medium">
                              {candidate.party}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{candidate.age}</td>
                          <td className="px-6 py-4 text-slate-600">{candidate.votingId}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-blue-600 text-lg">{candidate.votes}</span>
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default withAuth(CandidateDashboard, { requiredRole: "candidate" })