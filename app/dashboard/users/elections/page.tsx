"use client"

import withAuth from "@/components/withAuth"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"

interface Candidate {
  _id: string
  name: string
  party: string
  votes: number
  promises: string
}

function UserElections() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCandidates()
    const interval = setInterval(fetchCandidates, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/candidate")
      setCandidates(response.data.candidates)
    } catch (error) {
      console.error("Error fetching candidates:", error)
    }
  }

  const voteCandidate = async (candidateId: string) => {
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/vote/${candidateId}`)
      fetchCandidates()
    } catch (error) {
      console.error("Error voting:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">🗳 Election Voting Portal</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white shadow-xl rounded-xl p-6 border-2 border-slate-200 transition-transform transform hover:scale-105 duration-300 hover:shadow-2xl"
            >
              <h2 className="text-xl font-bold text-slate-800 text-center mb-2">{candidate.name}</h2>
              <p className="text-slate-600 text-center mb-1">{candidate.party}</p>
              <p className="text-blue-700 font-bold text-center mt-3 text-lg">Votes: {candidate.votes}</p>
              <div className="text-center mt-4">
                <details className="bg-slate-100 p-4 rounded-lg cursor-pointer">
                  <summary className="font-semibold text-slate-700">View Campaign Promises</summary>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{candidate.promises}</p>
                </details>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() =>
                    voteCandidate(candidate._id).then(() => {
                      alert("Vote recorded successfully!\nYou are being redirected to the user dashboard.")
                      router.push("/dashboard/users")
                    })
                  }
                  disabled={loading}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg"
                >
                  {loading ? "Voting..." : "Cast Vote"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withAuth(UserElections, "user")
