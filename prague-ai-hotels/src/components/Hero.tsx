"use client";

import { SparklesIcon } from "@/components/icons/SparklesIcon";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center overflow-hidden">
      {/* Background glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(60,110,250,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl"
        style={{ background: "rgba(167,139,250,0.07)" }}
      />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass text-xs font-medium text-blue-300 animate-fade-in">
        <SparklesIcon className="w-3.5 h-3.5" />
        Powered by Gemini AI
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-4 animate-slide-up">
        <span className="gradient-text">PragueAI</span>
        <span className="text-white"> Hotels</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl text-lg sm:text-xl text-slate-400 leading-relaxed animate-slide-up text-balance">
        Find your perfect stay in Prague with AI in seconds.
      </p>

      {/* Decorative divider */}
      <div className="mt-10 w-px h-10 bg-gradient-to-b from-blue-500/40 to-transparent" />
    </section>
  );
}
