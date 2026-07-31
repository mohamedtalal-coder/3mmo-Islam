"use client";

import { useState, useEffect } from "react";
import { Award, Download, Share2, Eye, ExternalLink, Copy, Check, GraduationCap, Calendar } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { toast } from "sonner";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Badge } from "@/src/shared/components/ui/Badge";

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  contextName: string;
  score: number | null;
  rank: number | null;
  conditionType: string;
}

export function StudentCertificatesClient({ certificates, studentName }: { certificates: Certificate[], studentName: string }) {
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDownloadCertificate = async (cert: Certificate) => {
    try {
      setIsGenerating(cert.id);
      const toastId = toast.loading("جاري إصدار الشهادة...");
      
      const { generateCertificate } = await import("@/src/features/certificates/certificateGenerator");
      const blob = await generateCertificate(
        studentName,
        cert.contextName,
        cert.issuedAt,
        cert.certificateNumber,
        cert.score,
        cert.rank,
        cert.conditionType
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `شهادة_إتمام_${cert.contextName.replace(/\\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("تم تحميل الشهادة بنجاح!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إنشاء الشهادة");
    } finally {
      setIsGenerating(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyVerifyLink = (cert: Certificate) => {
    const url = `${window.location.origin}/verify/${cert.certificateNumber}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(cert.id);
      toast.success("تم نسخ رابط التحقق");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-primary flex items-center gap-3">
          <Award size={28} className="text-accent" />
          شهاداتي
        </h1>
        {certificates.length > 0 && (
          <Badge variant="outline" className="px-3 py-1 shadow-sm bg-surface">
            {certificates.length} شهادة
          </Badge>
        )}
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
          {certificates.map((cert) => (
            <Card key={cert.id} hoverable className="overflow-hidden group p-0">
              {/* Certificate Preview Header */}
              <div className="relative h-40 bg-surfaceHover p-6 flex flex-col justify-between overflow-hidden border-b border-surfaceBorder rounded-t-[19px]">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-[30px] translate-x-1/4 translate-y-1/4" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap size={20} className="text-primary" />
                  </div>
                  <span className="text-muted text-[10px] font-ui font-bold tracking-widest uppercase">شهادة إتمام</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-lg text-primary truncate group-hover:text-accent transition-colors">{cert.courseTitle}</h3>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted font-ui flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(cert.issuedAt)}
                  </span>
                  <span className="text-muted font-ui text-xs font-mono bg-primary/5 px-2 py-1 rounded">
                    {cert.certificateNumber}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    leftIcon={<Eye size={14} />}
                    onClick={() => setPreviewCert(cert)}
                  >
                    معاينة الشهادة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyVerifyLink(cert)}
                    className="px-4"
                  >
                    {copiedId === cert.id ? <Check size={14} /> : <Share2 size={14} />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Award size={32} />}
          title="لم تحصل على شهادات بعد"
          description="أكمل دوراتك واجتز جميع الاختبارات للحصول على شهادات الإتمام."
          action={{ label: "عرض دوراتي", href: "/dashboard/student/courses" }}
        />
      )}

      {/* Certificate Preview Modal */}
      {previewCert && (
        <>
          <div
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50"
            onClick={() => setPreviewCert(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden pointer-events-auto animate-scale-in">
              <div className="bg-surface p-4 relative border-b border-surfaceBorder min-h-[400px] flex items-center justify-center">
                <CertificateImagePreview 
                  cert={previewCert} 
                  studentName={studentName} 
                />
              </div>
              <div className="p-5 flex gap-3 bg-surface">
                <Button
                  variant="primary"
                  className="flex-1"
                  leftIcon={<Download size={16} />}
                  onClick={() => handleDownloadCertificate(previewCert)}
                  isLoading={isGenerating === previewCert.id}
                  disabled={isGenerating !== null}
                >
                  تحميل PDF
                </Button>
                <Button variant="outline" onClick={() => setPreviewCert(null)}>
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CertificateImagePreview({ cert, studentName }: any) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const generate = async () => {
      try {
        const { generateCertificateImage } = await import("@/src/features/certificates/certificateGenerator");
        const src = await generateCertificateImage(
          studentName,
          cert.contextName,
          cert.issuedAt,
          cert.certificateNumber,
          cert.score,
          cert.rank,
          cert.conditionType
        );
        if (mounted) setImgSrc(src);
      } catch (err) {
        console.error(err);
      }
    };
    generate();
    return () => { mounted = false; };
  }, [cert, studentName]);

  if (!imgSrc) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-primary w-full h-full min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="font-ui text-sm animate-pulse">جاري إنشاء المعاينة...</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imgSrc} alt="Certificate Preview" className="w-full max-h-[70vh] object-contain rounded-lg shadow-sm border border-primary/10" />
  );
}
