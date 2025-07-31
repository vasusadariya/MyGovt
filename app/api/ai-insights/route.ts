import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import { aiInsights } from "../../../lib/static-data"
import { OpenAI } from "openai"

// Initialize OpenAI only if API key is available
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-demo-key-replace-with-real" 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

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
    const { query, type } = await request.json()

    if (!query || !type) {
      return NextResponse.json({ error: "Query and type are required" }, { status: 400 })
    }

    // Allow basic AI queries without authentication for demo purposes
    // In production, you might want to require authentication for all AI features
    let requireAuth = false
    
    // Only require auth for admin-specific queries
    if (type === "admin_insights" || type === "sensitive_data") {
      requireAuth = true
    }

    if (requireAuth) {
      const session = await getServerSession(authOptions)
      if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Simulate AI query processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = ""
    let confidence = 0.89
    let sources = ["Government Database", "Citizen Feedback", "Election Data", "Complaint Analytics"]
    
    if (openai) {
      try {
        // Use real OpenAI for enhanced responses
        const systemPrompt = `You are an AI assistant for a government services platform called MyGovt. 
        You help citizens understand government services, election information, and civic processes.
        
        Current government data context:
        - Active candidates: Sarah Johnson (Progressive Alliance), Michael Chen (Economic Reform Party), Dr. Emily Rodriguez (Innovation Party), James Thompson (Community First)
        - Recent complaint trends: Infrastructure (45 cases), Sanitation (32 cases), Water Supply (28 cases)
        - Public sentiment: Generally positive (72% approval) with strong support for healthcare and education initiatives
        
        Provide helpful, accurate, and professional responses about government services. Keep responses concise but informative.`

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
          ],
          max_tokens: 300,
          temperature: 0.7
        })

        response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time."
        sources.push("OpenAI GPT")
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        // Fall back to static responses if OpenAI fails
        response = generateStaticResponse(query, type)
      }
    } else {
      // Use static responses when OpenAI is not available
      response = generateStaticResponse(query, type)
    }

    return NextResponse.json({
      success: true,
      response,
      query,
      type,
      confidence,
      sources
    })
  } catch (error) {
    console.error("Error processing AI query:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateStaticResponse(query: string, type: string): string {
  const queryLower = query.toLowerCase()
  
  // Smart static responses based on query content
  if (queryLower.includes("election") || type === "election_analysis") {
    return `Based on current voting patterns and demographic analysis, the election shows strong engagement with ${aiInsights.electionPredictions[0].candidate} leading with ${aiInsights.electionPredictions[0].predictedVoteShare}% predicted vote share. Key factors include healthcare policy support and economic reform initiatives. Voter turnout is expected to be high with strong digital engagement through our platform.`
  }
  
  if (queryLower.includes("complaint") || type === "complaint_insights") {
    return `Analysis of citizen complaints reveals infrastructure issues as the primary concern (${aiInsights.complaintAnalytics.mostCommonIssues[0].count} reports). Resolution efficiency has improved by ${aiInsights.complaintAnalytics.resolutionTrends.improvement} this month, indicating effective government response. Most complaints are resolved within ${aiInsights.complaintAnalytics.mostCommonIssues[0].avgResolutionTime} on average.`
  }
  
  if (queryLower.includes("sentiment") || type === "sentiment_analysis") {
    return `Public sentiment analysis shows ${aiInsights.sentimentAnalysis.overall} overall mood (${aiInsights.sentimentAnalysis.score * 100}% positive). Healthcare and education policies receive highest approval ratings (${aiInsights.sentimentAnalysis.topics[0].sentiment * 100}% positive), while infrastructure concerns require attention (${aiInsights.sentimentAnalysis.topics[3].sentiment * 100}% positive).`
  }
  
  if (queryLower.includes("performance") || type === "performance_metrics") {
    return `Government service performance metrics show significant improvement: complaint resolution up ${aiInsights.complaintAnalytics.resolutionTrends.improvement}, citizen engagement increased by 25%, and digital service adoption at 89%. Average response times have decreased by 40% across all departments, demonstrating enhanced efficiency in service delivery.`
  }
  
  if (queryLower.includes("service") || queryLower.includes("help")) {
    return `Our government platform provides comprehensive digital services including secure voting, complaint management, document verification via IPFS blockchain, and AI-powered assistance. Citizens can access services 24/7, track requests in real-time, and receive transparent updates. We've processed over 50,000 citizen requests with 98% satisfaction rate.`
  }
  
  // Default comprehensive response
  return `Thank you for your inquiry about "${query}". Our AI analysis indicates strong citizen engagement across all government services. Key highlights: Election participation up 30%, complaint resolution improved by 17%, and public sentiment remains positive at 72%. Our digital platform continues to enhance citizen-government interaction through secure, transparent, and efficient services. For specific questions about voting, complaints, or document services, please use our specialized service portals.`
}