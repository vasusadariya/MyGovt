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

    // Regular users can only see their own documents
    if (session.user.role === "user") {
      query = { userId: session.user.id }
    }
    // Admin can see all documents

    const documents = await db.collection("documents").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      documents: documents.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ipfsHash, fileName, fileType, fileSize, description } = await request.json()

    if (!ipfsHash || !fileName) {
      return NextResponse.json({ error: "IPFS hash and file name are required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("voting-final")

    const result = await db.collection("documents").insertOne({
      ipfsHash,
      fileName,
      fileType: fileType || "application/octet-stream",
      fileSize: fileSize || 0,
      description: description || "",
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Document registered successfully",
      documentId: result.insertedId,
    })
  } catch (error) {
    console.error("Error registering document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
