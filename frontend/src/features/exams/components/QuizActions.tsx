"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { Trash2, Loader2, Edit } from "lucide-react";
import { Modal } from "@/src/shared/components/ui/Modal";

export function QuizActions({ quizId, initialTitle, initialScore }: { quizId: string; initialTitle: string; initialScore: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [passingScore, setPassingScore] = useState(String(initialScore));

  async function handleDelete() {
    if (!confirm("متأكد إنك عايز تمسح الاختبار ده؟")) return;
    setLoading(true);
    try {
      await fetchApi(`/teacher/quizzes/${quizId}`, { method: "DELETE" });
      toast.success("تم مسح الاختبار بنجاح.");
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
      await fetchApi(`/teacher/quizzes/${quizId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          passingScore: Number(passingScore)
        })
      });
      toast.success("تم تعديل الاختبار.");
      setIsEditOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حصلت مشكلة أثناء التعديل.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={loading}
          className="p-1.5 text-muted hover:text-accent transition-colors rounded-md hover:bg-gold/10"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1.5 text-muted hover:text-danger transition-colors rounded-md hover:bg-danger/10"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="تعديل الاختبار">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-ui text-muted">اسم الاختبار</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-ui text-muted">درجة النجاح (%)</label>
            <input
              type="number"
              required
              min={1}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="w-full border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-inverse font-semibold px-6 py-2 rounded-lg hover:bg-primary-hover shadow-sm mt-4 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "حفظ"}
          </button>
        </form>
      </Modal>
    </>
  );
}
