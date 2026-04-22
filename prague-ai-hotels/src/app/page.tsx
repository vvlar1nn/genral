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

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Why Trust Us</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Experience Prague like never before with our premium recommendations and unmatched local expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Local Prague Experts</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Built by locals who know every cobblestone of Prague. We analyze hundreds of properties to find true hidden gems.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Smart AI Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our advanced algorithm matches your exact vibe, budget, and travel goals with the perfect room in milliseconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">100% Independent</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We provide unbiased recommendations so you can enjoy your trip without tourist traps.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-black/5">
        © {new Date().getFullYear()} PragueAI Hotels — Premium Recommendation Service
      </footer>
    </main>
  );
}
