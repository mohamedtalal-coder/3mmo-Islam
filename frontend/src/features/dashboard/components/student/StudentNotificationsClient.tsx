"use client";

import { useState } from "react";
import { Bell, BookOpen, FileText, Award, CreditCard, CheckCheck, Check } from "lucide-react";
import { TabBar } from "./TabBar";
import { EmptyState } from "./EmptyState";
import { Badge } from "@/src/shared/components/ui/Badge";

type NotificationType = "course" | "quiz" | "certificate" | "payment";
type FilterType = "all" | NotificationType;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const iconMap: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string }> = {
  course: { icon: <BookOpen size={18} />, color: "text-primary", bg: "bg-primary/10" },
  quiz: { icon: <FileText size={18} />, color: "text-primary", bg: "bg-primary/10" },
  certificate: { icon: <Award size={18} />, color: "text-accent", bg: "bg-gold/10" },
  payment: { icon: <CreditCard size={18} />, color: "text-success", bg: "bg-success/10" },
};

// Mock notifications
const initialNotifications: Notification[] = [
  { id: "1", type: "course", title: "درس جديد متاح", message: "تم إضافة درس جديد في دورة الرياضيات المتقدمة", timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false },
  { id: "2", type: "quiz", title: "تذكير باختبار", message: "لديك اختبار في الوحدة الثالثة ينتهي غداً", timestamp: new Date(Date.now() - 7200000).toISOString(), isRead: false },
  { id: "3", type: "certificate", title: "شهادة جاهزة!", message: "تهانينا! شهادة إتمام دورة الرياضيات جاهزة للتحميل", timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: false },
  { id: "4", type: "payment", title: "تأكيد الدفع", message: "تم استلام دفعتك بنجاح لدورة الفيزياء", timestamp: new Date(Date.now() - 172800000).toISOString(), isRead: true },
  { id: "5", type: "course", title: "تحديث محتوى", message: "تم تحديث محتوى الوحدة الثانية في دورة الكيمياء", timestamp: new Date(Date.now() - 259200000).toISOString(), isRead: true },
];

export function StudentNotificationsClient() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { id: "all", label: "الكل", count: notifications.length },
    { id: "course", label: "الدورات", icon: <BookOpen size={14} /> },
    { id: "quiz", label: "الاختبارات", icon: <FileText size={14} /> },
    { id: "certificate", label: "الشهادات", icon: <Award size={14} /> },
    { id: "payment", label: "المدفوعات", icon: <CreditCard size={14} /> },
  ];

  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => n.type === filter);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Tabs */}
      <TabBar
        tabs={tabs}
        activeTab={filter}
        onTabChange={(id) => setFilter(id as FilterType)}
      />

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <div className="space-y-2 stagger-children">
          {filtered.map((notification) => {
            const config = iconMap[notification.type];
            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full text-right p-4 rounded-card flex items-start gap-4 transition-all duration-200 border bg-surface hover:border-primary/30 shadow-sm ${
                  notification.isRead
                    ? "border-surfaceBorder opacity-70"
                    : "border-primary/20 bg-primary/5 shadow-soft"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-ui text-sm ${notification.isRead ? "text-muted" : "text-primary font-bold"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted font-body mt-1 leading-relaxed">{notification.message}</p>
                  <span className="text-[11px] text-muted/70 font-ui mt-2 block">{formatTimeAgo(notification.timestamp)}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell size={32} />}
          title="لا توجد إشعارات"
          description="ستظهر هنا إشعارات تحديثات الدورات والاختبارات والشهادات."
        />
      )}
    </div>
  );
}
