"use client";

import { useState } from "react";
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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      try {
        await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, fullName, role: role.toUpperCase() }),
        });
        toast.success("تم إنشاء الحساب بنجاح!");
        router.push(role === "teacher" ? "/dashboard/teacher" : redirectTo);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "حصلت مشكلة أثناء إنشاء الحساب. تأكد من البيانات وحاول تاني.");
        setLoading(false);
      }
    } else {
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
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
      {mode === "register" && (
        <>


          <div className="space-y-1">
            <Input
              type="text"
              required
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="space-y-1">
        <Input
          type="email"
          required
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Input
          type="password"
          required
          minLength={6}
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

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
