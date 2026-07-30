import { redirect, notFound } from "next/navigation";
import { StudentDetailClient } from "@/src/features/dashboard/components/teacher/StudentDetailClient";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

export default async function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let detail: any = null;

  try {
    detail = await fetchServerApi(`/teacher/students/${params.id}`);
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
    if (err.message === "Not found" || err.message === "Student not found" || err.message === "Student not enrolled in any of your courses") {
      notFound();
    }
  }

  if (!detail) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <StudentDetailClient initial={detail} />
    </div>
  );
}
