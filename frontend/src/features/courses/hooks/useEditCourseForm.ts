import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";

export type CourseAttachment = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
};

export type CourseData = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  pricing_type: string;
  thumbnail_url: string | null;
  intro_video_url?: string | null;
  external_link?: string | null;
  attachments?: CourseAttachment[];
};

export function useEditCourseForm(course: CourseData, onClose: () => void) {
  const router = useRouter();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [price, setPrice] = useState(course.price.toString());
  const [pricingType, setPricingType] = useState<"one_time" | "subscription">(course.pricing_type as any || "one_time");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(course.thumbnail_url);
  
  const [introVideoUrl, setIntroVideoUrl] = useState(course.intro_video_url || "");
  const [externalLink, setExternalLink] = useState(course.external_link || "");
  
  const [existingAttachments, setExistingAttachments] = useState<CourseAttachment[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<string[]>([]); // Array of attachment IDs

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course.attachments) {
      setExistingAttachments(course.attachments.map((a: any) => ({
        id: a.id,
        file_name: a.fileName,
        file_url: a.fileUrl,
        file_size: a.fileSize
      })));
    }
  }, [course.attachments]);

  const isValidUrl = (url: string) => {
    if (!url) return true;
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
    if (title) formData.append("title", title);
    if (description !== null) formData.append("description", description);
    formData.append("price", price);
    formData.append("pricingType", pricingType);
    if (introVideoUrl) formData.append("introVideoUrl", introVideoUrl);
    if (externalLink) formData.append("externalLink", externalLink);
    
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    
    if (attachmentsToDelete.length > 0) {
      attachmentsToDelete.forEach(id => formData.append("attachmentsToDelete", id));
    }

    if (newAttachments.length > 0) {
      newAttachments.forEach(file => formData.append("attachments", file));
    }

    try {
      const res = await fetchApi(`/teacher/courses/${course.id}`, {
        method: "PATCH",
        body: formData,
        headers: {}, // let browser set boundary
      });
      
      toast.success("تم تحديث الكورس بنجاح!");
      router.refresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "حصلت مشكلة أثناء التحديث.");
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
    existingThumbnailUrl, setExistingThumbnailUrl,
    introVideoUrl, setIntroVideoUrl,
    externalLink, setExternalLink,
    existingAttachments, setExistingAttachments,
    newAttachments, setNewAttachments,
    attachmentsToDelete, setAttachmentsToDelete,
    loading,
    handleSubmit,
  };
}
