"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";
import { Card } from "@/src/shared/components/ui/Card";
import { Modal } from "@/src/shared/components/ui/Modal";

type QuizAttempt = {
  id: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  student: {
    id: string;
    fullName: string | null;
    phone: string | null;
  };
};

export function ExamResultsClient({ examId }: { examId: string }) {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    loadResults();
  }, [examId]);

  async function loadResults() {
    try {
      const data = await fetchApi(`/teacher/quizzes/${examId}/results`);
      setAttempts(data.attempts || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center p-12 bg-surface border border-primary/5 rounded-xl">
        <p className="text-muted font-ui text-lg">لم يقم أي طالب بحل هذا الاختبار حتى الآن.</p>
      </div>
    );
  }

  const averageScore = attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length;
  const passRate = (attempts.filter((a) => a.passed).length / attempts.length) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface text-center">
          <p className="text-sm text-muted font-ui mb-1">إجمالي المحاولات</p>
          <p className="text-3xl font-display text-primary">{attempts.length}</p>
        </Card>
        <Card className="p-4 bg-surface text-center">
          <p className="text-sm text-muted font-ui mb-1">متوسط الدرجات</p>
          <p className="text-3xl font-display text-accent">{averageScore.toFixed(1)}%</p>
        </Card>
        <Card className="p-4 bg-surface text-center">
          <p className="text-sm text-muted font-ui mb-1">نسبة النجاح</p>
          <p className="text-3xl font-display text-green-500">{passRate.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right font-ui text-sm">
            <thead className="bg-primary/5 text-primary">
              <tr>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">رقم الهاتف</th>
                <th className="p-4">الدرجة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">تاريخ التقديم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4 font-bold text-primary">{attempt.student.fullName || 'بدون اسم'}</td>
                  <td className="p-4 text-secondary" dir="ltr">{attempt.student.phone || '-'}</td>
                  <td className="p-4 font-bold text-accent">{attempt.score}%</td>
                  <td className="p-4">
                    {attempt.passed ? (
                      <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs">ناجح</span>
                    ) : (
                      <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-full text-xs">راسب</span>
                    )}
                  </td>
                  <td className="p-4 text-secondary">
                    {new Date(attempt.submittedAt).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
