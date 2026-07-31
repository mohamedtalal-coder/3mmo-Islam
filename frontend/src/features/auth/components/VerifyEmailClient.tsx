"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { fetchApi } from "@/src/lib/api";
import { Button } from "@/src/shared/components/ui/Button";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("رابط التفعيل غير موجود أو غير صالح.");
      return;
    }

    fetchApi("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "تم تفعيل حسابك بنجاح!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "فشل تفعيل الحساب. قد يكون الرابط منتهي الصلاحية.");
      });
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted text-sm">جاري التحقق من التوكن...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-display text-primary">تم التفعيل بنجاح!</h3>
          <p className="text-muted text-sm">{message}</p>
        </div>
        <Link href="/login" className="w-full max-w-xs">
          <Button className="w-full">تسجيل الدخول</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <XCircle className="w-16 h-16 text-red-500" />
      <div className="space-y-2">
        <h3 className="text-xl font-display text-primary">فشل التفعيل</h3>
        <p className="text-muted text-sm">{message}</p>
      </div>
      <Link href="/login" className="w-full max-w-xs">
        <Button variant="outline" className="w-full">العودة لتسجيل الدخول</Button>
      </Link>
    </div>
  );
}
