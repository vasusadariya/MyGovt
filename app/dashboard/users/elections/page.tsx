"use client"

import withAuth from "../../../../components/withAuth"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "../../../../components/Navbar"
import { Vote, Users, TrendingUp, Award, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { motion } from "framer-motion"
import { useToast } from "../../../../hooks/use-toast"

interface Candidate {
  _id: string
  name: string
  party: string
  votes: number
  promises: string
  age: number
  gender: string
}

function UserElections() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCandidates()
    checkVotingStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCandidates, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates")
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates || [])
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
    }
  }

  const checkVotingStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/votes")
      if (response.ok) {
        const data = await response.json()
        setHasVoted(data.hasVoted)
      }
    } catch (error) {
      console.error("Error checking voting status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const voteCandidate = async (candidateId: string) => {
    if (hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSelectedCandidate(candidateId)

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to record vote")
      }

      setHasVoted(true)
      toast({
        title: "Vote Recorded Successfully!",
        description: "Thank you for participating in the democratic process.",
        variant: "default",
      })

      // Refresh candidates to show updated vote counts
      await fetchCandidates()

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard/users")
      }, 3000)

    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Voting Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSelectedCandidate(null)
    }
  }

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const leadingCandidate = candidates.length > 0 ? candidates[0] : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading election data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto py-24 px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-800 mb-4">🗳️ Digital Election Portal</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Participate in secure, transparent democratic elections powered by blockchain technology
          </p>
        </motion.div>

        {/* Election Stats */}
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
                    <p className="text-sm font-medium text-slate-600 mb-1">Your Status</p>
                    <p className="text-lg font-bold text-slate-800">{hasVoted ? "Voted" : "Not Voted"}</p>
                    <p className="text-sm text-slate-500">{hasVoted ? "Thank you!" : "Cast your vote"}</p>
                  </div>
                  <div className={`p-3 rounded-full ${hasVoted ? "bg-green-50" : "bg-orange-50"}`}>
                    {hasVoted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Voting Status Alert */}
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Vote Recorded:</strong> Thank you for participating in the democratic process. Your vote has been securely recorded on the blockchain.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {!hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Ready to Vote:</strong> Review the candidates below and cast your vote. You can only vote once per election.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                index === 0 ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100" : "bg-white"
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-800">{candidate.name}</CardTitle>
                    {index === 0 && <Award className="w-6 h-6 text-yellow-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {candidate.party}
                    </Badge>
                    {index === 0 && <Badge className="bg-yellow-500">Leading</Badge>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700 mb-1">{candidate.votes}</p>
                    <p className="text-sm text-slate-600">Votes Received</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                      <strong>Age:</strong> {candidate.age} | <strong>Gender:</strong> {candidate.gender}
                    </p>
                  </div>

                  <details className="bg-slate-50 p-4 rounded-lg cursor-pointer">
                    <summary className="font-semibold text-slate-700 text-sm">Campaign Promises</summary>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed">{candidate.promises}</p>
                  </details>

                  <div className="pt-4">
                    <Button
                      onClick={() => voteCandidate(candidate._id)}
                      disabled={loading || hasVoted}
                      className={`w-full font-semibold transition-all duration-300 ${
                        hasVoted 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-blue-700 hover:bg-blue-800 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {loading && selectedCandidate === candidate._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Voting...
                        </>
                      ) : hasVoted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Vote Cast
                        </>
                      ) : (
                        <>
                          <Vote className="w-4 h-4 mr-2" />
                          Cast Vote
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {candidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Candidates Available</h3>
            <p className="text-slate-500">Election candidates will appear here when registration opens.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default withAuth(UserElections)