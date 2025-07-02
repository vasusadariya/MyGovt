import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

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

    await client.connect()
    const db = client.db("voting-final")

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
