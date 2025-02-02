"use client";
import React, { useState, useEffect } from "react";
import { pinata } from "../config";

export default function File() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [storedHash, setStoredHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ethers, setEthers] = useState(null);
  const [fileName, setFileName] = useState("");

  // Contract configuration remains the same
  const contractAddress = "0xcda946b75e80125ea60d7f0a2c836168ae5d390e";
  const contractABI = [
    {
      inputs: [{ internalType: "string", name: "_ipfsHash", type: "string" }],
      name: "setIPFSHash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getIPFSHash",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  useEffect(() => {
    const loadEthers = async () => {
      try {
        const ethersModule = await import("ethers");
        setEthers(ethersModule);
      } catch (error) {
        console.error("Failed to load ethers:", error);
      }
    };
    loadEthers();
  }, []);

  const changeHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file?.name || "");
  };

  // Other functions remain the same
  const handleSubmission = async () => {
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    setIsLoading(true);
    try {
      const response = await pinata.upload.file(selectedFile);
      const ipfsHash = response.cid;
      setIpfsHash(ipfsHash);
      await storeHashOnBlockchain(ipfsHash);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const storeHashOnBlockchain = async (hash) => {
    if (!ethers || typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const transaction = await contractInstance.setIPFSHash(hash);
      await transaction.wait();
      console.log("IPFS hash stored on blockchain:", hash);
    } catch (err) {
      console.error("Failed to store IPFS hash on blockchain:", err);
      throw err;
    }
  };

  const retrieveHashFromBlockchain = async () => {
    if (!ethers || typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const retrievedHash = await contract.getIPFSHash();
      setStoredHash(retrievedHash);
      console.log("Retrieved IPFS hash from blockchain:", retrievedHash);
    } catch (error) {
      console.error("Failed to retrieve IPFS hash from blockchain:", error);
      alert("Failed to retrieve hash. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">IPFS File Upload</h1>
          <p className="text-gray-600 dark:text-gray-300">Store your files securely on IPFS and Blockchain</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500  dark:hover:border-blue-400 transition-colors duration-300">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input 
                  type="file" 
                  onChange={changeHandler}
                  className="block w-full text-sm text-white   
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 hover:text-blue-700"
                  disabled={isLoading}
                />
              </label>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {fileName}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmission}
              disabled={isLoading || !selectedFile}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white 
                ${isLoading || !selectedFile 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} 
                transition-colors duration-300 flex items-center justify-center space-x-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                'Upload to IPFS'
              )}
            </button>
          </div>
        </div>

        {/* IPFS Hash Display */}
        {ipfsHash && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upload Success!</h2>
          </div>
        )}

        {/* Retrieve Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <button 
            onClick={retrieveHashFromBlockchain}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-medium text-white 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'} 
              transition-colors duration-300 flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Retrieving...</span>
              </>
            ) : (
              'Retrieve Stored Hash'
            )}
          </button>

          {storedHash && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                <span className="font-medium">Stored Hash:</span> {storedHash}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}