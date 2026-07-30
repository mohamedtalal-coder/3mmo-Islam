import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ChevronLeft } from "lucide-react";

interface ConfirmPageProps {
  searchParams: {
    success?: string;
    pending?: string;
    id?: string;
    amount_cents?: string;
    currency?: string;
  };
}

export const revalidate = 0;

export default function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const isSuccess = searchParams.success === "true";
  const isPending = searchParams.pending === "true";
  const transactionId = searchParams.id;
  const amountCents = searchParams.amount_cents ? parseInt(searchParams.amount_cents, 10) : 0;
  const amount = (amountCents / 100).toFixed(2);
  const currency = searchParams.currency || "EGP";

  return (
    <main className="min-h-screen bg-background text-primary flex items-center justify-center p-4 md:p-8 font-ui relative overflow-hidden">
      {/* Background Ornaments */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none ${isSuccess && !isPending ? 'bg-success' : isPending ? 'bg-warning' : 'bg-danger'}`} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-primary/20 backdrop-blur-md rounded-[20px] shadow-2xl border border-gold/20 overflow-hidden text-center relative z-10">
        {/* Status Header Icon */}
        <div className="p-10 flex flex-col items-center border-b border-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay"></div>
          
          {isSuccess && !isPending ? (
            <>
              <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center text-success border border-success/50 mb-6 animate-[bounce_2s_ease-in-out_infinite] shadow-[0_0_30px_rgba(34,197,94,0.3)] relative z-10">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-success mb-3 relative z-10 drop-shadow-md">تم تفعيل الاشتراك بنجاح!</h1>
              <p className="text-muted text-sm font-body leading-relaxed max-w-sm relative z-10">
                شكراً لك! تمت معالجة عملية الدفع بنجاح وتفعيل اشتراكك بالكورس.
              </p>
            </>
          ) : isPending ? (
            <>
              <div className="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center text-warning border border-warning/50 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative z-10">
                <Clock size={48} />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-warning mb-3 relative z-10 drop-shadow-md">عملية الدفع معلقة</h1>
              <p className="text-muted text-sm font-body leading-relaxed max-w-sm relative z-10">
                العملية قيد المراجعة حالياً من قبل بوابة الدفع. سيتم تفعيل الكورس فور تأكيدها.
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-danger/20 rounded-full flex items-center justify-center text-danger border border-danger/50 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] relative z-10">
                <XCircle size={48} />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-danger mb-3 relative z-10 drop-shadow-md">فشلت عملية الدفع</h1>
              <p className="text-muted text-sm font-body leading-relaxed max-w-sm relative z-10">
                عذراً، لم نتمكن من إتمام عملية الدفع. يرجى مراجعة بيانات الدفع وإعادة المحاولة.
              </p>
            </>
          )}
        </div>

        {/* Transaction Info details */}
        <div className="p-8 bg-background/40 space-y-4 text-sm font-body">
          {transactionId && (
            <div className="flex justify-between items-center pb-3 border-b border-gold/5">
              <span className="text-muted">رقم العملية:</span>
              <span className="font-mono text-primary font-semibold bg-background/50 px-2 py-1 rounded">{transactionId}</span>
            </div>
          )}
          {amountCents > 0 && (
            <div className="flex justify-between items-center pb-3 border-b border-gold/5">
              <span className="text-muted">القيمة المدفوعة:</span>
              <span className="font-display text-xl text-accent">
                {amount} {currency === "EGP" ? "ج.م" : currency}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted">حالة الدفع:</span>
            <span
              className={`font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1 border ${
                isSuccess && !isPending
                  ? "bg-success/10 text-success border-success/20"
                  : isPending
                  ? "bg-warning/10 text-warning border-warning/20"
                  : "bg-danger/10 text-danger border-danger/20"
              }`}
            >
              {isSuccess && !isPending && <CheckCircle2 size={12} />}
              {isPending && <Clock size={12} />}
              {!isSuccess && !isPending && <XCircle size={12} />}
              {isSuccess && !isPending ? "مقبول" : isPending ? "معلق" : "مرفوض"}
            </span>
          </div>
        </div>

        {/* Actions Button */}
        <div className="p-8 border-t border-gold/10 space-y-4">
          {isSuccess && !isPending ? (
            <Link
              href="/dashboard/student"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gold to-gold-soft text-background font-ui font-bold py-4 px-6 rounded-[10px] hover:scale-[1.02] transition-transform shadow-[0_4px_15px_rgba(197,160,89,0.3)] text-lg"
            >
              الذهاب لكورساتي والبدء بالتعلم
              <ChevronLeft size={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/student"
                className="bg-primary/50 border border-gold/20 text-primary font-ui font-semibold py-3.5 px-4 rounded-[10px] hover:bg-primary transition-colors text-center shadow-sm"
              >
                لوحة التحكم
              </Link>
              <Link
                href="/courses"
                className="bg-gradient-to-r from-gold to-gold-soft text-background font-ui font-bold py-3.5 px-4 rounded-[10px] hover:scale-[1.02] transition-transform shadow-[0_4px_15px_rgba(197,160,89,0.3)] text-center flex items-center justify-center gap-2"
              >
                تصفح الكورسات
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
