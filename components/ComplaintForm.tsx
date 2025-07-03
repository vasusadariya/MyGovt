"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "../hooks/use-toast"

interface ComplaintFormProps {
  onClose: () => void
}

export default function ComplaintForm({ onClose }: ComplaintFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    complaintType: "",
    area: "",
    description: "",
    contact: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit complaint")
      }

      setIsSubmitted(true)
      toast({
        title: "Complaint Submitted Successfully!",
        description: "Your complaint has been registered and will be reviewed by our team.",
        variant: "default",
      })

      // Reset form after 2 seconds and close
      setTimeout(() => {
        setFormData({
          complaintType: "",
          area: "",
          description: "",
          contact: "",
        })
        onClose()
      }, 2000)

    } catch (error) {
      console.error("Error submitting complaint:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Complaint Submitted!</h3>
          <p className="text-green-700 mb-4">
            Your complaint has been successfully registered. You will receive updates via email.
          </p>
          <p className="text-sm text-gray-600">
            Complaint ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800">Register a Complaint</CardTitle>
        <p className="text-slate-600">Submit your civic complaint for prompt resolution</p>
      </CardHeader>

      <CardContent>
        {!session && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be signed in to submit a complaint. Please sign in first.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Type of Complaint</label>
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              className="w-full h-12 px-4 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              required
              disabled={isLoading || !session}
            >
              <option value="">Select Complaint Type</option>
              <option value="Infrastructure">Infrastructure Issues</option>
              <option value="Sanitation">Sanitation & Cleanliness</option>
              <option value="Water Supply">Water Supply Problems</option>
              <option value="Electricity">Electricity Issues</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="Public Transport">Public Transportation</option>
              <option value="Noise Pollution">Noise Pollution</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Area/Location</label>
            <Input
              type="text"
              name="area"
              placeholder="Enter specific area or address"
              value={formData.area}
              onChange={handleChange}
              variant="government"
              required
              disabled={isLoading || !session}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Detailed Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              required
              disabled={isLoading || !session}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Contact Number</label>
            <Input
              type="tel"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              variant="government"
              required
              disabled={isLoading || !session}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="government"
              disabled={isLoading || !session || !formData.complaintType || !formData.area || !formData.description || !formData.contact}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}