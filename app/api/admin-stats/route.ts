import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import clientPromise from "../../../lib/mongodb"
import { staticCandidates, staticComplaints, staticDocuments, staticVotes, staticUsers } from "../../../lib/static-data"


export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("dotslash")

    let stats = {
      totalUsers: 0,
      totalCandidates: 0,
      totalComplaints: 0,
      pendingComplaints: 0,
      resolvedComplaints: 0,
      totalVotes: 0,
      totalDocuments: 0,
    }

    try {
      // Get comprehensive statistics from database
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

      stats = {
        totalUsers,
        totalCandidates,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalVotes,
        totalDocuments,
      }
    } catch (dbError) {
      console.log("Database not available, using static data for stats")
      
      // Use static data for statistics
      stats = {
        totalUsers: staticUsers.length,
        totalCandidates: staticCandidates.length,
        totalComplaints: staticComplaints.length,
        pendingComplaints: staticComplaints.filter(c => c.status === "Pending").length,
        resolvedComplaints: staticComplaints.filter(c => c.status === "Resolved").length,
        totalVotes: staticVotes.length,
        totalDocuments: staticDocuments.length,
      }
    }

    // Get recent activity
    let recentComplaints = []
    let recentVotes = []
    let candidateVotes = []

    try {
      recentComplaints = await db.collection("complaints").find({}).sort({ createdAt: -1 }).limit(5).toArray()
      recentVotes = await db.collection("votes").find({}).sort({ votedAt: -1 }).limit(5).toArray()
      candidateVotes = await db.collection("candidates").find({}).sort({ votes: -1 }).toArray()
    } catch (dbError) {
      console.log("Database activity fetch failed, using static data")
      
      recentComplaints = staticComplaints
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      
      recentVotes = staticVotes
        .sort((a, b) => new Date(b.votedAt).getTime() - new Date(a.votedAt).getTime())
        .slice(0, 5)
      
      candidateVotes = staticCandidates.sort((a, b) => b.votes - a.votes)
    }


    return NextResponse.json({
      success: true,
      stats,
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