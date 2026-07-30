import { redirect } from "next/navigation";
import { fetchServerApi } from "@/src/lib/serverApi";

export default async function DashboardRedirect() {
  let role = "student";

  try {
    const data = await fetchServerApi("/auth/me");
    if (data && data.user) {
      role = data.user.role.toLowerCase();
    }
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  const isAdmin = ["teacher", "course_admin", "exam_admin"].includes(role);
  redirect(isAdmin ? "/dashboard/teacher" : "/dashboard/student");
}
