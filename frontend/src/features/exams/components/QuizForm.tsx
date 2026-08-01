"use client";

import { PlusCircle, Trash2, Loader2, Save, X, Plus, ImagePlus } from "lucide-react";
import { useQuizForm, QuestionDraft } from "@/src/features/exams/hooks/useQuizForm";
import { compressImage } from "@/src/lib/compressImage";
import { toast } from "sonner";

export function QuizForm({
  courseId,
  moduleId,
  nextPosition,
}: {
  courseId: string;
  moduleId: string;
  nextPosition: number;
}) {
  const {
    open,
    setOpen,
    title,
    setTitle,
    passingScore,
    setPassingScore,
    questions,
    loading,
    updateQuestion,
    setQuestionType,
    updateOption,
    addOption,
    removeOption,
    addQuestion,
    removeQuestion,
    handleSubmit,
  } = useQuizForm(courseId, moduleId, nextPosition);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-primary/10 text-primary font-ui font-bold px-4 py-3 rounded-xl hover:bg-surfaceHover hover:border-primary/20 transition-colors bg-surface shadow-sm"
      >
        <PlusCircle size={18} />
        إضافة اختبار للوحدة
      </button>
    );
  }

  return (
    <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-6 mt-4">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/5">
        <h3 className="font-display text-xl text-accent">إضافة اختبار جديد</h3>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-primary transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-ui text-muted mb-1">عنوان الاختبار</label>
            <input
              type="text"
              required
              placeholder="مثال: اختبار الوحدة الأولى"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-ui text-muted mb-1">درجة النجاح (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-surface border border-primary/5 shadow-sm rounded-xl p-5 relative group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <span className="bg-primary/5 border border-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-ui shadow-sm">سؤال {qIndex + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-danger hover:text-danger text-sm font-ui flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={14} />
                    حذف السؤال
                  </button>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="نص السؤال..."
                      value={q.text}
                      onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                      className="flex-1 border border-primary/10 rounded-xl px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <label className="flex items-center justify-center p-2 border border-primary/10 rounded-xl cursor-pointer hover:bg-surfaceHover text-muted hover:text-primary transition-colors" title="إضافة صورة للسؤال">
                      <ImagePlus size={20} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressedBase64 = await compressImage(file);
                              updateQuestion(qIndex, { imageUrl: compressedBase64 });
                            } catch (error) {
                              console.error("Failed to compress image:", error);
                              toast.error("فشل في معالجة الصورة");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {q.imageUrl && (
                    <div className="relative inline-block mt-2">
                      <img src={q.imageUrl} alt="Question media" className="h-32 object-cover rounded-lg border border-primary/10" />
                      <button 
                        type="button" 
                        onClick={() => updateQuestion(qIndex, { imageUrl: undefined })}
                        className="absolute -top-2 -right-2 bg-danger text-inverse p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <select
                  value={q.type}
                  onChange={(e) => setQuestionType(qIndex, e.target.value as QuestionDraft["type"])}
                  className="w-full md:w-48 h-[42px] border border-primary/10 rounded-xl px-4 py-2 font-ui text-sm bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
                >
                  <option value="multiple_choice">اختيار من متعدد</option>
                  <option value="true_false">صح / خطأ</option>
                </select>
              </div>

              <div className="space-y-3 pl-2 border-r border-primary/10 pr-4">
                <label className="block text-xs font-ui text-muted mb-2">الإجابات (اختر الإجابة الصحيحة)</label>
                {q.options.map((o, oIndex) => (
                  <div key={oIndex} className="flex flex-col gap-2 border border-primary/5 p-2 rounded-xl mb-2 bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={o.correct}
                          onChange={() => updateOption(qIndex, oIndex, { correct: true })}
                          className="w-5 h-5 accent-primary cursor-pointer"
                          title="تحديد كإجابة صحيحة"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={q.type === "true_false"}
                        placeholder={`الاختيار ${oIndex + 1}`}
                        value={o.text}
                        onChange={(e) => updateOption(qIndex, oIndex, { text: e.target.value })}
                        className={`flex-1 border rounded-lg px-3 py-1.5 font-body text-sm focus:outline-none transition-colors ${o.correct ? 'border-success bg-success/5' : 'border-primary/10 bg-surface focus:border-primary focus:ring-1 focus:ring-primary'} disabled:opacity-60 text-primary`}
                      />
                      {q.type !== "true_false" && (
                        <label className="flex items-center justify-center p-1.5 border border-primary/10 rounded-lg cursor-pointer hover:bg-surfaceHover text-muted hover:text-primary transition-colors" title="إضافة صورة للاختيار">
                          <ImagePlus size={16} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedBase64 = await compressImage(file);
                                  updateOption(qIndex, oIndex, { imageUrl: compressedBase64 });
                                } catch (error) {
                                  console.error("Failed to compress image:", error);
                                  toast.error("فشل في معالجة الصورة");
                                }
                              }
                            }}
                          />
                        </label>
                      )}
                      {q.type === "multiple_choice" && q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-danger hover:text-danger p-1 rounded-md transition-colors"
                          title="حذف الاختيار"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {o.imageUrl && (
                      <div className="relative inline-block ml-8 mt-1 self-start">
                        <img src={o.imageUrl} alt="Option media" className="h-16 object-cover rounded-md border border-primary/10" />
                        <button 
                          type="button" 
                          onClick={() => updateOption(qIndex, oIndex, { imageUrl: undefined })}
                          className="absolute -top-1.5 -right-1.5 bg-danger text-inverse p-0.5 rounded-full shadow-md hover:scale-110 transition-transform"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {q.type === "multiple_choice" && (
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="flex items-center gap-1 text-accent text-sm font-ui hover:text-accentLight transition-colors mt-2"
                  >
                    <Plus size={14} />
                    إضافة اختيار
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-primary/5">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center gap-2 w-full sm:w-auto border border-primary text-primary font-ui font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/5 transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            إضافة سؤال
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 text-muted hover:text-primary font-ui text-sm transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-none bg-primary text-inverse font-ui font-bold px-8 py-2.5 rounded-lg hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              حفظ الاختبار
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
