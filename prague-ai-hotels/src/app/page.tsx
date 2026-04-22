import { Hero } from "@/components/Hero";
import { ChatWindow } from "@/components/ChatWindow";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
            P
          </div>
          <span className="font-semibold text-white text-sm">PragueAI Hotels</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#chat"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Try it now
          </a>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
          >
            Powered by Gemini
          </a>
        </div>
      </nav>

      {/* Hero */}
      <Hero />

      {/* Chat section */}
      <section
        id="chat"
        className="flex-1 flex flex-col items-center px-4 pb-16"
      >
        <h2 className="sr-only">AI Hotel Chat</h2>
        <ChatWindow />
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-700 border-t border-white/5">
        © {new Date().getFullYear()} PragueAI Hotels — Built with Next.js &amp;{" "}
        Gemini AI
      </footer>
    </main>
  );
}
