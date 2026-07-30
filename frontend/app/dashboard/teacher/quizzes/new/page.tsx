import { redirect } from "next/navigation";
import { CreateExamForm } from "@/src/features/exams/components/CreateExamForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchServerApi } from "@/src/lib/serverApi";

export default async function NewExamPage() {
  let courses: any = [];

  try {
    const data = await fetchServerApi("/teacher/courses/with-modules");
    courses = data?.courses || [];
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  return (
    <main className="min-h-screen bg-background text-primary p-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          href="/dashboard/teacher/quizzes"
          className="inline-flex items-center gap-2 text-accent hover:text-accentLight font-ui text-sm mb-6 transition-colors"
        >
          <ArrowRight size={16} />
          الرجوع للاختبارات
        </Link>

        <h1 className="font-display text-3xl text-primary mb-8">إنشاء اختبار جديد</h1>

        <div className="bg-surface border border-gold/10 rounded-xl p-8 shadow-sm">
          <CreateExamForm courses={courses || []} />
        </div>
      </div>
    </main>
  );
}
