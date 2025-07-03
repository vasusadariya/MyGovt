"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { FileText, ArrowRight } from "lucide-react"
import { Card, CardContent } from "./ui/card"

export default function AddDocs() {
  const router = useRouter()

  return (
    <Card 
      className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100"
      onClick={() => router.push("/document")}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Document Storage</h3>
        <p className="text-slate-600 text-center text-sm mb-4">
          Secure blockchain document verification
        </p>
        <div className="flex items-center justify-center text-purple-600 font-semibold">
          <span className="text-sm">Upload Documents</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </CardContent>
    </Card>
  )
}