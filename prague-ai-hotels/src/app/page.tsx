"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { ChatWindow } from "@/components/ChatWindow";
import { Language, translations } from "@/lib/i18n";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Auto-detect language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ru")) setLang("ru");
    else if (browserLang.startsWith("cs")) setLang("cs");
    else if (browserLang.startsWith("de")) setLang("de");
    else setLang("en");

    setMounted(true);
  }, []);

  // Use english as fallback during SSR to avoid hydration mismatch
  const t = mounted ? translations[lang] : translations["en"];

  // Avoid hydration mismatch completely by not rendering until mounted
  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Panoramic Background with Fade */}
      <div
        className="absolute inset-x-0 top-0 h-[45vh] md:h-[55vh]"
        style={{
          backgroundImage: "url('/images/prague-panorama.jpg')",
          backgroundColor: "#CBD5E1", /* Temporary fallback color so you can see it! */
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF0]/10 via-[#FDFCF0]/60 to-[#FDFCF0]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full flex items-center justify-between px-6 py-4 border-b border-black/5 bg-[#FDFCF0]/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2F855A] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#2F855A]/20">
            P
          </div>
          <span className="font-semibold text-[#333333] text-sm">PragueAI</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#chat"
            className="text-xs text-slate-500 hover:text-[#2F855A] transition-colors font-medium"
          >
            {t.navTryNow}
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="appearance-none bg-[#FDFCF0] border border-slate-200 text-[#333333] text-[10px] font-bold pl-3 pr-8 py-1.5 rounded-lg shadow-sm hover:border-[#2F855A]/40 focus:outline-none focus:border-[#2F855A] focus:ring-1 focus:ring-[#2F855A]/20 transition-all cursor-pointer uppercase"
            >
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="cs">CS</option>
              <option value="de">DE</option>
            </select>
            {/* Custom chevron to replace the default select arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Hero lang={lang} />

      {/* Chat section */}
      <section
        id="chat"
        className="flex-1 flex flex-col items-center px-4 pb-16"
      >
        <h2 className="sr-only">AI Hotel Chat</h2>
        <ChatWindow lang={lang} />
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">{t.trustTitle}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t.trustSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">{t.feature1Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">{t.feature2Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.feature2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-[#2F855A]/10 flex items-center justify-center mb-6 text-[#2F855A]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-3">{t.feature3Title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.feature3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">{t.testTitle}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t.testSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex text-[#2F855A] mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1 italic mb-6">
              &quot;{t.test1Text}&quot;
            </p>
            <div className="font-semibold text-[#333333] text-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2F855A]/10 text-[#2F855A] flex items-center justify-center text-xs">
                {t.test1Author.charAt(0)}
              </div>
              {t.test1Author}
            </div>
          </div>

          {/* Review 2 */}
          <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex text-[#2F855A] mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1 italic mb-6">
              &quot;{t.test2Text}&quot;
            </p>
            <div className="font-semibold text-[#333333] text-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2F855A]/10 text-[#2F855A] flex items-center justify-center text-xs">
                {t.test2Author.charAt(0)}
              </div>
              {t.test2Author}
            </div>
          </div>

          {/* Review 3 */}
          <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex text-[#2F855A] mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1 italic mb-6">
              &quot;{t.test3Text}&quot;
            </p>
            <div className="font-semibold text-[#333333] text-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2F855A]/10 text-[#2F855A] flex items-center justify-center text-xs">
                {t.test3Author.charAt(0)}
              </div>
              {t.test3Author}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-black/5">
        © {new Date().getFullYear()} {t.footerText}
      </footer>
    </main>
  );
}
