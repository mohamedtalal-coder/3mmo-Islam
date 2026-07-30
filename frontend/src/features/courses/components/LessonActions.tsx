"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, Edit } from "lucide-react";
import { Modal } from "@/src/shared/components/ui/Modal";
import { fetchApi } from "@/src/lib/api";

export function LessonActions({ lessonId, initialTitle }: { lessonId: string; initialTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  async function handleDelete() {
    if (!confirm("متأكد إنك عايز تمسح الدرس ده؟")) return;
    setLoading("delete");
    try {
      await fetchApi(`/teacher/lessons/${lessonId}`, { method: "DELETE" });
      toast.success("تم مسح الدرس بنجاح.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حصلت مشكلة أثناء المسح.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi(`/teacher/lessons/${lessonId}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      toast.success("تم تعديل اسم الدرس.");
      setIsEditOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حصلت مشكلة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={!!loading}
          className="p-1.5 text-muted hover:text-accent transition-colors rounded-md hover:bg-gold/10"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={!!loading}
          className="p-1.5 text-muted hover:text-danger transition-colors rounded-md hover:bg-danger/10"
        >
          {loading === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="تعديل الدرس">
        <form onSubmit={handleEdit} className="space-y-4">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-inverse font-semibold px-6 py-2 rounded-lg hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-60"
          >
            {loading === true ? <Loader2 size={18} className="animate-spin" /> : "حفظ"}
          </button>
        </form>
      </Modal>
    </>
  );
}
