"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SimulatorPage({ params }: { params: { paymentId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"success" | "fail" | null>(null);

  const handleSimulate = async (success: boolean) => {
    setLoading(success ? "success" : "fail");
    
    try {
      const res = await fetch(`/api/payments/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: params.paymentId, success }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشلت عملية المحاكاة");
      }

      if (success) {
        toast.success("تمت محاكاة الدفع بنجاح!");
        router.push(data.redirectUrl);
      } else {
        toast.error("تمت محاكاة فشل الدفع.");
        router.push(data.redirectUrl);
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-primary/30 backdrop-blur-md rounded-[20px] shadow-2xl border border-gold/30 p-8 text-center relative z-10 font-ui">
        <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20 shadow-inner">
          <CreditCard size={40} className="text-accent" />
        </div>
        
        <h1 className="font-display text-3xl text-accent mb-2">بوابة دفع تجريبية (محاكاة)</h1>
        <p className="font-body text-muted mb-8 text-sm">
          رقم العملية: <span className="font-mono text-xs opacity-70" dir="ltr">{params.paymentId}</span>
          <br/>
          اختر نتيجة العملية لاختبار استجابة المنصة.
        </p>

        <div className="space-y-4 font-ui">
          <button
            onClick={() => handleSimulate(true)}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 bg-success/20 text-success border border-success/50 hover:bg-success/30 font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] disabled:opacity-50"
          >
            {loading === "success" ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            محاكاة دفع ناجح
          </button>

          <button
            onClick={() => handleSimulate(false)}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 font-bold py-4 rounded-xl transition-all disabled:opacity-50"
          >
            {loading === "fail" ? <Loader2 className="animate-spin" /> : <XCircle />}
            محاكاة دفع فاشل
          </button>
        </div>

        <p className="text-xs text-muted mt-8">
          هذه الصفحة تظهر فقط في وضع الاختبار لعدم تفعيل بوابة Paymob الحقيقية.
        </p>
      </div>
    </div>
  );
}
