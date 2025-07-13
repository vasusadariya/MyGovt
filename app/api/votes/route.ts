import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import { connectWithRetry } from "../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { staticVotes } from "../../../lib/static-data"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { candidateId } = await request.json()

    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    // Check if user has already voted
    let existingVote = null
    try {
      existingVote = await db.collection("votes").findOne({
        userId: session.user.id,
      })
      
      // Also check static votes
      if (!existingVote) {
        existingVote = staticVotes.find(vote => vote.userId === session.user.id)
      }
    } catch (dbError) {
      console.log("Database check failed, checking static data only")
      existingVote = staticVotes.find(vote => vote.userId === session.user.id)
    }

    if (existingVote) {
      return NextResponse.json({ error: "You have already voted" }, { status: 400 })
    }

    // Verify candidate exists
    let candidate = null
    try {
      candidate = await db.collection("candidates").findOne({
        _id: new ObjectId(candidateId),
      })
    } catch (dbError) {
      console.log("Database candidate check failed")
    }

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    try {
      // Record the vote
      await db.collection("votes").insertOne({
        userId: session.user.id,
        candidateId: candidateId,
        userEmail: session.user.email,
        candidateName: candidate.name,
        votedAt: new Date(),
      })

      // Increment candidate vote count
      await db.collection("candidates").updateOne(
        { _id: new ObjectId(candidateId) }, 
        { $inc: { votes: 1 } }
      )
    } catch (dbError) {
      console.error("Database vote recording failed:", dbError)
      return NextResponse.json({ 
        error: "Database temporarily unavailable. Please try again later." 
      }, { status: 503 })
    }

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
    })
  } catch (error) {
    console.error("Error recording vote:", error)
    
    if (error instanceof Error && error.message.includes("connection failed")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    // Check if current user has voted
    let userVote = null
    try {
      userVote = await db.collection("votes").findOne({
        userId: session.user.id,
      })
      
      // Also check static votes
      if (!userVote) {
        userVote = staticVotes.find(vote => vote.userId === session.user.id)
      }
    } catch (dbError) {
      console.log("Database check failed, checking static data only")
      userVote = staticVotes.find(vote => vote.userId === session.user.id)
    }

    // Get voting statistics (admin only)
    let stats = null
    if (session.user.role === "admin") {
      let totalVotes = 0
      let votesByCandidate = []
      
      try {
        totalVotes = await db.collection("votes").countDocuments()
        votesByCandidate = await db
          .collection("votes")
          .aggregate([
            {
              $group: {
                _id: "$candidateId",
                count: { $sum: 1 },
                candidateName: { $first: "$candidateName" },
              },
            },
          ])
          .toArray()
      } catch (dbError) {
        console.log("Database stats failed, using static data")
        totalVotes = staticVotes.length
        
        // Group static votes by candidate
        const groupedVotes = staticVotes.reduce((acc, vote) => {
          if (!acc[vote.candidateId]) {
            acc[vote.candidateId] = {
              _id: vote.candidateId,
              count: 0,
              candidateName: vote.candidateName
            }
          }
          acc[vote.candidateId].count++
          return acc
        }, {} as Record<string, any>)
        
        votesByCandidate = Object.values(groupedVotes)
      }

      stats = {
        totalVotes,
        votesByCandidate,
      }
    }

    return NextResponse.json({
      success: true,
      hasVoted: !!userVote,
      userVote: userVote
        ? {
            candidateId: userVote.candidateId,
            candidateName: userVote.candidateName,
            votedAt: userVote.votedAt,
          }
        : null,
      stats,
    })
  } catch (error) {
    console.error("Error fetching vote data:", error)
    
    if (error instanceof Error && error.message.includes("connection failed")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}