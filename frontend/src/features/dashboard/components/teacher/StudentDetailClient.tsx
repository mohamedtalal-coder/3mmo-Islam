"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Ban, CheckCircle2, PauseCircle, PlayCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/src/shared/components/ui/Card";
import { Badge } from "@/src/shared/components/ui/Badge";
import { Button } from "@/src/shared/components/ui/Button";

import { fetchApi } from "@/src/lib/api";

type Detail = {
  profile: {
    id: string;
    fullName: string;
    phone: string | null;
    accountStatus: "active" | "disabled" | "archived";
    lastLoginAt: string | null;
    averageScore: number;
    totalStudyTimeSeconds: number;
    createdAt: string;
    gradeName: string | null;
  };
  enrollments: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    price: number;
    status: "active" | "suspended" | "completed";
    progressPercentage: number;
    expiresAt: string | null;
    createdAt: string;
    lastViewedAt: string | null;
  }>;
  payments: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  quizAttempts: Array<{
    id: string;
    score: number;
    passed: boolean;
    submittedAt: string;
    quizTitle: string;
    courseId: string;
  }>;
};

const paymentLabels: Record<string, string> = {
  paid: "مدفوع",
  pending: "قيد الانتظار",
  failed: "فشل",
};

function paymentVariant(status: string): "success" | "warning" | "danger" | "outline" {
  if (status === "paid") return "success";
  if (status === "pending") return "warning";
  if (status === "failed") return "danger";
  return "outline";
}

