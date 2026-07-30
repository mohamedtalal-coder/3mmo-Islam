import { ResetPasswordForm } from "@/src/features/auth/components/ResetPasswordForm";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <AuthShell 
      title="كلمة مرور جديدة" 
      subtitle="أدخل كلمة المرور الجديدة الخاصة بك."
    >
      <ResetPasswordForm token={searchParams.token || ""} />
    </AuthShell>
  );
}
