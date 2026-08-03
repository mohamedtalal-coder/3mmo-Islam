"use client";

import { Loader2, Settings2, Globe, Type, Phone, Link as LinkIcon, Image as ImageIcon, Instagram, Youtube, Twitter, Send } from "lucide-react";
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
          <h3 className="font-display text-xl text-primary mb-4">وسائل التواصل</h3>
          <p className="text-sm text-muted mb-6">قم بإضافة روابط وسائل التواصل الخاصة بك وتفعيل أو تعطيل أي منها ليظهر على المنصة.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phone */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">رقم الهاتف</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.contact_phone_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="contact_phone_enabled" checked={formData.contact_phone_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="01xxxxxxxxx" dir="ltr" leftIcon={<Phone size={16} className="text-muted" />} />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">رقم واتساب</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.whatsapp_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="whatsapp_enabled" checked={formData.whatsapp_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+201xxxxxxxxx" dir="ltr" leftIcon={<Phone size={16} className="text-muted" />} />
            </div>

            {/* Facebook */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">فيسبوك</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.facebook_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="facebook_enabled" checked={formData.facebook_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/..." dir="ltr" leftIcon={<LinkIcon size={16} className="text-muted" />} />
            </div>

            {/* Instagram */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">انستجرام</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.instagram_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="instagram_enabled" checked={formData.instagram_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." dir="ltr" leftIcon={<Instagram size={16} className="text-muted" />} />
            </div>

            {/* YouTube */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">يوتيوب</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.youtube_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="youtube_enabled" checked={formData.youtube_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="youtube_url" value={formData.youtube_url} onChange={handleChange} placeholder="https://youtube.com/..." dir="ltr" leftIcon={<Youtube size={16} className="text-muted" />} />
            </div>

            {/* Twitter */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">تويتر (X)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.twitter_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="twitter_enabled" checked={formData.twitter_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} placeholder="https://twitter.com/..." dir="ltr" leftIcon={<Twitter size={16} className="text-muted" />} />
            </div>

            {/* Telegram */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">تيليجرام</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.telegram_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="telegram_enabled" checked={formData.telegram_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="telegram_url" value={formData.telegram_url} onChange={handleChange} placeholder="https://t.me/..." dir="ltr" leftIcon={<Send size={16} className="text-muted" />} />
            </div>

            {/* TikTok */}
            <div className="space-y-2 p-4 bg-surface rounded-xl border border-surfaceBorder">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-primary">تيك توك</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{formData.tiktok_enabled ? "مفعل" : "معطل"}</span>
                  <input type="checkbox" name="tiktok_enabled" checked={formData.tiktok_enabled} onChange={handleChange} className="w-4 h-4 accent-accent" />
                </div>
              </div>
              <Input type="url" name="tiktok_url" value={formData.tiktok_url} onChange={handleChange} placeholder="https://tiktok.com/@..." dir="ltr" leftIcon={<LinkIcon size={16} className="text-muted" />} />
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
