"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Users, ClipboardList, Settings, GraduationCap, Bell, Star } from "lucide-react";
import { DashboardShell } from "./DashboardShell";
import { fetchApi } from "@/src/lib/api";

const teacherLinks = [
  { label: "لوحة التحكم", href: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "المراحل", href: "/dashboard/teacher/grades", icon: GraduationCap },
  { label: "دوراتي", href: "/dashboard/teacher/courses", icon: BookOpen },
  { label: "الطلاب", href: "/dashboard/teacher/students", icon: Users },
  { label: "الاختبارات", href: "/dashboard/teacher/quizzes", icon: ClipboardList },
  { label: "المراجعات", href: "/dashboard/teacher/reviews", icon: Star },
  { label: "الإشعارات", href: "/dashboard/teacher/notifications", icon: Bell },
  { label: "الإعدادات", href: "/dashboard/teacher/settings", icon: Settings },
];

export function TeacherShell({ 
  children,
  user
}: { 
  children: React.ReactNode;
  user?: { name: string; avatar?: string; role?: string };
}) {
  const role = user?.role || "TEACHER";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchApi("/notifications/unread-count")
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => {});
  }, []);

  let filteredLinks = teacherLinks.map((link) =>
    link.href === "/dashboard/teacher/notifications" && unreadCount > 0
      ? { ...link, badge: unreadCount }
      : link
  );
  
  if (role === "COURSE_ADMIN") {
    filteredLinks = filteredLinks.filter(l => 
      l.href === "/dashboard/teacher/courses"
    );
  } else if (role === "EXAM_ADMIN") {
    filteredLinks = filteredLinks.filter(l => 
      l.href === "/dashboard/teacher/quizzes"
    );
  }

  return (
    <DashboardShell links={filteredLinks} user={user} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
