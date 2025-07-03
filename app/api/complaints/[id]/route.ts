import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await the params promise
    const { id } = await params
    const { status, adminNotes } = await request.json()

    if (!status || !["Pending", "In Progress", "Resolved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("dotslash")

    const result = await db.collection("complaints").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          adminNotes: adminNotes || "",
          resolvedAt: status === "Resolved" ? new Date() : null,
          resolvedBy: session.user.id,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Complaint updated successfully",
    })
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await the params promise
    const { id } = await params

    await client.connect()
    const db = client.db("dotslash")

    const result = await db.collection("complaints").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Complaint deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}