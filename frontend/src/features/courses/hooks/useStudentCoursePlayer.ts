import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";

export type Lesson = {
  id: string;
  title: string;
  position: number;
  quizzes?: Quiz[];
};

export type Quiz = {
  id: string;
  title: string;
};

export type Module = {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
  quizzes?: Quiz[];
};

export type ActiveItem = { type: "lesson"; lesson: Lesson } | { type: "quiz"; quiz: Quiz } | null;

export type ContentTab = "overview" | "notes" | "resources" | "discussion" | "quizzes";

export function useStudentCoursePlayer({
  modules,
  initialCompletedLessons,
  initialPassedQuizzes,
  certificatesEnabled,
  allLessonsAndQuizzesComplete,
  courseId,
  initialCertificate,
}: {
  modules: Module[];
  initialCompletedLessons: string[];
  initialPassedQuizzes: string[];
  certificatesEnabled: boolean;
  allLessonsAndQuizzesComplete: boolean;
  courseId?: string;
  initialCertificate?: any;
}) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(initialCompletedLessons));
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set(initialPassedQuizzes));
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificateReady, setCertificateReady] = useState<any>(initialCertificate || (allLessonsAndQuizzesComplete ? true : false));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));
  const [activeTab, setActiveTab] = useState<ContentTab>("overview");
  const [notes, setNotes] = useState<string>("");

  // Get flat ordered list of all lessons
  const allLessons = modules.flatMap(m => m.lessons);

  useEffect(() => {
    if (!activeItem && modules.length > 0 && modules[0].lessons.length > 0) {
      setActiveItem({ type: "lesson", lesson: modules[0].lessons[0] });
    }
  }, [modules, activeItem]);

  // Load notes from localStorage
  useEffect(() => {
    if (activeItem?.type === "lesson" && courseId) {
      const key = `notes-${courseId}-${activeItem.lesson.id}`;
      const savedNotes = localStorage.getItem(key);
      setNotes(savedNotes || "");
    }
  }, [activeItem, courseId]);

  // Save notes to localStorage (debounced)
  const saveNotes = useCallback((value: string) => {
    setNotes(value);
    if (activeItem?.type === "lesson" && courseId) {
      const key = `notes-${courseId}-${activeItem.lesson.id}`;
      localStorage.setItem(key, value);
    }
  }, [activeItem, courseId]);

  useEffect(() => {
    async function fetchVideo() {
      if (!activeItem || activeItem.type !== "lesson") {
        setVideoUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setVideoUrl(null);

      try {
        console.log("Fetching video URL via fetchApi...");
        const data = await fetchApi(`/student/lessons/${activeItem.lesson.id}/video`);
        setVideoUrl(data.url);
      } catch (err: any) {
        setError(err.message || "Failed to load video");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideo();
    setActiveTab("overview"); // Reset tab on lesson change
  }, [activeItem]);

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId);
    } else {
      newSet.add(moduleId);
    }
    setExpandedModules(newSet);
  };

  const toggleProgress = async (lessonId: string) => {
    const isCompleted = completedLessons.has(lessonId);

    const newSet = new Set(completedLessons);
    if (isCompleted) {
      newSet.delete(lessonId);
    } else {
      newSet.add(lessonId);
    }
    setCompletedLessons(newSet);

    try {
      const res = await fetchApi("/student/progress", {
        method: "POST",
        body: JSON.stringify({ lessonId, completed: !isCompleted }),
      });

      router.refresh();
      if (certificatesEnabled) {
        setTimeout(() => setCertificateReady(true), 1500);
      }
    } catch (e) {
      setCompletedLessons(completedLessons);
      toast.error("حدث خطأ أثناء حفظ التقدم.");
    }
  };

  // Navigate to next/previous lesson
  const getCurrentLessonIndex = () => {
    if (!activeItem || activeItem.type !== "lesson") return -1;
    return allLessons.findIndex(l => l.id === activeItem.lesson.id);
  };

  const goToNextLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setActiveItem({ type: "lesson", lesson: allLessons[currentIndex + 1] });
      // Expand the module containing the next lesson
      const nextLesson = allLessons[currentIndex + 1];
      const containingModule = modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
      if (containingModule) {
        setExpandedModules(prev => new Set(prev).add(containingModule.id));
      }
    }
  }, [activeItem, allLessons, modules]);

  const goToPreviousLesson = useCallback(() => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      setActiveItem({ type: "lesson", lesson: allLessons[currentIndex - 1] });
      const prevLesson = allLessons[currentIndex - 1];
      const containingModule = modules.find(m => m.lessons.some(l => l.id === prevLesson.id));
      if (containingModule) {
        setExpandedModules(prev => new Set(prev).add(containingModule.id));
      }
    }
  }, [activeItem, allLessons, modules]);

  const hasNextLesson = getCurrentLessonIndex() < allLessons.length - 1 && getCurrentLessonIndex() >= 0;
  const hasPreviousLesson = getCurrentLessonIndex() > 0;

  const activeLesson = activeItem?.type === "lesson" ? activeItem.lesson : null;
  const activeQuiz = activeItem?.type === "quiz" ? activeItem.quiz : null;

  return {
    activeItem,
    setActiveItem,
    completedLessons,
    passedQuizzes,
    setPassedQuizzes,
    videoUrl,
    isLoading,
    error,
    certificateReady,
    setCertificateReady,
    expandedModules,
    toggleModule,
    toggleProgress,
    activeLesson,
    activeQuiz,
    // New
    activeTab,
    setActiveTab,
    notes,
    saveNotes,
    goToNextLesson,
    goToPreviousLesson,
    hasNextLesson,
    hasPreviousLesson,
    allLessons,
  };
}
