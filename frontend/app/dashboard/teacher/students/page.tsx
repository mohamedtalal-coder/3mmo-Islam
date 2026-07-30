import { redirect } from "next/navigation";
import { StudentsManagementClient } from "@/src/features/dashboard/components/teacher/StudentsManagementClient";
import { fetchServerApi } from "@/src/lib/serverApi";

export const revalidate = 0;

export default async function StudentsPage() {
  let data: any = null;

  try {
    data = await fetchServerApi("/teacher/students");
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  const students = data?.students ?? [];
  
  // We need to fetch courses for the filter dropdown.
  // We can fetch it via fetchServerApi as well.
  let coursesData: any = [];
  try {
    const res = await fetchServerApi("/teacher/courses");
    coursesData = res.courses ?? [];
  } catch (e) {
    console.error(e);
  }

  const courses = coursesData.map((c: any) => ({
    id: c.id,
    title: c.title,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <StudentsManagementClient
        initialStudents={students}
        courses={courses}
      />
    </div>
  );
}
