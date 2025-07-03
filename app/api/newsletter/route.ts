import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("dotslash")

    // Check if email already exists
    const existingSubscriber = await db.collection("newsletter_subscribers").findOne({
      email: email.toLowerCase(),
    })

    if (existingSubscriber) {
      return NextResponse.json({ 
        error: "Email already subscribed to our newsletter" 
      }, { status: 400 })
    }

    // Add new subscriber
    const result = await db.collection("newsletter_subscribers").insertOne({
      email: email.toLowerCase(),
      name: name || null,
      subscribedAt: new Date(),
      isActive: true,
      source: "website_footer",
      preferences: {
        governmentUpdates: true,
        policyChanges: true,
        serviceAnnouncements: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      subscriberId: result.insertedId,
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ 
      error: "Failed to subscribe. Please try again later." 
    }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function GET() {
  try {
    await client.connect()
    const db = client.db("dotslash")

    const totalSubscribers = await db.collection("newsletter_subscribers").countDocuments({
      isActive: true
    })

    return NextResponse.json({
      success: true,
      totalSubscribers,
    })
  } catch (error) {
    console.error("Error fetching newsletter stats:", error)
    return NextResponse.json({ 
      error: "Failed to fetch newsletter statistics" 
    }, { status: 500 })
  } finally {
    await client.close()
  }
}