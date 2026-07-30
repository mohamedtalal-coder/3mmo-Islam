import { fetchServerApi } from "@/src/lib/serverApi";
import { GradesManager } from "@/src/features/grades/components/GradesManager";

export const revalidate = 0;

export default async function GradesPage() {
  let data = null;
  
  try {
    data = await fetchServerApi("/teacher/grades");
  } catch (error) {
    console.error("Failed to fetch grades:", error);
  }

  const grades = data?.grades || [];

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <GradesManager initialGrades={grades} />
      </div>
    </div>
  );
}
