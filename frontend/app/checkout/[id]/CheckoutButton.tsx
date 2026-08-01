"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
}

import { fetchApi } from "@/src/lib/api";

export default function CheckoutButton({ courseId, price }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    const toastId = toast.loading("جاري تجهيز بوابة الدفع...");

    try {
      const data = await fetchApi("/student/enroll", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });

      if (data.redirectUrl || data.success) {
        toast.success("تم الدفع والاشتراك بنجاح! جاري تحويلك...", { id: toastId });
        window.location.href = data.redirectUrl || `/dashboard/student/courses/${courseId}`;
      } else {
        throw new Error("حدث خطأ غير متوقع");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      if (err.message?.includes("رصيد") || err.error === 'INSUFFICIENT_BALANCE') {
        toast.error("رصيد المحفظة غير كافٍ. جاري تحويلك لصفحة المحفظة للشحن...", { id: toastId });
        setTimeout(() => {
          window.location.href = "/dashboard/student/wallet";
        }, 1500);
      } else {
        toast.error(err.message || "عذراً، لم نتمكن من إتمام العملية. يرجى المحاولة مرة أخرى.", { id: toastId });
      }
      setIsLoading(false);
    }
  };

  const isFree = Number(price) === 0;
  const buttonText = isFree ? "اشتراك مجاني مباشر" : `خصم ${price} ج.م من المحفظة والاشتراك`;

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-gold to-gold-soft text-background font-ui font-bold text-lg text-center py-4 px-6 rounded-[10px] hover:scale-[1.02] transition-transform shadow-[0_4px_15px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isLoading ? (
        <>
          <Loader2 size={24} className="animate-spin" />
          <span>جاري التجهيز...</span>
        </>
      ) : (
        <>
          <span>{buttonText}</span>
          <ArrowRight size={20} className={typeof document !== 'undefined' && document.dir === 'rtl' ? "rotate-180" : ""} />
        </>
      )}
    </button>
  );
}
