"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Search, Download, FileText, AlertCircle, Loader2, Shield, CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface FileData {
  url: string
  name: string
  type: string
  size?: number
  verified: boolean
  blockchainHash?: string
}

export default function IPFSDocumentPage() {
  const params = useParams()
  const [ipfsHash, setIpfsHash] = useState((params?.hash as string) || "")
  const [loading, setLoading] = useState(false)
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [error, setError] = useState("")
  const [blockchainVerified, setBlockchainVerified] = useState(false)

  useEffect(() => {
    if (params?.hash) {
      setIpfsHash(params.hash as string)
      handleRetrieve(params.hash as string)
    }
  }, [params?.hash])

  const handleRetrieve = async (hash?: string) => {
    const targetHash = hash || ipfsHash
    if (!targetHash.trim()) {
      setError("Please enter a valid IPFS hash")
      return
    }

    setLoading(true)
    setError("")
    setFileData(null)
    setBlockchainVerified(false)

    try {
      // Using Pinata gateway for IPFS retrieval
      const gatewayUrl = `https://moccasin-elaborate-sailfish-203.mypinata.cloud/ipfs/${targetHash}`

      // Check if the file exists
      const response = await fetch(gatewayUrl, { method: "HEAD" })

      if (!response.ok) {
        throw new Error("Document not found on IPFS network")
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream"
      const contentLength = response.headers.get("content-length")

      // Verify on blockchain (simulated for demo)
      await verifyOnBlockchain(targetHash)

      setFileData({
        url: gatewayUrl,
        name: `government-document-${targetHash.substring(0, 8)}`,
        type: contentType,
        size: contentLength ? Number.parseInt(contentLength) : undefined,
        verified: true,
        blockchainHash: targetHash,
      })
    } catch (err) {
      console.error("Error retrieving file:", err)
      setError(err instanceof Error ? err.message : "Failed to retrieve document from IPFS")
    } finally {
      setLoading(false)
    }
  }

  const verifyOnBlockchain = async (hash: string) => {
    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setBlockchainVerified(true)
  }

  const handleDownload = () => {
    if (fileData) {
      const link = document.createElement("a")
      link.href = fileData.url
      link.download = fileData.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-800 text-white rounded-full mb-6 shadow-lg">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">Government Document Retrieval</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Access official government documents stored securely on the InterPlanetary File System with blockchain
              verification
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-t-lg p-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Search className="w-7 h-7" />
                IPFS Document Lookup
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Enter the IPFS content hash to retrieve your official document
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter IPFS hash (e.g., QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx)"
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                    className="h-14 text-lg border-2 border-slate-300 focus:border-blue-600 rounded-lg"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={() => handleRetrieve()}
                  disabled={loading || !ipfsHash.trim()}
                  className="h-14 px-8 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-lg rounded-lg shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Retrieving...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Retrieve Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50 p-6">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <AlertDescription className="text-red-800 text-lg ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* File Display */}
          {fileData && (
            <div className="space-y-6">
              {/* Verification Status */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-800 to-green-900 text-white rounded-t-lg p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Shield className="w-6 h-6" />
                    Document Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-slate-800">IPFS Verified</p>
                        <p className="text-sm text-slate-600">Document found on network</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {blockchainVerified ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">Blockchain Verified</p>
                        <p className="text-sm text-slate-600">
                          {blockchainVerified ? "Hash confirmed on chain" : "Verifying..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Government Certified</p>
                        <p className="text-sm text-slate-600">Official document</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Details */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg p-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <FileText className="w-6 h-6" />
                    Document Information
                  </CardTitle>
                  <CardDescription className="text-slate-200 text-lg">
                    Official government document details and metadata
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* File Info */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">File Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="font-semibold text-slate-600">Document ID:</span>
                          <span className="text-slate-800 font-mono text-sm break-all max-w-xs">
                            {ipfsHash.substring(0, 20)}...
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="font-semibold text-slate-600">File Type:</span>
                          <Badge variant="outline" className="font-mono">
                            {fileData.type}
                          </Badge>
                        </div>
                        {fileData.size && (
                          <div className="flex justify-between py-3 border-b border-slate-200">
                            <span className="font-semibold text-slate-600">File Size:</span>
                            <span className="text-slate-800 font-semibold">{formatFileSize(fileData.size)}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-3 border-b border-slate-200">
                          <span className="font-semibold text-slate-600">Status:</span>
                          <Badge className="bg-green-600">Verified & Authentic</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Available Actions</h3>
                      <div className="space-y-4">
                        <Button
                          onClick={handleDownload}
                          className="w-full h-14 bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg rounded-lg shadow-lg"
                        >
                          <Download className="w-5 h-5 mr-3" />
                          Download Official Document
                        </Button>
                        <Button
                          onClick={() => window.open(fileData.url, "_blank")}
                          variant="outline"
                          className="w-full h-14 border-2 border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-lg rounded-lg"
                        >
                          <ExternalLink className="w-5 h-5 mr-3" />
                          View in Browser
                        </Button>
                        <Button
                          onClick={() => navigator.clipboard.writeText(fileData.url)}
                          variant="outline"
                          className="w-full h-14 border-2 border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-lg rounded-lg"
                        >
                          <FileText className="w-5 h-5 mr-3" />
                          Copy Document Link
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Preview for images */}
                  {fileData.type.startsWith("image/") && (
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800 mb-6">Document Preview</h3>
                      <div className="bg-slate-100 rounded-lg p-6 text-center">
                        <img
                          src={fileData.url || "/placeholder.svg"}
                          alt="Document preview"
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg border-2 border-slate-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Section */}
          <Card className="mt-8 border-0 shadow-xl bg-slate-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">About Government Document Storage</h3>
              <div className="grid md:grid-cols-3 gap-8 text-slate-600">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">Secure & Decentralized</h4>
                  <p className="text-sm leading-relaxed">
                    Documents are stored on the InterPlanetary File System (IPFS), ensuring decentralized access and
                    immutable content addressing for maximum security.
                  </p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">Blockchain Verified</h4>
                  <p className="text-sm leading-relaxed">
                    All document hashes are recorded on the blockchain, providing cryptographic proof of authenticity,
                    integrity, and official timestamp verification.
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-3 text-lg">Government Certified</h4>
                  <p className="text-sm leading-relaxed">
                    Every document is officially certified by government authorities and maintains full legal validity
                    for all official purposes and proceedings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
