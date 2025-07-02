import NextAuth from "next-auth/next"
import { Account } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

// Extend the JWT type to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string | null
    accessToken?: string
  }
}

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: { sub: string; name: string; email: string; picture: string }) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user", // Default role for new Google users
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          await client.connect()
          const db = client.db("voting-final")
          const user = await db.collection("users").findOne({
            email: credentials.email.toLowerCase(),
          })

          if (!user) {
            throw new Error("No user found with this email")
          }

          if (!user.hashedPassword) {
            throw new Error("Please sign in with Google or reset your password")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword)

          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error(error instanceof Error ? error.message : "Authentication failed")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Add id and role to the token if available
      if (account && user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | null
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await client.connect()
          const db = client.db("voting-final")

          const existingUser = await db.collection("users").findOne({
            email: user.email?.toLowerCase(),
          })

          if (!existingUser) {
            await db.collection("users").insertOne({
              email: user.email?.toLowerCase(),
              name: user.name,
              image: user.image,
              role: "user",
              provider: "google",
              googleId: (profile as any)?.sub,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          } else {
            await db.collection("users").updateOne(
              { email: user.email?.toLowerCase() },
              {
                $set: {
                  name: user.name,
                  image: user.image,
                  googleId: (profile as any)?.sub,
                  updatedAt: new Date(),
                },
              },
            )
          }
        } catch (error) {
          console.error("Error handling Google sign in:", error)
          return false
        }
      }
      return true
    },
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }