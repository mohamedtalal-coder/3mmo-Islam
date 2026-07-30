import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/src/lib/api";

export function useProfileForm(initialName: string) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (password && password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      const body: any = {};
      if (fullName !== initialName) body.fullName = fullName;
      if (password) body.password = password;

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
    handleSubmit,
    handleLogout,
  };
}
