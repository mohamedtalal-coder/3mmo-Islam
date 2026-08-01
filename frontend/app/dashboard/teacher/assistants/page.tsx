import { Metadata } from "next";
import { AssistantsClient } from "@/src/features/teacher/components/assistants/AssistantsClient";

export const metadata: Metadata = {
  title: "المساعدين - لوحة تحكم المعلم",
};

export default function AssistantsPage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <AssistantsClient />
    </div>
  );
}
