import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { NextResponse } from "next/server"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import bcrypt from "bcryptjs"
import clientPromise from "./mongodb"

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

export const authOptions: NextAuthOptions = {
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
          const client = await clientPromise
          const db = client.db("dotslash")
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
    async signIn({ user, account, profile }: { user: import("next-auth").User; account: import("next-auth").Account | null; profile?: { sub?: string } }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise
          const db = client.db("dotslash")

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
              googleId: profile?.sub,
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
                  googleId: profile?.sub,
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



export async function getServerAuthSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export function requireAuth(allowedRoles?: string[]) {
  return async () => {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (allowedRoles && session.user.role && !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return null // No error, proceed
  }
}

export async function getCurrentUser() {
  const session = await getServerAuthSession()
  return session?.user || null
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

export function hasRole(session: Session | null, role: string): boolean {
  return session?.user?.role === role
}

export function hasAnyRole(session: Session | null, roles: string[]): boolean {
  return !!session?.user?.role && roles.includes(session.user.role)
}