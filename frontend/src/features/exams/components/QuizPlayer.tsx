"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Send, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchApi } from "@/src/lib/api";

type QuizQuestion = {
  id: string;
  questionText: string;
  imageUrl?: string;
  questionType: "multiple_choice" | "true_false";
  options: { id: string; optionText: string; imageUrl?: string }[];
};

type QuizData = {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};

type Result = {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
};

export function QuizPlayer({ quizId, onPassed }: { quizId: string; onPassed?: (certificate?: any) => void }) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setLoading(true);

    fetchApi(`/student/quizzes/${quizId}`)
      .then((data) => {
        if (!cancelled) setQuiz(data as any);
      })
      .catch((e: any) => {
        if (!cancelled) toast.error(e.message || "تعذر تحميل الاختبار");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    const toastId = toast.loading("جاري تصحيح الاختبار...");
    
    try {
      const data = await fetchApi(`/student/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      setResult(data as any);
      
      if (data.passed) {
        toast.success("مبروك! لقد اجتزت الاختبار.", { id: toastId });
        onPassed?.(data.certificate);
      } else {
        toast.error("للأسف لم تتجاوز الاختبار. حاول مرة أخرى.", { id: toastId });
      }
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-accent mb-4" />
        <span className="text-muted font-ui">جاري تحميل الاختبار...</span>
      </div>
    );
  }

  if (!quiz) return null;

  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  return (
    <div className="w-full flex flex-col items-center py-10 px-4 md:px-8 lg:px-12">
      <div className="w-full max-w-5xl bg-surface border border-primary/5 rounded-[32px] shadow-2xl p-8 md:p-12 relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="border-b border-gold/10 pb-6 mb-8 text-center relative z-10">
          <h2 className="font-display text-3xl text-accent mb-2">{quiz.title}</h2>
          <div className="inline-flex items-center gap-2 bg-background/50 px-4 py-1.5 rounded-full border border-gold/20 text-muted text-sm font-ui">
            <Target size={16} className="text-accent" />
            درجة النجاح المطلوبة: {quiz.passingScore}%
          </div>
        </div>

        {result ? (
          <div className="text-center py-10 relative z-10">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${result.passed ? "bg-success/20 text-success border border-success/50" : "bg-danger/20 text-danger border border-danger/50"}`}>
              {result.passed ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            
            <p className={`font-display text-3xl mb-4 ${result.passed ? "text-success" : "text-danger"}`}>
              {result.passed ? "مبروك، اجتزت الاختبار بنجاح!" : "لم تحقق درجة النجاح المطلوبة"}
            </p>
            
            <div className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-6 max-w-sm mx-auto mb-8">
              <p className="font-ui text-muted mb-2">النتيجة النهائية</p>
              <p className="font-display text-4xl text-accent mb-2">{result.score}%</p>
              <p className="font-body text-sm text-muted">
                أجبت بشكل صحيح على {result.correctCount} من أصل {result.totalQuestions} أسئلة
              </p>
            </div>
            
            {!result.passed && (
              <Button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
                variant="outline"
                size="lg"
                leftIcon={<RotateCcw size={18} />}
              >
                إعادة المحاولة
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {quiz.questions.map((q, index) => (
              <div key={q.id} className="bg-surface shadow-sm border border-primary/5 rounded-[18px] p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="w-8 h-8 rounded-full bg-gold/20 text-accent flex items-center justify-center font-bold font-ui shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-xl text-primary mt-1 leading-relaxed">
                      {q.questionText}
                    </p>
                    {q.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={q.imageUrl} 
                          alt="Question image" 
                          className="max-h-64 object-contain rounded-xl border border-primary/10 cursor-zoom-in hover:opacity-90 transition-opacity" 
                          onClick={(e) => {
                            e.preventDefault();
                            setZoomedImage(q.imageUrl!);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 pr-12">
                  {q.options.map((o) => (
                    <label
                      key={o.id}
                      className={`flex flex-col border rounded-[10px] px-4 py-3 cursor-pointer transition-all ${
                        answers[q.id] === o.id 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-primary/10 hover:border-primary/20 hover:bg-surfaceHover text-muted hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={q.id}
                          className="w-5 h-5 accent-primary shrink-0"
                          checked={answers[q.id] === o.id}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                        />
                        <span className="font-body text-sm mt-0.5">{o.optionText}</span>
                      </div>
                      {o.imageUrl && (
                        <div className="mt-2 mr-8">
                          <img 
                            src={o.imageUrl} 
                            alt="Option image" 
                            className="max-h-40 object-contain rounded-lg border border-primary/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setZoomedImage(o.imageUrl!);
                            }} 
                          />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              isLoading={submitting}
              className="w-full mt-8"
              size="lg"
              leftIcon={!submitting && <Send size={20} className={document.dir === 'rtl' ? "rotate-180" : ""} />}
            >
              إرسال الإجابات
            </Button>
            {!allAnswered && (
              <p className="text-center text-muted text-xs font-ui mt-4">
                يجب الإجابة على جميع الأسئلة لتسليم الاختبار
              </p>
            )}
          </div>
        )}

        {/* Image Zoom Modal */}
        {zoomedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoomedImage(null)}
          >
            <div className="relative max-w-5xl max-h-screen">
              <button 
                className="absolute -top-12 right-0 text-white hover:text-accent transition-colors"
                onClick={() => setZoomedImage(null)}
              >
                <XCircle size={32} />
              </button>
              <img 
                src={zoomedImage} 
                alt="Zoomed" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
