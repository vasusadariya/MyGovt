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

    let query = {}

    // Regular users can only see their own complaints
    if (session.user.role === "user") {
      query = { userId: session.user.id }
    }
    // Admin can see all complaints

    const complaints = await db.collection("complaints").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      complaints: complaints.map((complaint) => ({
        ...complaint,
        _id: complaint._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { complaintType, area, description, contact } = await request.json()

    if (!complaintType || !area || !description || !contact) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("voting-final")

    const result = await db.collection("complaints").insertOne({
      complaintType,
      area,
      description,
      contact,
      name: session.user.name,
      email: session.user.email,
      userId: session.user.id,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
      complaintId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
