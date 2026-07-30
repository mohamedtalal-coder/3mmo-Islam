import { StudentAchievementsClient } from "@/src/features/dashboard/components/student/StudentAchievementsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإنجازات | المنصة التعليمية",
};

export default function AchievementsPage() {
  return <StudentAchievementsClient />;
}
