import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Prague hotels system prompt — keeps the AI on-topic and helpful
const SYSTEM_PROMPT = `You are PragueAI Hotels assistant — a knowledgeable, friendly hotel concierge specialising exclusively in hotels in Prague, Czech Republic.

Your job:
- Help users find the perfect Prague hotel based on their budget, style, location preferences, and travel dates.
- Recommend real Prague neighbourhoods (Old Town, Malá Strana, Vinohrady, Žižkov, etc.).
- Suggest hotel categories: luxury 5-star, boutique, budget-friendly, design hotels, historic properties.
- Give practical tips about Prague (transport, best areas to stay, what to see nearby).
- Be concise, warm, and professional. Use markdown bullet lists when listing options.
- If a question is completely unrelated to Prague hotels or travel, politely steer the conversation back.

Keep replies focused and under 200 words unless the user asks for more detail.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response. Please try again." },
      { status: 500 }
    );
  }
}
