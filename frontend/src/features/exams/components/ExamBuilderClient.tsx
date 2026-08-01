"use client";

import { useState } from "react";
import { Card } from "@/src/shared/components/ui/Card";
import { ExamSettingsForm } from "./ExamSettingsForm";
import { ExamQuestionBank } from "./ExamQuestionBank";
import { ExamResultsClient } from "./ExamResultsClient";

export function ExamBuilderClient({ initialExam, initialQuestions }: { initialExam: any, initialQuestions: any[] }) {
  const [activeTab, setActiveTab] = useState<"settings" | "questions" | "results">("settings");
  const [exam, setExam] = useState(initialExam);
  const [questions, setQuestions] = useState(initialQuestions);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gold/20 font-ui overflow-x-auto">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
            activeTab === "settings"
              ? "text-gold border-b-2 border-gold"
              : "text-muted hover:text-primary"
          }`}
        >
          الإعدادات العامة
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "questions"
              ? "text-gold border-b-2 border-gold"
              : "text-muted hover:text-primary"
          }`}
        >
          بنك الأسئلة
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {questions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-6 py-3 font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "results"
              ? "text-gold border-b-2 border-gold"
              : "text-muted hover:text-primary"
          }`}
        >
          النتائج والإحصائيات
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "settings" && (
          <ExamSettingsForm exam={exam} onUpdate={setExam} />
        )}
        {activeTab === "questions" && (
          <ExamQuestionBank examId={exam.id} questions={questions} onUpdate={setQuestions} />
        )}
        {activeTab === "results" && (
          <ExamResultsClient examId={exam.id} />
        )}
      </div>
    </div>
  );
}
