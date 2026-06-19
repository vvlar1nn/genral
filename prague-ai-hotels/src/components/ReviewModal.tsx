import { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

export function ReviewModal({ isOpen, onClose, t }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          setName("");
          setRating(5);
          setText("");
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting review", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-slate-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#333333] mb-6">{t.reviewModalTitle}</h3>
          
          {success ? (
            <div className="bg-[#2F855A]/10 text-[#2F855A] p-4 rounded-xl text-sm font-medium text-center">
              {t.reviewSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.reviewNameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FDFCF0]/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#333333] focus:outline-none focus:border-[#2F855A] focus:ring-1 focus:ring-[#2F855A]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.reviewRatingLabel}</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl transition-colors focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? "#EAB308" : "none"} stroke={star <= rating ? "#EAB308" : "#CBD5E1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.reviewTextLabel}</label>
                <textarea 
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-[#FDFCF0]/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#333333] focus:outline-none focus:border-[#2F855A] focus:ring-1 focus:ring-[#2F855A]/20 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  {t.reviewCancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#2F855A] text-white font-semibold text-sm hover:bg-[#2F855A]/90 transition-colors focus:outline-none shadow-md shadow-[#2F855A]/20 disabled:opacity-70"
                >
                  {t.reviewSubmitBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
