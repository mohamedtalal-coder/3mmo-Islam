import { redirect } from "next/navigation";
import { TeacherShell } from "@/src/features/dashboard/components/TeacherShell";
import { getProfile } from "@/src/lib/session";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const role = profile.role?.toUpperCase();
  if (role !== "TEACHER" && role !== "ASSISTANT") {
    redirect("/dashboard/student");
  }

  const name = profile.fullName || "معلم";
  const permissions = profile.permissions || [];

  return (
    <TeacherShell user={{ name, role, permissions }}>
      {children}
    </TeacherShell>
  );
}
