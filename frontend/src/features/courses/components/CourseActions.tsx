"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/src/shared/components/ui/Modal";
import { Loader2, Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { EditCourseForm } from "./EditCourseForm";
import { fetchApi } from "@/src/lib/api";

type CourseData = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  pricing_type: string;
  thumbnail_url: string | null;
  published: boolean;
};

export function CourseActions({ course }: { course: CourseData }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  async function patchCourse(body: Record<string, unknown>) {
    setLoading("patch");
    const toastId = toast.loading("جاري تحديث حالة الكورس...");
    
    try {
      await fetchApi(`/teacher/courses/${course.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      
      toast.success("تم تحديث الكورس بنجاح!", { id: toastId });
      setLoading(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حصلت مشكلة أثناء التحديث.", { id: toastId });
      setLoading(null);
    }
  }

  async function deleteCourse() {
    setLoading("delete");
    const toastId = toast.loading("جاري حذف الكورس...");
    
    try {
      await fetchApi(`/teacher/courses/${course.id}`, { method: "DELETE" });
      
      toast.success("تم حذف الكورس بنجاح!", { id: toastId });
      router.push("/dashboard/teacher/courses");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحذف.", { id: toastId });
      setLoading(null);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!!loading}
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 font-ui text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-primary/10 text-primary hover:border-primary/30 bg-surface shadow-sm disabled:opacity-60"
        >
          <Edit size={16} />
          تعديل التفاصيل
        </button>

        <button
          type="button"
          disabled={!!loading}
          onClick={() => patchCourse({ published: !course.published })}
          className={`flex items-center gap-2 font-ui text-sm font-semibold px-6 py-2 rounded-xl transition-colors disabled:opacity-60 border shadow-sm ${
            course.published
              ? "border-primary/10 text-primary hover:border-primary/30 bg-surface"
              : "bg-primary border-primary text-inverse hover:bg-primary-hover"
          }`}
        >
          {loading === "patch" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : course.published ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
          {course.published ? "إلغاء النشر" : "نشر الكورس"}
        </button>

        <button
          type="button"
          disabled={!!loading}
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 font-ui text-sm text-danger border border-danger/20 px-4 py-2 rounded-xl hover:bg-danger/10 transition-colors disabled:opacity-60 shadow-sm"
        >
          <Trash2 size={16} />
          حذف الكورس
        </button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !loading && setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <p className="mb-6 text-muted">
          هل أنت متأكد من حذف هذا الكورس؟ لن تتمكن من التراجع عن هذا الإجراء وسيتم حذف جميع الدروس والوحدات المرتبطة به.
        </p>
        <div className="flex justify-end gap-3 font-ui text-sm">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={!!loading}
            className="px-6 py-2 rounded-lg border border-primary/10 text-primary hover:bg-surfaceHover transition-colors font-semibold"
          >
            إلغاء
          </button>
          <button
            onClick={deleteCourse}
            disabled={!!loading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-danger text-inverse hover:bg-danger/90 transition-colors shadow-sm font-semibold"
          >
            {loading === "delete" && <Loader2 size={16} className="animate-spin" />}
            نعم، احذف الكورس
          </button>
        </div>
      </Modal>

      <EditCourseForm 
        course={course} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  );
}
