"use client";

import { ErrorState } from "@/src/features/dashboard/components/student/ErrorState";

export default function StudentCoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <ErrorState
        title="خطأ في تحميل الدورات"
        message="عذراً، حدث خطأ أثناء تحميل قائمة دوراتك. يرجى المحاولة مرة أخرى."
        onRetry={reset}
      />
    </div>
  );
}
