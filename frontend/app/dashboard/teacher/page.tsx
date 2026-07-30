import Link from "next/link";
import { BookOpen, Users, DollarSign, Activity, Clock, PlayCircle } from "lucide-react";
import { StatCard } from "@/src/features/dashboard/components/StatCard";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

export default async function TeacherDashboard() {
  let dashboardData: any = null;

  try {
    dashboardData = await fetchServerApi("/teacher/dashboard");
  } catch (err) {
    return null; // or error boundary
  }

  if (!dashboardData) return null;

  const courses = dashboardData.courses || [];
  const courseMap = Object.fromEntries(courses.map((c: any) => [c.id, c]));
  
  const totalStudents = dashboardData.totalStudents || 0;
  const totalSales = dashboardData.totalSales || 0;
  const recentEnrollments = dashboardData.recentEnrollments || [];

  const stats = [
    { label: "إجمالي الكورسات", value: courses.length.toString(), icon: BookOpen },
    { label: "إجمالي الطلاب", value: totalStudents.toString(), icon: Users },
    { label: "إجمالي المبيعات", value: `${totalSales} ج.م`, icon: DollarSign },
    { label: "التفاعل", value: "نشط", icon: Activity },
  ];

  return (
    <div className="relative space-y-12">
      <div className="max-w-[1200px] mx-auto relative z-10 space-y-12">
        
        {/* Welcome Banner */}
        <Card className="relative w-full overflow-hidden border-0 bg-gradient-to-r from-primary to-[#1a1a2e] dark:from-surfaceHover dark:to-surface text-inverse dark:text-primary p-8 md:p-12">
          {/* Subtle overlay texture/pattern instead of old SVG */}
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="text-center md:text-right flex-1">
              <h1 className="font-display text-4xl mb-2">نظرة عامة</h1>
              <p className="font-body text-inverse/80 dark:text-secondary text-lg">
                مرحباً بعودتك! إليك ملخص لنشاطك.
              </p>
            </div>
            <Link href="/dashboard/teacher/courses/new" className="shrink-0 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto bg-surface/10 text-inverse border-inverse/20 hover:bg-surface/20 dark:bg-gold/10 dark:text-gold dark:border-gold/20 dark:hover:bg-gold/20">
                + كورس جديد
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8">
          
          {/* My Courses */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-display text-2xl text-primary">
                دوراتي
              </h2>
              <Link href="/dashboard/teacher/courses" className="font-ui text-sm text-muted hover:text-primary transition-colors">
                عرض الكل
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {courses.slice(0, 4).map((course: any) => (
                <Card key={course.id} hoverable className="p-0 flex flex-col group overflow-hidden">
                  <div className="h-40 relative overflow-hidden bg-surfaceHover border-b border-surfaceBorder rounded-t-[19px]">
                    {course.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surfaceBorder">
                        <BookOpen size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow text-center">
                    <h3 className="text-lg font-ui font-bold mb-1 text-primary line-clamp-1 group-hover:text-accent transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <span className="font-ui text-xs font-bold text-primary">
                        {course.price > 0 ? `${course.price} ج.م` : 'مجاني'}
                      </span>
                      <Link href={`/dashboard/teacher/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          تعديل
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              
              {courses.length === 0 && (
                <Card className="col-span-full p-8 text-center bg-surface border-dashed">
                  <p className="font-ui text-muted mb-4">ليس لديك أي كورسات بعد.</p>
                  <Link href="/dashboard/teacher/courses/new">
                    <Button variant="primary">أضف كورس جديد</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="px-2">
              <h2 className="font-display text-2xl text-primary">النشاط الأخير</h2>
            </div>
            
            <Card className="p-6">
              <div className="space-y-6">
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enr: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="p-2 bg-success text-success rounded-full shrink-0">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-ui text-sm text-primary leading-relaxed">
                          انضمام{" "}
                          <Link href={`/dashboard/teacher/students/${enr.studentId}`} className="underline hover:text-accent">
                            <strong>{enr.student?.fullName || "طالب"}</strong>
                          </Link>{" "}
                          لدورة <strong>{courseMap[enr.courseId]?.title}</strong>
                        </p>
                        <span className="text-xs text-muted font-ui block mt-1">
                          {new Date(enr.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted font-ui text-sm">
                    لا توجد نشاطات حديثة بعد.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
