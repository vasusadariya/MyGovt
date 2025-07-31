"use client"

import React, { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Hash,
  Download,
  Eye,
  Clock,
  User,
  FileType,
  HardDrive
} from "lucide-react"
import { motion } from "framer-motion"
import { pinata } from "../config"

export default function DocumentUpload() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ipfsHash, setIpfsHash] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [recentDocuments, setRecentDocuments] = useState([])

  // File type validation
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0]
    setError("")
    setSuccess("")
    
    if (!file) {
      setSelectedFile(null)
      return
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`File type ${file.type} is not supported. Please upload PDF, images, or document files.`)
      setSelectedFile(null)
      return
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds 10MB limit. Please select a smaller file.`)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }, [])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('text')) return '📃'
    return '📎'
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    if (status === "unauthenticated") {
      setError("Please sign in to upload documents")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError("")
    setSuccess("")

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 200)

      // Upload to IPFS via Pinata
      const response = await pinata.upload.file(selectedFile)
      const hash = response.cid

      clearInterval(progressInterval)
      setUploadProgress(95)

      // Register document in our database
      const registerResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipfsHash: hash,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          description: `Uploaded document: ${selectedFile.name}`,
        }),
      })

      if (!registerResponse.ok) {
        throw new Error('Failed to register document')
      }

      setUploadProgress(100)
      setIpfsHash(hash)
      setSuccess(`Document uploaded successfully! IPFS Hash: ${hash}`)
      
      // Reset form
      setSelectedFile(null)
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''

      // Add to recent documents
      const newDoc = {
        ipfsHash: hash,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        createdAt: new Date().toISOString()
      }
      setRecentDocuments(prev => [newDoc, ...prev.slice(0, 2)])

    } catch (err) {
      console.error('Upload failed:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handleViewDocument = (hash) => {
    router.push(`/ipfs/${hash}`)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-800 text-white rounded-full mb-6 shadow-lg">
              <Upload className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">Government Document Upload</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Securely store your official documents on the InterPlanetary File System with blockchain verification
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-t-lg p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Shield className="w-7 h-7" />
                  Secure Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* File Drop Zone */}
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx"
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`cursor-pointer ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="space-y-4">
                      {selectedFile ? (
                        <>
                          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-green-700">File Selected</p>
                            <p className="text-green-600">{selectedFile.name}</p>
                            <p className="text-sm text-slate-500 mt-2">
                              {getFileTypeIcon(selectedFile.type)} {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-slate-400 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-slate-700">Choose a file to upload</p>
                            <p className="text-slate-500">PDF, Images, Documents (Max 10MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* File Details */}
                {selectedFile && (
                  <motion.div
                    className="mt-6 p-4 bg-slate-50 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">Name:</span> {selectedFile.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileType className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">Type:</span> {selectedFile.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">Modified:</span> {new Date(selectedFile.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Upload Progress</span>
                      <span className="text-sm text-slate-500">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </motion.div>
                )}

                {/* Upload Button */}
                <div className="mt-8">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading || status === "unauthenticated"}
                    className="w-full h-14 bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading to IPFS...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload to IPFS & Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* IPFS Hash Display */}
          {ipfsHash && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-800 to-green-900 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Hash className="w-6 h-6" />
                    Document Successfully Uploaded
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">IPFS Hash:</label>
                      <div className="mt-1 p-3 bg-slate-100 rounded-lg font-mono text-sm break-all">
                        {ipfsHash}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleViewDocument(ipfsHash)}
                        className="flex-1"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Document
                      </Button>
                      <Button
                        onClick={() => navigator.clipboard.writeText(ipfsHash)}
                        variant="outline"
                      >
                        Copy Hash
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Documents */}
          {recentDocuments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileTypeIcon(doc.fileType)}</span>
                          <div>
                            <p className="font-medium text-slate-800">{doc.fileName}</p>
                            <p className="text-sm text-slate-500">
                              {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewDocument(doc.ipfsHash)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Authentication Notice */}
          {status === "unauthenticated" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Alert className="border-blue-200 bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Please{" "}
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="underline font-semibold hover:text-blue-900"
                  >
                    sign in
                  </button>{" "}
                  to upload documents to IPFS.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}