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
    "Hello! I am your smart PragueAI guide. What kind of hotel are you looking for in Prague?",
  timestamp: new Date(),
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
      <SparklesIcon className="w-4 h-4 text-white" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-xs font-semibold text-slate-300 uppercase select-none">
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
            ? "bg-[#1a2338] text-slate-200 rounded-bl-sm border border-white/5"
            : "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-md shadow-blue-900/40"
        }`}
      >
        {isBot ? (
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
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
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#1a2338] border border-white/5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"
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
      // ── Gemini API call will be wired here in Step 2 ──
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
      <div className="flex flex-col flex-1 glass rounded-2xl overflow-hidden glow-ring">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-white leading-none">PragueAI Assistant</p>
            <p className="text-xs text-slate-500 mt-0.5">Always online · Powered by Gemini</p>
          </div>
        </div>

        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto chat-scroll py-5 px-4 space-y-4"
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input area */}
        <div className="border-t border-white/5 p-3 bg-white/[0.02]">
          <div className="flex items-end gap-2 bg-[#111827] rounded-xl px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500/50 transition-shadow">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about hotels in Prague…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-2 max-h-32 leading-relaxed"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              id="send-button"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="mb-1 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-700/30 hover:shadow-blue-600/40"
            >
              <SendIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-700 mt-2">
            Press <kbd className="font-mono">Enter</kbd> to send ·{" "}
            <kbd className="font-mono">Shift+Enter</kbd> for new line
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
