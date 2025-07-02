"use client"

import { Navbar } from "@/components/Navbar"
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import withAuth from "@/components/withAuth"
import axios from "axios"
import { X, UserPlus } from "lucide-react"

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
  const [showForm, setShowForm] = useState<boolean>(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    age: "",
    promises: "",
    party: "",
    votingId: "",
  })

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await axios.get("http://localhost:8080/candidate")
        setCandidates(response.data.candidates)
      } catch (error) {
        console.error("Error fetching candidates:", error)
      }
    }
    fetchCandidates()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if ((name === "age" || name === "votingId") && value.startsWith("0")) {
      setFormData({ ...formData, [name]: value.replace(/^0+/, "") })
    } else {
      setFormData({ ...formData, [name]: name === "age" || name === "votingId" ? Number(value) : value })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8080/candidates", formData)
      console.log("Form submitted successfully:", response.data)

      const updatedCandidates = await axios.get("http://localhost:8080/candidate")
      setCandidates(updatedCandidates.data.candidates)

      setFormData({
        name: "",
        gender: "",
        age: "",
        promises: "",
        party: "",
        votingId: "",
      })

      setShowForm(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-24 px-6">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-12">Candidate Registration Portal</h1>

        {/* Enter Details Card */}
        <div
          onClick={() => setShowForm(true)}
          className="max-w-md mx-auto bg-blue-700 text-white p-8 rounded-xl shadow-xl cursor-pointer 
          flex items-center justify-center gap-4 hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300 mb-12"
        >
          <UserPlus className="w-10 h-10" />
          <h2 className="text-xl font-bold">Register as Candidate</h2>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Candidate Registration</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">Full Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">
                    Campaign Promises:
                  </label>
                  <input
                    type="text"
                    name="promises"
                    value={formData.promises}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">Political Party:</label>
                  <input
                    type="text"
                    name="party"
                    value={formData.party}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 font-semibold mb-2">Voting ID:</label>
                  <input
                    type="number"
                    name="votingId"
                    value={formData.votingId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-slate-600 dark:text-gray-300 border-2 border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Register Candidate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-slate-800 text-white p-6">
            <h2 className="text-2xl font-bold">Registered Candidates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Sr No.</th>
                  <th className="px-6 py-4 text-left font-semibold">Candidate Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Political Party</th>
                  <th className="px-6 py-4 text-left font-semibold">Voting ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Current Votes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidates.map((candidate, index) => (
                  <tr key={candidate._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-700">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{candidate.name}</td>
                    <td className="px-6 py-4 text-slate-600">{candidate.party}</td>
                    <td className="px-6 py-4 text-slate-600">{candidate.votingId}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{candidate.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(CandidateDashboard, "candidate")
