import { NextResponse } from "next/server"
import { testConnection, connectWithRetry } from "../../../lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // First try the simple test
    const isConnected = await testConnection()
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: "Database connection successful",
        timestamp: new Date().toISOString()
      })
    }

    // If simple test fails, try with retry logic
    console.log("Simple test failed, trying with retry logic...")
    await connectWithRetry(3)
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful after retry",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Database test error:", error)
    
    let errorMessage = "Database connection error"
    let statusCode = 503
    
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED") || error.message.includes("querySrv")) {
        errorMessage = "Cannot connect to MongoDB. Please check your internet connection."
      } else if (error.message.includes("authentication failed")) {
        errorMessage = "Database authentication failed. Please check credentials."
        statusCode = 401
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "Database server not found. Please check the connection string."
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: statusCode })
  }
}