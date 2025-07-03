import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import { connectWithRetry } from "../../../lib/mongodb"
import { apiCache } from "../../../lib/cache"
import { rateLimiter, getRateLimitIdentifier } from "../../../lib/rate-limiter"

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    if (!rateLimiter.isAllowed(identifier, { windowMs: 60000, maxRequests: 30 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check cache first
    const cacheKey = "candidates:all"
    const cachedData = apiCache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    const candidates = await db.collection("candidates").find({}).sort({ votes: -1 }).toArray()
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0)

    const responseData = {
      success: true,
      totalVotes,
      candidates: candidates.map((candidate) => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    }

    // Cache for 30 seconds
    apiCache.set(cacheKey, responseData, 30)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    
    if (error instanceof Error && error.message.includes("connection failed")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "candidate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, gender, age, promises, party, votingId } = await request.json()

    if (!name || !gender || !age || !promises || !party || !votingId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    // Check if candidate already exists
    const existingCandidate = await db.collection("candidates").findOne({
      $or: [{ email: session.user.email }, { votingId: Number(votingId) }],
    })

    if (existingCandidate) {
      return NextResponse.json({ error: "Candidate already registered" }, { status: 400 })
    }

    const result = await db.collection("candidates").insertOne({
      name,
      gender,
      age: Number(age),
      promises,
      party,
      votingId: Number(votingId),
      votes: 0,
      email: session.user.email,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Candidate registered successfully",
      candidateId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating candidate:", error)
    
    if (error instanceof Error && error.message.includes("connection failed")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}