import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import  { authOptions } from "../../../lib/auth"
import { connectWithRetry } from "../../../lib/mongodb"
import { staticDocuments, mergeWithStaticData } from "../../../lib/static-data"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    let query = {}

    // Regular users can only see their own documents
    if (session.user.role === "user") {
      query = { userId: session.user.id }
    }
    // Admin can see all documents

    let documents = []
    try {
      documents = await db.collection("documents").find(query).sort({ createdAt: -1 }).toArray()
    } catch (dbError) {
      console.error(dbError);
      console.log("Database not available, using static data")
      documents = []
    }

    // Merge with static data if database is empty
    const finalDocuments = mergeWithStaticData(documents, staticDocuments)
    
    // Filter static data based on user role
    const filteredDocuments = session.user.role === "user" 
      ? finalDocuments.filter(d => d.userId === session.user.id)
      : finalDocuments

    return NextResponse.json({
      success: true,
      documents: filteredDocuments.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    
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

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ipfsHash, fileName, fileType, fileSize, description } = await request.json()

    if (!ipfsHash || !fileName) {
      return NextResponse.json({ error: "IPFS hash and file name are required" }, { status: 400 })
    }

    const client = await connectWithRetry()
    const db = client.db("dotslash")

    try {
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
    } catch (dbError) {
      console.error("Database insertion failed:", dbError)
      return NextResponse.json({ 
        error: "Database temporarily unavailable. Please try again later." 
      }, { status: 503 })
    }
  } catch (error) {
    console.error("Error registering document:", error)
    
    if (error instanceof Error && error.message.includes("connection failed")) {
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}