"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchApi } from "@/src/lib/api";

type TestLevel = "COURSE" | "MODULE" | "LESSON";
type CertCondition = "SCORE" | "TOP_N" | "ALL";

export function CreateExamForm({ courses }: { courses: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);
  const [testLevel, setTestLevel] = useState<TestLevel>("MODULE");
  const [moduleId, setModuleId] = useState("");
  const [lessonId, setLessonId] = useState("");

  const [hasCertificate, setHasCertificate] = useState(false);
  const [certificateCondition, setCertificateCondition] = useState<CertCondition>("SCORE");
  const [certificateConditionValue, setCertificateConditionValue] = useState("80");

  const selectedCourse = courses.find((c) => c.id === courseId);
  const modules = selectedCourse?.modules || [];
  const selectedModule = modules.find((m: any) => m.id === moduleId);
  const lessons = selectedModule?.lessons || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      toast.error("يرجى إدخال عنوان الاختبار");
      return;
    }
    if (!isStandalone && !courseId) {
      toast.error("يرجى اختيار الكورس أو تحديد أنه اختبار مستقل");
      return;
    }
    if (!isStandalone && (testLevel === "MODULE" || testLevel === "LESSON") && !moduleId) {
      toast.error("يرجى اختيار الوحدة");
      return;
    }
    if (!isStandalone && testLevel === "LESSON" && !lessonId) {
      toast.error("يرجى اختيار الدرس");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("جاري إنشاء الاختبار...");

    try {
      const payload = {
        title,
        isStandalone,
        courseId: isStandalone ? null : courseId,
        moduleId: !isStandalone && testLevel !== "COURSE" ? moduleId : null,
        lessonId: !isStandalone && testLevel === "LESSON" ? lessonId : null,
        hasCertificate,
        certificateCondition: hasCertificate ? certificateCondition : null,
        certificateConditionValue: hasCertificate && certificateCondition !== "ALL" ? certificateConditionValue : null,
      };

      const data = await fetchApi("/teacher/quizzes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("تم إنشاء الاختبار بنجاح!", { id: toastId });
      router.push(`/dashboard/teacher/quizzes/${data.quizId}`);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Association Settings */}
      <div className="space-y-4 p-4 border border-primary/10 rounded-xl bg-surface">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="isStandalone"
            checked={isStandalone}
            onChange={(e) => setIsStandalone(e.target.checked)}
            className="w-4 h-4 text-gold border-primary/20 rounded focus:ring-gold"
          />
          <label htmlFor="isStandalone" className="text-sm font-ui text-primary font-bold">
            اختبار مجاني مستقل (يُعرض في الصفحة الرئيسية)
          </label>
        </div>

        {!isStandalone && (
          <>
            <div>
              <label className="block text-sm font-bold text-primary mb-2 font-ui">الكورس</label>
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setModuleId("");
              setLessonId("");
            }}
            required
            className="w-full bg-surface border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
          >
            <option value="" disabled>اختر الكورس...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-2 font-ui">مستوى الاختبار</label>
          <select
            value={testLevel}
            onChange={(e) => {
              setTestLevel(e.target.value as TestLevel);
              if (e.target.value === "COURSE") {
                setModuleId("");
                setLessonId("");
              }
              if (e.target.value === "MODULE") {
                setLessonId("");
              }
            }}
            className="w-full bg-surface border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
          >
            <option value="COURSE">اختبار شامل للكورس</option>
            <option value="MODULE">اختبار على وحدة/فصل معين</option>
            <option value="LESSON">اختبار على درس معين</option>
          </select>
        </div>

        {testLevel !== "COURSE" && (
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">الوحدة / الفصل</label>
            <select
              value={moduleId}
              onChange={(e) => {
                setModuleId(e.target.value);
                setLessonId("");
              }}
              required
              disabled={!courseId || modules.length === 0}
              className="w-full bg-surface border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui disabled:opacity-50"
            >
              <option value="" disabled>
                {courseId && modules.length === 0 ? "لا توجد وحدات في هذا الكورس" : "اختر الوحدة..."}
              </option>
              {modules
                .sort((a: any, b: any) => a.position - b.position)
                .map((m: any) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        )}
          </>
        )}

        {testLevel === "LESSON" && !isStandalone && (
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">الدرس</label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              required={testLevel === "LESSON"}
              disabled={!moduleId || lessons.length === 0}
              className="w-full bg-surface border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui disabled:opacity-50"
            >
              <option value="" disabled>
                {moduleId && lessons.length === 0 ? "لا توجد دروس في هذه الوحدة" : "اختر الدرس..."}
              </option>
              {lessons
                .sort((a: any, b: any) => a.position - b.position)
                .map((l: any) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-2">
        <label className="block text-sm font-bold text-primary mb-2 font-ui">عنوان الاختبار</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: امتحان الشهر الأول"
          required
        />
      </div>

      {/* Certificate Settings */}
      <div className="space-y-4 p-4 border border-primary/10 rounded-xl bg-surface">
        <div className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            id="hasCertificate"
            checked={hasCertificate}
            onChange={(e) => setHasCertificate(e.target.checked)}
            className="w-5 h-5 rounded border-primary/20 text-accent focus:ring-accent"
          />
          <label htmlFor="hasCertificate" className="font-ui font-bold text-primary cursor-pointer">
            تفعيل الشهادة لهذا الاختبار؟
          </label>
        </div>

        {hasCertificate && (
          <div className="pr-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-primary mb-2 font-ui">من يحصل على الشهادة؟</label>
              <select
                value={certificateCondition}
                onChange={(e) => setCertificateCondition(e.target.value as CertCondition)}
                className="w-full bg-surface border-2 border-primary border-opacity-10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-gold transition-colors font-ui text-sm"
              >
                <option value="ALL">جميع من يجتاز الاختبار (درجة النجاح)</option>
                <option value="SCORE">الحاصلون على نسبة معينة أو أعلى</option>
                <option value="TOP_N">أوائل الاختبار (أعلى عدد محدد من الطلاب)</option>
              </select>
            </div>

            {certificateCondition === "SCORE" && (
              <div>
                <label className="block text-sm font-bold text-primary mb-2 font-ui">
                  النسبة المئوية المطلوبة للحصول على الشهادة (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={certificateConditionValue}
                  onChange={(e) => setCertificateConditionValue(e.target.value)}
                  placeholder="مثال: 80"
                  required
                />
              </div>
            )}

            {certificateCondition === "TOP_N" && (
              <div>
                <label className="block text-sm font-bold text-primary mb-2 font-ui">
                  عدد الأوائل الذين سيحصلون على الشهادة
                </label>
                <Input
                  type="number"
                  min="1"
                  value={certificateConditionValue}
                  onChange={(e) => setCertificateConditionValue(e.target.value)}
                  placeholder="مثال: 10 (لأول 10 طلاب)"
                  required
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
        إنشاء ومتابعة الإعدادات
      </Button>
    </form>
  );
}
