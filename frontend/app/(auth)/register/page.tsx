import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/src/features/auth/components/AuthForm";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell 
      title="إنشاء حساب جديد" 
      subtitle="انضم إلينا وابدأ التعلم الآن"
    >
      <Suspense fallback={<Skeleton className="h-72 w-full" />}>
        <AuthForm mode="register" />
      </Suspense>

      <div className="mt-8 text-center font-ui text-sm border-t border-gold/20 pt-6">
        <p className="text-muted">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
