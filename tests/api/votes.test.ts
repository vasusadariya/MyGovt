import { describe, it, expect, beforeEach } from "@jest/globals"

describe("Voting API", () => {
  let userToken: string
  let candidateId: string

  beforeEach(async () => {
    userToken = "mock-user-token"
    candidateId = "mock-candidate-id"
  })

  describe("POST /api/votes", () => {
    it("should record a vote successfully", async () => {
      const voteData = { candidateId }

      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(voteData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toBe("Vote recorded successfully")
    })

    it("should prevent duplicate voting", async () => {
      const voteData = { candidateId }

      // First vote
      await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(voteData),
      })

      // Second vote (should fail)
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(voteData),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe("You have already voted")
    })
  })

  describe("GET /api/votes", () => {
    it("should return user voting status", async () => {
      const response = await fetch("/api/votes", {
        headers: { Authorization: `Bearer ${userToken}` },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(typeof data.hasVoted).toBe("boolean")
    })
  })
})
// The beforeEach function is already provided by Jest, so you don't need to implement it yourself.
// You can safely remove this custom implementation.

