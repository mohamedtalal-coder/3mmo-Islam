import { notFound, redirect } from "next/navigation";
import StudentCoursePlayer from "@/src/features/courses/components/StudentCoursePlayer";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchServerApi } from "@/src/lib/serverApi";
import { getProfile } from "@/src/lib/session";

export const revalidate = 0;

export default async function StudentCoursePage({ params }: { params: { id: string } }) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  let data: any = null;
  let error: any = null;

  try {
    data = await fetchServerApi(`/student/courses/${params.id}`);
  } catch (err: any) {
    if (err.message === 'Not enrolled in this course') {
      redirect(`/courses/${params.id}`);
    } else if (err.message === 'Enrollment expired') {
      redirect("/dashboard/student");
    } else if (err.message === 'Course not found') {
      notFound();
    }
    error = err;
  }

  if (error || !data) {
    notFound();
  }

  const { course, modules, completedLessonIds, quizzes = [] } = data;

  // Filter lessons and sort
  const cleanModules = modules?.map((m: any) => ({
    ...m,
    lessons: m.lessons?.sort((a: any, b: any) => a.position - b.position) || [],
    quizzes: quizzes.filter((q: any) => q.moduleId === m.id && !q.lessonId), // Quizzes for the module
  })) || [];

  // Also we should pass lesson quizzes down? StudentCoursePlayer expects quizzes to be nested inside module.quizzes, but what about lesson.quizzes?
  cleanModules.forEach((m: any) => {
    m.lessons.forEach((l: any) => {
      l.quizzes = quizzes.filter((q: any) => q.lessonId === l.id);
    });
  });

  const courseLessonIds = new Set(cleanModules.flatMap((m: any) => m.lessons.map((l: any) => l.id)));
  const completedIdsSet = new Set(completedLessonIds.filter((id: string) => courseLessonIds.has(id)));

  const totalLessons = courseLessonIds.size;
  const allLessonsDone = totalLessons > 0 && completedIdsSet.size >= totalLessons;
  const totalQuizzes = 0;
  const allQuizzesPassed = true; // Placeholder for quizzes

  return (
    <div className="h-screen flex flex-col bg-background text-primary overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <StudentCoursePlayer 
          courseId={course.id} 
          courseTitle={course.title}
          modules={cleanModules} 
          initialCompletedLessons={Array.from(completedIdsSet) as string[]}
          initialPassedQuizzes={[]}
          quizzesEnabled={siteConfig.features.quizzes}
          certificatesEnabled={siteConfig.features.certificates}
          commentsEnabled={siteConfig.features.community}
          allLessonsAndQuizzesComplete={allLessonsDone && allQuizzesPassed}
          studentName={profile.fullName}
          studentEmail={profile.email}
          studentPhone={profile.phone || ""}
          initialCertificate={data.certificate}
          attachments={course.attachments || []}
        />
      </div>
    </div>
  );
}
