"use client";

import { ErrorState } from "@/src/features/dashboard/components/student/ErrorState";

export default function StudentDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-[1200px] mx-auto py-12">
      <ErrorState
        title="حدث خطأ في لوحة التحكم"
        message="عذراً، حدث خطأ غير متوقع أثناء تحميل لوحة التحكم. يرجى المحاولة مرة أخرى."
        onRetry={reset}
      />
    </div>
  );
}
