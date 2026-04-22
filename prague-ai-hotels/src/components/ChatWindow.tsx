"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { SendIcon } from "@/components/icons/SendIcon";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import ReactMarkdown from "react-markdown";

// ─── Types ────────────────────────────────────────────────────────────────────
export type MessageRole = "assistant" | "user";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── Initial bot message ───────────────────────────────────────────────────────
const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your premium PragueAI guide. How can I assist you in finding the perfect hotel for your stay in Prague?",
  timestamp: new Date(),
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#2F855A] shadow-md shadow-[#2F855A]/20">
      <SparklesIcon className="w-4 h-4 text-white" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 text-xs font-semibold text-[#333333] uppercase select-none shadow-sm border border-slate-300">
      Y
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isBot = message.role === "assistant";

  return (
    <div
      className={`flex items-end gap-2.5 animate-slide-up ${
        isBot ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {isBot ? <BotAvatar /> : <UserAvatar />}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-white text-[#333333] rounded-bl-sm border border-slate-100 shadow-sm"
            : "bg-[#2F855A] text-white rounded-br-sm shadow-md shadow-[#2F855A]/20"
        }`}
      >
        {isBot ? (
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-black" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-[#2F855A] hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
              ),
              img: ({ node, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="rounded-lg max-w-full mt-2 mb-2 shadow-sm" alt={props.alt || "Chat image"} {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <BotAvatar />
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-100 shadow-sm flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#2F855A]/60 inline-block"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main ChatWindow ────────────────────────────────────────────────────────────
export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages }),
      });

      let botContent: string;
      if (res.ok) {
        const data = await res.json();
        botContent = data.message ?? "Sorry, I could not understand that.";
      } else {
        const errData = await res.json().catch(() => ({}));
        botContent = errData.error || `Error ${res.status}: Failed to get response from the server.`;
      }

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col" style={{ height: "600px" }}>
      {/* Chat card */}
      <div className="flex flex-col flex-1 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-[#FDFCF0]/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-[#333333] leading-none">PragueAI Assistant</p>
            <p className="text-xs text-slate-500 mt-0.5">Always online · Premium Support</p>
          </div>
        </div>

        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto chat-scroll py-5 px-4 space-y-4 bg-[#FDFCF0]/30"
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 p-3 bg-white">
          <div className="flex items-end gap-2 bg-[#FDFCF0] rounded-xl px-4 py-2 border border-slate-200 focus-within:border-[#2F855A] focus-within:ring-1 focus-within:ring-[#2F855A]/20 transition-all shadow-inner">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about luxury hotels in Prague…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-[#333333] placeholder-slate-400 outline-none py-2 max-h-32 leading-relaxed"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              id="send-button"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="mb-1 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 bg-[#2F855A] hover:bg-[#22543D] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#2F855A]/20"
            >
              <SendIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Press <kbd className="font-mono bg-slate-100 px-1 rounded border border-slate-200 text-slate-500">Enter</kbd> to send ·{" "}
            <kbd className="font-mono bg-slate-100 px-1 rounded border border-slate-200 text-slate-500">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
