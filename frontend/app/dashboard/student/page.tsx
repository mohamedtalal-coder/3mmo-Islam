import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import {
  PlayCircle, Award, Clock, BookOpen, TrendingUp,
  ChevronLeft, Flame, GraduationCap, Target, ArrowLeft,
} from "lucide-react";
import { fetchServerApi } from "@/src/lib/serverApi";
import { getProfile } from "@/src/lib/session";

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const profile = await getProfile();
  if (!profile) return null;

  let dashboardData: any = null;
  let error: any = null;

  try {
    dashboardData = await fetchServerApi("/student/dashboard");
  } catch (err) {
    error = err;
  }

  const enrollments = dashboardData?.enrollments || [];
  const certifiedCourseIds = new Set(dashboardData?.certificates || []);
  const completedLessonIds = new Set(dashboardData?.completedLessonIds || []);
  const recommendedCourses = dashboardData?.recommendedCourses || [];

  // Logic processing for frontend display
  const activeEnrollments = enrollments.map((e: any) => {
    const now = new Date();
    const expiresAt = e.expiresAt ? new Date(e.expiresAt) : null;
    const isExpired = expiresAt ? expiresAt < now : false;

    let isExpiringSoon = false;
    let daysRemaining = 0;
    if (expiresAt && !isExpired) {
      const diffTime = expiresAt.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (daysRemaining <= 3) {
        isExpiringSoon = true;
      }
    }

    return {
      ...e,
      isExpired,
      isExpiringSoon,
      daysRemaining
    };
  });

  const nonExpiredEnrollments = activeEnrollments.filter((e: any) => !e.isExpired);
  const expiringSoonEnrollments = activeEnrollments.filter((e: any) => e.isExpiringSoon);

  // Recently viewed (sorted by lastViewedAt)
  const recentlyViewed = [...nonExpiredEnrollments]
    .filter(e => e.lastViewedAt)
    .sort((a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime())
    .slice(0, 4);

  // Continue learning = most recently viewed
  const continueLearningSorted = [...nonExpiredEnrollments]
    .sort((a, b) => {
      const dateA = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
      const dateB = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  // Stats
  const totalCourses = activeEnrollments.length;
  const completedCourses = activeEnrollments.filter((e: any) => e.progressPercentage === 100 || e.status === "COMPLETED").length;
  const totalCertificates = certifiedCourseIds.size;
  // Calculate estimated hours based on progress and course duration
  let totalMinutesLearned = 0;
  activeEnrollments.forEach((e: any) => {
    const duration = e.course?.estimatedDuration || 120; // fallback to 120 mins
    const progress = e.progressPercentage || 0;
    totalMinutesLearned += (duration * progress) / 100;
  });
  const estimatedHours = Math.round(totalMinutesLearned / 60);

  const totalLessonsCompleted = completedLessonIds.size;
  // Mock weekly activity data
  const weeklyData = [
    { day: "Sat", hours: Math.min(totalLessonsCompleted > 0 ? 1.5 : 0, 3) },
    { day: "Sun", hours: Math.min(totalLessonsCompleted > 0 ? 2.0 : 0, 3) },
    { day: "Mon", hours: Math.min(totalLessonsCompleted > 1 ? 1.0 : 0, 3) },
    { day: "Tue", hours: Math.min(totalLessonsCompleted > 2 ? 2.5 : 0, 3) },
    { day: "Wed", hours: Math.min(totalLessonsCompleted > 3 ? 1.5 : 0, 3) },
    { day: "Thu", hours: Math.min(totalLessonsCompleted > 0 ? 3.0 : 0, 3) },
    { day: "Fri", hours: Math.min(totalLessonsCompleted > 0 ? 0.5 : 0, 3) },
  ];

  // Completion percentage
  const totalProgress = activeEnrollments.reduce((sum: number, e: any) => sum + (e.progressPercentage || 0), 0);
  const completionPercentage = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 17 ? "مساء الخير" : "مساء النور";

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">

      {/* Welcome Banner */}
      <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 md:p-8 relative overflow-hidden animate-fade-in-up">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-soft/10 rounded-full blur-[60px] translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary/90 text-sm font-ui">{greeting} 👋</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-3">
              {profile.fullName || "طالب"}
            </h1>
            <p className="font-body text-muted text-sm md:text-base max-w-lg leading-relaxed">
              {continueLearningSorted.length > 0
                ? `لديك ${nonExpiredEnrollments.length} دورة نشطة. واصل رحلة التعلم واقترب من أهدافك.`
                : "مرحباً بك في منصتك التعليمية. استكشف الدورات المتاحة وابدأ رحلة التعلم."
              }
            </p>
          </div>

          {continueLearningSorted.length > 0 ? (
            <Link
              href={`/dashboard/student/courses/${continueLearningSorted[0].courseId}`}
              className="inline-flex items-center gap-2 bg-primary text-inverse font-semibold font-ui px-6 py-3 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-sm shrink-0 text-sm"
            >
              <PlayCircle size={18} />
              تابع التعلم
            </Link>
          ) : (
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-primary text-inverse font-semibold font-ui px-6 py-3 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-sm shrink-0 text-sm"
            >
              <BookOpen size={18} />
              تصفح الدورات
            </Link>
          )}
        </div>
      </div>

      {/* Expiry Warnings */}
      {expiringSoonEnrollments.length > 0 && (
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {expiringSoonEnrollments.map((enrollment: any) => (
            <div
              key={`warning-${enrollment.id}`}
              className="bg-warning/5 border border-warning/20 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                  <Clock className="text-warning" size={20} />
                </div>
                <div>
                  <h4 className="font-ui font-bold text-primary text-sm">تنبيه بقرب انتهاء الاشتراك</h4>
                  <p className="text-xs font-body text-muted mt-0.5">
                    ينتهي اشتراكك في <span className="font-bold">{(enrollment.courses as any).title}</span>{" "}
                    خلال {enrollment.daysRemaining} {enrollment.daysRemaining === 1 ? "يوم" : "أيام"}.
                  </p>
                </div>
              </div>
              <Link
                href={`/checkout/${enrollment.courseId}`}
                className="bg-warning text-inverse px-5 py-2 rounded-lg font-ui font-bold text-sm hover:bg-warning/90 transition-colors shrink-0"
              >
                تجديد الاشتراك
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-danger/5 border-none shadow-sm text-danger p-5 rounded-[18px] font-body text-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
            <Target size={20} />
          </div>
          حدث خطأ أثناء تحميل الكورسات. الرجاء المحاولة مرة أخرى.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-accent">
              <BookOpen size={22} />
            </div>
          </div>
          <div>
            <p className="font-display text-4xl text-primary leading-none mb-2">{totalCourses}</p>
            <p className="font-ui text-xs text-muted font-bold">الدورات المسجلة</p>
          </div>
        </div>

        <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
              <Award size={22} />
            </div>
          </div>
          <div>
            <p className="font-display text-4xl text-primary leading-none mb-2">{totalCertificates}</p>
            <p className="font-ui text-xs text-muted font-bold">الشهادات المكتسبة</p>
          </div>
        </div>

        <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center text-secondary">
              <Clock size={22} />
            </div>
          </div>
          <div>
            <p className="font-display text-4xl text-primary leading-none mb-2">{estimatedHours}</p>
            <p className="font-ui text-xs text-muted font-bold">ساعات التعلم</p>
          </div>
        </div>

        <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-gold bg-opacity-10 flex items-center justify-center text-accent">
              <TrendingUp size={22} />
            </div>
          </div>
          <div>
            <p className="font-display text-4xl text-primary leading-none mb-2">{completionPercentage}%</p>
            <p className="font-ui text-xs text-muted font-bold">نسبة الإنجاز</p>
          </div>
        </div>
      </div>

      {/* Continue Learning + Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-primary flex items-center gap-2">
              <PlayCircle size={22} className="text-accent" />
              تابع التعلم
            </h2>
            {continueLearningSorted.length > 0 && (
              <Link href="/dashboard/student/courses" className="text-accent text-sm font-ui font-bold hover:text-accentLight transition-colors flex items-center gap-1">
                عرض الكل
                <ArrowLeft size={14} />
              </Link>
            )}
          </div>

          {continueLearningSorted.length > 0 ? (
            <div className="space-y-4 stagger-children">
              {continueLearningSorted.map((enrollment: any) => (
                <div key={enrollment.id} className="bg-surface shadow-sm border border-primary/5 rounded-[24px] flex gap-5 p-5 group hover:shadow-md transition-shadow">
                  <div className="w-24 h-18 md:w-32 md:h-20 rounded-xl overflow-hidden bg-primary/5 shrink-0">
                    {enrollment.course?.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={enrollment.course.thumbnailUrl}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent/30">
                        <BookOpen size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-ui font-bold text-primary text-sm truncate mb-1.5">
                      {enrollment.course?.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-1.5 bg-gold/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-gold to-gold-soft rounded-full" style={{ width: `${enrollment.progressPercentage ?? 0}%` }} />
                      </div>
                      <span className="text-xs font-ui text-muted font-bold">{Math.round(enrollment.progressPercentage ?? 0)}%</span>
                    </div>
                    {enrollment.lastViewedAt && (
                      <div className="flex items-center gap-1 text-[11px] text-muted font-ui">
                        <Clock size={11} />
                        <span>{formatTimeAgo(enrollment.lastViewedAt)}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/student/courses/${enrollment.courseId}`}
                    className="self-center shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-gold group-hover:text-inverse transition-all duration-300 shadow-sm group-hover:shadow-md"
                    aria-label={`تابع ${enrollment.course?.title}`}
                  >
                    <PlayCircle size={24} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={28} className="text-accent/50" />
              </div>
              <p className="text-muted font-body mb-4">لم تبدأ أي دورة بعد</p>
              <Link href="/courses" className="inline-flex items-center gap-2 bg-gold text-primary font-bold font-ui font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gold-soft transition-colors">
                تصفح الدورات
              </Link>
            </div>
          )}
        </div>

        {/* Weekly Activity */}
        <div className="space-y-6">
          <h2 className="font-display text-xl text-primary flex items-center gap-2">
            <Flame size={22} className="text-accent" />
            النشاط الأسبوعي
          </h2>
          <WeeklyActivityServer data={weeklyData} />
        </div>
      </div>

      {/* Recently Viewed + Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Viewed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-primary flex items-center gap-2">
              <Clock size={22} className="text-accent" />
              شوهدت مؤخراً
            </h2>
          </div>

          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
              {recentlyViewed.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/student/courses/${enrollment.courseId}`}
                  className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-4 flex items-center gap-4 group hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary/5 shrink-0">
                    {enrollment.course?.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={enrollment.course.thumbnailUrl}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent/30">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ui font-bold text-primary text-sm truncate mb-1">
                      {enrollment.course?.title}
                    </h3>
                    <span className="text-[11px] text-muted font-ui">
                      {enrollment.lastViewedAt && formatTimeAgo(enrollment.lastViewedAt)}
                    </span>
                  </div>
                  <ChevronLeft size={16} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-8 text-center">
              <p className="text-muted font-body text-sm">لم تشاهد أي دورات بعد</p>
            </div>
          )}
        </div>

        {/* Recommended Courses */}
        <div className="space-y-6">
          <h2 className="font-display text-xl text-primary flex items-center gap-2">
            <Target size={22} className="text-accent" />
            موصى بها
          </h2>

          {recommendedCourses.length > 0 ? (
            <div className="space-y-3 stagger-children">
              {recommendedCourses.map((course: any) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-3 flex items-center gap-3 group hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary/5 shrink-0">
                    {course.thumbnail_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent/30">
                        <BookOpen size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ui font-bold text-primary text-xs truncate">{course.title}</h3>
                    {course.price > 0 && (
                      <span className="text-[11px] text-accent font-ui font-bold">{course.price} ج.م</span>
                    )}
                  </div>
                  <ChevronLeft size={14} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-6 text-center">
              <p className="text-muted text-sm font-ui">لا توجد اقتراحات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Server-compatible weekly chart inline component
function WeeklyActivityServer({ data }: { data: { day: string; hours: number }[] }) {
  const dayLabels: Record<string, string> = {
    Sun: "أحد", Mon: "إثن", Tue: "ثلا", Wed: "أرب", Thu: "خمي", Fri: "جمع", Sat: "سبت",
  };
  const max = Math.max(...data.map(d => d.hours), 1);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-5">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-ui text-muted">
          إجمالي: <span className="font-bold text-accent">{totalHours.toFixed(1)}</span> ساعة
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 h-28">
        {data.map((item, i) => {
          const heightPercent = max > 0 ? (item.hours / max) * 100 : 0;
          const isToday = i === data.length - 1;
          return (
            <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[10px] font-ui font-bold text-muted">
                {item.hours > 0 ? `${item.hours}h` : ""}
              </span>
              <div className="w-full flex justify-center" style={{ height: "70px" }}>
                <div className="w-full max-w-[28px] flex items-end h-full">
                  <div
                    className={`w-full rounded-t ${isToday
                        ? "bg-gradient-to-t from-gold to-gold-soft"
                        : "bg-gold/20"
                      }`}
                    style={{ height: `${Math.max(heightPercent, 6)}%`, minHeight: "4px" }}
                  />
                </div>
              </div>
              <span className={`text-[10px] font-ui ${isToday ? "font-bold text-accent" : "text-muted"}`}>
                {dayLabels[item.day] || item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
