import { fetchServerApi } from "@/src/lib/serverApi";
import { redirect } from "next/navigation";
import { StudentCertificatesClient } from "@/src/features/dashboard/components/student/StudentCertificatesClient";
import { getProfile } from "@/src/lib/session";

export const revalidate = 0;

export default async function CertificatesPage() {
  let certificates = [];

  try {
    const data = await fetchServerApi("/student/certificates");
    certificates = data?.certificates || [];
  } catch (err: any) {
    if (err.message === "Unauthorized" || err.message === "No token provided") {
      redirect("/login");
    }
  }

  const profile = await getProfile();

  const processedCerts = certificates.map((cert: any) => ({
    id: cert.id,
    certificateNumber: cert.certificateNumber,
    issuedAt: cert.issuedAt,
    courseId: cert.courseId,
    courseTitle: cert.course?.title || "دورة",
    courseThumbnail: cert.course?.thumbnailUrl || null,
    contextName: cert.contextName || cert.course?.title || "دورة",
    score: cert.score ?? null,
    rank: cert.rank ?? null,
    conditionType: cert.conditionType || 'SCORE',
  }));

  return <StudentCertificatesClient certificates={processedCerts} studentName={profile?.fullName || ""} />;
}
