"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { Modal } from "@/src/shared/components/ui/Modal";

export function ModuleActions({ moduleId, initialTitle }: { moduleId: string; initialTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  async function handleDelete() {
    if (!confirm("متأكد إنك عايز تمسح الوحدة دي؟ كل الدروس اللي فيها هتتمسح.")) return;
    setLoading(true);
    try {
      await fetchApi(`/teacher/modules/${moduleId}`, { method: "DELETE" });
      toast.success("تم مسح الوحدة بنجاح.");
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
      await fetchApi(`/teacher/modules/${moduleId}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      toast.success("تم تعديل اسم الوحدة.");
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={loading}
          className="p-2 text-muted hover:text-accent transition-colors rounded-full hover:bg-gold/10"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-muted hover:text-danger transition-colors rounded-full hover:bg-danger/10"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="تعديل اسم الوحدة">
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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-inverse font-semibold px-6 py-2 rounded-lg hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "حفظ"}
          </button>
        </form>
      </Modal>
    </>
  );
}
