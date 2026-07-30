import { fetchServerApi } from "@/src/lib/serverApi";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const revalidate = 0;

export default async function VerifyCertificatePage({
  params,
}: {
  params: { certificateNumber: string };
}) {
  const { certificateNumber } = params;

  let certificate = null;
  let error = false;

  try {
    const data = await fetchServerApi(`/public/certificates/verify/${certificateNumber}`);
    certificate = data?.certificate;
  } catch (err) {
    error = true;
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-lg shadow-sm border border-danger text-center max-w-md w-full">
          <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-display text-ink mb-2">شهادة غير صالحة</h1>
          <p className="text-muted font-body mb-6">
            عذراً، لم نتمكن من العثور على شهادة برقم {certificateNumber}. يرجى التأكد من الرقم والمحاولة مرة أخرى.
          </p>
          <Link href="/verify" className="text-accent hover:text-accentLight underline font-ui">
            بحث عن شهادة أخرى
          </Link>
        </div>
      </div>
    );
  }

  const studentName = certificate.student?.fullName || "طالب";
  const courseTitle = certificate.course?.title || "دورة";
  const dateStr = new Date(certificate.issuedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-lg shadow-sm border border-gold/30 text-center max-w-lg w-full relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-petrol/5 rounded-tr-[100px] -z-10" />

        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-display text-petrol mb-4">شهادة صالحة وموثقة</h1>
        
        <div className="space-y-4 mb-8 text-right bg-parchment p-6 rounded-md">
          <div>
            <span className="text-muted text-sm block mb-1">صادرة إلى:</span>
            <strong className="text-ink text-xl font-body">{studentName}</strong>
          </div>
          <div>
            <span className="text-muted text-sm block mb-1">عن دورة:</span>
            <strong className="text-ink text-lg font-body">{courseTitle}</strong>
          </div>
          <div>
            <span className="text-muted text-sm block mb-1">تاريخ الإصدار:</span>
            <span className="text-ink font-body">{dateStr}</span>
          </div>
          <div>
            <span className="text-muted text-sm block mb-1">إعداد:</span>
            <span className="text-ink font-body">{siteConfig.teacher.name}</span>
          </div>
        </div>

        <p className="text-muted text-sm font-ui bg-surface-alt py-2 rounded">
          رقم الشهادة: <span className="font-mono" dir="ltr">{certificateNumber}</span>
        </p>

        <div className="mt-8">
          <Link href="/" className="text-accent hover:text-accentLight underline font-ui">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
