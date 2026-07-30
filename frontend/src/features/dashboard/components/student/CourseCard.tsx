"use client";

import Link from "next/link";
import { PlayCircle, BookOpen, Clock, Award, Bookmark, BookmarkCheck } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Badge } from "@/src/shared/components/ui/Badge";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  progress?: number;
  isExpired?: boolean;
  isCompleted?: boolean;
  hasCertificate?: boolean;
  lastViewedAt?: string | null;
  expiresAt?: string | null;
  daysRemaining?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  variant?: "default" | "compact" | "horizontal";
}

export function CourseCard({
  id,
  title,
  thumbnailUrl,
  progress = 0,
  isExpired = false,
  isCompleted = false,
  hasCertificate = false,
  lastViewedAt,
  expiresAt,
  daysRemaining,
  isBookmarked = false,
  onToggleBookmark,
  variant = "default",
}: CourseCardProps) {
  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  if (variant === "horizontal") {
    return (
      <Card hoverable className="flex gap-4 p-4 group">
        <div className="w-28 h-20 rounded-lg overflow-hidden bg-surfaceHover shrink-0">
          {thumbnailUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-surfaceBorder">
              <BookOpen size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-ui font-bold text-primary text-sm truncate mb-1 group-hover:text-accent transition-colors">{title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-surfaceBorder rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-ui text-muted font-bold">{progress}%</span>
          </div>
          {lastViewedAt && (
            <div className="flex items-center gap-1 text-xs text-muted font-ui">
              <Clock size={12} />
              <span>{formatTimeAgo(lastViewedAt)}</span>
            </div>
          )}
        </div>
        <Link
          href={`/dashboard/student/courses/${id}`}
          className="self-center shrink-0 w-10 h-10 rounded-button bg-surfaceHover flex items-center justify-center text-primary hover:bg-primary hover:text-inverse transition-all duration-300"
        >
          <PlayCircle size={20} />
        </Link>
      </Card>
    );
  }

  return (
    <Card hoverable className="overflow-hidden group relative flex flex-col h-full">
      {/* Expired Overlay */}
      {isExpired && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center rounded-[16px]">
          <Clock size={32} className="text-danger mb-3" />
          <span className="font-display text-lg text-danger mb-4">انتهى الاشتراك</span>
          <Link href={`/checkout/${id}`}>
            <Button variant="danger" size="sm">
              تجديد الاشتراك
            </Button>
          </Link>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-surfaceHover border-b border-surfaceBorder rounded-t-[19px]">
        {thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <BookOpen size={40} className="text-surfaceBorder" />
          </div>
        )}

        {/* Bookmark Button */}
        {onToggleBookmark && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleBookmark(); }}
            className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface transition-all duration-200 shadow-sm border border-surfaceBorder"
            aria-label={isBookmarked ? "إزالة من المحفوظات" : "حفظ"}
          >
            {isBookmarked ? (
              <BookmarkCheck size={16} className="text-accent" />
            ) : (
              <Bookmark size={16} className="text-muted" />
            )}
          </button>
        )}

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" icon={<Award size={12} />}>مكتمل</Badge>
          </div>
        )}

        {/* Expiry Warning */}
        {daysRemaining !== undefined && daysRemaining <= 3 && daysRemaining > 0 && !isExpired && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="warning">متبقي {daysRemaining} {daysRemaining === 1 ? "يوم" : "أيام"}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-ui font-bold text-primary text-base mb-3 line-clamp-2 leading-relaxed group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-ui text-muted mb-2">
            <span>التقدم</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-surfaceBorder rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Action Button */}
          <Link href={`/dashboard/student/courses/${id}`} className="mt-4 block">
            <Button variant="primary" className="w-full" leftIcon={<PlayCircle size={16} />}>
              {isCompleted ? "مراجعة الدورة" : "متابعة التعلم"}
            </Button>
          </Link>

          {/* Certificate Download */}
          {hasCertificate && (
            <a href={`/api/certificates/${id}`} className="mt-2 block">
              <Button variant="outline" className="w-full" leftIcon={<Award size={14} />}>
                تحميل الشهادة
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
