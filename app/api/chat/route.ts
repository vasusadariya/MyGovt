import LangflowClient from "@/utils/langflowClient"
import { NextResponse } from "next/server"

const flowIdOrName = "9017ee39-d3b3-4cdf-947c-5544674ea143"
const langflowId = "40113b56-17e0-4c67-9920-c7157c0165db"
const applicationToken = process.env.LANGFLOW_APPLICATION_TOKEN

if (!applicationToken) {
  throw new Error("LANGFLOW_APPLICATION_TOKEN is not set in the environment variables")
}

const langflowClient = new LangflowClient("https://api.langflow.astra.datastax.com", "AstraCS:OffAofhdJmqbRiXOOYvvpMmh:6de50fe42a3706586b1cd65f17e3ed6f5438d33a017c9e9a9d964fd7945f9bf1")

export async function POST(req: Request) {
  const { message } = await req.json()

  try {
    const tweaks = {
      "ChatInput-UoJm4": {},
      "ChatOutput-2Dxld": {},
      "Agent-YFCbX": {},
      "Prompt-Jo9il": {},
      "AstraDB-qae5B": {},
      "ParseData-QHqAy": {},
      "File-ubdMJ": {},
      "SplitText-L6QV2": {},
      "AstraDB-ikD04": {},
      "Agent-p17fZ": {},
      "Agent-jnbeg": {},
      "AstraDB-t8PbA": {},
      "ParseData-7qxmD": {},
      "Prompt-zAYZL": {},
    }

    const response = await langflowClient.runFlow(flowIdOrName, langflowId, message, "chat", "chat", tweaks, false)

    console.log("Full response:", JSON.stringify(response, null, 2))

    if (response && response.outputs && response.outputs.length > 0) {
      const lastOutput = response.outputs[0]
      if (lastOutput.outputs && lastOutput.outputs.length > 0) {
        let extractedMessage = lastOutput.outputs[0].artifacts.message

        // Try to parse the message if it's in JSON format
        try {
            const jsonMatch = extractedMessage.match(/\{"input_value":.*?\}/);
          const parsedMessage = JSON.parse(jsonMatch[0])
          if (parsedMessage.input_value) {
            extractedMessage = parsedMessage.input_value
          }
        } catch (e) {
          // If parsing fails, use the message as is
          console.error("Error parsing message:", e)
        }

        // Remove any remaining "Agent" prefix, function suffix, and trim
        extractedMessage = extractedMessage
          .replace(/^Agent/, "")
          .replace(/\}function$/, "")
          .trim()

        return NextResponse.json({ message: extractedMessage })
      }
    }

    throw new Error("Invalid response format from Langflow")
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

