import { fetchServerApi } from "@/src/lib/serverApi";
import { notFound, redirect } from "next/navigation";
import CheckoutButton from "./CheckoutButton";
import { Lock, User, Mail, CreditCard, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  let profile = null;
  let user = null;

  try {
    const authData = await fetchServerApi("/auth/me");
    if (authData && authData.user) {
      user = authData.user;
      profile = { ...user };
    }
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect(`/login?redirectTo=/checkout/${params.id}`);
    }
  }

  if (!user) {
    redirect(`/login?redirectTo=/checkout/${params.id}`);
  }

  // 1. Fetch course details
  let course;
  try {
    const data = await fetchServerApi(`/public/courses/${params.id}`);
    course = data?.course;
  } catch (error) {
    // If not found or error, course is undefined
  }

  if (!course || !course.published) {
    notFound();
  }

  const role = profile?.role;
  const isTeacher = role === "TEACHER";

  // 3. Check if already active enrollment exists
  if (!isTeacher) {
    try {
      const { courses } = await fetchServerApi("/student/courses");
      const isEnrolled = courses?.some((c: any) => c.id === params.id);
      if (isEnrolled) {
        redirect(`/dashboard/student/courses/${params.id}`);
      }
    } catch (err) {
      // Ignore error
    }
  }

  const isSubscription = course.pricingType === "subscription";
  const periodText = isSubscription
    ? `اشتراك لمدة ${course.subscriptionPeriodDays || 30} يوم`
    : "شراء مرة واحدة (وصول دائم)";

  return (
    <main className="min-h-screen bg-background text-primary flex items-center justify-center p-4 md:p-8 font-ui relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl bg-primary/20 backdrop-blur-md rounded-[20px] shadow-2xl border border-gold/20 overflow-hidden flex flex-col relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary to-primary/80 p-8 text-center border-b border-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay"></div>
          <ShieldCheck size={48} className="text-accent mx-auto mb-4 relative z-10" />
          <h1 className="font-display text-3xl md:text-4xl text-accent mb-2 relative z-10">إتمام الاشتراك الدفع</h1>
          <p className="text-muted text-sm font-body relative z-10">أنت على وشك الانضمام لرحلة تعليمية متميزة</p>
        </div>

        <div className="p-8 flex-1 space-y-8">
          {/* Course card info */}
          <div className="bg-background/40 rounded-[15px] p-6 border border-gold/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
            <span className="text-xs font-bold text-accent/80 tracking-wider block mb-2 font-display">تفاصيل الكورس</span>
            <h2 className="font-display text-2xl text-primary mb-3">{course.title}</h2>
            <p className="text-muted text-sm font-body line-clamp-3 leading-relaxed">
              {course.description || "لا يوجد وصف متوفر لهذا الكورس."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-accent border-b border-gold/10 pb-2 flex items-center gap-2">
                <User size={16} /> بيانات الطالب
              </h3>
              <div className="space-y-3 text-sm font-body">
                <div>
                  <span className="text-muted block mb-1">الاسم:</span>
                  <span className="text-primary font-semibold flex items-center gap-2">
                    <User size={14} className="text-accent/50" />
                    {profile?.fullName || "غير متوفر"}
                  </span>
                </div>
                <div>
                  <span className="text-muted block mb-1">البريد الإلكتروني:</span>
                  <span className="text-primary font-semibold flex items-center gap-2 truncate">
                    <Mail size={14} className="text-accent/50" />
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing detail */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-accent border-b border-gold/10 pb-2 flex items-center gap-2">
                <CreditCard size={16} /> تفاصيل الفاتورة
              </h3>
              <div className="space-y-3 text-sm font-body">
                <div>
                  <span className="text-muted block mb-1">طريقة الاشتراك:</span>
                  <span className="font-semibold text-primary">{periodText}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-gold/20">
                  <span className="text-muted block mb-1">المبلغ الإجمالي:</span>
                  <span className="font-display text-3xl text-accent block">
                    {course.price > 0 ? `${course.price} ج.م` : "مجاني"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Action */}
          <div className="pt-4 border-t border-gold/10">
            {isTeacher ? (
              <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-[10px] text-center font-ui">
                <span className="block font-bold mb-1">غير مسموح للمعلم بالاشتراك</span>
                <span className="text-sm opacity-80">عذراً، هذه الميزة مخصصة للطلاب فقط. حسابك مسجل كمعلم.</span>
              </div>
            ) : (
              <CheckoutButton courseId={course.id} price={course.price} />
            )}
          </div>
        </div>

        <div className="bg-background/80 p-5 border-t border-gold/10 text-center flex items-center justify-center gap-3">
          <Lock size={16} className="text-muted" />
          <p className="text-xs text-muted font-body leading-relaxed">
            الدفع مؤمن بالكامل عبر بوابة Paymob.<br /> نحن لا نخزن بيانات بطاقتك الائتمانية بأي شكل من الأشكال.
          </p>
        </div>
      </div>
    </main>
  );
}
