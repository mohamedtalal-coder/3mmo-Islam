import { redirect } from "next/navigation";
import { StudentProfileClient } from "@/src/features/dashboard/components/student/StudentProfileClient";
import { getProfile } from "@/src/lib/session";

export default async function StudentProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <StudentProfileClient
      initialName={profile.fullName || ""}
      email={profile.email || ""}
      joinedAt={profile.createdAt || ""}
      initialPhone={profile.phone || ""}
      initialParentPhone={profile.parentPhone || ""}
      initialGovernorate={profile.governorate || ""}
      initialSchoolName={profile.schoolName || ""}
      initialCurrentGradeId={profile.currentGradeId || ""}
      initialNotifications={{
        courseUpdates: profile.notifyCourseUpdates ?? true,
        quizReminders: profile.notifyQuizReminders ?? true,
        certificates: profile.notifyCertificates ?? true,
        payments: profile.notifyPayments ?? true,
      }}
    />
  );
}
