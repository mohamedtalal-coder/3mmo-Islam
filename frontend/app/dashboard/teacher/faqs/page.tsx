import { Metadata } from "next";
import { FaqManagementClient } from "@/src/features/dashboard/components/teacher/FaqManagementClient";

export const metadata: Metadata = {
  title: "إدارة الأسئلة الشائعة | لوحة المعلم",
  description: "إدارة الأسئلة الشائعة للمنصة",
};

export default function FaqsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-primary/10 rounded-[24px] p-6 shadow-sm">
        <div>
          <h1 className="h3 text-primary mb-2">إدارة الأسئلة الشائعة</h1>
          <p className="text-muted">قم بإضافة وتعديل وحذف الأسئلة الشائعة التي تظهر في الصفحة الرئيسية</p>
        </div>
      </div>

      <FaqManagementClient />
    </div>
  );
}
