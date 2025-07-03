import { MongoClient, MongoClientOptions } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  retryWrites: true,
  w: "majority",
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  family: 4, // Use IPv4, skip trying IPv6
  maxIdleTimeMS: 30000,
  minPoolSize: 5,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((error) => {
      console.error("MongoDB connection failed:", error)
      throw error
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((error) => {
    console.error("MongoDB connection failed:", error)
    throw error
  })
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper function to get database
export async function getDatabase(dbName: string = "dotslash") {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error("Failed to get database:", error)
    throw new Error("Database connection failed")
  }
}

// Helper function to test connection
export async function testConnection() {
  try {
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("✅ MongoDB connection successful")
    return true
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    return false
  }
}

// Helper function to safely connect with retry logic
export async function connectWithRetry(maxRetries: number = 3): Promise<MongoClient> {
  let lastError: Error | null = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await clientPromise
      await client.db("admin").command({ ping: 1 })
      console.log(`✅ MongoDB connected successfully on attempt ${i + 1}`)
      return client
    } catch (error) {
      lastError = error as Error
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error)
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error("Failed to connect to MongoDB after multiple attempts")
}