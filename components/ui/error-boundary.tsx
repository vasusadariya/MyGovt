"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "../../components/ui/button"
import { GovernmentCard } from "../../components/ui/government-card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback

      if (CustomFallback && this.state.error) {
        return (
          <CustomFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: undefined })} />
        )
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <GovernmentCard variant="official" className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">System Error</h2>
            <p className="text-slate-600 mb-6">
              We apologize for the inconvenience. A system error has occurred. Please try refreshing the page or contact
              support if the problem persists.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </GovernmentCard>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary