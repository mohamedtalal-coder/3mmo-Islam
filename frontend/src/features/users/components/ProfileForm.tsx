"use client";

import { Loader2, User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProfileForm } from "@/src/features/users/hooks/useProfileForm";

export function ProfileForm({ 
  initialName, 
  userRole 
}: { 
  initialName: string, 
  userRole: "TEACHER" | "STUDENT" | "ASSISTANT" | "teacher" | "student"
}) {
  const {
    fullName,
    setFullName,
    password,
    setPassword,
    loading,
    handleSubmit,
    handleLogout,
  } = useProfileForm(initialName);

  const backLink = (userRole === "TEACHER" || userRole === "teacher" || userRole === "ASSISTANT") ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 text-accent hover:text-accentLight font-ui text-sm mb-6 transition-colors"
      >
        <ArrowRight size={16} />
        الرجوع للوحة التحكم
      </Link>

      <div className="bg-surface border border-primary/5 p-8 rounded-[24px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="font-display text-3xl text-accent mb-6 relative z-10">إعدادات الحساب</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-ui text-muted flex items-center gap-2">
              <User size={16} />
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              disabled={userRole === "ASSISTANT"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-primary/10 rounded-[14px] px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60 disabled:bg-surface/50"
            />
          </div>

          {userRole !== "ASSISTANT" && (
            <div className="space-y-2">
              <label className="text-sm font-ui text-muted flex items-center gap-2">
                <Lock size={16} />
                تغيير كلمة المرور (اختياري)
              </label>
              <input
                type="password"
                placeholder="اترك الحقل فارغاً إذا لم ترد تغيير كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-primary/10 rounded-[14px] px-4 py-3 font-body bg-surface text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted/50"
              />
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-primary/5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full md:w-auto text-danger hover:text-danger font-ui text-sm font-bold px-4 py-2 border border-danger/20 rounded-md hover:bg-danger/10 transition-colors"
            >
              تسجيل الخروج
            </button>
            {userRole !== "ASSISTANT" && (
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-inverse font-ui font-semibold px-8 py-3 rounded-lg hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                حفظ التعديلات
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
