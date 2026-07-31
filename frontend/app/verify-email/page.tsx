import { Suspense } from "react";
import { VerifyEmailClient } from "@/src/features/auth/components/VerifyEmailClient";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function VerifyEmailPage() {
  return (
    <AuthShell 
      title="تفعيل الحساب" 
      subtitle="جاري التحقق من بريدك الإلكتروني"
    >
      <Suspense fallback={<div className="h-40 flex items-center justify-center">جاري التحميل...</div>}>
        <VerifyEmailClient />
      </Suspense>
    </AuthShell>
  );
}
