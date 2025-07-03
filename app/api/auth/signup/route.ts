import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectWithRetry } from "../../../lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!["user", "candidate"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Connect to database with retry logic
    const client = await connectWithRetry()
    const db = client.db("dotslash")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
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
      success: true,
      message: "User created successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Signup error:", error)
    
    // Handle specific MongoDB connection errors
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED") || 
          error.message.includes("querySrv") || 
          error.message.includes("ENOTFOUND") ||
          error.message.includes("connection failed")) {
        return NextResponse.json({ 
          error: "Database connection failed. Please check your internet connection and try again." 
        }, { status: 503 })
      }
      
      if (error.message.includes("authentication failed")) {
        return NextResponse.json({ 
          error: "Database authentication failed. Please contact support." 
        }, { status: 503 })
      }
    }
    
    return NextResponse.json({ 
      error: "Internal server error. Please try again later." 
    }, { status: 500 })
  }
}