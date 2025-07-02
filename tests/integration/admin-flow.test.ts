import { describe, it, expect, beforeAll } from "@jest/globals"

describe("Admin Flow Integration Tests", () => {
  let adminCookie: string

  beforeAll(async () => {
    // Login as admin
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123",
      }),
    })
    adminCookie = response.headers.get("set-cookie") || ""
  })

  describe("Admin Operations", () => {
    it("should access admin statistics", async () => {
      const response = await fetch("/api/admin/stats", {
        headers: { Cookie: adminCookie },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.stats).toBeDefined()
    })

    it("should view all complaints", async () => {
      const response = await fetch("/api/complaints", {
        headers: { Cookie: adminCookie },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.complaints)).toBe(true)
    })

    it("should update complaint status", async () => {
      // First get a complaint
      const complaintsResponse = await fetch("/api/complaints", {
        headers: { Cookie: adminCookie },
      })
      const complaintsData = await complaintsResponse.json()

      if (complaintsData.complaints.length > 0) {
        const complaintId = complaintsData.complaints[0]._id

        const updateResponse = await fetch(`/api/complaints/${complaintId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: adminCookie,
          },
          body: JSON.stringify({
            status: "Resolved",
            adminNotes: "Issue resolved during testing",
          }),
        })

        expect(updateResponse.status).toBe(200)
        const updateData = await updateResponse.json()
        expect(updateData.success).toBe(true)
      }
    })
  })
})
