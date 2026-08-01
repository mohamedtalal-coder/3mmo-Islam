import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";

export function useCourseForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricingType, setPricingType] = useState<"one_time" | "subscription">("one_time");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gradeId, setGradeId] = useState("");
  
  // New fields
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showOnLandingPage, setShowOnLandingPage] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Simple URL validation
  const isValidUrl = (url: string) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!gradeId) {
      toast.error("لازم تختار المرحلة الدراسية.");
      setLoading(false);
      return;
    }

    if (introVideoUrl && !isValidUrl(introVideoUrl)) {
      toast.error("رابط الفيديو التعريفي غير صحيح.");
      setLoading(false);
      return;
    }

    if (externalLink && !isValidUrl(externalLink)) {
      toast.error("الرابط الخارجي غير صحيح.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("pricingType", pricingType);
    formData.append("gradeId", gradeId);
    formData.append("showOnLandingPage", showOnLandingPage.toString());
    if (introVideoUrl) formData.append("introVideoUrl", introVideoUrl);
    if (externalLink) formData.append("externalLink", externalLink);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    if (attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      const response = await fetchApi("/teacher/courses", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
        headers: {}, 
      });

      if (!response || !response.id) {
        throw new Error("Failed to create course");
      }

      toast.success("تم إنشاء الكورس بنجاح!");
      router.push(`/dashboard/teacher/courses/${response.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error("حصلت مشكلة أثناء إنشاء الكورس.");
    } finally {
      setLoading(false);
    }
  }

  return {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    pricingType, setPricingType,
    thumbnail, setThumbnail,
    gradeId, setGradeId,
    introVideoUrl, setIntroVideoUrl,
    externalLink, setExternalLink,
    attachments, setAttachments,
    showOnLandingPage, setShowOnLandingPage,
    loading,
    handleSubmit,
  };
}