export function StudentDetailClient({ initial }: { initial: Detail }) {
  const [detail, setDetail] = useState(initial);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function setEnrollmentStatus(
    enrollmentId: string,
    status: "active" | "suspended" | "completed"
  ) {
    setLoadingKey(`enr-${enrollmentId}-${status}`);
    const toastId = toast.loading("جاري تحديث الاشتراك...");
    try {
      await fetchApi(
        `/teacher/students/${detail.profile.id}/enrollments/${enrollmentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setDetail((prev) => ({
        ...prev,
        enrollments: prev.enrollments.map((e) =>
          e.id === enrollmentId ? { ...e, status } : e
        ),
      }));
      toast.success("تم تحديث حالة الاشتراك", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "فشل التحديث", { id: toastId });
    } finally {
      setLoadingKey(null);
    }
  }

  async function setAccountStatus(accountStatus: "active" | "disabled") {
    setLoadingKey(`acc-${accountStatus}`);
    const toastId = toast.loading("جاري تحديث الحساب...");
    try {
      await fetchApi(`/teacher/students/${detail.profile.id}`, {
        method: "PATCH",
        body: JSON.stringify({ accountStatus }),
      });

      setDetail((prev) => ({
        ...prev,
        profile: { ...prev.profile, accountStatus },
      }));
      toast.success(
        accountStatus === "disabled" ? "تم تعطيل الحساب" : "تم تفعيل الحساب",
        { id: toastId }
      );
    } catch (err: any) {
      toast.error(err.message || "فشل التحديث", { id: toastId });
    } finally {
      setLoadingKey(null);
    }
  }

  async function resetDevices() {
    if (!confirm("هل أنت متأكد من إعادة ضبط الأجهزة لهذا الطالب؟ سيتمكن من تسجيل الدخول من جهاز جديد.")) return;
    setLoadingKey("reset-devices");
    const toastId = toast.loading("جاري إعادة ضبط الأجهزة...");
    try {
      await fetchApi(`/teacher/students/${detail.profile.id}/reset-devices`, {
        method: "POST",
      });
      toast.success("تم إعادة ضبط الأجهزة بنجاح", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "فشل إعادة ضبط الأجهزة", { id: toastId });
    } finally {
      setLoadingKey(null);
    }
  }

  const { profile } = detail;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/teacher/students"
          className="inline-flex items-center gap-2 font-ui text-sm text-muted hover:text-primary w-fit"
        >
          <ArrowRight size={16} />
          العودة للطلاب
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="font-display text-3xl text-primary">{profile.fullName}</h1>
              <Badge
                variant={
                  profile.accountStatus === "active"
                    ? "success"
                    : profile.accountStatus === "disabled"
                      ? "danger"
                      : "outline"
                }
              >
                {profile.accountStatus === "active"
                  ? "حساب نشط"
                  : profile.accountStatus === "disabled"
                    ? "حساب معطل"
                    : "مؤرشف"}
              </Badge>
              {profile.gradeName && <Badge variant="outline">{profile.gradeName}</Badge>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-sm text-muted">
              {profile.phone && <span>{profile.phone}</span>}
              <span>
                انضم {new Date(profile.createdAt).toLocaleDateString("ar-EG")}
              </span>
              {profile.lastLoginAt && (
                <span>
                  آخر دخول {new Date(profile.lastLoginAt).toLocaleDateString("ar-EG")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.accountStatus === "disabled" ? (
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 size={16} />}
                isLoading={loadingKey === "acc-active"}
                onClick={() => setAccountStatus("active")}
              >
                تفعيل الحساب
              </Button>
            ) : (
              <Button
                variant="danger"
                leftIcon={<Ban size={16} />}
                isLoading={loadingKey === "acc-disabled"}
                onClick={() => setAccountStatus("disabled")}
              >
                تعطيل الحساب
              </Button>
            )}
            <Button
              variant="outline"
              leftIcon={<Smartphone size={16} />}
              isLoading={loadingKey === "reset-devices"}
              onClick={resetDevices}
            >
              إعادة ضبط الأجهزة
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <div className="font-ui text-xs text-muted mb-1">الكورسات</div>
          <div className="font-display text-3xl text-primary">{detail.enrollments.length}</div>
        </Card>
        <Card className="p-5 text-center">
          <div className="font-ui text-xs text-muted mb-1">متوسط التقدم</div>
          <div className="font-display text-3xl text-primary">
            {detail.enrollments.length
              ? Math.round(
                  detail.enrollments.reduce((s, e) => s + e.progressPercentage, 0) /
                    detail.enrollments.length
                )
              : 0}
            %
          </div>
        </Card>
        <Card className="p-5 text-center">
          <div className="font-ui text-xs text-muted mb-1">متوسط درجات الاختبارات</div>
          <div className="font-display text-3xl text-primary">
            {detail.quizAttempts.length
              ? Math.round(
                  detail.quizAttempts.reduce((s, a) => s + a.score, 0) /
                    detail.quizAttempts.length
                )
              : profile.averageScore || 0}
            %
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-primary">الاشتراكات</h2>
        <div className="grid grid-cols-1 gap-4">
          {detail.enrollments.map((e) => (
            <Card key={e.id} className="p-5 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-ui font-bold text-lg text-primary">{e.courseTitle}</h3>
                    <Badge
                      variant={
                        e.status === "active"
                          ? "success"
                          : e.status === "suspended"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {e.status === "active"
                        ? "نشط"
                        : e.status === "suspended"
                          ? "موقوف"
                          : "مكتمل"}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-ui text-muted mb-1">
                      <span>التقدم</span>
                      <span>{e.progressPercentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, e.progressPercentage))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-sm text-muted">
                    <span>السعر {e.price} ج.م</span>
                    <span>
                      تاريخ الاشتراك {new Date(e.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                    {e.lastViewedAt && (
                      <span>
                        آخر مشاهدة {new Date(e.lastViewedAt).toLocaleDateString("ar-EG")}
                      </span>
                    )}
                    {e.expiresAt && (
                      <span>
                        ينتهي {new Date(e.expiresAt).toLocaleDateString("ar-EG")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {e.status === "suspended" ? (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<PlayCircle size={16} />}
                      isLoading={loadingKey === `enr-${e.id}-active`}
                      onClick={() => setEnrollmentStatus(e.id, "active")}
                    >
                      إعادة تفعيل
                    </Button>
                  ) : e.status !== "completed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<PauseCircle size={16} />}
                      isLoading={loadingKey === `enr-${e.id}-suspended`}
                      onClick={() => setEnrollmentStatus(e.id, "suspended")}
                    >
                      إيقاف الاشتراك
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-primary">المدفوعات</h2>
        {detail.payments.length === 0 ? (
          <Card className="p-6 text-center text-muted font-body text-sm">لا توجد مدفوعات</Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {detail.payments.map((p) => (
              <Card key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-ui font-bold text-primary mb-1">{p.courseTitle}</div>
                  <div className="font-body text-sm text-muted">
                    {new Date(p.createdAt).toLocaleDateString("ar-EG")} · {p.amount} ج.م
                  </div>
                </div>
                <Badge variant={paymentVariant(p.status)}>
                  {paymentLabels[p.status] || p.status}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-primary">نتائج الاختبارات</h2>
        {detail.quizAttempts.length === 0 ? (
          <Card className="p-6 text-center text-muted font-body text-sm">
            لا توجد محاولات اختبار بعد
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {detail.quizAttempts.map((a) => (
              <Card key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-ui font-bold text-primary mb-1">{a.quizTitle}</div>
                  <div className="font-body text-sm text-muted">
                    {new Date(a.submittedAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-ui font-bold text-primary">{a.score}%</span>
                  <Badge variant={a.passed ? "success" : "danger"}>
                    {a.passed ? "ناجح" : "راسب"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
