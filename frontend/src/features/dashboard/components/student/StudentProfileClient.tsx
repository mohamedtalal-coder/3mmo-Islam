"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Lock, Camera, Bell, LogOut, Mail, Calendar, Eye, EyeOff, Shield, Phone, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useProfileForm } from "@/src/features/users/hooks/useProfileForm";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { fetchApi } from "@/src/lib/api";

interface ProfileProps {
  initialName: string;
  email: string;
  joinedAt: string;
  initialPhone?: string;
  initialParentPhone?: string;
  initialGovernorate?: string;
  initialCurrentGradeId?: string;
  initialNotifications?: any;
}

export function StudentProfileClient({ 
  initialName, 
  email, 
  joinedAt, 
  initialPhone = "", 
  initialParentPhone = "", 
  initialGovernorate = "", 
  initialCurrentGradeId = "", 
  initialNotifications 
}: ProfileProps) {
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

  const [phone, setPhone] = useState(initialPhone);
  const [parentPhone, setParentPhone] = useState(initialParentPhone);
  const [governorate, setGovernorate] = useState(initialGovernorate);
  const [currentGradeId, setCurrentGradeId] = useState(initialCurrentGradeId);
  const [grades, setGrades] = useState<any[]>([]);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchApi("/public/grades/all")
      .then((data) => {
        if (data.grades) {
          setGrades(data.grades);
        }
      })
      .catch((err) => console.error("Failed to fetch grades:", err));
  }, []);

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

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      phone: phone !== initialPhone ? phone : undefined,
      parentPhone: parentPhone !== initialParentPhone ? parentPhone : undefined,
      governorate: governorate !== initialGovernorate ? governorate : undefined,
      currentGradeId: currentGradeId !== initialCurrentGradeId ? currentGradeId : undefined,
    });
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

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Edit Profile */}
        <Card className="p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-xl text-primary mb-5 flex items-center gap-2">
            <User size={20} className="text-primary" />
            المعلومات الشخصية
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="رقم الطالب"
                leftIcon={<Phone size={14} />}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Input
                label="رقم ولي الأمر"
                leftIcon={<Phone size={14} />}
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="المحافظة"
                leftIcon={<MapPin size={14} />}
                type="text"
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-primary mr-1">الصف</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-surfaceBorder bg-surface px-4 py-3 pl-10 text-sm text-primary transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    value={currentGradeId}
                    onChange={(e) => setCurrentGradeId(e.target.value)}
                  >
                    <option value="" disabled>اختر الصف الخاص بك</option>
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-muted">
                    <GraduationCap size={16} className="text-muted" />
                  </div>
                </div>
              </div>
            </div>
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
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-opacity-75 ${
                    notifications[item.key] ? "bg-primary" : "bg-surfaceBorder"
                  }`}
                  role="switch"
                  aria-checked={notifications[item.key]}
                >
                  <span className="sr-only">Toggle {item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      notifications[item.key] ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
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
