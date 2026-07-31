"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { PlusCircle, Loader2, Upload } from "lucide-react";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

export function LessonForm({ moduleId, nextPosition }: { moduleId: string; nextPosition: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("اسم الدرس مطلوب.");
      return;
    }
    if (!videoUrl) {
      toast.error("لازم تدخل رابط الفيديو.");
      return;
    }
    try {
      new URL(videoUrl);
    } catch {
      toast.error("رابط الفيديو غير صحيح.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("جاري إضافة الدرس...");

    try {
      await fetchApi("/teacher/lessons", {
        method: "POST",
        body: JSON.stringify({
          moduleId,
          title,
          position: nextPosition,
          videoUrl,
        }),
      });

      toast.success("تم إضافة الدرس بنجاح!", { id: toastId });
      setTitle("");
      setVideoUrl("");
      setLoading(false);
      
      router.refresh();
    } catch (err) {
      toast.error("حدث خطأ في الاتصال بالخادم.", { id: toastId });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mt-4 pt-4 border-t border-primary border-opacity-10 bg-surface text-primary p-4 rounded-xl shadow-sm">
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          required
          placeholder="اسم الدرس"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          type="text"
          required
          placeholder="رابط فيديو Vimeo (مثال: https://vimeo.com/123456789)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          dir="ltr"
          className="text-left"
        />
      </div>

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-4"
        size="md"
        leftIcon={!loading && <PlusCircle size={18} />}
      >
        {loading ? "جاري الإضافة..." : "إضافة الدرس"}
      </Button>
    </form>
  );
}
