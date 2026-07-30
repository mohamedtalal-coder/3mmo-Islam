import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/src/features/auth/components/AuthForm";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell 
      title="تسجيل الدخول" 
      subtitle="أهلاً بك في منصتنا التعليمية. سجل دخولك لمتابعة التعلم."
    >
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <AuthForm mode="login" />
      </Suspense>

      <div className="mt-8 text-center font-ui text-sm space-y-3 border-t border-gold/20 pt-6">
        <p className="text-muted">
          مفيش حساب؟{" "}
          <Link href="/register" className="text-accent font-semibold hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
        <p>
          <Link href="/forgot-password" className="text-accent hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
