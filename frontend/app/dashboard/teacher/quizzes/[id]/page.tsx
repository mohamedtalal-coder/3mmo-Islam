import { fetchServerApi } from "@/src/lib/serverApi";
import { notFound, redirect } from "next/navigation";
import { ExamBuilderClient } from "@/src/features/exams/components/ExamBuilderClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function ExamBuilderPage({ params }: { params: { id: string } }) {
  let exam: any = null;
  let questions: any = [];

  try {
    const data = await fetchServerApi(`/teacher/quizzes/${params.id}`);
    if (!data || !data.quiz) {
      notFound();
    }
    
    exam = data.quiz;
    questions = exam.questions || [];
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-primary p-4 md:p-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link
          href="/dashboard/teacher/quizzes"
          className="inline-flex items-center gap-2 text-accent hover:text-accentLight font-ui text-sm mb-6 transition-colors"
        >
          <ArrowRight size={16} />
          الرجوع للاختبارات
        </Link>

        <h1 className="font-display text-3xl text-primary mb-2">إدارة الاختبار: {exam.title}</h1>
        <p className="font-body text-muted mb-8 text-sm">قم بتعديل إعدادات الاختبار وإدارة بنك الأسئلة الخاص به.</p>

        <ExamBuilderClient initialExam={exam} initialQuestions={questions || []} />
      </div>
    </main>
  );
}
