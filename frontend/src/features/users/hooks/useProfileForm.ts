import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";

export function useProfileForm(initialName: string, initialNotifications?: any) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications || {
    courseUpdates: true,
    quizReminders: true,
    certificates: true,
    payments: true,
  });

  async function handleSubmit(e: React.FormEvent, extraData?: any) {
    e.preventDefault();
    setLoading(true);

    try {
      if (password && password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      const body: any = extraData ? { ...extraData } : {};
      if (fullName !== initialName) body.fullName = fullName;
      if (password) body.password = password;

      if (initialNotifications) {
        if (notifications.courseUpdates !== initialNotifications.courseUpdates) body.notifyCourseUpdates = notifications.courseUpdates;
        if (notifications.quizReminders !== initialNotifications.quizReminders) body.notifyQuizReminders = notifications.quizReminders;
        if (notifications.certificates !== initialNotifications.certificates) body.notifyCertificates = notifications.certificates;
        if (notifications.payments !== initialNotifications.payments) body.notifyPayments = notifications.payments;
      }

      if (Object.keys(body).length > 0) {
        await fetchApi("/users/profile", {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }

      toast.success("تم حفظ التعديلات بنجاح!");
      setPassword("");
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "حدث خطأ أثناء حفظ التعديلات.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/login");
    router.refresh();
  }

  return {
    fullName,
    setFullName,
    password,
    setPassword,
    loading,
    notifications,
    setNotifications,
    handleSubmit,
    handleLogout,
  };
}
