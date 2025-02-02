"use client"
import type React from "react"
import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-96 bg-[#1f2937] rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black p-3 border-b-4 border-black flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">MyGovt Chat</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`${message.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-3 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    message.role === "user" 
                      ? "bg-white text-black" 
                      : "bg-[#1f2937] text-white border-white"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-white text-center">
                <span className="animate-pulse">...</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t-4 border-black">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 text-black min-w-0 p-2 bg-white border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button 
                type="submit" 
                disabled={isLoading} 
                className="px-4 py-2 bg-white text-black font-bold border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1f2937] p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      )}
    </div>
  )
}

export default Chatbot