"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, Users, ClipboardList, Settings, GraduationCap, Bell, Star, HelpCircle } from "lucide-react";
import { DashboardShell } from "./DashboardShell";
import { fetchApi } from "@/src/lib/api";

const teacherLinks = [
  { label: "لوحة التحكم", href: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "المراحل", href: "/dashboard/teacher/grades", icon: GraduationCap },
  { label: "دوراتي", href: "/dashboard/teacher/courses", icon: BookOpen },
  { label: "الطلاب", href: "/dashboard/teacher/students", icon: Users },
  { label: "الاختبارات", href: "/dashboard/teacher/quizzes", icon: ClipboardList },
  { label: "المراجعات", href: "/dashboard/teacher/reviews", icon: Star },
  { label: "الأسئلة", href: "/dashboard/teacher/faqs", icon: HelpCircle },
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
  
  if (role === "ASSISTANT") {
    const perms = (user as any)?.permissions || [];
    filteredLinks = filteredLinks.filter(l => {
      if (l.href === "/dashboard/teacher") return perms.includes("DASHBOARD");
      if (l.href === "/dashboard/teacher/grades") return perms.includes("GRADE");
      if (l.href === "/dashboard/teacher/courses") return perms.includes("COURSE");
      if (l.href === "/dashboard/teacher/students") return perms.includes("STUDENT");
      if (l.href === "/dashboard/teacher/quizzes") return perms.includes("QUIZ");
      if (l.href === "/dashboard/teacher/reviews") return perms.includes("REVIEW");
      if (l.href === "/dashboard/teacher/faqs") return perms.includes("FAQ");
      if (l.href === "/dashboard/teacher/notifications") return true; // maybe allow notifications for everyone
      if (l.href === "/dashboard/teacher/settings") return perms.includes("SETTINGS");
      return false;
    });
  } else if (role === "TEACHER") {
    // Teachers get access to the assistants management page
    filteredLinks.push({ label: "المساعدين", href: "/dashboard/teacher/assistants", icon: Users });
  }

  return (
    <DashboardShell links={filteredLinks} user={user} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
