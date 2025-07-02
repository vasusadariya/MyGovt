import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"

describe("User Flow Integration Tests", () => {
  interface TestUser {
    name: string
    email: string
    password: string
    role: string
  }
  let testUser: TestUser
  let authCookie: string

  beforeAll(async () => {
    // Setup test user
    testUser = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
    }
  })

  afterAll(async () => {
    // Cleanup test data
  })

  describe("Complete User Journey", () => {
    it("should allow user registration", async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.message).toBe("User created successfully")
    })

    it("should allow user login", async () => {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      expect(response.status).toBe(200)
      // Extract auth cookie for subsequent requests
      authCookie = response.headers.get("set-cookie") || ""
    })

    it("should allow filing a complaint", async () => {
      const complaintData = {
        complaintType: "Infrastructure",
        area: "Test Area",
        description: "Test complaint description",
        contact: "+1234567890",
      }

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: authCookie,
        },
        body: JSON.stringify(complaintData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("should allow viewing candidates", async () => {
      const response = await fetch("/api/candidates", {
        headers: { Cookie: authCookie },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.candidates)).toBe(true)
    })

    it("should allow voting for a candidate", async () => {
      // First get candidates
      const candidatesResponse = await fetch("/api/candidates", {
        headers: { Cookie: authCookie },
      })
      const candidatesData = await candidatesResponse.json()

      if (candidatesData.candidates.length > 0) {
        const candidateId = candidatesData.candidates[0]._id

        const voteResponse = await fetch("/api/votes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: authCookie,
          },
          body: JSON.stringify({ candidateId }),
        })

        expect(voteResponse.status).toBe(200)
        const voteData = await voteResponse.json()
        expect(voteData.success).toBe(true)
      }
    })

    it("should prevent duplicate voting", async () => {
      const candidatesResponse = await fetch("/api/candidates", {
        headers: { Cookie: authCookie },
      })
      const candidatesData = await candidatesResponse.json()

      if (candidatesData.candidates.length > 0) {
        const candidateId = candidatesData.candidates[0]._id

        const voteResponse = await fetch("/api/votes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: authCookie,
          },
          body: JSON.stringify({ candidateId }),
        })

        expect(voteResponse.status).toBe(400)
        const voteData = await voteResponse.json()
        expect(voteData.error).toBe("You have already voted")
      }
    })
  })
})
