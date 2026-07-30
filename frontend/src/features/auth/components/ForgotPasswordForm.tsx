"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/src/shared/components/ui/Input";
import { Button } from "@/src/shared/components/ui/Button";

import { fetchApi } from "@/src/lib/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إرسال الرابط.");
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right">
      <Input
        type="email"
        required
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        dir="rtl"
      />
      <Button
        type="submit"
        isLoading={loading}
        className="w-full mt-4"
        size="lg"
      >
        إرسال الرابط
      </Button>
    </form>
  );
}
