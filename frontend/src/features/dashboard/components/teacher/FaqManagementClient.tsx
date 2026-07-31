"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, GripVertical, Check, X } from "lucide-react";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function FaqManagementClient() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await fetchApi("/faq/teacher");
      setFaqs(data.faqs || []);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الأسئلة الشائعة");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setIsActive(true);
    setPosition(faqs.length);
    setIsEditing(null);
  };

  const handleEdit = (faq: any) => {
    setIsEditing(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsActive(faq.isActive);
    setPosition(faq.position);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetchApi(`/faq/teacher/${isEditing}`, {
          method: "PUT",
          body: JSON.stringify({ question, answer, isActive, position })
        });
        toast.success("تم تحديث السؤال بنجاح");
      } else {
        await fetchApi("/faq/teacher", {
          method: "POST",
          body: JSON.stringify({ question, answer, isActive, position })
        });
        toast.success("تمت إضافة السؤال بنجاح");
      }
      resetForm();
      loadFaqs();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    try {
      await fetchApi(`/faq/teacher/${id}`, { method: "DELETE" });
      toast.success("تم حذف السؤال بنجاح");
      loadFaqs();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleToggleActive = async (faq: any) => {
    try {
      await fetchApi(`/faq/teacher/${faq.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...faq, isActive: !faq.isActive })
      });
      loadFaqs();
      toast.success(faq.isActive ? "تم إخفاء السؤال" : "تم إظهار السؤال");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-primary/10 rounded-2xl p-6">
        <h2 className="text-xl font-display text-primary mb-6">
          {isEditing ? "تعديل سؤال" : "إضافة سؤال جديد"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">السؤال</label>
            <input 
              required
              type="text" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-background border border-surfaceBorder rounded-xl p-3 focus:border-gold outline-none"
              placeholder="مثال: كيف يمكنني الاشتراك في الدورة؟"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الإجابة</label>
            <textarea 
              required
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-background border border-surfaceBorder rounded-xl p-3 focus:border-gold outline-none resize-none"
              rows={3}
              placeholder="اكتب الإجابة هنا..."
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">الترتيب</label>
              <input 
                type="number" 
                value={position} 
                onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
                className="w-20 bg-background border border-surfaceBorder rounded-xl p-2 focus:border-gold outline-none text-center"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-gold"
              />
              <span className="text-sm font-medium">نشط (يظهر للطلاب)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary text-inverse rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2"
            >
              {isEditing ? <Check size={18} /> : <Plus size={18} />}
              {isEditing ? "حفظ التعديلات" : "إضافة السؤال"}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-2 bg-surfaceBorder text-primary rounded-xl font-bold hover:bg-surfaceBorder/80"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-surface border border-primary/10 rounded-2xl p-6">
        <h2 className="text-xl font-display text-primary mb-6">قائمة الأسئلة الشائعة</h2>
        
        {faqs.length === 0 ? (
          <div className="text-center py-10 text-muted">
            لا توجد أسئلة شائعة مضافة حالياً.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`flex gap-4 p-4 border rounded-xl transition-all ${
                  faq.isActive ? 'border-primary/10 bg-background' : 'border-surfaceBorder bg-surface/50 opacity-70'
                }`}
              >
                <div className="flex flex-col gap-2 pt-1 text-muted cursor-grab">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-1">{faq.question}</h3>
                  <p className="text-sm text-muted mb-3">{faq.answer}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="text-primary/60">الترتيب: {faq.position}</span>
                    <span className={faq.isActive ? "text-success" : "text-error"}>
                      {faq.isActive ? "نشط (يظهر في الرئيسية)" : "مخفي"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleToggleActive(faq)}
                    className="p-2 bg-surface hover:bg-surfaceBorder rounded-lg transition-colors text-primary"
                    title={faq.isActive ? "إخفاء" : "إظهار"}
                  >
                    {faq.isActive ? <X size={16} /> : <Check size={16} />}
                  </button>
                  <button 
                    onClick={() => handleEdit(faq)}
                    className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                    title="تعديل"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 bg-error/10 hover:bg-error/20 rounded-lg transition-colors text-error"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
