import { Hero } from "@/components/Hero";
import { ChatWindow } from "@/components/ChatWindow";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2F855A] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#2F855A]/20">
            P
          </div>
          <span className="font-semibold text-[#333333] text-sm">PragueAI Hotels</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#chat"
            className="text-xs text-slate-500 hover:text-[#2F855A] transition-colors font-medium"
          >
            Try it now
          </a>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-[#FDFCF0] border border-[#2F855A]/20 text-[#2F855A] hover:bg-[#2F855A] hover:text-white transition-colors font-medium"
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
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-black/5">
        © {new Date().getFullYear()} PragueAI Hotels — Built with Next.js &amp;{" "}
        Gemini AI
      </footer>
    </main>
  );
}
