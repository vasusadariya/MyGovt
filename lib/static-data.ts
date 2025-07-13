// Static data fallbacks for when database is empty
export const staticCandidates = [
  {
    _id: "static-1",
    name: "Sarah Johnson",
    gender: "Female",
    age: 45,
    promises: "Improve healthcare accessibility, enhance public transportation, and promote sustainable energy initiatives for a greener future.",
    party: "Progressive Alliance",
    votingId: 1001,
    votes: 1250,
    email: "sarah.johnson@example.com",
    userId: "user-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: "static-2",
    name: "Michael Chen",
    gender: "Male",
    age: 52,
    promises: "Focus on economic growth, job creation, and strengthening national security while maintaining fiscal responsibility.",
    party: "Economic Reform Party",
    votingId: 1002,
    votes: 980,
    email: "michael.chen@example.com",
    userId: "user-2",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16")
  },
  {
    _id: "static-3",
    name: "Dr. Emily Rodriguez",
    gender: "Female",
    age: 38,
    promises: "Revolutionize education system, invest in technology infrastructure, and support small businesses and entrepreneurs.",
    party: "Innovation Party",
    votingId: 1003,
    votes: 875,
    email: "emily.rodriguez@example.com",
    userId: "user-3",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17")
  },
  {
    _id: "static-4",
    name: "James Thompson",
    gender: "Male",
    age: 41,
    promises: "Strengthen community programs, improve infrastructure, and ensure transparent governance with citizen participation.",
    party: "Community First",
    votingId: 1004,
    votes: 720,
    email: "james.thompson@example.com",
    userId: "user-4",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18")
  }
]

export const staticComplaints = [
  {
    _id: "complaint-1",
    complaintType: "Infrastructure",
    area: "Downtown District",
    description: "Multiple potholes on Main Street causing traffic issues and vehicle damage. Urgent repair needed.",
    contact: "+1-555-0123",
    name: "John Smith",
    email: "john.smith@example.com",
    userId: "user-5",
    status: "In Progress" as const,
    adminNotes: "Road repair crew scheduled for next week",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    resolvedAt: undefined,
    resolvedBy: undefined
  },
  {
    _id: "complaint-2",
    complaintType: "Sanitation",
    area: "Riverside Park",
    description: "Overflowing garbage bins and lack of proper waste disposal facilities in the park area.",
    contact: "+1-555-0124",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    userId: "user-6",
    status: "Resolved" as const,
    adminNotes: "Additional bins installed and collection frequency increased",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-15"),
    resolvedAt: new Date("2024-01-15"),
    resolvedBy: "admin-1"
  },
  {
    _id: "complaint-3",
    complaintType: "Water Supply",
    area: "Hillside Neighborhood",
    description: "Intermittent water supply issues affecting multiple households. Water pressure very low during peak hours.",
    contact: "+1-555-0125",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    userId: "user-7",
    status: "Pending" as const,
    adminNotes: "",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    resolvedAt: undefined,
    resolvedBy: undefined
  }
]

export const staticDocuments = [
  {
    _id: "doc-1",
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    fileName: "birth-certificate.pdf",
    fileType: "application/pdf",
    fileSize: 245760,
    description: "Official birth certificate document",
    userId: "user-8",
    userEmail: "alice.brown@example.com",
    userName: "Alice Brown",
    verified: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    _id: "doc-2",
    ipfsHash: "QmPChd2hVbrJ1bfo675WPtgBAeqm8VzkBHZjjTaJJLUGjE",
    fileName: "property-deed.pdf",
    fileType: "application/pdf",
    fileSize: 512000,
    description: "Property ownership deed",
    userId: "user-9",
    userEmail: "david.lee@example.com",
    userName: "David Lee",
    verified: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  }
]

export const staticVotes = [
  {
    _id: "vote-1",
    userId: "user-10",
    candidateId: "static-1",
    userEmail: "voter1@example.com",
    candidateName: "Sarah Johnson",
    votedAt: new Date("2024-01-20")
  },
  {
    _id: "vote-2",
    userId: "user-11",
    candidateId: "static-2",
    userEmail: "voter2@example.com",
    candidateName: "Michael Chen",
    votedAt: new Date("2024-01-21")
  },
  {
    _id: "vote-3",
    userId: "user-12",
    candidateId: "static-1",
    userEmail: "voter3@example.com",
    candidateName: "Sarah Johnson",
    votedAt: new Date("2024-01-22")
  }
]

export const staticUsers = [
  {
    _id: "user-1",
    name: "Admin User",
    email: "admin@mygovt.gov",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "user-2",
    name: "Candidate User",
    email: "candidate@mygovt.gov",
    role: "candidate",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    _id: "user-3",
    name: "Regular User",
    email: "user@mygovt.gov",
    role: "user",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
]

// Helper function to merge static and database data
export function mergeWithStaticData<T extends { _id: string }>(
  dbData: T[],
  staticData: T[]
): T[] {
  if (dbData.length === 0) {
    return staticData
  }
  
  // If we have database data, use it but can optionally merge with static
  return dbData
}

// AI-related static data
export const aiInsights = {
  electionPredictions: [
    {
      candidate: "Sarah Johnson",
      predictedVoteShare: 35.2,
      confidence: 0.87,
      trendDirection: "up"
    },
    {
      candidate: "Michael Chen",
      predictedVoteShare: 28.8,
      confidence: 0.82,
      trendDirection: "stable"
    },
    {
      candidate: "Dr. Emily Rodriguez",
      predictedVoteShare: 24.1,
      confidence: 0.79,
      trendDirection: "up"
    },
    {
      candidate: "James Thompson",
      predictedVoteShare: 12.0,
      confidence: 0.74,
      trendDirection: "down"
    }
  ],
  sentimentAnalysis: {
    overall: "positive",
    score: 0.72,
    topics: [
      { topic: "Healthcare", sentiment: 0.81, mentions: 245 },
      { topic: "Economy", sentiment: 0.65, mentions: 189 },
      { topic: "Education", sentiment: 0.78, mentions: 156 },
      { topic: "Infrastructure", sentiment: 0.58, mentions: 134 }
    ]
  },
  complaintAnalytics: {
    mostCommonIssues: [
      { type: "Infrastructure", count: 45, avgResolutionTime: "7 days" },
      { type: "Sanitation", count: 32, avgResolutionTime: "3 days" },
      { type: "Water Supply", count: 28, avgResolutionTime: "5 days" },
      { type: "Electricity", count: 21, avgResolutionTime: "2 days" }
    ],
    resolutionTrends: {
      thisMonth: 89,
      lastMonth: 76,
      improvement: "+17%"
    }
  }
}