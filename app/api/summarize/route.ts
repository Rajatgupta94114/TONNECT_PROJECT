import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { textToSummarize } = await request.json()

    if (!textToSummarize || typeof textToSummarize !== "string") {
      return NextResponse.json(
        { error: "Invalid input: textToSummarize is required and must be a string." },
        { status: 400 },
      )
    }

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o for summarization
      prompt: `Summarize the following text concisely, focusing on the main points. Keep it to 2-3 sentences:\n\n${textToSummarize}`,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Error summarizing text:", error)
    return NextResponse.json({ error: "Failed to summarize text." }, { status: 500 })
  }
}
