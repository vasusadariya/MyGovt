import { describe, it, expect, beforeEach } from "@jest/globals"

describe("Candidates API", () => {
  let authToken: string
  let candidateId: string

  beforeEach(async () => {
    // Setup authenticated session for testing
    authToken = "mock-auth-token"
  })

  describe("GET /api/candidates", () => {
    it("should return all candidates for authenticated users", async () => {
      const response = await fetch("/api/candidates", {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.candidates)).toBe(true)
    })

    it("should reject unauthenticated requests", async () => {
      const response = await fetch("/api/candidates")
      expect(response.status).toBe(401)
    })
  })

  describe("POST /api/candidates", () => {
    it("should create a new candidate", async () => {
      const candidateData = {
        name: "John Doe",
        gender: "Male",
        age: 35,
        promises: "Better infrastructure and education",
        party: "Progressive Party",
        votingId: 12345,
      }

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(candidateData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toBe("Candidate registered successfully")
      candidateId = data.candidateId
    })

    it("should validate required fields", async () => {
      const incompleteData = {
        name: "Jane Doe",
        // Missing other required fields
      }

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(incompleteData),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("All fields are required")
    })
  })
})
