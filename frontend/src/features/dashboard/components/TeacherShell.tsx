"use client";

import { LayoutDashboard, BookOpen, Users, ClipboardList, Settings, GraduationCap } from "lucide-react";
import { DashboardShell } from "./DashboardShell";

const teacherLinks = [
  { label: "لوحة التحكم", href: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "المراحل", href: "/dashboard/teacher/grades", icon: GraduationCap },
  { label: "دوراتي", href: "/dashboard/teacher/courses", icon: BookOpen },
  { label: "الطلاب", href: "/dashboard/teacher/students", icon: Users },
  { label: "الاختبارات", href: "/dashboard/teacher/quizzes", icon: ClipboardList },
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

  let filteredLinks = teacherLinks;
  
  if (role === "COURSE_ADMIN") {
    filteredLinks = teacherLinks.filter(l => 
      l.href === "/dashboard/teacher" || 
      l.href === "/dashboard/teacher/courses" || 
      l.href === "/dashboard/teacher/grades"
    );
  } else if (role === "EXAM_ADMIN") {
    filteredLinks = teacherLinks.filter(l => 
      l.href === "/dashboard/teacher" || 
      l.href === "/dashboard/teacher/quizzes" || 
      l.href === "/dashboard/teacher/students"
    );
  }

  return (
    <DashboardShell links={filteredLinks} user={user}>
      {children}
    </DashboardShell>
  );
}
