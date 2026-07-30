import { redirect } from "next/navigation";
import { ProfileForm } from "@/src/features/users/components/ProfileForm";
import { getProfile } from "@/src/lib/session";

export default async function TeacherProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background text-primary p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />
      
      <div className="relative z-10 pt-10">
        <ProfileForm initialName={profile?.fullName || ""} userRole="teacher" />
      </div>
    </main>
  );
}
