import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";

export type SettingsData = {
  id?: string;
  teacher_name: string;
  hero_title: string;
  hero_subtitle: string;
  contact_phone: string;
  facebook: string;
  whatsapp: string;
};

export function usePlatformSettingsForm(initialData: SettingsData | null) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Default fallbacks if empty
  const [formData, setFormData] = useState<SettingsData>({
    id: initialData?.id || undefined,
    teacher_name: initialData?.teacher_name || "أستاذ المادة",
    hero_title: initialData?.hero_title || "إبدأ رحلتك التعليمية اليوم!",
    hero_subtitle: initialData?.hero_subtitle || "منصة متكاملة لبيع الدورات التعليمية للمعلمين المصريين.",
    contact_phone: initialData?.contact_phone || "",
    facebook: initialData?.facebook || "",
    whatsapp: initialData?.whatsapp || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.id) {
        // Update existing settings
        await fetchApi(`/teacher/settings/${formData.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
      } else {
        // Create new settings row
        await fetchApi(`/teacher/settings`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }

      toast.success("تم تحديث إعدادات المنصة بنجاح!");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error("حدث خطأ أثناء حفظ الإعدادات.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
  };
}
