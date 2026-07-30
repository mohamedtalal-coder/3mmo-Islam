import { redirect } from "next/navigation";
import { StudentCoursesClient } from "@/src/features/dashboard/components/student/StudentCoursesClient";
import { fetchServerApi } from "@/src/lib/serverApi";
import { getProfile } from "@/src/lib/session";

export const revalidate = 0;

export default async function StudentCoursesPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  let data: any = null;
  let error: any = null;

  try {
    data = await fetchServerApi("/student/courses");
  } catch (err) {
    error = err;
  }

  const enrollments = data?.enrollments || [];
  const certifiedCourseIds = data?.certifiedCourseIds || [];

  const processedEnrollments = enrollments
    .filter((e: any) => e.course && !e.course.deletedAt)
    .map((e: any) => {
      const now = new Date();
      const expiresAt = e.expiresAt ? new Date(e.expiresAt) : null;
      const enrollmentStatus = e.status ?? "active";
      const isExpired =
        enrollmentStatus === "suspended" ||
        (expiresAt ? expiresAt < now : false);
      const isCompleted =
        e.progressPercentage === 100 || enrollmentStatus === "COMPLETED";

      let daysRemaining = 0;
      if (expiresAt && !isExpired) {
        const diffTime = expiresAt.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        id: e.id,
        courseId: e.courseId,
        title: e.course.title,
        description: e.course.description,
        thumbnailUrl: e.course.thumbnailUrl,
        price: e.course.price,
        isExpired,
        isCompleted,
        hasCertificate: certifiedCourseIds.includes(e.courseId),
        lastViewedAt: e.lastViewedAt,
        createdAt: e.createdAt,
        daysRemaining,
        progress: Number(e.progressPercentage ?? 0),
      };
    });

  return (
    <StudentCoursesClient
      enrollments={processedEnrollments}
      hasError={!!error}
    />
  );
}
