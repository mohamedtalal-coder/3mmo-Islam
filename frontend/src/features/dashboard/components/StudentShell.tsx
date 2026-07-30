"use client";

import { useState, useEffect } from "react";
import { Home, BookOpen, Award, Bell, Trophy, Bookmark, User } from "lucide-react";
import { DashboardShell } from "./DashboardShell";
import { fetchApi } from "@/src/lib/api";

const baseStudentLinks = [
  { label: "الرئيسية", href: "/dashboard/student", icon: Home },
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const studentLinks = baseStudentLinks.map((link) =>
    link.href === "/dashboard/student/notifications" && unreadCount > 0
      ? { ...link, badge: unreadCount }
      : link
  );

  useEffect(() => {
    if (profile && !profile.currentGradeId) {
      setShowOnboarding(true);
    }
  }, [profile]);

  useEffect(() => {
    fetchApi("/notifications/unread-count")
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => {});
  }, []);

  const handleSaveGrade = async () => {
    if (!selectedGrade) return;
    setIsSaving(true);
    try {
      await fetchApi("/student/profile", {
        method: "PUT",
        body: JSON.stringify({ current_grade_id: selectedGrade }),
      });
      setShowOnboarding(false);
      window.location.reload();
    } catch (e) {
      console.error("Failed to save grade");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DashboardShell links={studentLinks} user={user} unreadCount={unreadCount}>
        {children}
      </DashboardShell>

      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface shadow-md border border-primary/5 rounded-[24px] p-8 max-w-lg w-full">
            <h2 className="font-display text-3xl text-accent mb-2 text-center">أهلاً بك في المنصة!</h2>
            <p className="text-muted text-center mb-8 font-body">
              لتقديم أفضل تجربة لك، برجاء اختيار السنة الدراسية الخاصة بك.
            </p>

            <div className="space-y-4 mb-8">
              {grades?.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`w-full text-right p-4 rounded-xl border transition-all duration-300 font-ui text-lg ${
                    selectedGrade === grade.id
                      ? "bg-primary text-inverse border-primary shadow-sm"
                      : "bg-surface border-primary/5 text-primary hover:border-primary/20 hover:bg-surfaceHover"
                  }`}
                >
                  {grade.icon && <span className="me-3 text-xl">{grade.icon}</span>}
                  {grade.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveGrade}
              disabled={!selectedGrade || isSaving}
              className="w-full bg-primary text-inverse font-semibold font-ui px-6 py-4 rounded-xl hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving ? "جاري الحفظ..." : "تأكيد السنة الدراسية"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
