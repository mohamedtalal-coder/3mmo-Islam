"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";
import { fetchApi } from "@/src/lib/api";

type Mode = "login" | "register";

function safeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/dashboard";
  return path;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirectTo"));

  const [role, setRole] = useState<"teacher" | "student">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [currentGradeId, setCurrentGradeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (mode === "register") {
      fetchApi("/public/grades/all")
        .then((data) => {
          if (data.grades) {
            setGrades(data.grades);
          }
        })
        .catch((err) => console.error("Failed to fetch grades:", err));
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (mode === "register") {
      if (password !== confirmPassword) {
        toast.error("كلمة السر غير متطابقة.");
        return;
      }
      
      setLoading(true);
      try {
        await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ 
            email, 
            password, 
            fullName, 
            phone,
            parentPhone,
            governorate,
            currentGradeId,
            role: role.toUpperCase() 
          }),
        });
        toast.success("تم إنشاء الحساب بنجاح!");
        router.push(role === "teacher" ? "/dashboard/teacher" : redirectTo);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "حصلت مشكلة أثناء إنشاء الحساب. تأكد من البيانات وحاول تاني.");
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await fetchApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        toast.success("تم تسجيل الدخول بنجاح!");
        router.push(redirectTo);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        setLoading(false);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
      {mode === "register" && (
        <>
          <Input
            type="text"
            required
            placeholder="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            type="tel"
            required
            placeholder="رقم الطالب"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="رقم ولي الأمر"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="المحافظة"
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
          />
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-surfaceBorder bg-surface px-4 py-3 text-sm text-primary transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              value={currentGradeId}
              onChange={(e) => setCurrentGradeId(e.target.value)}
              required
            >
              <option value="" disabled>اختر الصف الخاص بك</option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-muted">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </>
      )}

      <Input
        type="email"
        required
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        required
        minLength={6}
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mode === "register" && (
        <Input
          type="password"
          required
          minLength={6}
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-4"
        size="lg"
      >
        {mode === "register" ? "إنشاء حساب" : "تسجيل الدخول"}
      </Button>
    </form>
  );
}
