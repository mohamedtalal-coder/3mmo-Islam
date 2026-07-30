"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Users, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/src/shared/components/ui/Card";
import { Input } from "@/src/shared/components/ui/Input";
import { Badge } from "@/src/shared/components/ui/Badge";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchApi } from "@/src/lib/api";

type CourseOption = { id: string; title: string };

export type EnrollmentStatus = "active" | "suspended" | "completed";
export type AccountStatus = "active" | "disabled" | "archived";

export type TeacherStudentRow = {
  studentId: string;
  fullName: string;
  phone: string | null;
  accountStatus: AccountStatus;
  gradeName: string | null;
  enrolledCourses: number;
  avgProgress: number;
  lastActivityAt: string | null;
  enrollments: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    status: EnrollmentStatus;
    progressPercentage: number;
    expiresAt: string | null;
    createdAt: string;
    lastViewedAt: string | null;
  }>;
};

const enrollmentLabels: Record<string, string> = {
  active: "نشط",
  suspended: "موقوف",
  completed: "مكتمل",
};

const accountLabels: Record<string, string> = {
  active: "نشط",
  disabled: "معطل",
  archived: "مؤرشف",
};

function accountVariant(status: string): "success" | "danger" | "outline" | "warning" {
  if (status === "active") return "success";
  if (status === "disabled") return "danger";
  return "outline";
}

export function StudentsManagementClient({
  initialStudents,
  courses,
}: {
  initialStudents: TeacherStudentRow[];
  courses: CourseOption[];
}) {
  const [students, setStudents] = useState(initialStudents);
  const [q, setQ] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [enrollmentStatus, setEnrollmentStatus] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [pending, startTransition] = useTransition();

  async function refresh(next?: {
    q?: string;
    courseId?: string;
    enrollmentStatus?: string;
    accountStatus?: string;
  }) {
    const params = new URLSearchParams();
    const query = next?.q ?? q;
    const course = next?.courseId ?? courseId;
    const enr = next?.enrollmentStatus ?? enrollmentStatus;
    const acc = next?.accountStatus ?? accountStatus;

    if (query.trim()) params.set("q", query.trim());
    if (course !== "all") params.set("courseId", course);
    if (enr !== "all") params.set("enrollmentStatus", enr);
    if (acc !== "all") params.set("accountStatus", acc);

    startTransition(async () => {
      try {
        const json = await fetchApi(`/teacher/students?${params.toString()}`);
        setStudents(json.students ?? []);
      } catch (err: any) {
        toast.error(err.message || "فشل تحديث القائمة");
      }
    });
  }

  const stats = useMemo(() => {
    const total = students.length;
    const suspended = students.filter((s) =>
      s.enrollments.some((e) => e.status === "suspended")
    ).length;
    const disabled = students.filter((s) => s.accountStatus === "disabled").length;
    return { total, suspended, disabled };
  }, [students]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-primary mb-2">إدارة الطلاب</h1>
          <p className="font-body text-muted text-sm">
            تابع اشتراكات طلابك وتقدمهم وحالة الدفع، وأوقف أو فعّل الوصول عند الحاجة.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Card className="px-4 py-3 text-center min-w-[100px]">
            <div className="font-ui text-xs text-muted mb-1">الطلاب</div>
            <div className="font-display text-2xl text-primary">{stats.total}</div>
          </Card>
          <Card className="px-4 py-3 text-center min-w-[100px]">
            <div className="font-ui text-xs text-muted mb-1">موقوفون</div>
            <div className="font-display text-2xl text-warning">{stats.suspended}</div>
          </Card>
          <Card className="px-4 py-3 text-center min-w-[100px]">
            <div className="font-ui text-xs text-muted mb-1">حسابات معطّلة</div>
            <div className="font-display text-2xl text-danger">{stats.disabled}</div>
          </Card>
        </div>
      </div>

      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="بحث بالاسم أو الهاتف..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") refresh({ q: (e.target as HTMLInputElement).value });
            }}
            leftIcon={<Search size={16} />}
          />

          <select
            className="h-11 w-full border border-primary/10 rounded-lg font-body bg-surface text-primary text-sm px-4 focus:outline-none focus:border-gold/50"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              refresh({ courseId: e.target.value });
            }}
          >
            <option value="all">كل الكورسات</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            className="h-11 w-full border border-primary/10 rounded-lg font-body bg-surface text-primary text-sm px-4 focus:outline-none focus:border-gold/50"
            value={enrollmentStatus}
            onChange={(e) => {
              setEnrollmentStatus(e.target.value);
              refresh({ enrollmentStatus: e.target.value });
            }}
          >
            <option value="all">كل حالات الاشتراك</option>
            <option value="active">نشط</option>
            <option value="suspended">موقوف</option>
            <option value="completed">مكتمل</option>
          </select>

          <div className="flex gap-2">
            <select
              className="h-11 w-full border border-primary/10 rounded-lg font-body bg-surface text-primary text-sm px-4 focus:outline-none focus:border-gold/50"
              value={accountStatus}
              onChange={(e) => {
                setAccountStatus(e.target.value);
                refresh({ accountStatus: e.target.value });
              }}
            >
              <option value="all">كل حالات الحساب</option>
              <option value="active">نشط</option>
              <option value="disabled">معطل</option>
              <option value="archived">مؤرشف</option>
            </select>
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              isLoading={pending}
              onClick={() => refresh()}
            >
              بحث
            </Button>
          </div>
        </div>
      </Card>

      {students.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center border-dashed">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Users size={32} />
          </div>
          <h3 className="font-display text-2xl text-primary mb-2">لا يوجد طلاب</h3>
          <p className="font-body text-muted max-w-md">
            لما يسجّل طلاب في كورساتك، هتقدر تتابع تقدمهم وتدير اشتراكاتهم من هنا.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {students.map((student) => (
            <Card key={student.studentId} hoverable className="p-5 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-ui font-bold text-xl text-primary truncate">
                      {student.fullName}
                    </h3>
                    <Badge variant={accountVariant(student.accountStatus)}>
                      {accountLabels[student.accountStatus] || student.accountStatus}
                    </Badge>
                    {student.gradeName && (
                      <Badge variant="outline">{student.gradeName}</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-sm text-muted mb-3">
                    {student.phone && <span>{student.phone}</span>}
                    <span>{student.enrolledCourses} كورس</span>
                    <span>متوسط التقدم {student.avgProgress}%</span>
                    {student.lastActivityAt && (
                      <span>
                        آخر نشاط{" "}
                        {new Date(student.lastActivityAt).toLocaleDateString("ar-EG")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {student.enrollments.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-ui px-2.5 py-1 rounded-md"
                      >
                        <span className="truncate max-w-[160px]">{e.courseTitle}</span>
                        <span className="text-muted">
                          {enrollmentLabels[e.status] || e.status} · {e.progressPercentage}%
                        </span>
                      </span>
                    ))}
                    {student.enrollments.length > 3 && (
                      <span className="text-xs text-muted font-ui self-center">
                        +{student.enrollments.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/dashboard/teacher/students/${student.studentId}`}>
                  <Button variant="primary" leftIcon={<ChevronLeft size={16} />}>
                    عرض التفاصيل
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
