import { fetchServerApi } from "@/src/lib/serverApi";
import { LandingClient } from "@/src/shared/components/LandingClient";

import { siteConfig } from "@/config/site.config";

export const revalidate = 60;

export default async function Home() {
  let user = null;
  let grades = [];
  let settings = null;
  let studentCount = 0;
  let courseCount = 0;

  try {
    const authData = await fetchServerApi("/auth/me");
    if (authData && authData.user) {
      user = authData.user;
    }
  } catch (err) {
    // Ignore auth error for public pages
  }

  try {
    const homeData = await fetchServerApi("/public/home");
    
    if (homeData) {
      settings = homeData.settings;
      studentCount = homeData.stats?.studentCount || 0;
      courseCount = homeData.stats?.courseCount || 0;
      
      const allCourses = homeData.courses || [];
      const gradesData = homeData.grades || [];

      grades = gradesData.map((grade: any) => {
        const coursesForGrade = allCourses.filter((c: any) => c.gradeId === grade.id);
        const uniqueTeachers = new Set(coursesForGrade.map((c: any) => c.teacherId));

        return {
          ...grade,
          stats: {
            courses: coursesForGrade.length,
            teachers: uniqueTeachers.size,
          }
        };
      });
    }
  } catch (error) {
    console.error("Failed to load home data", error);
  }

  return (
    <LandingClient 
      grades={grades} 
      settings={settings} 
      studentCount={studentCount} 
      courseCount={courseCount}
      user={user}
    />
  );
}
