"use client";

import { useState, useEffect } from "react";
import { Home, BookOpen, Award, Bell, Trophy, Bookmark, User, Wallet } from "lucide-react";
import { DashboardShell } from "./DashboardShell";
import { fetchApi } from "@/src/lib/api";

const baseStudentLinks = [
  { label: "الرئيسية", href: "/dashboard/student", icon: Home },
  { label: "محفظتي", href: "/dashboard/student/wallet", icon: Wallet },
  { label: "دوراتي", href: "/dashboard/student/courses", icon: BookOpen },
  { label: "الشهادات", href: "/dashboard/student/certificates", icon: Award },
  { label: "الإنجازات", href: "/dashboard/student/achievements", icon: Trophy },
  { label: "المحفوظات", href: "/dashboard/student/bookmarks", icon: Bookmark },
  { label: "الإشعارات", href: "/dashboard/student/notifications", icon: Bell },
  { label: "الملف", href: "/dashboard/student/profile", icon: User },
];

export function StudentShell({
  children,
  user,
  profile,
  grades,
}: {
  children: React.ReactNode;
  user?: { name: string; avatar?: string; email?: string; phone?: string };
  profile?: any;
  grades?: any[];
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  const studentLinks = baseStudentLinks.map((link) =>
    link.href === "/dashboard/student/notifications" && unreadCount > 0
      ? { ...link, badge: unreadCount }
      : link
  );

  useEffect(() => {
    fetchApi("/notifications/unread-count")
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => {});
  }, []);

  return (
    <DashboardShell links={studentLinks} user={user} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
