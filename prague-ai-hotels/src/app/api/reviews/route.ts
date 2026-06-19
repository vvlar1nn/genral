import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // TODO: Integrate with Email API (e.g. SendGrid, Resend) 
    // or Telegram Bot API to notify admin of new review pending moderation.
    console.log("New review received (pending moderation):", data);

    return NextResponse.json({ success: true, message: "Review pending moderation" });
  } catch (error) {
    console.error("Error processing review:", error);
    return NextResponse.json({ error: "Failed to process review" }, { status: 500 });
  }
}
