import { fetchServerApi } from "@/src/lib/serverApi";
import { BACKEND_URL } from "@/src/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Topbar } from "@/src/features/dashboard/components/Topbar";

export default async function GradeDashboard({ params }: { params: { gradeSlug: string } }) {
  let user = null;
  let grade = null;
  let courses = [];

  try {
    const authData = await fetchServerApi("/auth/me");
    if (authData && authData.user) {
      user = authData.user;
    }
  } catch (err) {
    // Ignore auth error for public pages
  }

  try {
    const data = await fetchServerApi(`/public/grades/${params.gradeSlug}`);
    if (data && data.grade) {
      grade = data.grade;
      courses = data.courses || [];
    }
  } catch (error) {
    // Grade not found
  }

  if (!grade) {
    notFound();
  }

  const breadcrumbs = (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-muted hover:text-accent transition-colors">الرئيسية</Link>
      <span className="text-muted">/</span>
      <span className="text-primary font-bold">{grade.name}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <Topbar user={{ name: user?.user_metadata?.full_name || "طالب" }} breadcrumbs={breadcrumbs} />
        
        <main className="py-12">
          {/* Header */}
          <div className="mb-12 flex items-center gap-6 bg-surface shadow-sm border border-primary/5 p-8 rounded-[24px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold opacity-10 rounded-bl-full" />
            <div className="w-20 h-20 bg-surface shadow-sm border border-primary/5 rounded-[18px] flex items-center justify-center text-4xl z-10">
              {grade.icon}
            </div>
            <div className="z-10">
              <h1 className="font-display text-3xl md:text-4xl text-accent mb-2">{grade.name}</h1>
              <p className="font-body text-muted text-lg">{grade.description}</p>
            </div>
          </div>

          {/* Courses Grid */}
          <h2 className="font-display text-3xl text-primary mb-8 border-b border-gold/10 pb-4">الدورات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses || []).map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group block bg-surface shadow-sm border border-primary/5 rounded-[24px] overflow-hidden hover:shadow-md transition-all relative"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Thumbnail */}
                {course.thumbnailUrl ? (
                  <div className="w-full h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BACKEND_URL}${course.thumbnailUrl}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-primary/5 flex items-center justify-center">
                    <BookOpen size={48} className="text-gold/30" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-accent group-hover:text-gold-soft transition-colors mb-2">{course.title}</h3>
                  {course.description && (
                    <p className="font-body text-sm text-muted line-clamp-2 mb-4">{course.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/5 font-ui text-sm">
                    <span className="text-accent font-bold text-lg">
                      {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
                    </span>
                    <span className="flex items-center gap-1 text-muted group-hover:text-accent transition-colors">
                      عرض التفاصيل
                      <ArrowRight size={14} className="rotate-180" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            
            {(!courses || courses.length === 0) && (
              <div className="col-span-full py-12 text-center border border-dashed border-gold/30 rounded-2xl">
                <BookOpen size={48} className="text-gold/30 mx-auto mb-4" />
                <p className="font-body text-muted text-lg">لم يتم إضافة دورات لهذه المرحلة بعد.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
