"use client";

import { Loader2, Settings2, Globe, Type, Phone, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { usePlatformSettingsForm, SettingsData } from "@/src/shared/hooks/usePlatformSettingsForm";
import { Card } from "@/src/shared/components/ui/Card";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

export function PlatformSettingsForm({ initialData }: { initialData: SettingsData | null }) {
  const {
    formData,
    loading,
    handleChange,
    handleImageChange,
    handleSubmit,
  } = usePlatformSettingsForm(initialData);

  return (
    <Card className="p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-primary/10 rounded-[12px] text-primary">
          <Globe size={24} />
        </div>
        <div>
          <h2 className="font-display text-2xl text-primary">محتوى الصفحة الرئيسية</h2>
          <p className="text-muted text-sm font-body">تحكم في النصوص المعروضة للطلاب على واجهة المنصة.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-body">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              label="اسم المعلم"
              type="text"
              name="teacher_name"
              value={formData.teacher_name}
              onChange={handleChange}
              leftIcon={<Type size={16} className="text-muted" />}
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-semibold text-primary mb-1">صورة المعلم (في الواجهة)</label>
            <div className="relative flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-background border border-surfaceBorder rounded-lg px-4 py-2.5 outline-none transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <ImageIcon size={16} className="text-muted" />
              </div>
            </div>
            <p className="text-xs text-muted mt-1">اترك هذا الحقل فارغاً إذا كنت لا تود تغيير الصورة الحالية.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              label="العنوان الرئيسي (Hero Title)"
              type="text"
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              leftIcon={<Type size={16} className="text-muted" />}
            />
          </div>

          <div className="space-y-2">
            <Input
              label="النص الفرعي (Hero Subtitle)"
              type="text"
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              leftIcon={<Type size={16} className="text-muted" />}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-surfaceBorder">
          <h3 className="font-display text-xl text-primary mb-4">وسائل التواصل (اختياري)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Input
                label="رقم الهاتف"
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                dir="ltr"
                leftIcon={<Phone size={16} className="text-muted" />}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                label="رابط فيسبوك"
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                dir="ltr"
                leftIcon={<LinkIcon size={16} className="text-muted" />}
              />
            </div>

            <div className="space-y-2">
              <Input
                label="رقم واتساب"
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+201xxxxxxxxx"
                dir="ltr"
                leftIcon={<Phone size={16} className="text-muted" />}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-surfaceBorder flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="px-10"
            leftIcon={loading ? <Loader2 size={18} className="animate-spin" /> : <Settings2 size={18} />}
          >
            حفظ إعدادات المنصة
          </Button>
        </div>
      </form>
    </Card>
  );
}
