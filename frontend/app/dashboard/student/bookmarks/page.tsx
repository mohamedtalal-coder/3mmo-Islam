import { StudentBookmarksClient } from "@/src/features/dashboard/components/student/StudentBookmarksClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المحفوظات | المنصة التعليمية",
};

export default function BookmarksPage() {
  return <StudentBookmarksClient />;
}
