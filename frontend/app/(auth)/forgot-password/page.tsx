import Link from "next/link";
import { ForgotPasswordForm } from "@/src/features/auth/components/ForgotPasswordForm";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell 
      title="استعادة كلمة المرور" 
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور."
    >
      <ForgotPasswordForm />

      <div className="mt-8 pt-6 border-t border-gold/20 text-center">
        <Link href="/login" className="text-accent font-semibold hover:underline font-ui text-sm">
          العودة لتسجيل الدخول
        </Link>
      </div>
    </AuthShell>
  );
}
