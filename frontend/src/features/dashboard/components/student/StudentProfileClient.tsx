"use client";

import { useState } from "react";
import { Loader2, User, Lock, Camera, Bell, LogOut, Mail, Calendar, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useProfileForm } from "@/src/features/users/hooks/useProfileForm";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";

interface ProfileProps {
  initialName: string;
  email: string;
  joinedAt: string;
  initialNotifications?: any;
}

export function StudentProfileClient({ initialName, email, joinedAt, initialNotifications }: ProfileProps) {
  const {
    fullName,
    setFullName,
    password,
    setPassword,
    loading,
    notifications,
    setNotifications,
    handleSubmit,
    handleLogout,
  } = useProfileForm(initialName, initialNotifications);

  const [showPassword, setShowPassword] = useState(false);




  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6 flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-surfaceHover border-2 border-surfaceBorder flex items-center justify-center overflow-hidden">
            <User size={36} className="text-primary" />
          </div>
          <button className="absolute -bottom-2 -left-2 w-8 h-8 rounded-lg bg-surface border border-surfaceBorder text-primary flex items-center justify-center shadow-sm hover:bg-surfaceHover transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-right">
          <h1 className="font-display text-2xl text-primary mb-1">{fullName || "طالب"}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted font-ui">
            <span className="flex items-center gap-1.5">
              <Mail size={14} />
              {email}
            </span>
            {joinedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                انضم {formatDate(joinedAt)}
              </span>
            )}
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Edit Profile */}
        <Card className="p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-xl text-primary mb-5 flex items-center gap-2">
            <User size={20} className="text-primary" />
            المعلومات الشخصية
          </h2>
          
          <div className="space-y-4">
            <Input
              label="الاسم الكامل"
              leftIcon={<User size={14} />}
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="البريد الإلكتروني"
              leftIcon={<Mail size={14} />}
              type="email"
              value={email}
              disabled
              className="bg-background/50 text-muted cursor-not-allowed"
            />
          </div>
        </Card>

        {/* Password Change */}
        <Card className="p-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-display text-xl text-primary mb-5 flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            الأمان
          </h2>
          
          <div>
            <Input
              type={showPassword ? "text" : "password"}
              label="كلمة المرور الجديدة (اختياري)"
              placeholder="اترك الحقل فارغاً إذا لم ترد تغيير كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={14} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            {password && (
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      password.length > i * 3
                        ? password.length > 10
                          ? "bg-success"
                          : password.length > 6
                          ? "bg-warning"
                          : "bg-danger"
                        : "bg-surfaceBorder"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-display text-xl text-primary mb-5 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            الإشعارات
          </h2>
          
          <div className="space-y-4">
            {[
              { key: "courseUpdates" as const, label: "تحديثات الدورات", desc: "إشعار عند إضافة دروس جديدة" },
              { key: "quizReminders" as const, label: "تذكير بالاختبارات", desc: "تذكير بالاختبارات القادمة" },
              { key: "certificates" as const, label: "الشهادات", desc: "إشعار عند توفر شهادة جديدة" },
              { key: "payments" as const, label: "المدفوعات", desc: "تأكيد عمليات الدفع" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-ui font-bold text-primary text-sm">{item.label}</p>
                  <p className="text-xs text-muted font-body">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(item.key)}
                  className={`toggle-switch ${notifications[item.key] ? "active" : ""}`}
                  role="switch"
                  aria-checked={notifications[item.key]}
                />
              </div>
            ))}
          </div>
        </Card>


        {/* Save + Logout */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2 pb-8">
          <Button
            type="button"
            variant="danger"
            onClick={handleLogout}
            leftIcon={<LogOut size={16} />}
          >
            تسجيل الخروج
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            isLoading={loading}
          >
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </div>
  );
}
