"use client";

interface AffiliateFooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function AffiliateFooter({ t }: AffiliateFooterProps) {
  return (
    <div className="w-full border-t border-black/5 bg-slate-50/70 py-4 px-6">
      <p className="max-w-3xl mx-auto text-center text-[11px] leading-relaxed text-slate-400">
        {t.affiliateDisclaimer}
      </p>
    </div>
  );
}
