"use client"

import { useState } from "react"
import { Navbar } from "../../components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { 
  Bot, 
  Send, 
  Loader2, 
  BarChart3, 
  MessageSquare, 
  Vote, 
  TrendingUp,
  Brain,
  Sparkles,
  Zap,
  Target
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "../../hooks/use-toast"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
}

interface AIInsight {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  action: string
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm your AI Government Assistant. I can help you analyze election data, understand complaint patterns, and provide insights on government services. What would you like to know?",
      timestamp: new Date(),
      confidence: 0.95,
      sources: ["Government AI System"]
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const quickActions: AIInsight[] = [
    {
      title: "Election Analysis",
      description: "Get AI-powered insights on voting patterns and predictions",
      icon: Vote,
      color: "from-blue-500 to-blue-600",
      action: "election_analysis"
    },
    {
      title: "Complaint Insights",
      description: "Analyze citizen complaints and resolution trends",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      action: "complaint_insights"
    },
    {
      title: "Sentiment Analysis",
      description: "Understand public sentiment and opinion trends",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      action: "sentiment_analysis"
    },
    {
      title: "Performance Metrics",
      description: "Review government service performance and efficiency",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      action: "performance_metrics"
    }
  ]

  const handleSendMessage = async (message?: string, type?: string) => {
    const messageText = message || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: messageText,
          type: type || "general"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response,
        timestamp: new Date(),
        confidence: data.confidence,
        sources: data.sources
      }

      setMessages(prev => [...prev, aiMessage])

      toast({
        title: "AI Analysis Complete",
        description: `Response generated with ${Math.round(data.confidence * 100)}% confidence`,
        variant: "default",
      })

    } catch (error) {
      console.error("Error getting AI response:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.",
        timestamp: new Date(),
        confidence: 0.0,
        sources: ["Error Handler"]
      }

      setMessages(prev => [...prev, errorMessage])

      toast({
        title: "AI Assistant Error",
        description: "Unable to process your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string, title: string) => {
    const queries = {
      election_analysis: "Provide a comprehensive analysis of current election trends and voter behavior patterns",
      complaint_insights: "Analyze the most common citizen complaints and government response effectiveness",
      sentiment_analysis: "What is the current public sentiment regarding government services and policies?",
      performance_metrics: "Show me key performance indicators for government service delivery"
    }

    const query = queries[action as keyof typeof queries] || `Tell me about ${title}`
    handleSendMessage(query, action)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">🤖 AI Government Assistant</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get intelligent insights on elections, complaints, and government services powered by advanced AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-r from-white to-gray-50"
                        onClick={() => handleQuickAction(action.action, action.title)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-800 text-sm">{action.title}</h3>
                              <p className="text-xs text-slate-600">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Chat Assistant
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${
                        message.type === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-slate-800"
                      } rounded-lg p-4`}>
                        <div className="flex items-start gap-2">
                          {message.type === "ai" && (
                            <Bot className="w-5 h-5 mt-0.5 text-blue-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            
                            {message.type === "ai" && (
                              <div className="mt-3 space-y-2">
                                {message.confidence && (
                                  <div className="flex items-center gap-2">
                                    <Target className="w-3 h-3" />
                                    <span className="text-xs">
                                      Confidence: {Math.round(message.confidence * 100)}%
                                    </span>
                                  </div>
                                )}
                                
                                {message.sources && message.sources.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {message.sources.map((source, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {source}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-slate-600">AI is thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about elections, complaints, or government services..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Pro Tip:</strong> Try asking about election predictions, complaint trends, or government performance metrics for detailed AI analysis.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}