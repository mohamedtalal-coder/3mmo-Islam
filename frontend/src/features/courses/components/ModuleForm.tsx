"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

export function ModuleForm({ courseId, nextPosition }: { courseId: string; nextPosition: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetchApi("/teacher/modules", {
        method: "POST",
        body: JSON.stringify({
          courseId,
          title,
          position: nextPosition,
        }),
      });
    } catch (error) {
      toast.error("حصلت مشكلة أثناء إضافة الوحدة.");
      setLoading(false);
      return;
    }

    toast.success("تم إضافة الوحدة بنجاح!");
    setTitle("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-surface p-4 rounded-xl shadow-sm border border-primary/10 items-start sm:items-center">
      <div className="flex-1 w-full">
        <Input
          type="text"
          required
          placeholder="اسم الوحدة الجديدة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        isLoading={loading}
        size="md"
        className="w-full sm:w-auto"
        leftIcon={!loading && <PlusCircle size={18} />}
      >
        إضافة
      </Button>
    </form>
  );
}
