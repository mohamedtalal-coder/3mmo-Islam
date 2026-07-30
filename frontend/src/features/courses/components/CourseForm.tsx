"use client";

import { Loader2, Upload, X, Link as LinkIcon, Video, FileText } from "lucide-react";
import { useCourseForm } from "@/src/features/courses/hooks/useCourseForm";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

export function CourseForm({ grades = [] }: { grades?: any[] }) {
  const {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    pricingType, setPricingType,
    thumbnail, setThumbnail,
    gradeId, setGradeId,
    introVideoUrl, setIntroVideoUrl,
    externalLink, setExternalLink,
    attachments, setAttachments,
    loading, handleSubmit,
  } = useCourseForm();

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-8 rounded-xl shadow-sm border border-primary border-opacity-10">
        
        {/* Basic Info Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-display text-primary border-b border-primary/10 pb-2">المعلومات الأساسية</h2>
          
          <div className="space-y-1">
            <select
              required
              value={gradeId}
              onChange={(e) => setGradeId(e.target.value)}
              className="input-field w-full"
            >
              <option value="" disabled>اختر المرحلة الدراسية</option>
              {grades.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Input
              type="text"
              required
              placeholder="اسم الكورس"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <textarea
              placeholder="وصف مختصر عن الكورس"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-primary/10 rounded-lg px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors placeholder:text-muted/40 resize-none hover:bg-surfaceHover"
            />
          </div>

          <div className="relative h-40 w-full">
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full h-full border-2 border-dashed ${thumbnail ? 'border-gold text-accent bg-gold/5' : 'border-primary border-opacity-10 text-muted hover:border-gold/50'} rounded-lg flex flex-col items-center justify-center gap-2 transition-colors`}>
              <Upload size={24} className={thumbnail ? 'text-accent' : 'text-muted'} />
              <span className="font-ui text-sm">{thumbnail ? thumbnail.name : "اختر صورة غلاف للكورس (إجباري)"}</span>
            </div>
          </div>
        </div>

        {/* Media & Links Section */}
        <div className="space-y-6 pt-6 border-t border-primary/5">
          <h2 className="text-xl font-display text-primary border-b border-primary/10 pb-2">الوسائط والروابط</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-ui text-muted flex items-center gap-2">
              <Video size={16} />
              فيديو تعريفي (اختياري)
            </label>
            <Input
              type="url"
              placeholder="رابط يوتيوب أو فيميو (YouTube / Vimeo)"
              value={introVideoUrl}
              onChange={(e) => setIntroVideoUrl(e.target.value)}
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-ui text-muted flex items-center gap-2">
              <LinkIcon size={16} />
              رابط خارجي (اختياري - جروب واتساب/تليجرام)
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              dir="ltr"
              className="text-left"
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div className="space-y-4 pt-6 border-t border-primary/5">
          <h2 className="text-xl font-display text-primary border-b border-primary/10 pb-2">المرفقات الإضافية</h2>
          <p className="text-xs text-muted font-ui">يمكنك رفع ملفات PDF، مذكرات، أو أي ملفات إضافية للكورس (اختياري).</p>
          
          <div className="relative w-full">
            <input
              type="file"
              multiple
              onChange={handleAttachmentUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full py-4 border-2 border-dashed border-primary/10 rounded-lg flex flex-col items-center justify-center gap-2 text-muted hover:border-gold/50 transition-colors bg-surfaceHover/50">
              <FileText size={24} />
              <span className="font-ui text-sm">اضغط هنا أو اسحب الملفات لإضافتها</span>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2 mt-4">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface border border-primary/5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={18} className="text-gold flex-shrink-0" />
                    <span className="text-sm font-ui text-primary truncate" dir="ltr">{file.name}</span>
                    <span className="text-xs text-muted flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-6 pt-6 border-t border-primary/5">
          <h2 className="text-xl font-display text-primary border-b border-primary/10 pb-2">التسعير والنشر</h2>
          
          <div className="flex gap-3 font-ui text-sm">
            <button
              type="button"
              onClick={() => setPricingType("one_time")}
              className={`flex-1 py-3 rounded-lg border transition-all duration-300 ${
                pricingType === "one_time"
                  ? "bg-primary text-inverse font-bold border-primary shadow-sm"
                  : "border-primary/10 bg-surface hover:bg-surfaceHover text-muted hover:text-primary"
              }`}
            >
              دفعة واحدة
            </button>
            <button
              type="button"
              onClick={() => setPricingType("subscription")}
              className={`flex-1 py-3 rounded-lg border transition-all duration-300 ${
                pricingType === "subscription"
                  ? "bg-primary text-inverse font-bold border-primary shadow-sm"
                  : "border-primary/10 bg-surface hover:bg-surfaceHover text-muted hover:text-primary"
              }`}
            >
              اشتراك شهري
            </button>
          </div>

          <div className="space-y-1">
            <Input
              type="number"
              required
              min={0}
              placeholder="السعر بالجنيه"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full mt-8"
            size="lg"
          >
            نشر الكورس
          </Button>
        </div>
      </form>
    </div>
  );
}
