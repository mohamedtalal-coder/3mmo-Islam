"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

import { fetchApi } from "@/src/lib/api";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) {
      toast.error("رابط غير صالح أو منتهي الصلاحية.");
      return;
    }

    setLoading(true);

    try {
      await fetchApi("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      toast.success("تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور.");
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right">
      <Input
        type="password"
        required
        placeholder="كلمة المرور الجديدة"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        dir="rtl"
      />
      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-4"
        size="lg"
      >
        تغيير كلمة المرور
      </Button>
    </form>
  );
}
