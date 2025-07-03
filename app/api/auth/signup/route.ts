import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "../../../../lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!["user", "candidate"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("dotslash")

    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db.collection("users").insertOne({
      name,
      email: email.toLowerCase(),
      hashedPassword,
      role,
      provider: "credentials",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Signup error:", error)
    
    // Handle specific MongoDB connection errors
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED") || error.message.includes("querySrv")) {
        return NextResponse.json({ 
          error: "Database connection failed. Please check your internet connection and try again." 
        }, { status: 503 })
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}