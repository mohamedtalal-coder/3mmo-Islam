"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle, Trash2, ArrowRight, ImagePlus, X } from "lucide-react";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";
import { Card } from "@/src/shared/components/ui/Card";

import { fetchApi } from "@/src/lib/api";

export function QuestionForm({ examId, initialData, onSave, onCancel }: { examId: string, initialData?: any, onSave: (q: any) => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionText: initialData?.questionText || "",
    imageUrl: initialData?.imageUrl || undefined,
    questionType: initialData?.questionType || "multiple_choice",
    difficulty: initialData?.difficulty || "medium",
    marks: initialData?.marks || 1,
    explanation: initialData?.explanation || "",
    options: initialData?.options || [
      { optionText: "", isCorrect: true, imageUrl: undefined },
      { optionText: "", isCorrect: false, imageUrl: undefined },
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index].optionText = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleOptionImageChange = (index: number, imageUrl?: string) => {
    const newOptions = [...formData.options];
    newOptions[index].imageUrl = imageUrl;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSetCorrect = (index: number) => {
    const newOptions = [...formData.options];
    if (formData.questionType === "multiple_choice" || formData.questionType === "true_false") {
      // Only one correct answer
      newOptions.forEach((opt, i) => opt.isCorrect = (i === index));
    } else {
      // Multiple correct answers possible for multiple_select
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    }
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { optionText: "", isCorrect: false, imageUrl: undefined }]
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_: any, i: number) => i !== index)
    }));
  };

  // Adjust options based on question type changes
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    let newOptions = [...formData.options];

    if (type === "true_false") {
      newOptions = [
        { optionText: "صح", isCorrect: true, imageUrl: undefined },
        { optionText: "خطأ", isCorrect: false, imageUrl: undefined },
      ];
    } else if (type === "short_answer" || type === "essay") {
      newOptions = []; // No options needed
    } else if (formData.questionType === "true_false" || formData.options.length === 0) {
      newOptions = [
        { optionText: "", isCorrect: true, imageUrl: undefined },
        { optionText: "", isCorrect: false, imageUrl: undefined },
      ];
    }

    setFormData(prev => ({ ...prev, questionType: type, options: newOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText) {
      toast.error("يرجى كتابة السؤال");
      return;
    }

    const needsOptions = ["multiple_choice", "multiple_select", "true_false"].includes(formData.questionType);
    if (needsOptions) {
      if (formData.options.length < 2) {
        toast.error("يجب إضافة خيارين على الأقل");
        return;
      }
      if (!formData.options.some((o: any) => o.isCorrect)) {
        toast.error("يجب تحديد إجابة صحيحة واحدة على الأقل");
        return;
      }
      if (formData.options.some((o: any) => !o.optionText)) {
        toast.error("يرجى ملء جميع نصوص الاختيارات");
        return;
      }
    }

    setLoading(true);
    const toastId = toast.loading("جاري حفظ السؤال...");

    try {
      const url = initialData 
        ? `/teacher/quizzes/${examId}/questions/${initialData.id}` 
        : `/teacher/quizzes/${examId}/questions`;
      
      const method = initialData ? "PUT" : "POST";

      const data = await fetchApi(url, {
        method,
        body: JSON.stringify(formData),
      });
      
      toast.success("تم الحفظ بنجاح", { id: toastId });
      onSave(data.question);
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 bg-surface">
      <div className="flex justify-between items-center mb-6 border-b border-gold/10 pb-4">
        <h3 className="font-display text-xl text-primary">
          {initialData ? "تعديل السؤال" : "سؤال جديد"}
        </h3>
        <Button variant="outline" size="sm" onClick={onCancel} leftIcon={<ArrowRight size={16} />}>
          إلغاء
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">نوع السؤال</label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleTypeChange}
              className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            >
              <option value="multiple_choice">اختيار من متعدد</option>
              <option value="multiple_select">تحديد متعدد (أكثر من إجابة)</option>
              <option value="true_false">صح أم خطأ</option>
              <option value="short_answer">إجابة قصيرة</option>
              <option value="essay">مقال (تصحيح يدوي)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">الدرجة</label>
            <Input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-2 font-ui">الصعوبة</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            >
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-2 font-ui">السؤال</label>
          <div className="flex gap-2">
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              required
              rows={3}
              placeholder="اكتب نص السؤال هنا..."
              className="flex-1 bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
            />
            <label className="flex items-center justify-center p-3 border-2 border-primary/10 rounded-xl cursor-pointer hover:bg-surfaceHover text-muted hover:text-primary transition-colors h-fit" title="إضافة صورة للسؤال">
              <ImagePlus size={24} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          {formData.imageUrl && (
            <div className="relative inline-block mt-2">
              <img src={formData.imageUrl} alt="Question media" className="h-32 object-cover rounded-lg border border-primary/10" />
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, imageUrl: undefined }))}
                className="absolute -top-2 -right-2 bg-danger text-inverse p-1 rounded-full shadow-md hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Options Section */}
        {["multiple_choice", "multiple_select", "true_false"].includes(formData.questionType) && (
          <div className="bg-primary/5 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-primary font-ui">
                الاختيارات <span className="text-muted text-xs font-normal">(حدد الدائرة/المربع للإجابة الصحيحة)</span>
              </label>
            </div>
            
            {formData.options.map((opt: any, index: number) => (
              <div key={index} className="flex flex-col gap-2 border border-primary/5 p-3 rounded-xl mb-2 bg-surface">
                <div className="flex items-center gap-3">
                  <input
                    type={formData.questionType === "multiple_select" ? "checkbox" : "radio"}
                    name="correct_answer"
                    checked={opt.isCorrect}
                    onChange={() => handleSetCorrect(index)}
                    className="w-6 h-6 accent-success cursor-pointer"
                  />
                  <Input
                    value={opt.optionText}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`الخيار ${index + 1}`}
                    className={`flex-1 ${opt.isCorrect ? 'border-success/50 bg-success/5' : ''}`}
                    disabled={formData.questionType === "true_false"}
                  />
                  {formData.questionType !== "true_false" && (
                    <label className="flex items-center justify-center p-2 border border-primary/10 rounded-lg cursor-pointer hover:bg-surfaceHover text-muted hover:text-primary transition-colors" title="إضافة صورة للاختيار">
                      <ImagePlus size={20} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleOptionImageChange(index, reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                  {formData.questionType !== "true_false" && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeOption(index)} className="text-danger hover:bg-danger/10 hover:border-danger border-transparent h-[42px]">
                      <Trash2 size={20} />
                    </Button>
                  )}
                </div>
                {opt.imageUrl && (
                  <div className="relative inline-block ml-8 mt-1 self-start">
                    <img src={opt.imageUrl} alt="Option media" className="h-16 object-cover rounded-md border border-primary/10" />
                    <button 
                      type="button" 
                      onClick={() => handleOptionImageChange(index, undefined)}
                      className="absolute -top-1.5 -right-1.5 bg-danger text-inverse p-0.5 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {formData.questionType !== "true_false" && (
              <Button type="button" variant="outline" size="sm" onClick={addOption} leftIcon={<PlusCircle size={16} />} className="mt-2">
                إضافة خيار
              </Button>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-primary mb-2 font-ui">شرح الإجابة (اختياري، يظهر للطالب بعد الحل)</label>
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            rows={2}
            className="w-full bg-background border-2 border-primary border-opacity-10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-colors font-ui"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gold/10">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} className="w-full sm:w-auto">
            حفظ السؤال
          </Button>
        </div>
      </form>
    </Card>
  );
}
