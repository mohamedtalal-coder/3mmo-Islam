import { QuizPlayer } from "@/src/features/exams/components/QuizPlayer";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function StudentQuizPage({ params, searchParams }: { params: { id: string }, searchParams: { courseId?: string } }) {
  const quizId = params.id;
  const courseId = searchParams.courseId;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Top Header */}
      <header className="px-4 md:px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-surfaceBorder flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 font-ui text-sm text-muted">
          <BookOpen size={20} className="text-primary" />
          <span className="text-primary font-bold">منصة عمو إسلام</span>
        </div>
        {courseId ? (
          <Link
            href={`/dashboard/student/courses/${courseId}`}
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors font-ui text-sm shrink-0 px-4 py-2 rounded-lg hover:bg-gold/5 border border-transparent hover:border-gold/20"
          >
            <ArrowRight size={16} />
            <span>العودة للدورة</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/student"
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors font-ui text-sm shrink-0 px-4 py-2 rounded-lg hover:bg-gold/5 border border-transparent hover:border-gold/20"
          >
            <ArrowRight size={16} />
            <span>العودة للوحة التحكم</span>
          </Link>
        )}
      </header>

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col w-full h-full">
        <QuizPlayer quizId={quizId} />
      </div>
    </div>
  );
}
