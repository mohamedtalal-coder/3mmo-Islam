import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";

export type OptionDraft = { text: string; correct: boolean };
export type QuestionDraft = {
  text: string;
  type: "multiple_choice" | "true_false";
  options: OptionDraft[];
};

export function blankQuestion(): QuestionDraft {
  return {
    text: "",
    type: "multiple_choice",
    options: [
      { text: "", correct: true },
      { text: "", correct: false },
    ],
  };
}

export function useQuizForm(courseId: string, moduleId: string, nextPosition: number) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<QuestionDraft[]>([blankQuestion()]);
  const [loading, setLoading] = useState(false);

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function setQuestionType(index: number, type: QuestionDraft["type"]) {
    if (type === "true_false") {
      updateQuestion(index, {
        type,
        options: [
          { text: "صح", correct: true },
          { text: "غلط", correct: false },
        ],
      });
    } else {
      updateQuestion(index, {
        type,
        options: [
          { text: "", correct: true },
          { text: "", correct: false },
        ],
      });
    }
  }

  function updateOption(qIndex: number, oIndex: number, patch: Partial<OptionDraft>) {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qIndex) return q;
        const options = q.options.map((o, j) => {
          if (patch.correct) {
            // Single-correct-answer model: only one option can be marked correct.
            return { ...o, correct: j === oIndex };
          }
          return j === oIndex ? { ...o, ...patch } : o;
        });
        return { ...q, options };
      })
    );
  }

  function addOption(qIndex: number) {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, { text: "", correct: false }] } : q))
    );
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== oIndex) } : q))
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, blankQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function validate() {
    if (!title.trim()) {
      toast.error("لازم تكتب عنوان الاختبار.");
      return false;
    }
    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error("كل سؤال لازم يكون ليه نص.");
        return false;
      }
      if (q.options.some((o) => !o.text.trim())) {
        toast.error("كل اختيار لازم يكون ليه نص.");
        return false;
      }
      if (!q.options.some((o) => o.correct)) {
        toast.error("كل سؤال لازم يكون له إجابة صحيحة واحدة محددة.");
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("جاري حفظ الاختبار...");
    try {
      await fetchApi("/teacher/quizzes", {
        method: "POST",
        body: JSON.stringify({
          courseId,
          moduleId,
          title,
          passingScore,
          position: nextPosition,
          questions
        })
      });

      toast.success("تم حفظ الاختبار بنجاح!", { id: toastId });
      setTitle("");
      setPassingScore(60);
      setQuestions([blankQuestion()]);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "حصلت مشكلة أثناء حفظ الاختبار. حاول تاني.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
