"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background text-primary flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-danger rounded-full blur-[100px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-primary rounded-full blur-[80px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg">
        <AlertTriangle size={80} className="text-danger mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="font-display text-3xl md:text-4xl mb-4 text-primary">حدث خطأ غير متوقع</h1>
        <p className="font-body text-muted mb-6 text-lg">
          نعتذر، واجهنا مشكلة أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
        </p>
        
        {process.env.NODE_ENV === "development" && (
          <div className="bg-danger/10 border border-danger/20 rounded-[10px] p-4 mb-8 w-full text-left">
            <p className="font-mono text-xs text-danger break-all">{error.message}</p>
          </div>
        )}
        
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-background font-ui font-bold px-8 py-3.5 rounded-[10px] hover:scale-[1.05] transition-transform shadow-[0_4px_20px_rgba(197,160,89,0.3)]"
        >
          <RotateCcw size={18} />
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}
