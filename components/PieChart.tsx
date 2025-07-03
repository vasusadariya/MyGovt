"use client"

import React, { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"

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
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export default function PieChartComponent() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/candidates")
      if (response.ok) {
        const result = await response.json()
        const candidates: Candidate[] = result.candidates || []
        
        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

        const formattedData = candidates.map((candidate) => ({
          name: candidate.name,
          votes: candidate.votes,
          percentage: totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0,
        }))

        setData(formattedData)
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Votes: {data.votes}</p>
          <p className="text-green-600">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
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
    </div>
  )
}