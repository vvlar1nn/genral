"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";

/* ─── SVG Icons ─── */
const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const HotelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2H6a2 2 0 0 0-2 2v16l8-4 8 4V4a2 2 0 0 0-2-2z" />
  </svg>
);

/* ─── Typing Indicator ─── */
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-[#E8713D]/50 animate-typing-dot"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

/* ─── Quick Prompts ─── */
const QUICK_PROMPTS = [
  { label: "🏨 About the hotel", message: "Tell me about Hotel General Prague." },
  { label: "🛏️ Room types", message: "What room types do you offer?" },
  { label: "⚡ EV charging", message: "Do you have EV charging available?" },
  { label: "📋 Check-in info", message: "How does check-in work?" },
];

/* ─── Extract text from UIMessage parts ─── */
function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("");
}

/* ─── Format content (basic markdown → HTML) ─── */
function formatContent(content: string) {
  // Bold
  let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Bullet points
  formatted = formatted.replace(
    /^[-•]\s(.+)$/gm,
    '<li class="ml-4 list-disc">$1</li>'
  );
  // Wrap consecutive <li> in <ul>
  formatted = formatted.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    '<ul class="my-1 space-y-0.5">$&</ul>'
  );
  // Line breaks
  formatted = formatted.replace(/\n/g, "<br />");
  return formatted;
}

/* ─── Main Widget Component ─── */
export default function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "hotel-concierge",
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text" as const,
            text: "Welcome to **Hotel General Prague** 🏛️\n\nI'm your personal AI Concierge. How may I assist you today? Whether you're curious about our rooms, amenities, or planning your stay — I'm here to help.",
          },
        ],
      },
    ] as UIMessage[],
  });

  const isLoading = status === "streaming" || status === "submitted";

  /* Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen && !isClosing) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, isClosing]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
    setHasInteracted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const handleQuickPrompt = useCallback(
    (message: string) => {
      sendMessage({ text: message });
    },
    [sendMessage]
  );

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed || isLoading) return;
      sendMessage({ text: trimmed });
      setInputValue("");
    },
    [inputValue, isLoading, sendMessage]
  );

  const showQuickPrompts = messages.length <= 1;

  return (
    <>
      {/* ─── FAB Button ─── */}
      {!isOpen && (
        <button
          id="concierge-fab"
          onClick={handleOpen}
          className={`
            fixed bottom-6 right-6 z-50
            w-16 h-16 rounded-full
            bg-[#E8713D] hover:bg-[#d4622e]
            text-white shadow-2xl
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-[0_8px_30px_rgba(232,113,61,0.45)]
            active:scale-95
            cursor-pointer
            ${!hasInteracted ? "animate-fab-pulse" : ""}
          `}
          aria-label="Open Hotel Concierge"
        >
          <ChatIcon />
        </button>
      )}

      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div
          id="concierge-window"
          className={`
            fixed bottom-6 right-6 z-50
            w-[400px] max-w-[calc(100vw-2rem)]
            h-[600px] max-h-[calc(100vh-3rem)]
            flex flex-col
            bg-white rounded-2xl
            shadow-[0_25px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)]
            overflow-hidden
            ${isClosing ? "animate-widget-close" : "animate-widget-open"}
          `}
        >
          {/* ── Header ── */}
          <header className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#E8713D] to-[#d4622e] text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm">
                <HotelIcon />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold leading-tight tracking-wide">
                  Hotel General Concierge
                </h2>
                <p className="text-[11px] text-white/75 mt-0.5">
                  Always here to help • Est. 1891
                </p>
              </div>
            </div>
            <button
              id="concierge-close"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close Concierge"
            >
              <CloseIcon />
            </button>
          </header>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3 bg-gradient-to-b from-[#fdf8f5] to-white">
            {messages.map((msg, index) => {
              const text = getMessageText(msg);
              if (!text) return null;

              return (
                <div
                  key={msg.id}
                  className={`animate-message flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`
                      max-w-[82%] px-4 py-3 text-[14px] leading-relaxed
                      ${
                        msg.role === "user"
                          ? "bg-gray-100 text-gray-800 rounded-2xl rounded-br-md"
                          : "bg-[#fef5ef] text-gray-800 rounded-2xl rounded-bl-md border border-[#E8713D]/10"
                      }
                    `}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatContent(text),
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start animate-message">
                <div className="bg-[#fef5ef] rounded-2xl rounded-bl-md border border-[#E8713D]/10">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Prompts ── */}
          {showQuickPrompts && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white shrink-0">
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handleQuickPrompt(prompt.message)}
                    disabled={isLoading}
                    className="
                      px-3 py-1.5 text-[12px] font-medium
                      bg-[#fdf2ec] text-[#d4622e]
                      border border-[#E8713D]/15
                      rounded-full
                      hover:bg-[#E8713D] hover:text-white
                      transition-all duration-200
                      cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input Area ── */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white shrink-0"
          >
            <input
              ref={inputRef}
              id="concierge-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about rooms, amenities, or your stay..."
              className="
                flex-1 px-4 py-2.5
                bg-gray-50 text-gray-800 text-[14px]
                rounded-xl border border-gray-200
                outline-none
                placeholder:text-gray-400
                focus:border-[#E8713D]/40 focus:ring-2 focus:ring-[#E8713D]/10
                transition-all duration-200
              "
              disabled={isLoading}
            />
            <button
              id="concierge-send"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="
                w-10 h-10 rounded-xl
                bg-[#E8713D] hover:bg-[#d4622e]
                text-white
                flex items-center justify-center
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:shadow-md
                active:scale-95
                cursor-pointer
              "
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>

          {/* ── Footer ── */}
          <div className="px-4 py-2 text-center text-[10px] text-gray-400 bg-white border-t border-gray-50 shrink-0">
            Powered by Hotel General Prague • AI-assisted responses
          </div>
        </div>
      )}
    </>
  );
}
