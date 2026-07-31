"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";
import { Card } from "@/src/shared/components/ui/Card";
import { fetchApi } from "@/src/lib/api";

export function ExamSettingsForm({ exam, onUpdate }: { exam: any, onUpdate: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: exam.title || "",
    description: exam.description || "",
    instructions: exam.instructions || "",
    durationMinutes: exam.durationMinutes || "",
    passingScore: exam.passingScore || 60,
    maxAttempts: exam.maxAttempts || 1,
    shuffleQuestions: exam.shuffleQuestions || false,
    shuffleAnswers: exam.shuffleAnswers || false,
    showResultsImmediately: exam.showResultsImmediately ?? true,
    showCorrectAnswers: exam.showCorrectAnswers ?? true,
    status: exam.status || "draft",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("عنوان الاختبار مطلوب.");
      return;
    }
    if (formData.passingScore < 1 || formData.passingScore > 100) {
      toast.error("نسبة النجاح يجب أن تكون بين 1 و 100.");
      return;
    }
    if (formData.maxAttempts < 1) {
      toast.error("عدد المحاولات يجب أن يكون 1 على الأقل.");
      return;
    }
    if (formData.durationMinutes && Number(formData.durationMinutes) < 1) {
      toast.error("المدة الزمنية يجب أن تكون دقيقة واحدة على الأقل.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("جاري حفظ الإعدادات...");

    try {
      await fetchApi(`/teacher/quizzes/${exam.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      toast.success("تم الحفظ بنجاح!", { id: toastId });
      onUpdate({ ...exam, ...formData });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6 md:p-8 bg-surface">
        <h3 className="font-display text-xl text-primary mb-6">المعلومات الأساسية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              عنوان الاختبار
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              الوصف (يظهر للطلاب قبل بدء الاختبار)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              التعليمات
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 bg-surface">
        <h3 className="font-display text-xl text-primary mb-6">قواعد الاختبار</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              المدة الزمنية (بالدقائق)
            </label>
            <Input
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              placeholder="اتركه فارغاً إذا كان بدون وقت محدد"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              نسبة النجاح (%)
            </label>
            <Input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              min="1"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              عدد المحاولات المسموحة
            </label>
            <Input
              type="number"
              name="maxAttempts"
              value={formData.maxAttempts}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">
              حالة الاختبار
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            >
              <option value="draft">مسودة (غير مرئي للطلاب)</option>
              <option value="published">منشور (متاح للطلاب)</option>
              <option value="archived">مؤرشف (مغلق)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 bg-surface">
        <h3 className="font-display text-xl text-primary mb-6">إعدادات العرض</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 border border-primary border-opacity-10 rounded-xl hover:bg-primary/5 transition-colors">
            <input
              type="checkbox"
              name="shuffleQuestions"
              checked={formData.shuffleQuestions}
              onChange={handleChange}
              className="w-5 h-5 accent-gold"
            />
            <span className="font-ui text-primary text-sm">ترتيب عشوائي للأسئلة</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-4 border border-primary border-opacity-10 rounded-xl hover:bg-primary/5 transition-colors">
            <input
              type="checkbox"
              name="shuffleAnswers"
              checked={formData.shuffleAnswers}
              onChange={handleChange}
              className="w-5 h-5 accent-gold"
            />
            <span className="font-ui text-primary text-sm">ترتيب عشوائي للاختيارات</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-4 border border-primary border-opacity-10 rounded-xl hover:bg-primary/5 transition-colors">
            <input
              type="checkbox"
              name="showResultsImmediately"
              checked={formData.showResultsImmediately}
              onChange={handleChange}
              className="w-5 h-5 accent-gold"
            />
            <span className="font-ui text-primary text-sm">إظهار النتيجة فوراً بعد التسليم</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-4 border border-primary border-opacity-10 rounded-xl hover:bg-primary/5 transition-colors">
            <input
              type="checkbox"
              name="showCorrectAnswers"
              checked={formData.showCorrectAnswers}
              onChange={handleChange}
              className="w-5 h-5 accent-gold"
              disabled={!formData.showResultsImmediately}
            />
            <span className={`font-ui text-primary text-sm ${!formData.showResultsImmediately ? 'opacity-50' : ''}`}>
              إظهار الإجابات الصحيحة للطلاب
            </span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto">
          حفظ الإعدادات
        </Button>
      </div>
    </form>
  );
}
