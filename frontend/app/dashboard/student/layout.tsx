import { redirect } from "next/navigation";
import { StudentShell } from "@/src/features/dashboard/components/StudentShell";
import { getProfile, getGrades } from "@/src/lib/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const role = profile.role?.toUpperCase();
  if (role === "TEACHER" || role === "ASSISTANT") {
    redirect("/dashboard/teacher");
  }

  // Fetch available grades for onboarding
  const grades = await getGrades();

  const name = profile.fullName || "طالب";
  const email = profile.email || "";
  const phone = profile.phone || "";

  return (
    <StudentShell 
      user={{ name, email, phone }} 
      profile={profile} 
      grades={grades || []}
    >
      {children}
    </StudentShell>
  );
}
