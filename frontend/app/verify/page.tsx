"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

export default function VerifyIndexPage() {
  const [certNumber, setCertNumber] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certNumber.trim()) {
      router.push(`/verify/${encodeURIComponent(certNumber.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-lg shadow-sm border border-gold/30 text-center max-w-md w-full">
        <h1 className="text-3xl font-display text-petrol mb-4">التحقق من الشهادات</h1>
        <p className="text-muted font-body mb-8">
          أدخل رقم الشهادة للتحقق من صحتها وتفاصيل الإصدار.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="مثال: CERT-123456-ABCD"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            className="w-full px-4 py-3 text-left border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold outline-none font-mono"
            dir="ltr"
            required
          />
          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold-soft text-background font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            تحقق الآن
          </button>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <Link href="/" className="text-muted hover:text-accent text-sm font-ui transition-colors">
            العودة للمنصة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
