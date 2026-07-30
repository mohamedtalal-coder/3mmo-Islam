import Link from "next/link";
import {
  BookOpen,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  RefreshCw,
  Award,
  FileText,
  CreditCard,
} from "lucide-react";
import { StatCard } from "@/src/features/dashboard/components/StatCard";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

function formatCurrency(amount: number) {
  return `${Math.round(amount).toLocaleString("ar-EG")} ج.م`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `منذ ${minutes} د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} ي`;
}

const activityConfig: Record<
  string,
  { icon: typeof Users; label: string; color: string; bg: string }
> = {
  enrollment: { icon: Users, label: "انضمام", color: "text-success", bg: "bg-success/10" },
  payment: { icon: CreditCard, label: "دفعة", color: "text-primary", bg: "bg-primary/10" },
  quiz: { icon: FileText, label: "اختبار", color: "text-accent", bg: "bg-gold/10" },
  certificate: { icon: Award, label: "شهادة", color: "text-accent", bg: "bg-gold/10" },
};

function ActivityMessage({ activity }: { activity: any }) {
  const studentLink = (
    <Link
      href={`/dashboard/teacher/students/${activity.studentId}`}
      className="underline hover:text-accent font-bold"
    >
      {activity.studentName}
    </Link>
  );

  switch (activity.type) {
    case "enrollment":
      return (
        <>
          انضم {studentLink} إلى دورة <strong>{activity.courseTitle}</strong>
        </>
      );
    case "payment":
      return (
        <>
          دفع {studentLink}{" "}
          <strong>{formatCurrency(activity.amount)}</strong> لدورة{" "}
          <strong>{activity.courseTitle}</strong>
        </>
      );
    case "quiz":
      return (
        <>
          {studentLink} {activity.passed ? "نجح" : "أكمل"} في{" "}
          <strong>{activity.quizTitle}</strong> ({activity.score}%)
        </>
      );
    case "certificate":
      return (
        <>
          حصل {studentLink} على شهادة دورة <strong>{activity.courseTitle}</strong>
        </>
      );
    default:
      return null;
  }
}

export default async function TeacherDashboard() {
  let dashboardData: any = null;

  try {
    dashboardData = await fetchServerApi("/teacher/dashboard");
  } catch {
    return null;
  }

  if (!dashboardData) return null;

  const courses = dashboardData.courses || [];
  const totalStudents = dashboardData.totalStudents || 0;
  const totalSales = dashboardData.totalSales || 0;
  const totalProfit = dashboardData.totalProfit || totalSales;
  const activeSubscriptions = dashboardData.activeSubscriptions || 0;
  const newJoinsThisWeek = dashboardData.newJoinsThisWeek || 0;
  const salesThisMonth = dashboardData.salesThisMonth || 0;
  const recentActivity = dashboardData.recentActivity || [];

  const stats = [
    { label: "إجمالي الكورسات", value: courses.length.toString(), icon: BookOpen },
    { label: "إجمالي الطلاب", value: totalStudents.toString(), icon: Users },
    { label: "إجمالي المبيعات", value: formatCurrency(totalSales), icon: DollarSign },
    { label: "صافي الأرباح", value: formatCurrency(totalProfit), icon: TrendingUp },
    { label: "اشتراكات نشطة", value: activeSubscriptions.toString(), icon: RefreshCw },
    { label: "انضمام هذا الأسبوع", value: newJoinsThisWeek.toString(), icon: Activity },
    { label: "مبيعات الشهر", value: formatCurrency(salesThisMonth), icon: CreditCard },
  ];

  return (
    <div className="relative space-y-12">
      <div className="max-w-[1200px] mx-auto relative z-10 space-y-12">
        <Card className="relative w-full overflow-hidden border-0 bg-gradient-to-r from-primary to-[#1a1a2e] dark:from-surfaceHover dark:to-surface text-inverse dark:text-primary p-8 md:p-12">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] mix-blend-overlay" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="text-center md:text-right flex-1">
              <h1 className="font-display text-4xl mb-2">نظرة عامة</h1>
              <p className="font-body text-inverse/80 dark:text-secondary text-lg">
                مرحباً بعودتك! إليك ملخص نشاط منصتك.
              </p>
            </div>
            <Link href="/dashboard/teacher/courses/new" className="shrink-0 w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-surface/10 text-inverse border-inverse/20 hover:bg-surface/20 dark:bg-gold/10 dark:text-gold dark:border-gold/20 dark:hover:bg-gold/20"
              >
                + كورس جديد
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-display text-2xl text-primary">دوراتي</h2>
              <Link
                href="/dashboard/teacher/courses"
                className="font-ui text-sm text-muted hover:text-primary transition-colors"
              >
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
                    <p className="text-xs text-muted font-ui mb-2">
                      {course._count?.enrollments || 0} طالب مسجّل
                    </p>

                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <span className="font-ui text-xs font-bold text-primary">
                        {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
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

          <div className="w-full lg:w-96 shrink-0 space-y-4">
            <div className="px-2">
              <h2 className="font-display text-2xl text-primary">آخر النشاطات</h2>
              <p className="text-xs text-muted font-ui mt-1">
                اشتراكات، انضمامات، مدفوعات، واختبارات
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-5 max-h-[520px] overflow-y-auto custom-scrollbar">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity: any, i: number) => {
                    const config = activityConfig[activity.type] || activityConfig.enrollment;
                    const Icon = config.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div
                          className={`p-2 rounded-full shrink-0 ${config.bg} ${config.color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-ui font-bold text-muted uppercase tracking-wide">
                            {config.label}
                          </span>
                          <p className="font-ui text-sm text-primary leading-relaxed mt-0.5">
                            <ActivityMessage activity={activity} />
                          </p>
                          <span className="text-xs text-muted font-ui block mt-1">
                            {formatTimeAgo(activity.timestamp)} · {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
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
