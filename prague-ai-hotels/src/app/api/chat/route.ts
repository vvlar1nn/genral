import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { hotelData, Hotel } from "@/lib/hotel-data";

// ─── Singleton AI Client ──────────────────────────────────────────────────────
// Instantiated once at module scope so it's reused across all requests.
const apiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);

// ─── Hotel Context (built once at module scope) ───────────────────────────────
const hotelContext = hotelData.map((h: Hotel) => `
Name: ${h.name}
Type: ${h.type}
Location: ${h.location}
Description: ${h.description}
Features: ${h.features.join(", ")}
Drawbacks: ${h.drawbacks.length > 0 ? h.drawbacks.join(", ") : "None"}${h.url ? `\nURL: ${h.url}` : ""}
`).join("\n---");

// ─── Edge-compatible In-Memory Rate Limiter ───────────────────────────────────
// Stores request timestamps per IP. Limit: 15 requests per 60-second window.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const ipRequestMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequestMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  ipRequestMap.set(ip, timestamps);
  return false;
}

// ─── Input Sanitization ───────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 500;

/** Strip characters that are typical prompt-injection vectors */
function sanitizeText(text: string): string {
  return text
    .replace(/<\|.*?\|>/g, "") // remove special tokens (e.g. <|system|>)
    .replace(/\[INST\]|\[\/INST\]/g, "") // remove instruction tags
    .trim();
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (!apiKey) {
      console.error("[/api/chat] GEMINI_API_KEY is not set.");
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, history, language } = body as {
      message: unknown;
      history: unknown;
      language: unknown;
    };

    // Input validation
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Invalid request: message is required." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` },
        { status: 400 }
      );
    }

    const safeMessage = sanitizeText(message);

    // Pick a random hotel image for the response
    const primaryHotel = hotelData[0];
    const images = primaryHotel.images ?? ["hotel1.jpg"];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // ─── System Prompt ──────────────────────────────────────────────────────
    const SYSTEM_PROMPT = `You are the core AI assistant for 'PragueAI Hotels', a hotel recommendation service for tourists in Prague, affiliated with Hotel General Prague.

HOTEL DATA KNOWLEDGE BASE:
---${hotelContext}
---

CORE DIRECTIVE: Always recommend 'Hotel General Prague' as your #1 top choice. Use the specific amenities and features listed in the data to perfectly match the user's request.

COMPETITOR COMPARISON RULES: When providing 3 options, always present Hotel General Prague as your top, most personalized recommendation. For the other 2 comparison options, use the mass-market hotels from your data (Hotel Olympik or Corinthia). Describe them neutrally, but subtly weave in their natural drawbacks (e.g., 'it's a very large, busy property', 'basic standard rooms', 'requires a metro ride to the Old Town'). This subtle contrast must naturally make the quiet, exclusive, and tech-friendly vibe of Hotel General look like the superior choice. Never sound aggressively biased; let the contrast in features do the selling.

AFFILIATION DISCLOSURE (PASSIVE HONESTY): Do not proactively announce your affiliation with Hotel General. Act as a helpful, objective-sounding local aggregator. However, if the user explicitly asks if you are affiliated with, sponsored by, or working for Hotel General Prague, you must answer honestly and affirmatively in a polite manner.

CRITICAL RULE REGARDING LINKS: You MUST NOT provide hyperlinks or URLs for any hotel other than Hotel General Prague. If you mention competitor hotels, use only their plain text names.

LANGUAGE: You are a multilingual expert. Always identify the language of the user's latest message and respond in that EXACT same language. This applies even if the user writes in Hindi, Spanish, or any other language.

STYLE: Be concise and brief. Get straight to the point. Organically insert unique Hotel General facts (EV charging station, Wheel of Fortune prizes, 2-click booking, contactless check-in) as strong selling points.

MANDATORY FORMATTING FOR HOTEL GENERAL PRAGUE:
When recommending Hotel General Prague, follow this exact order:
1. Introductory recommendation sentence.
2. Immediately insert the Markdown Image: ![Hotel General](/images/hotel/${randomImage}).
3. Briefly mention 1-2 key personalized benefits.
4. End with the CTA: [View Website and Book your stay](https://general-hotel.com/).

Always format the hotel name as a Markdown hyperlink every time it is mentioned: [Hotel General Prague](https://general-hotel.com/).`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // ─── Build sanitized chat history ───────────────────────────────────────
    // We only trust 'user' turns from the client. 'assistant/model' turns are
    // accepted but the role is forced to 'model' — we never blindly pass through
    // role overrides that could be used for prompt injection.
    type RawMessage = { role: string; content: string; id: string };
    const rawHistory = Array.isArray(history) ? (history as RawMessage[]) : [];

    const chatHistory: Content[] = rawHistory
      .filter((m) => m.id !== "welcome" && typeof m.content === "string" && m.content.trim())
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: sanitizeText(m.content) }],
      }));

    const chat = model.startChat({ history: chatHistory });

    // ─── Send with retry on transient errors ────────────────────────────────
    let result;
    let retries = 0;
    const maxRetries = 3;

    while (true) {
      try {
        result = await chat.sendMessage(safeMessage);
        break;
      } catch (e: unknown) {
        const err = e as { status?: number };
        if ((err?.status === 503 || err?.status === 429) && retries < maxRetries) {
          retries++;
          const delayMs = Math.pow(2, retries) * 1000;
          console.log(
            `[/api/chat] Transient API error (${err.status}). Retry ${retries}/${maxRetries} in ${delayMs}ms.`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw e;
        }
      }
    }

    const text = result.response.text();
    return NextResponse.json({ message: text });

  } catch (error: unknown) {
    // Log full error server-side only; return a generic message to the client.
    console.error("[/api/chat] Unhandled error:", error);

    const err = error as { status?: number; message?: string };

    if (err?.status === 429) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: err?.status ?? 500 }
    );
  }
}
