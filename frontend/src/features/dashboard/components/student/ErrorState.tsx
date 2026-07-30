"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "حدث خطأ غير متوقع",
  message = "عذراً، حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
        <AlertTriangle size={36} className="text-danger" />
      </div>
      <h3 className="font-display text-2xl text-primary mb-3">{title}</h3>
      <p className="font-body text-muted max-w-md mb-8 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-danger/10 text-danger font-ui font-bold px-6 py-3 rounded-xl border border-danger/20 hover:bg-danger/20 transition-all duration-300"
        >
          <RefreshCw size={18} />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
