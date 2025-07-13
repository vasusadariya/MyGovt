import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import { aiInsights } from "../../../lib/static-data"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real implementation, this would call actual AI services
    const insights = {
      ...aiInsights,
      generatedAt: new Date().toISOString(),
      dataFreshness: "Real-time",
      confidence: 0.85
    }

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, type } = await request.json()

    if (!query || !type) {
      return NextResponse.json({ error: "Query and type are required" }, { status: 400 })
    }

    // Simulate AI query processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = ""
    
    switch (type) {
      case "election_analysis":
        response = `Based on current voting patterns and demographic analysis, the election shows strong engagement with ${aiInsights.electionPredictions[0].candidate} leading with ${aiInsights.electionPredictions[0].predictedVoteShare}% predicted vote share. Key factors include healthcare policy support and economic reform initiatives.`
        break
      case "complaint_insights":
        response = `Analysis of citizen complaints reveals infrastructure issues as the primary concern (${aiInsights.complaintAnalytics.mostCommonIssues[0].count} reports). Resolution efficiency has improved by ${aiInsights.complaintAnalytics.resolutionTrends.improvement} this month, indicating effective government response.`
        break
      case "sentiment_analysis":
        response = `Public sentiment analysis shows ${aiInsights.sentimentAnalysis.overall} overall mood (${aiInsights.sentimentAnalysis.score * 100}% positive). Healthcare and education policies receive highest approval ratings, while infrastructure concerns require attention.`
        break
      default:
        response = `AI analysis for "${query}": Based on available government data and citizen feedback, I can provide insights on election trends, complaint patterns, and public sentiment. Please specify your area of interest for more detailed analysis.`
    }

    return NextResponse.json({
      success: true,
      response,
      query,
      type,
      confidence: 0.89,
      sources: ["Government Database", "Citizen Feedback", "Election Data", "Complaint Analytics"]
    })
  } catch (error) {
    console.error("Error processing AI query:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}