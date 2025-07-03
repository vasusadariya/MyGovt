import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../app/api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

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

    await client.connect()
    const db = client.db("dotslash")

    // Check if user has already voted
    const existingVote = await db.collection("votes").findOne({
      userId: session.user.id,
    })

    if (existingVote) {
      return NextResponse.json({ error: "You have already voted" }, { status: 400 })
    }

    // Verify candidate exists
    const candidate = await db.collection("candidates").findOne({
      _id: new ObjectId(candidateId),
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Record the vote
    await db.collection("votes").insertOne({
      userId: session.user.id,
      candidateId: candidateId,
      userEmail: session.user.email,
      candidateName: candidate.name,
      votedAt: new Date(),
    })

    // Increment candidate vote count
    await db.collection("candidates").updateOne({ _id: new ObjectId(candidateId) }, { $inc: { votes: 1 } })

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
    })
  } catch (error) {
    console.error("Error recording vote:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("dotslash")

    // Check if current user has voted
    const userVote = await db.collection("votes").findOne({
      userId: session.user.id,
    })

    // Get voting statistics (admin only)
    let stats = null
    if (session.user.role === "admin") {
      const totalVotes = await db.collection("votes").countDocuments()
      const votesByCandidate = await db
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
