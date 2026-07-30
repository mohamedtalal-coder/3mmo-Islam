"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteExamButton({ examId }: { examId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا الاختبار؟")) {
      return;
    }

    setIsDeleting(true);
    try {
      await fetchApi(`/teacher/quizzes/${examId}`, {
        method: "DELETE",
      });
      toast.success("تم حذف الاختبار بنجاح");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-danger border-danger hover:bg-danger/10"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </Button>
  );
}
