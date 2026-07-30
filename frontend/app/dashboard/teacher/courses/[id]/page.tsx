import { CourseActions } from "@/src/features/courses/components/CourseActions";
import { ModuleForm } from "@/src/features/courses/components/ModuleForm";
import { CourseContentList } from "@/src/features/courses/components/CourseContentList";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { ArrowRight, Book, PlayCircle } from "lucide-react";
import { fetchServerApi } from "@/src/lib/serverApi";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  let data: any = null;
  try {
    data = await fetchServerApi(`/teacher/courses/${params.id}`);
  } catch (error) {
    notFound();
  }

  if (!data || !data.course) notFound();

  const { course, modules, quizzes } = data;

  const nextModulePosition = (modules?.length ?? 0);

  return (
    <main className="min-h-screen bg-background text-primary p-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/dashboard/teacher/courses"
          className="inline-flex items-center gap-2 text-accent hover:text-accentLight font-ui text-sm mb-6 transition-colors"
        >
          <ArrowRight size={16} />
          الرجوع للكورسات
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-6 border-b border-gold/20">
          <div>
            <h1 className="font-display text-4xl text-accent mb-2">{course.title}</h1>
            <p className="font-body text-muted max-w-2xl mb-4">{course.description || "لا يوجد وصف"}</p>
            <div className="flex flex-wrap items-center gap-3 font-ui text-sm">
              <span className="bg-primary/50 border border-gold/10 px-3 py-1 rounded-full text-accent">
                {course.pricingType === "subscription" ? "اشتراك" : "دفعة واحدة"}
              </span>
              <span className="bg-primary/50 border border-gold/10 px-3 py-1 rounded-full text-accent">
                {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
              </span>
              <span
                className={`px-3 py-1 rounded-full border ${
                  course.published ? "bg-success/10 text-success border-success/20" : "bg-gold/10 text-accent border-gold/20"
                }`}
              >
                {course.published ? "منشور" : "مسودة"}
              </span>
            </div>
          </div>
          
          <CourseActions course={course} />
        </div>

        <div className="space-y-8">
          <CourseContentList courseId={course.id} initialModules={modules ?? []} quizzes={quizzes ?? []} />

          {!modules?.length && (
            <div className="bg-primary/20 border border-dashed border-gold/20 rounded-xl p-10 text-center">
              <p className="font-body text-muted mb-4">لا توجد وحدات تعليمية في هذا الكورس بعد.</p>
            </div>
          )}

          <section className="bg-background border-2 border-dashed border-gold/30 rounded-tr-[20px] rounded-bl-[20px] p-8">
            <h2 className="font-display text-2xl text-accent mb-4 text-center">إضافة وحدة جديدة</h2>
            <ModuleForm courseId={course.id} nextPosition={nextModulePosition} />
          </section>
        </div>
      </div>
    </main>
  );
}
