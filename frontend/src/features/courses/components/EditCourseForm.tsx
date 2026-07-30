"use client";

import { Loader2, Upload, X, Video, Link as LinkIcon, FileText } from "lucide-react";
import { Modal } from "@/src/shared/components/ui/Modal";
import { useEditCourseForm, CourseData, CourseAttachment } from "@/src/features/courses/hooks/useEditCourseForm";

export function EditCourseForm({ course, isOpen, onClose }: { course: CourseData, isOpen: boolean, onClose: () => void }) {
  const {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    pricingType, setPricingType,
    thumbnail, setThumbnail,
    existingThumbnailUrl, setExistingThumbnailUrl,
    introVideoUrl, setIntroVideoUrl,
    externalLink, setExternalLink,
    existingAttachments,
    newAttachments, setNewAttachments,
    attachmentsToDelete, setAttachmentsToDelete,
    loading,
    handleSubmit,
  } = useEditCourseForm(course, onClose);

  const handleNewAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments([...newAttachments, ...Array.from(e.target.files)]);
    }
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(newAttachments.filter((_: File, i: number) => i !== index));
  };

  const markExistingForDeletion = (id: string) => {
    if (attachmentsToDelete.includes(id)) {
      setAttachmentsToDelete(attachmentsToDelete.filter((aid: string) => aid !== id));
    } else {
      setAttachmentsToDelete([...attachmentsToDelete, id]);
    }
  };

  const visibleExistingAttachments = existingAttachments.filter(
    (a: CourseAttachment) => !attachmentsToDelete.includes(a.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="تعديل تفاصيل الكورس">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-ui text-muted mb-1 block">اسم الكورس</label>
          <input
            type="text"
            required
            placeholder="اسم الكورس"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-primary/10 rounded-xl px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted"
          />
        </div>

        {/* Thumbnail */}
        <div className="relative h-32 w-full mb-6 mt-4">
          <label className="text-sm font-ui text-muted mb-2 block absolute -top-7">صورة الغلاف</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setThumbnail(e.target.files?.[0] ?? null);
              setExistingThumbnailUrl(null);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`w-full h-full border border-dashed ${thumbnail || existingThumbnailUrl ? 'border-primary/30 text-primary bg-primary/5' : 'border-primary/10 text-muted hover:border-primary/20'} rounded-xl flex flex-col items-center justify-center gap-2 transition-colors relative overflow-hidden bg-surface shadow-sm`}>
            {(existingThumbnailUrl && !thumbnail) && (
              <img src={existingThumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Current thumbnail" />
            )}
            <Upload size={24} className={(thumbnail || existingThumbnailUrl) ? 'text-accent' : 'text-muted'} />
            <span className="font-ui text-sm relative z-10 text-secondary">{thumbnail ? thumbnail.name : existingThumbnailUrl ? "تغيير الصورة الحالية" : "اختر صورة غلاف جديدة"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-ui text-muted mb-1 block">الوصف</label>
          <textarea
            placeholder="وصف مختصر عن الكورس"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-primary/10 rounded-xl px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted resize-none"
          />
        </div>

        {/* Intro Video URL */}
        <div className="space-y-2">
          <label className="text-sm font-ui text-muted flex items-center gap-2">
            <Video size={16} />
            فيديو تعريفي (اختياري)
          </label>
          <input
            type="url"
            placeholder="رابط يوتيوب أو فيميو"
            value={introVideoUrl}
            onChange={(e) => setIntroVideoUrl(e.target.value)}
            dir="ltr"
            className="w-full border border-primary/10 rounded-xl px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted text-left"
          />
        </div>

        {/* External Link */}
        <div className="space-y-2">
          <label className="text-sm font-ui text-muted flex items-center gap-2">
            <LinkIcon size={16} />
            رابط خارجي (اختياري)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            dir="ltr"
            className="w-full border border-primary/10 rounded-xl px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted text-left"
          />
        </div>

        {/* Existing Attachments */}
        {visibleExistingAttachments.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-ui text-muted block">المرفقات الحالية</label>
            {visibleExistingAttachments.map((att: CourseAttachment) => (
              <div key={att.id} className="flex items-center justify-between p-3 bg-surface border border-primary/5 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={18} className="text-gold flex-shrink-0" />
                  <span className="text-sm font-ui text-primary truncate" dir="ltr">{att.file_name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => markExistingForDeletion(att.id)}
                  className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Attachments Upload */}
        <div className="space-y-2">
          <label className="text-sm font-ui text-muted block">إضافة مرفقات جديدة</label>
          <div className="relative w-full">
            <input
              type="file"
              multiple
              onChange={handleNewAttachments}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full py-3 border-2 border-dashed border-primary/10 rounded-lg flex items-center justify-center gap-2 text-muted hover:border-gold/50 transition-colors text-sm font-ui">
              <FileText size={18} />
              اضغط لإضافة ملفات
            </div>
          </div>
          {newAttachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {newAttachments.map((file: File, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface border border-primary/5 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={18} className="text-gold flex-shrink-0" />
                    <span className="text-sm font-ui text-primary truncate" dir="ltr">{file.name}</span>
                    <span className="text-xs text-muted flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewAttachment(idx)}
                    className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex gap-3 font-ui text-sm mb-6 mt-2">
          <button
            type="button"
            onClick={() => setPricingType("one_time")}
            className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${
              pricingType === "one_time"
                ? "bg-primary text-inverse font-bold border-primary shadow-sm"
                : "border-primary/10 text-muted hover:border-primary/30 hover:text-primary bg-surface"
            }`}
          >
            دفعة واحدة
          </button>
          <button
            type="button"
            onClick={() => setPricingType("subscription")}
            className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${
              pricingType === "subscription"
                ? "bg-primary text-inverse font-bold border-primary shadow-sm"
                : "border-primary/10 text-muted hover:border-primary/30 hover:text-primary bg-surface"
            }`}
          >
            اشتراك شهري
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-ui text-muted mb-1 block">السعر</label>
          <input
            type="number"
            required
            min={0}
            placeholder="السعر بالجنيه"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-primary/10 rounded-xl px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 font-ui text-sm mt-8 pt-4 border-t border-primary/5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-primary/10 text-secondary hover:bg-surfaceHover transition-colors font-semibold"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-inverse font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            حفظ التغييرات
          </button>
        </div>
      </form>
    </Modal>
  );
}
