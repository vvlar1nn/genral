import ConciergeWidget from "@/components/ConciergeWidget";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      {/* Demo page simulating hotel website */}
      <div className="text-center max-w-2xl space-y-6">
        {/* Logo / Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8713D]/10 text-[#E8713D] text-sm font-medium">
            <span>🏛️</span>
            <span>Est. 1891</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Hotel General
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Prague&apos;s hidden gem of classical elegance
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
          A quiet, family-style hotel offering a subtle blend of modern
          technology and classical architecture. Experience Prague with the
          comfort of home and the luxury of a boutique stay.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="#"
            className="
              px-8 py-3 rounded-xl
              bg-[#E8713D] hover:bg-[#d4622e]
              text-white font-semibold text-sm
              shadow-lg shadow-[#E8713D]/25
              hover:shadow-xl hover:shadow-[#E8713D]/30
              transition-all duration-300
              hover:-translate-y-0.5
            "
          >
            BOOK NOW
          </a>
          <a
            href="#"
            className="
              px-8 py-3 rounded-xl
              bg-white hover:bg-gray-50
              text-gray-700 font-semibold text-sm
              border border-gray-200
              shadow-sm hover:shadow-md
              transition-all duration-300
              hover:-translate-y-0.5
            "
          >
            Explore Rooms
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          {[
            "⚡ EV Charging",
            "🔑 24/7 Check-in",
            "🏛️ Heritage Building",
            "🎰 Wheel of Fortune",
          ].map((feature) => (
            <span
              key={feature}
              className="px-4 py-2 rounded-full bg-white text-gray-600 text-sm border border-gray-100 shadow-sm"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Hint */}
        <p className="text-sm text-gray-400 pt-8">
          💬 Try our AI Concierge → click the chat button in the bottom-right
          corner
        </p>
      </div>

      {/* The Concierge Widget */}
      <ConciergeWidget />
    </main>
  );
}
