"use client";

import { useState } from "react";
import { PlusCircle, GripVertical, Trash2, Edit2 } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { QuestionForm } from "./QuestionForm";
import { fetchApi } from "@/src/lib/api";

export function ExamQuestionBank({ examId, questions, onUpdate }: { examId: string, questions: any[], onUpdate: (q: any[]) => void }) {
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (questionId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;

    try {
      await fetchApi(`/teacher/quizzes/${examId}/questions/${questionId}`, {
        method: "DELETE",
      });

      const updated = questions.filter(q => q.id !== questionId);
      onUpdate(updated);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleSave = (newQuestion: any) => {
    if (editingQuestion) {
      onUpdate(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
    } else {
      onUpdate([...questions, newQuestion]);
    }
    setEditingQuestion(null);
    setIsAdding(false);
  };

  const getQuestionTypeName = (type: string) => {
    const types: Record<string, string> = {
      multiple_choice: "اختيار من متعدد",
      multiple_select: "تحديد متعدد",
      true_false: "صح أم خطأ",
      short_answer: "إجابة قصيرة",
      essay: "مقال",
      fill_blank: "أكمل الفراغ",
    };
    return types[type] || type;
  };

  if (isAdding || editingQuestion) {
    return (
      <QuestionForm 
        examId={examId} 
        initialData={editingQuestion} 
        onSave={handleSave} 
        onCancel={() => {
          setIsAdding(false);
          setEditingQuestion(null);
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-primary">الأسئلة ({questions.length})</h3>
        <Button variant="primary" leftIcon={<PlusCircle size={18} />} onClick={() => setIsAdding(true)}>
          إضافة سؤال جديد
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center bg-surface border-dashed">
          <p className="font-body text-muted mb-4">لا توجد أسئلة في هذا الاختبار بعد.</p>
          <Button variant="outline" onClick={() => setIsAdding(true)}>ابدأ بإضافة الأسئلة</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.sort((a, b) => a.position - b.position).map((q, index) => (
            <Card key={q.id} className="p-4 flex gap-4 bg-surface group hover:border-gold/50 transition-colors">
              <div className="flex flex-col items-center justify-center text-muted cursor-move opacity-50 group-hover:opacity-100">
                <GripVertical size={20} />
                <span className="text-xs mt-1 font-bold">{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-ui font-bold text-lg text-primary">{q.questionText}</h4>
                  <div className="flex gap-2">
                    <span className="bg-primary/5 text-xs px-2 py-1 rounded-md">{getQuestionTypeName(q.questionType)}</span>
                    <span className="bg-gold/10 text-accent text-xs px-2 py-1 rounded-md">{q.marks} درجة</span>
                  </div>
                </div>
                
                {/* Options preview for MC/TF */}
                {q.options && q.options.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt: any) => (
                      <div key={opt.id} className={`p-2 rounded-lg text-sm font-ui border ${opt.isCorrect ? 'bg-success/10 border-success/30 text-success' : 'bg-background border-primary/10 text-muted'}`}>
                        {opt.optionText}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingQuestion(q)} className="px-2">
                  <Edit2 size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)} className="px-2 text-danger hover:bg-danger hover:text-white hover:border-danger">
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
