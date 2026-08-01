import { StudentWalletClient } from "@/src/features/dashboard/components/student/StudentWalletClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "محفظتي - منصة عمو إسلام",
};

export default function StudentWalletPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-primary mb-2">محفظتي</h1>
        <p className="font-body text-muted">
          اشحن رصيدك بكل سهولة لشراء الدورات التعليمية
        </p>
      </div>

      <StudentWalletClient />
    </div>
  );
}
