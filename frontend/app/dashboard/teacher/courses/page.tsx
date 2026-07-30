import Link from "next/link";
import { PlusCircle, Edit, ExternalLink, BookOpen } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Badge } from "@/src/shared/components/ui/Badge";
import { fetchServerApi } from "@/src/lib/serverApi";

export default async function TeacherCoursesPage() {
  let courses: any[] = [];
  try {
    courses = await fetchServerApi("/teacher/courses");
  } catch (error) {
    console.error("Failed to fetch teacher courses:", error);
  }

  return (
    <main className="min-h-screen bg-background text-primary p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display text-3xl text-primary mb-2">كورساتي</h1>
            <p className="font-body text-muted text-sm">قم بإدارة الدورات التدريبية الخاصة بك.</p>
          </div>
          <Link href="/dashboard/teacher/courses/new" className="w-full md:w-auto">
            <Button variant="primary" leftIcon={<PlusCircle size={20} />} className="w-full md:w-auto">
              إضافة كورس
            </Button>
          </Link>
        </div>

        {!courses?.length ? (
          <Card className="p-8 md:p-12 text-center flex flex-col items-center bg-surface border-dashed">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <BookOpen size={32} />
            </div>
            <h3 className="font-display text-2xl text-primary mb-2">لا توجد كورسات</h3>
            <p className="font-body text-muted mb-6">لم تقم بإنشاء أي كورسات بعد. ابدأ الآن!</p>
            <Link href="/dashboard/teacher/courses/new">
              <Button variant="primary">إنشاء كورس</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course: any) => (
              <Card
                key={course.id}
                hoverable
                className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 group gap-4 md:gap-0"
              >
                <div className="mb-2 md:mb-0">
                  <h3 className="font-ui font-bold text-xl text-primary mb-2 group-hover:text-accent transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 font-body text-sm text-muted">
                    <Badge variant="outline" className="bg-surface">
                      {course.pricingType === "subscription" ? "اشتراك" : "دفعة واحدة"}
                    </Badge>
                    <Badge variant="outline" className="bg-surface">
                      {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
                    </Badge>
                    <Badge variant={course.published ? "success" : "warning"}>
                      {course.published ? "منشور" : "مسودة"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/courses/${course.id}`} target="_blank" className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full md:w-auto px-3" title="معاينة كطالب">
                      <ExternalLink size={18} />
                      <span className="md:hidden mr-2">معاينة</span>
                    </Button>
                  </Link>
                  <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1 md:flex-none">
                    <Button variant="primary" leftIcon={<Edit size={16} />} className="w-full md:w-auto">
                      تعديل
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
