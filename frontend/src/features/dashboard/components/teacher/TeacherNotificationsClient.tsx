"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, Users, CheckCheck, Loader2 } from "lucide-react";
import { TabBar } from "../student/TabBar";
import { EmptyState } from "../student/EmptyState";
import { Badge } from "@/src/shared/components/ui/Badge";
import { fetchApi } from "@/src/lib/api";

type NotificationType = "enrollment" | "course" | "quiz" | "certificate" | "payment";
type FilterType = "all" | NotificationType;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  timestamp: string;
  isRead: boolean;
}

const iconMap: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  enrollment: { icon: <Users size={18} />, color: "text-primary", bg: "bg-primary/10" },
  default: { icon: <Bell size={18} />, color: "text-accent", bg: "bg-gold/10" },
};

export function TeacherNotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApi("/notifications");
      setNotifications(data.notifications || []);
    } catch (err) {
      setError("تعذّر تحميل الإشعارات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs = [
    { id: "all", label: "الكل", count: notifications.length },
    { id: "enrollment", label: "تسجيلات الطلاب", icon: <Users size={14} /> },
  ];

  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAsRead = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.isRead) return;

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PATCH" });
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await fetchApi("/notifications/read-all", { method: "PATCH" });
    } catch (err) {
      loadNotifications();
      console.error(err);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-primary flex items-center gap-3">
          <Bell size={28} className="text-accent" />
          الإشعارات
          {unreadCount > 0 && (
            <Badge variant="danger" className="text-xs">
              {unreadCount} جديد
            </Badge>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-accent font-ui text-sm font-bold hover:text-accentLight transition-colors"
          >
            <CheckCheck size={16} />
            قراءة الكل
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-card bg-danger/10 text-danger font-ui text-sm text-center">
          {error}
          <button onClick={loadNotifications} className="block mx-auto mt-2 underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      <TabBar
        tabs={tabs}
        activeTab={filter}
        onTabChange={(id) => setFilter(id as FilterType)}
      />

      {filtered.length > 0 ? (
        <div className="space-y-2 stagger-children">
          {filtered.map((notification) => {
            const config = iconMap[notification.type] || iconMap.default;
            const content = (
              <>
                <div
                  className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 ${config.color}`}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-ui text-sm ${notification.isRead ? "text-muted" : "text-primary font-bold"}`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted font-body mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-muted/70 font-ui mt-2 block">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>
              </>
            );

            const className = `w-full text-right p-4 rounded-card flex items-start gap-4 transition-all duration-200 border bg-surface hover:border-primary/30 shadow-sm ${
              notification.isRead
                ? "border-surfaceBorder opacity-70"
                : "border-primary/20 bg-primary/5 shadow-soft"
            }`;

            if (notification.link) {
              return (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => markAsRead(notification.id)}
                  className={className}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={className}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell size={32} />}
          title="لا توجد إشعارات"
          description="ستظهر هنا إشعارات انضمام الطلاب وغيرها."
        />
      )}
    </div>
  );
}
