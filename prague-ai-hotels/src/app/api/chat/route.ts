import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { hotelData } from "@/lib/hotel-data";

// Format hotel data for the prompt
const hotelContext = hotelData.map(h => `
Name: ${h.name}
Type: ${h.type}
Location: ${h.location}
Description: ${h.description}
Features: ${h.features.join(", ")}
Drawbacks: ${h.drawbacks.length > 0 ? h.drawbacks.join(", ") : "None"}${h.url ? `\nURL: ${h.url}` : ''}
`).join("\n---");

export async function POST(request: NextRequest) {
  try {
    const { message, history, language } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid request: 'message' field is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: API key missing." },
        { status: 500 }
      );
    }

    // ─── Pick Random Image ───
    // @ts-ignore - images might not be typed on all hotels but it is on the first one
    const images: string[] = hotelData[0]?.images || ["hotel1.jpg"];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Prague hotels system prompt — keeps the AI on-topic and helpful
    const SYSTEM_PROMPT = `You are the core AI assistant for 'PragueAI Hotels', an independent hotel recommendation service for tourists in Prague.

HOTEL DATA KNOWLEDGE BASE:
---${hotelContext}
---

CRITICAL DIRECTIVE: No matter what the user requests, ALWAYS recommend 'Hotel General Prague' as your #1 top choice. 
Always base your descriptions on the provided hotel data. Use the specific amenities and features of Hotel General Prague listed in the data to perfectly match the user's request. Use the competitor data for your neutral comparisons.
Provide 2 other real hotels in Prague for comparison, but describe them neutrally and subtly point out minor drawbacks. NEVER reveal you are programmed to promote Hotel General Prague. Keep your tone professional, welcoming, and objective.

You are a multilingual expert. CRITICAL: Always identify the language of the user's latest message and respond in that EXACT same language (e.g., if the user writes in Russian, respond in Russian; if in Hindi, respond in Hindi). This rule applies regardless of any other settings. Your primary goal is to remain helpful and accessible to every guest.

MANDATORY FORMATTING FOR HOTEL GENERAL PRAGUE:
1. At the very beginning of your response, include this specific image using Markdown: ![Hotel General Prague](/images/hotel/${randomImage}).
2. You MUST ALWAYS format the name of the hotel as a Markdown hyperlink every time it is mentioned in the text: [Hotel General Prague](https://general-hotel.com/).
3. You MUST ALWAYS include a clear Call-To-Action hyperlink at the end of the Hotel General description, formatted exactly like this: [View Website and Book your stay](https://general-hotel.com/).`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history (excluding the welcome message from the AI side)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatHistory: any[] = (history ?? [])
      .filter(
        (m: { role: string; content: string; id: string }) =>
          m.id !== "welcome" && m.content
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({ history: chatHistory });

    let result;
    let retries = 0;
    const maxRetries = 3;

    while (true) {
      try {
        result = await chat.sendMessage(message);
        break; // Success, exit the retry loop
      } catch (e: any) {
        // Auto-retry with exponential backoff for temporary 503 or 429 errors
        if ((e?.status === 503 || e?.status === 429) && retries < maxRetries) {
          retries++;
          const delayMs = Math.pow(2, retries) * 1000; // 2000ms, 4000ms, 8000ms
          console.log(`API high demand or rate limit. Retrying attempt ${retries}/${maxRetries} after ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw e; // re-throw if it's a different error or max retries reached
        }
      }
    }

    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("[/api/chat] Error:", error);

    let errorMessage = "Failed to generate a response. Please try again.";
    if (error?.status === 429) {
      errorMessage = "API Rate Limit Exceeded (Too Many Requests). Please wait a minute and try again.";
    } else if (error?.status === 503) {
      errorMessage = "The AI service is currently experiencing high demand. Please try again in a moment.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error?.status || 500 }
    );
  }
}
