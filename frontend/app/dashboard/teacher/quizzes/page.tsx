import Link from "next/link";
import { fetchServerApi } from "@/src/lib/serverApi";
import { redirect } from "next/navigation";
import { PlusCircle, Edit, ClipboardList } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Badge } from "@/src/shared/components/ui/Badge";
import { DeleteExamButton } from "@/src/features/exams/components/DeleteExamButton";

export default async function TeacherExamsPage() {
  let exams: any = [];

  try {
    const data = await fetchServerApi("/teacher/quizzes");
    exams = data?.quizzes || [];
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  return (
    <main className="min-h-screen bg-background text-primary p-8 relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-primary mb-2">الاختبارات</h1>
            <p className="font-body text-muted text-sm">قم بإدارة الاختبارات وبنك الأسئلة الخاص بك.</p>
          </div>
          <Link href="/dashboard/teacher/quizzes/new">
            <Button variant="primary" leftIcon={<PlusCircle size={20} />}>
              إضافة اختبار
            </Button>
          </Link>
        </div>

        {!exams?.length ? (
          <Card className="p-12 text-center flex flex-col items-center bg-surface border-dashed">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <ClipboardList size={32} />
            </div>
            <h3 className="font-display text-2xl text-primary mb-2">لا توجد اختبارات</h3>
            <p className="font-body text-muted mb-6">لم تقم بإنشاء أي اختبارات بعد. ابدأ الآن!</p>
            <Link href="/dashboard/teacher/quizzes/new">
              <Button variant="primary">إنشاء اختبار</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {exams.map((exam: any) => (
              <Card
                key={exam.id}
                hoverable
                className="flex flex-col md:flex-row md:items-center justify-between p-6 group"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="font-ui font-bold text-xl text-primary mb-2 group-hover:text-accent transition-colors">
                    {exam.title}
                  </h3>
                  <div className="flex items-center gap-2 font-body text-sm text-muted">
                    <span className="bg-primary/5 px-2 py-1 rounded-md text-xs">
                      {exam.course?.title}
                    </span>
                    <Badge variant={exam.status === "PUBLISHED" ? "success" : exam.status === "ARCHIVED" ? "outline" : "warning"}>
                      {exam.status === "PUBLISHED" ? "منشور" : exam.status === "ARCHIVED" ? "مؤرشف" : "مسودة"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/teacher/quizzes/${exam.id}`}>
                    <Button variant="primary" leftIcon={<Edit size={16} />}>
                      تعديل وإدارة الأسئلة
                    </Button>
                  </Link>
                  <DeleteExamButton examId={exam.id} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
