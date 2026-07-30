import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, PlayCircle, CheckCircle, ExternalLink, FileText } from "lucide-react";
import { getVideoEmbedUrl } from "@/src/shared/lib/parseVideoUrl";
import { fetchServerApi } from "@/src/lib/serverApi";
import { getProfile } from "@/src/lib/session";

export const revalidate = 0;

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const profile = await getProfile();
  const isTeacher = profile?.role === "TEACHER";
  
  let course: any = null;
  let modules: any[] = [];
  let attachments: any[] = [];

  // Check if this is a dummy course from the landing page fallback
  if (['1', '2', '3'].includes(params.id)) {
    const dummyCourses = [
      { id: '1', title: "علم النفس التربوي المتقدم", description: "كورس متقدم في علم النفس التربوي يستهدف المعلمين لتطوير مهاراتهم في فهم نفسية الطلاب وتوجيه سلوكهم بشكل إيجابي.", price: 400, pricingType: "one_time", thumbnailUrl: null },
      { id: '2', title: "تطبيقات الذكاء الاصطناعي في التعليم", description: "تعرف على أحدث أدوات الذكاء الاصطناعي التي ستوفر وقتك وجهدك في تحضير الدروس وتقييم الطلاب بفعالية.", price: 650, pricingType: "one_time", thumbnailUrl: null },
      { id: '3', title: "إدارة الفصول الدراسية", description: "استراتيجيات عملية ومجربة لإدارة السلوك داخل الفصل الدراسي وبناء بيئة تعليمية إيجابية وتفاعلية.", price: 350, pricingType: "one_time", thumbnailUrl: null }
    ];
    course = dummyCourses.find(c => c.id === params.id);
    modules = [
      { id: 'm1', title: "مقدمة عامة", lessons: [{ id: 'l1', title: "الترحيب ونظرة عامة على الكورس", position: 1 }] },
      { id: 'm2', title: "الوحدة الأولى", lessons: [] }
    ];
  } else {
    try {
      const data = await fetchServerApi(`/courses/${params.id}`);
      course = data.course;
      modules = data.modules;
      attachments = data.attachments;
    } catch (e) {
      notFound();
    }
  }

  return (
    <main className="min-h-screen bg-background text-primary font-ui relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <section className="relative z-10 pt-10 md:pt-16 pb-16 md:pb-20 px-4 md:px-8 bg-gradient-to-b from-primary/30 to-background border-b border-gold/10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-accent hover:text-accentLight transition-colors font-ui text-sm mb-8"
          >
            <ArrowRight size={16} />
            العودة للكورسات
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1 order-2 md:order-1 text-center md:text-right">
              <h1 className="h1 text-accent mb-6 leading-tight">{course.title}</h1>
              <p className="text-muted text-lg md:text-xl font-body leading-relaxed max-w-3xl">
                {course.description}
              </p>
            </div>
            {course.thumbnailUrl && (
              <div className="w-full md:w-1/3 order-1 md:order-2 rounded-[20px] overflow-hidden border-2 border-gold/20 shadow-2xl shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Intro Video Embed */}
        {course.introVideoUrl && getVideoEmbedUrl(course.introVideoUrl) && (
          <div className="mt-10 max-w-3xl">
            <div className="relative w-full pt-[56.25%] rounded-[20px] overflow-hidden border-2 border-gold/20 shadow-xl bg-black">
              <iframe
                src={getVideoEmbedUrl(course.introVideoUrl)!}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="فيديو تعريفي"
              />
            </div>
          </div>
        )}
      </section>
      
      {/* Content section */}
      <section className="relative z-10 py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-display mb-8 text-accent flex items-center gap-3">
              <BookOpen size={28} />
              محتوى الكورس
            </h2>
            
            {modules && modules.length > 0 ? (
              <div className="space-y-6">
                {modules.map((module, idx) => (
                  <div key={module.id} className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-primary/5">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-accent font-bold font-display">
                        {idx + 1}
                      </div>
                      <h3 className="font-bold text-xl text-primary">{module.title}</h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                          <li key={lesson.id} className="flex items-center gap-3 text-muted font-body group">
                            <PlayCircle size={16} className="text-accent/50 group-hover:text-accent transition-colors" />
                            <span className="group-hover:text-primary transition-colors">{lesson.title}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted/60 text-sm font-body italic p-4 bg-background/50 rounded-[8px] text-center border border-dashed border-gold/10">
                          جاري تجهيز محتوى هذه الوحدة
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/10 rounded-[15px] p-10 text-center border border-dashed border-gold/20">
                <BookOpen size={48} className="text-accent/30 mx-auto mb-4" />
                <p className="text-muted font-body text-lg">لم يتم إضافة محتوى لهذا الكورس بعد.</p>
              </div>
            )}

            {/* Course Attachments */}
            {attachments.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-display mb-6 text-accent flex items-center gap-3">
                  <FileText size={28} />
                  المرفقات والملفات
                </h2>
                <div className="space-y-3">
                  {attachments.map((att: any) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-surface border border-primary/5 rounded-xl hover:border-gold/30 hover:shadow-sm transition-all group"
                    >
                      <FileText size={24} className="text-gold flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-primary font-ui text-sm block truncate group-hover:text-accent transition-colors">{att.fileName}</span>
                        {att.fileSize && (
                          <span className="text-xs text-muted">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                      <ExternalLink size={16} className="text-muted group-hover:text-accent transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-surface shadow-sm border border-primary/5 p-8 rounded-[24px] sticky top-8 backdrop-blur-sm">
              <div className="text-center mb-8 pb-8 border-b border-primary/5">
                <span className="block text-4xl font-display text-accent mb-3">
                  {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
                </span>
                {course.pricingType === 'subscription' && (
                  <span className="text-muted text-sm font-body flex items-center justify-center gap-2 bg-background/50 py-2 rounded-full mx-8 border border-gold/10">
                    <Clock size={14} className="text-accent" />
                    اشتراك لمدة {course.subscriptionPeriodDays} يوم
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-8 text-muted text-sm font-body">
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> وصول كامل لجميع الدروس</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> اختبارات وتقييمات دورية</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> شهادة عند إتمام الكورس</p>
              </div>

              {/* External Link */}
              {course.externalLink && (
                <a
                  href={course.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gold/30 text-accent hover:bg-gold/10 font-ui text-sm font-semibold transition-colors mb-4"
                >
                  <ExternalLink size={16} />
                  رابط المجموعة / الصفحة الخارجية
                </a>
              )}

              {isTeacher ? (
                <div className="flex flex-col items-center justify-center w-full bg-primary/10 text-accent/60 py-4 rounded-[10px] font-bold font-ui text-base border border-dashed border-gold/30 cursor-not-allowed">
                  <span className="block">حساب المعلم لا يمكنه الاشتراك</span>
                  <span className="text-xs opacity-70 mt-1 font-body font-normal">هذه الميزة مخصصة للطلاب فقط</span>
                </div>
              ) : (
                <Link 
                  href={`/checkout/${course.id}`} 
                  className="flex items-center justify-center w-full bg-primary text-inverse py-4 rounded-xl font-bold font-ui text-lg hover:bg-primary-hover shadow-sm transition-colors"
                >
                  اشترك الآن وابدأ التعلم
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
