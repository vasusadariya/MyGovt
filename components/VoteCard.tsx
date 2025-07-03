"use client"

import Link from "next/link"
import React from "react"
import { Vote, ArrowRight } from "lucide-react"
import { Card, CardContent } from "./ui/card"

export default function VoteCard() {
  return (
    <Link href="/dashboard/users/elections">
      <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Cast Your Vote</h3>
          <p className="text-slate-600 text-center text-sm mb-4">
            Participate in secure digital elections
          </p>
          <div className="flex items-center justify-center text-blue-600 font-semibold">
            <span className="text-sm">Vote Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}