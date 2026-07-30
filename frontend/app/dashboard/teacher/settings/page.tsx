import { redirect } from "next/navigation";
import { PlatformSettingsForm } from "@/src/shared/components/PlatformSettingsForm";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

export default async function TeacherSettingsPage() {
  let settings: any = null;

  try {
    const data = await fetchServerApi("/teacher/settings");
    settings = data?.settings;
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  return (
    <main className="min-h-screen bg-background text-primary p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[100px] opacity-30 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto pt-10">
        <PlatformSettingsForm initialData={settings || null} />
      </div>
    </main>
  );
}
