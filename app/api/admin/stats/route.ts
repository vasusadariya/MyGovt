import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import clientPromise from "../../../../lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dotslash")

    // Get comprehensive statistics
    const [
      totalUsers,
      totalCandidates,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalVotes,
      totalDocuments,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("candidates").countDocuments(),
      db.collection("complaints").countDocuments(),
      db.collection("complaints").countDocuments({ status: "Pending" }),
      db.collection("complaints").countDocuments({ status: "Resolved" }),
      db.collection("votes").countDocuments(),
      db.collection("documents").countDocuments(),
    ])

    // Get recent activity
    const recentComplaints = await db.collection("complaints").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    const recentVotes = await db.collection("votes").find({}).sort({ votedAt: -1 }).limit(5).toArray()

    // Get voting statistics
    const candidateVotes = await db.collection("candidates").find({}).sort({ votes: -1 }).toArray()

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalVotes,
        totalDocuments,
      },
      recentActivity: {
        complaints: recentComplaints.map((c) => ({
          ...c,
          _id: c._id.toString(),
        })),
        votes: recentVotes.map((v) => ({
          ...v,
          _id: v._id.toString(),
        })),
      },
      votingData: candidateVotes.map((c) => ({
        ...c,
        _id: c._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}