import { TeacherNotificationsClient } from "@/src/features/dashboard/components/teacher/TeacherNotificationsClient";

export const metadata = {
  title: "الإشعارات | لوحة تحكم المعلم",
  description: "عرض وتتبع الإشعارات",
};

export default function NotificationsPage() {
  return <TeacherNotificationsClient />;
}
