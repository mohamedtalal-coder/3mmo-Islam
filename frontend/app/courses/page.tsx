import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { TiltCard } from "@/src/shared/components/TiltCard";
import { ArrowLeft, BookOpen, Clock, SearchX } from "lucide-react";
import { CoursesSearch } from "@/src/features/courses/components/CoursesSearch";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  let courses: any[] = [];
  let error: any = null;

  try {
    const queryStr = searchParams.q ? `?q=${encodeURIComponent(searchParams.q)}` : "";
    courses = await fetchServerApi(`/courses${queryStr}`);
  } catch (err) {
    error = err;
  }

  // Fallback dummy courses to match design if db is empty and no search was performed
  if ((!courses || courses.length === 0) && !searchParams.q) {
    courses = [
      { id: '1', title: "علم النفس التربوي المتقدم", description: "كورس متقدم في علم النفس التربوي يستهدف المعلمين لتطوير مهاراتهم في فهم نفسية الطلاب وتوجيه سلوكهم بشكل إيجابي.", price: 400, pricingType: "one_time", thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b" },
      { id: '2', title: "تطبيقات الذكاء الاصطناعي في التعليم", description: "تعرف على أحدث أدوات الذكاء الاصطناعي التي ستوفر وقتك وجهدك في تحضير الدروس وتقييم الطلاب بفعالية.", price: 650, pricingType: "one_time", thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" },
      { id: '3', title: "إدارة الفصول الدراسية", description: "استراتيجيات عملية ومجربة لإدارة السلوك داخل الفصل الدراسي وبناء بيئة تعليمية إيجابية وتفاعلية.", price: 350, pricingType: "one_time", thumbnailUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45" }
    ];
  }

  return (
    <main className="min-h-screen bg-background text-primary p-4 md:p-8 relative overflow-hidden font-ui">
      {/* Background Ornaments */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/20 rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 pt-6 md:pt-10">
        <div className="text-center mb-10">
          <h1 className="h1 mb-6 text-accent bg-clip-text text-transparent bg-gradient-to-l from-gold to-gold-soft">
            كورسات {siteConfig.teacher.name}
          </h1>
          <p className="font-body text-muted text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            اكتشف مجموعة منتقاة من أفضل الكورسات التعليمية المصممة بعناية لمساعدتك في تحقيق أهدافك.
          </p>
        </div>

        <CoursesSearch />

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-[10px] mb-8 text-center">
            حدث خطأ أثناء تحميل الكورسات. الرجاء المحاولة مرة أخرى لاحقاً.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
          {courses && courses.length > 0 ? (
            courses.map((course: any) => (
              <TiltCard key={course.id}>
                <div className="h-full bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 relative overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-300">
                  {course.thumbnailUrl && (
                    <div className="w-full h-40 mb-4 rounded-[20px] overflow-hidden border border-gold/10">
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-500">
                      <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-display mb-3 text-accent group-hover:-translate-x-2 transition-transform duration-500">
                      {course.title}
                    </h2>
                    <p className="text-muted font-body text-sm line-clamp-3">
                      {course.description || "لا يوجد وصف متوفر لهذا الكورس."}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-display text-xl text-accent font-bold">
                        {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
                      </span>
                      {course.pricingType === 'subscription' && (
                        <span className="text-xs text-muted flex items-center gap-1 mt-1">
                          <Clock size={12} /> اشتراك
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      href={`/courses/${course.id}`}
                      className="flex items-center justify-center gap-2 bg-primary text-inverse font-ui font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      التفاصيل
                      <ArrowLeft size={16} />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))
          ) : searchParams.q ? (
            <div className="col-span-full bg-surface shadow-sm py-20 px-6 rounded-[24px] border border-primary/5 text-center flex flex-col items-center">
              <SearchX className="text-muted mb-6" size={64} />
              <p className="font-display text-2xl text-primary mb-2">لا توجد نتائج بحث</p>
              <p className="font-body text-muted">
                لم نتمكن من العثور على أي كورسات تطابق &quot;{searchParams.q}&quot;.
              </p>
            </div>
          ) : (
            <div className="col-span-full bg-surface shadow-sm py-20 px-6 rounded-[24px] border border-primary/5 text-center flex flex-col items-center">
              <BookOpen className="text-muted mb-6" size={64} />
              <p className="font-display text-2xl text-primary mb-2">لا توجد كورسات متاحة حالياً</p>
              <p className="font-body text-muted">عد قريباً لاكتشاف محتوى جديد ومميز.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
