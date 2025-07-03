"use client"

import React, { useState } from "react"
import { MessageSquare, ArrowRight } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import ComplaintForm from "./ComplaintForm"

export default function ComplaintCard() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      {/* Card that opens the form */}
      <Card
        className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100"
        onClick={() => setIsFormOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Register Complaint</h3>
          <p className="text-slate-600 text-center text-sm mb-4">
            Submit civic issues for prompt government action
          </p>
          <div className="flex items-center justify-center text-orange-600 font-semibold">
            <span className="text-sm">File Complaint</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </CardContent>
      </Card>

      {/* Modal for Complaint Form */}
      {isFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ComplaintForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}