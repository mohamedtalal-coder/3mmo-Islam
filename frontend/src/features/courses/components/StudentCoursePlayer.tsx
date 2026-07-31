"use client";

import { QuizPlayer } from "@/src/features/exams/components/QuizPlayer";
import { LessonComments } from "./LessonComments";
import { BookmarkButton } from "./BookmarkButton";
import { ReviewSubmitForm } from "./ReviewSubmitForm";
import {
  CheckCircle, Circle, PlayCircle, FileText, Award, Loader2,
  ChevronDown, ChevronUp, ArrowRight, ArrowLeft, BookOpen,
  StickyNote, Download, MessageSquare, SkipForward, SkipBack, Maximize
} from "lucide-react";
import Link from "next/link";
import { useStudentCoursePlayer, Module, ContentTab } from "@/src/features/courses/hooks/useStudentCoursePlayer";
import { useState, useRef } from "react";
import { generateCertificate } from "@/src/features/certificates/certificateGenerator";
import { toast } from "sonner";

export default function StudentCoursePlayer({
  courseId,
  courseTitle,
  modules,
  initialCompletedLessons,
  initialPassedQuizzes = [],
  quizzesEnabled = false,
  certificatesEnabled = false,
  commentsEnabled = false,
  allLessonsAndQuizzesComplete = false,
  studentName = "",
  studentEmail = "",
  studentPhone = "",
  initialCertificate = null,
}: {
  courseId: string;
  courseTitle: string;
  modules: Module[];
  initialCompletedLessons: string[];
  initialPassedQuizzes?: string[];
  quizzesEnabled?: boolean;
  certificatesEnabled?: boolean;
  commentsEnabled?: boolean;
  allLessonsAndQuizzesComplete: boolean;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  initialCertificate?: any;
}) {
  const {
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
    activeTab,
    setActiveTab,
    notes,
    saveNotes,
    goToNextLesson,
    goToPreviousLesson,
    hasNextLesson,
    hasPreviousLesson,
  } = useStudentCoursePlayer({
    modules,
    initialCompletedLessons,
    initialPassedQuizzes,
    certificatesEnabled,
    allLessonsAndQuizzesComplete,
    initialCertificate,
    courseId,
  });

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const handleFullScreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const handleDownloadCertificate = async () => {
    if (!certificateReady) return;
    try {
      setIsGeneratingCert(true);
      const toastId = toast.loading("جاري إصدار الشهادة...");
      
      const blob = await generateCertificate(
        studentName,
        courseTitle,
        certificateReady.issuedAt || new Date().toISOString(),
        certificateReady.certificateNumber || `CERT-${Math.random().toString(36).substr(2,9).toUpperCase()}`
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `شهادة_إتمام_${courseTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("تم تحميل الشهادة بنجاح!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إنشاء الشهادة");
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalQuizzes = quizzesEnabled ? modules.reduce((acc, mod) => acc + (mod.quizzes?.length || 0), 0) : 0;
  const totalItems = totalLessons + totalQuizzes;
  const completedItems = completedLessons.size + passedQuizzes.size;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const contentTabs: { id: ContentTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "نظرة عامة", icon: <BookOpen size={15} /> },
    { id: "notes", label: "ملاحظاتي", icon: <StickyNote size={15} /> },
    { id: "resources", label: "المرفقات", icon: <Download size={15} /> },
    ...(quizzesEnabled && activeLesson?.quizzes?.length ? [{ id: "quizzes" as ContentTab, label: "الاختبارات", icon: <FileText size={15} /> }] : []),
    ...(commentsEnabled ? [{ id: "discussion" as ContentTab, label: "المناقشة", icon: <MessageSquare size={15} /> }] : []),
  ];

  // Mock resources for demo
  const mockResources = [
    { name: "ملخص الدرس.pdf", size: "2.4 MB", type: "pdf" },
    { name: "تمارين إضافية.pdf", size: "1.8 MB", type: "pdf" },
    { name: "الشرائح التوضيحية.pptx", size: "5.1 MB", type: "pptx" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden absolute inset-0 z-10">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 w-80 bg-surface shadow-lg flex flex-col overflow-hidden shrink-0 font-ui z-50 transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        {/* Mobile Close Button */}
        <button 
          className="md:hidden absolute top-4 left-4 p-2 text-muted hover:text-accent bg-background rounded-full shadow-sm z-10"
          onClick={() => setIsSidebarOpen(false)}
        >
          <ArrowRight size={20} />
        </button>
        
        {/* Header with Progress */}
        <div className="p-5 border-b border-surfaceBorder bg-surface">
          <h2 className="font-display text-xl text-primary mb-4 text-center">المحتوى</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-gold/10 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-l from-gold to-gold-soft h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-accent whitespace-nowrap">{progressPercentage}%</span>
          </div>
          <p className="text-[11px] text-muted mt-2 text-center">
            {completedItems} من {totalItems} مكتمل
          </p>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {modules.map((module, idx) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleLessonsDone = module.lessons.filter(l => completedLessons.has(l.id)).length;
            const moduleTotal = module.lessons.length + (module.quizzes?.length || 0);
            
            return (
              <div key={module.id} className="rounded-[18px] overflow-hidden bg-surface shadow-sm mb-2">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3.5 bg-surface hover:bg-gold/5 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-gold/10 text-accent flex items-center justify-center text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="text-right">
                      <h3 className="font-bold text-primary text-sm">{module.title}</h3>
                      <span className="text-[10px] text-muted">{moduleLessonsDone}/{moduleTotal}</span>
                    </div>
                  </div>
                  <div className="text-muted">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                
                {isExpanded && (
                  <ul className="py-1.5 px-1.5 space-y-0.5 bg-background/50">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveItem({ type: "lesson", lesson })}
                          className={`w-full text-right p-2.5 rounded-lg flex items-center justify-between text-sm transition-all duration-200 cursor-pointer ${
                            activeLesson?.id === lesson.id
                              ? "bg-gold/10 text-accent font-bold"
                              : "hover:bg-surface text-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <PlayCircle size={14} className="shrink-0 opacity-70" />
                            <span className="truncate text-[13px]">{lesson.title}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProgress(lesson.id);
                            }}
                            className="shrink-0 p-0.5 rounded-full hover:bg-surface transition-colors"
                            title={completedLessons.has(lesson.id) ? "إلغاء كمكتمل" : "تحديد كمكتمل"}
                          >
                            {completedLessons.has(lesson.id) ? (
                              <CheckCircle size={16} className="text-success" />
                            ) : (
                              <Circle size={16} className="text-muted/40" />
                            )}
                          </button>
                        </div>
                        {/* Lesson Quizzes */}
                        {quizzesEnabled && lesson.quizzes?.map((quiz) => (
                          <div key={quiz.id} className="pr-4 mt-1">
                            <button
                              onClick={() => setActiveItem({ type: "quiz", quiz })}
                              className={`w-full text-right p-2 rounded-lg flex items-center justify-between text-xs transition-all duration-200 ${
                                activeQuiz?.id === quiz.id
                                  ? "bg-gold/10 text-accent font-bold"
                                  : "hover:bg-surface text-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText size={12} className="shrink-0 opacity-70" />
                                <span className="truncate">{quiz.title}</span>
                              </div>
                              {passedQuizzes.has(quiz.id) && (
                                <Award size={14} className="text-success shrink-0" />
                              )}
                            </button>
                          </div>
                        ))}
                      </li>
                    ))}
                    {quizzesEnabled &&
                      module.quizzes?.map((quiz) => (
                        <li key={quiz.id}>
                          <button
                            onClick={() => setActiveItem({ type: "quiz", quiz })}
                            className={`w-full text-right p-2.5 rounded-lg flex items-center justify-between text-sm transition-all duration-200 ${
                              activeQuiz?.id === quiz.id
                                ? "bg-gold/10 text-accent font-bold"
                                : "hover:bg-surface text-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <FileText size={14} className="shrink-0 opacity-70" />
                              <span className="truncate text-[13px]">{quiz.title}</span>
                            </div>
                            {passedQuizzes.has(quiz.id) && (
                              <Award size={16} className="text-success shrink-0" />
                            )}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Certificate Button */}
        {certificatesEnabled && !!certificateReady && (
          <div className="p-4 border-t border-surfaceBorder">
            <Link
              href="/dashboard/student/certificates"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-inverse font-bold px-4 py-3 rounded-xl hover:shadow-gold transition-all text-sm"
            >
              <Award size={18} />
              معاينة شهادة الإتمام
            </Link>
          </div>
        )}

        {/* Review Submission */}
        {allLessonsAndQuizzesComplete && (
          <div className="p-4 border-t border-surfaceBorder">
            <ReviewSubmitForm courseId={courseId} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background text-primary overflow-y-auto relative z-10 custom-scrollbar w-full">
        {/* Topbar/Breadcrumbs */}
        <header className="px-4 md:px-6 py-3 bg-surface/80 backdrop-blur-xl border-b border-surfaceBorder flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 font-ui text-sm text-muted">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-primary p-2 mr-[-8px] hover:bg-gold/10 rounded-full transition-colors"
            >
              <BookOpen size={20} />
            </button>
            <Link href="/dashboard/student" className="hidden sm:block hover:text-accent transition-colors">الدورات</Link>
            <span className="hidden sm:block text-muted/30">/</span>
            <span className="text-primary font-bold truncate max-w-[150px] sm:max-w-xs">{courseTitle}</span>
          </div>
          <Link
            href="/dashboard/student"
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors font-ui text-sm shrink-0 px-3 py-1.5 rounded-lg hover:bg-gold/5"
          >
            <ArrowRight size={14} />
            <span className="hidden sm:inline">العودة</span>
          </Link>
        </header>

        {activeQuiz ? (
          <QuizPlayer
            quizId={activeQuiz.id}
            onPassed={(certificate) => {
              setPassedQuizzes((prev) => new Set(prev).add(activeQuiz.id));
              if (certificatesEnabled && certificate) {
                setTimeout(() => setCertificateReady(certificate), 1500);
              } else if (certificatesEnabled) {
                setTimeout(() => setCertificateReady(true), 1500);
              }
            }}
          />
        ) : activeLesson ? (
          <div className="flex-1 flex flex-col items-center p-4 md:p-8 lg:p-10">
            {/* Video Player */}
            <div 
              ref={videoContainerRef}
              className="w-full max-w-5xl aspect-video bg-black rounded-[24px] overflow-hidden shadow-xl relative group border border-primary/5"
            >
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/90 backdrop-blur-sm z-20">
                  <Loader2 size={36} className="animate-spin text-accent mb-3" />
                  <span className="text-accent font-ui text-sm">جاري تحميل الفيديو...</span>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/90 z-20">
                  <div className="text-center p-6 bg-danger/10 border border-danger/20 rounded-xl max-w-sm">
                    <p className="text-danger font-bold mb-2 font-ui">حدث خطأ</p>
                    <p className="text-danger/70 font-body text-sm">{error}</p>
                  </div>
                </div>
              )}

              {videoUrl && !isLoading && !error && (
                <>
                  <iframe
                    src={videoUrl}
                    loading="lazy"
                    className="w-full h-full border-0 absolute inset-0 z-10"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={false}
                  ></iframe>
                  
                  {/* Anti-Piracy Watermark Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" aria-hidden="true">
                    <div
                      className="absolute whitespace-nowrap font-ui text-sm md:text-base font-semibold select-none animate-watermark"
                      style={{ color: "rgba(255, 255, 255, 0.4)", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
                    >
                      {studentName} - {studentPhone}
                    </div>

                  </div>

                  {/* Custom Fullscreen Button */}
                  <button 
                    onClick={handleFullScreen}
                    className="absolute bottom-4 right-4 z-30 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-lg transition-colors cursor-pointer"
                    title="تكبير الشاشة"
                  >
                    <Maximize size={20} />
                  </button>
                </>
              )}

              {!videoUrl && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/30 z-10">
                  <span className="text-muted font-ui text-sm">الفيديو غير متاح لهذا الدرس حالياً.</span>
                </div>
              )}
            </div>

            {/* Lesson Title + Mark Complete + Nav */}
            <div className="w-full max-w-5xl mt-6 md:mt-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 pb-6 border-b border-primary/10">
              <div className="w-full md:w-auto">
                <h2 className="font-display text-xl md:text-2xl text-primary mb-1">{activeLesson.title}</h2>
                <p className="font-body text-muted text-xs md:text-sm">قم بتحديد الدرس كمكتمل عند الانتهاء.</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Previous / Next */}
                <button
                  onClick={goToPreviousLesson}
                  disabled={!hasPreviousLesson}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-ui text-sm text-muted border border-surfaceBorder hover:border-primary/20 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="الدرس السابق"
                >
                  <SkipForward size={16} />
                  <span className="hidden sm:inline">السابق</span>
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={!hasNextLesson}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-ui text-sm text-muted border border-surfaceBorder hover:border-primary/20 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="الدرس التالي"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <SkipBack size={16} />
                </button>

                {/* Bookmark */}
                <BookmarkButton lessonId={activeLesson.id} />

                {/* Mark Complete */}
                <button
                  onClick={() => toggleProgress(activeLesson.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold font-ui text-sm transition-all duration-300 ${
                    completedLessons.has(activeLesson.id)
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-gold text-primary font-bold hover:bg-gold-soft shadow-sm"
                  }`}
                >
                  {completedLessons.has(activeLesson.id) ? (
                    <>
                      <CheckCircle size={16} />
                      تم الإكمال
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      تحديد كمكتمل
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="w-full max-w-5xl mt-6">
              <div className="flex gap-1 overflow-x-auto border-b border-primary/10 custom-scrollbar pb-1">
                {contentTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-ui text-sm transition-all border-b-2 -mb-[1px] ${
                      activeTab === tab.id
                        ? "text-accent border-gold font-bold"
                        : "text-muted border-transparent hover:text-primary hover:border-gold/20"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="animate-fade-in space-y-4">
                    <div className="bg-surface shadow-sm rounded-[18px] p-6">
                      <h3 className="font-ui font-bold text-primary text-sm mb-2">عن هذا الدرس</h3>
                      <p className="text-muted font-body text-sm leading-relaxed">
                        استمتع بمشاهدة هذا الدرس وتأكد من فهم المحتوى قبل الانتقال للدرس التالي.
                        يمكنك تدوين ملاحظاتك في تبويب الملاحظات والعودة لمراجعتها في أي وقت.
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                  <div className="animate-fade-in">
                    <div className="bg-surface shadow-sm rounded-[18px] p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-ui font-bold text-primary text-sm flex items-center gap-2">
                          <StickyNote size={16} className="text-accent" />
                          ملاحظاتي على هذا الدرس
                        </h3>
                        <span className="text-[11px] text-muted font-ui">يتم الحفظ تلقائياً</span>
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => saveNotes(e.target.value)}
                        placeholder="اكتب ملاحظاتك هنا..."
                        className="w-full h-48 bg-background/50 border border-surfaceBorder rounded-xl p-4 font-body text-sm text-primary resize-none focus:outline-none focus:border-primary transition-colors placeholder:text-muted/40"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {/* Resources Tab */}
                {activeTab === "resources" && (
                  <div className="animate-fade-in space-y-4">
                    {mockResources.map((resource, i) => (
                      <div key={i} className="bg-surface shadow-sm rounded-[18px] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                            <FileText size={18} className="text-accent" />
                          </div>
                          <div>
                            <h4 className="font-ui font-bold text-primary text-sm">{resource.name}</h4>
                            <span className="text-[11px] text-muted font-ui">{resource.size}</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 text-accent font-ui text-sm font-bold hover:bg-gold/20 transition-colors">
                          <Download size={14} />
                          تحميل
                        </button>
                      </div>
                    ))}
                    <p className="text-center text-muted text-xs font-ui mt-4">
                      المرفقات المعروضة هي عينة توضيحية
                    </p>
                  </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === "quizzes" && quizzesEnabled && activeLesson?.quizzes?.length && (
                  <div className="animate-fade-in space-y-4">
                    {activeLesson.quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-surface shadow-sm rounded-[18px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surfaceBorder/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            passedQuizzes.has(quiz.id) ? "bg-success/10 text-success" : "bg-gold/10 text-accent"
                          }`}>
                            {passedQuizzes.has(quiz.id) ? <Award size={24} /> : <FileText size={24} />}
                          </div>
                          <div>
                            <h4 className="font-ui font-bold text-primary text-base mb-1">{quiz.title}</h4>
                            <span className={`text-[12px] font-ui ${passedQuizzes.has(quiz.id) ? "text-success font-bold" : "text-muted"}`}>
                              {passedQuizzes.has(quiz.id) ? "لقد اجتزت هذا الاختبار بنجاح" : "لم يتم اجتياز الاختبار بعد"}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveItem({ type: "quiz", quiz })}
                          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-ui text-sm font-bold transition-all shrink-0 ${
                            passedQuizzes.has(quiz.id)
                              ? "bg-surface border border-surfaceBorder text-primary hover:bg-surface/80"
                              : "bg-gold text-primary hover:bg-gold-soft shadow-sm"
                          }`}
                        >
                          {passedQuizzes.has(quiz.id) ? "إعادة الاختبار" : "ابدأ الاختبار الآن"}
                          <ArrowLeft size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discussion Tab */}
                {activeTab === "discussion" && commentsEnabled && (
                  <div className="animate-fade-in">
                    <LessonComments lessonId={activeLesson.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted font-ui">
            <PlayCircle size={56} className="text-accent/20 mb-4" />
            <p className="text-lg">اختر درساً من القائمة للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
}
