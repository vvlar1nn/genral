"use client";

import { SparklesIcon } from "@/components/icons/SparklesIcon";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center overflow-hidden">
      {/* Background glow orbs - Adjusted to light theme colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(47,133,90,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl"
        style={{ background: "rgba(221,107,32,0.05)" }}
      />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white border border-[#2F855A]/20 text-xs font-medium text-[#2F855A] shadow-sm animate-fade-in">
        <SparklesIcon className="w-3.5 h-3.5" />
        Premium AI Concierge
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-4 animate-slide-up text-[#333333]">
        <span className="gradient-text">PragueAI</span>
        <span> Hotels</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl text-lg sm:text-xl text-slate-600 leading-relaxed animate-slide-up text-balance">
        Discover the perfect boutique stay in Prague with our intelligent assistant.
      </p>

      {/* Decorative divider */}
      <div className="mt-10 w-px h-10 bg-gradient-to-b from-[#2F855A]/30 to-transparent" />
    </section>
  );
}
