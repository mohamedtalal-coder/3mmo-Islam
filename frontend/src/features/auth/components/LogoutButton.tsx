"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore errors on logout
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-2 text-danger hover:text-danger font-ui text-sm transition-colors">
      <LogOut size={16} />
      <span>تسجيل الخروج</span>
    </button>
  );
}
