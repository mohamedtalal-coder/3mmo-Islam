import { TeacherReviewsClient } from "@/src/features/dashboard/components/teacher/TeacherReviewsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المراجعات | لوحة المعلم",
};

export default function TeacherReviewsPage() {
  return <TeacherReviewsClient />;
}
