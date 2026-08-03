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
  contact_phone_enabled?: boolean;
  facebook: string;
  facebook_enabled?: boolean;
  whatsapp: string;
  whatsapp_enabled?: boolean;
  instagram_url?: string;
  instagram_enabled?: boolean;
  youtube_url?: string;
  youtube_enabled?: boolean;
  telegram_url?: string;
  telegram_enabled?: boolean;
  twitter_url?: string;
  twitter_enabled?: boolean;
  tiktok_url?: string;
  tiktok_enabled?: boolean;
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
    contact_phone_enabled: initialData?.contact_phone_enabled ?? true,
    facebook: initialData?.facebook || "",
    facebook_enabled: initialData?.facebook_enabled ?? true,
    whatsapp: initialData?.whatsapp || "",
    whatsapp_enabled: initialData?.whatsapp_enabled ?? true,
    instagram_url: initialData?.instagram_url || "",
    instagram_enabled: initialData?.instagram_enabled ?? true,
    youtube_url: initialData?.youtube_url || "",
    youtube_enabled: initialData?.youtube_enabled ?? true,
    telegram_url: initialData?.telegram_url || "",
    telegram_enabled: initialData?.telegram_enabled ?? true,
    twitter_url: initialData?.twitter_url || "",
    twitter_enabled: initialData?.twitter_enabled ?? true,
    tiktok_url: initialData?.tiktok_url || "",
    tiktok_enabled: initialData?.tiktok_enabled ?? true,
  });

  const [teacherImage, setTeacherImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeacherImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) payload.append(key, value as string);
    });
    
    if (teacherImage) {
      payload.append("teacherImage", teacherImage);
    }

    try {
      if (formData.id) {
        await fetchApi(`/teacher/settings/${formData.id}`, {
          method: "PATCH",
          body: payload,
          headers: {}, // let browser set content-type with boundary
        });
      } else {
        await fetchApi(`/teacher/settings`, {
          method: "POST",
          body: payload,
          headers: {}, // let browser set content-type with boundary
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
    handleImageChange,
    handleSubmit,
  };
}
