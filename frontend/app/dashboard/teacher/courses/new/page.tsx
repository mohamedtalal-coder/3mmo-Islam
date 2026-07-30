import { CourseForm } from "@/src/features/courses/components/CourseForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchServerApi } from "@/src/lib/serverApi";

export default async function NewCoursePage() {
  let grades: any[] = [];
  try {
    grades = await fetchServerApi("/courses/grades");
  } catch (error) {
    console.error("Failed to fetch grades:", error);
  }

  return (
    <main className="min-h-screen bg-background text-primary p-4 sm:p-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/dashboard/teacher/courses"
          className="inline-flex items-center gap-2 text-accent hover:text-accentLight font-ui text-sm mb-6 transition-colors"
        >
          <ArrowRight size={16} />
          الرجوع للكورسات
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-accent mb-2">إضافة كورس جديد</h1>
        <p className="font-body text-muted mb-10 pb-6 border-b border-gold/10">
          أدخل بيانات الكورس الأساسية. يمكنك إضافة الدروس والموديلات لاحقاً.
        </p>

        <CourseForm grades={grades || []} />
      </div>
    </main>
  );
}
