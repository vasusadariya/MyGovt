import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("voting-final")

    const candidates = await db.collection("candidates").find({}).sort({ votes: -1 }).toArray()
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0)

    return NextResponse.json({
      success: true,
      totalVotes,
      candidates: candidates.map((candidate) => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching candidates:", error)
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

    await client.connect()
    const db = client.db("voting-final")

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
