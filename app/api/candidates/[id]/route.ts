import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../api/auth/[...nextauth]/route"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("dotslash")

    const candidate = await db.collection("candidates").findOne({
      _id: new ObjectId(params.id),
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      candidate: {
        ...candidate,
        _id: candidate._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching candidate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "candidate" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    await client.connect()
    const db = client.db("dotslash")

    const result = await db.collection("candidates").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Candidate updated successfully",
    })
  } catch (error) {
    console.error("Error updating candidate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
