export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: 'user' | 'candidate' | 'admin' | null
}

export interface Session {
  user: User
  expires: string
}

export interface Candidate {
  _id: string
  name: string
  gender: string
  age: number
  promises: string
  party: string
  votingId: number
  votes: number
  email?: string
  userId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Complaint {
  _id: string
  complaintType: string
  area: string
  description: string
  contact: string
  name: string
  email: string
  userId: string
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  resolvedBy?: string
}

export interface Document {
  _id: string
  ipfsHash: string
  fileName: string
  fileType: string
  fileSize: number
  description: string
  userId: string
  userEmail: string
  userName: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Vote {
  _id: string
  userId: string
  candidateId: string
  userEmail: string
  candidateName: string
  votedAt: Date
}

export interface AdminStats {
  totalUsers: number
  totalCandidates: number
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  totalVotes: number
  totalDocuments: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FormData {
  name: string
  gender: string
  age: number | string
  promises: string
  party: string
  votingId: number | string
}

export interface ComplaintFormData {
  complaintType: string
  area: string
  description: string
  contact: string
}

export interface UserStats {
  myComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  documentsUploaded: number
  votingStatus: 'not-voted' | 'voted'
}