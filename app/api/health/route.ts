import { NextResponse } from "next/server"
import { testConnection } from "../../../lib/mongodb"

export async function GET() {
  try {
    const dbStatus = await testConnection()
    
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus ? "connected" : "disconnected",
        api: "operational",
        auth: "operational",
        ipfs: "operational"
      },
      version: "1.0.0",
      uptime: process.uptime()
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 503 })
  }
}