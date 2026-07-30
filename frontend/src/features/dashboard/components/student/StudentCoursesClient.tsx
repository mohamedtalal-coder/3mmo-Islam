"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookOpen, PlayCircle, Award, Heart, SortAsc, Filter, ArrowDownUp } from "lucide-react";
import { TabBar } from "./TabBar";
import { SearchInput } from "./SearchInput";
import { CourseCard } from "./CourseCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Badge } from "@/src/shared/components/ui/Badge";

interface Enrollment {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  isExpired: boolean;
  isCompleted: boolean;
  hasCertificate: boolean;
  lastViewedAt: string | null;
  createdAt: string;
  daysRemaining: number;
  progress: number;
}

type SortOption = "recent" | "name" | "progress" | "date";
type TabId = "current" | "completed" | "wishlist";

export function StudentCoursesClient({
  enrollments,
  hasError,
}: {
  enrollments: Enrollment[];
  hasError: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>("current");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Sync state to URL without causing re-renders
  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Separate enrollments by tab
  const currentCourses = enrollments.filter(e => !e.isCompleted && !e.isExpired);
  const completedCourses = enrollments.filter(e => e.isCompleted);
  // Wishlist is localStorage-based (empty for now, placeholder)
  const wishlistCourses: Enrollment[] = [];

  const tabs = [
    { id: "current", label: "الحالية", count: currentCourses.length, icon: <PlayCircle size={16} /> },
    { id: "completed", label: "المكتملة", count: completedCourses.length, icon: <Award size={16} /> },
    { id: "wishlist", label: "المفضلة", count: wishlistCourses.length, icon: <Heart size={16} /> },
  ];

  // Get active courses list
  const activeCourses = useMemo(() => {
    let courses: Enrollment[] = [];
    switch (activeTab) {
      case "current":
        courses = currentCourses;
        break;
      case "completed":
        courses = completedCourses;
        break;
      case "wishlist":
        courses = wishlistCourses;
        break;
    }
    return courses;
  }, [activeTab, enrollments]);

  // Filter by search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return activeCourses;
    const query = searchQuery.toLowerCase();
    
    // Support partial match, case-insensitive, and ignore excessive spaces
    const normalizedQuery = query.replace(/\s+/g, ' ').trim();
    
    return activeCourses.filter(c =>
      c.title.toLowerCase().includes(normalizedQuery) ||
      (c.description && c.description.toLowerCase().includes(normalizedQuery))
    );
  }, [activeCourses, searchQuery]);

  // Sort
  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => {
          const dateA = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
          const dateB = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
          return dateB - dateA;
        });
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title, "ar"));
      case "progress":
        return sorted.sort((a, b) => b.progress - a.progress);
      case "date":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  }, [filteredCourses, sortBy]);

  const sortLabels: Record<SortOption, string> = {
    recent: "الأحدث مشاهدة",
    name: "الاسم",
    progress: "نسبة التقدم",
    date: "تاريخ التسجيل",
  };

  if (hasError) {
    return (
      <ErrorState
        title="خطأ في تحميل الدورات"
        message="حدث خطأ أثناء تحميل قائمة الدورات. يرجى تحديث الصفحة."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-primary flex items-center gap-3">
          <BookOpen size={28} className="text-accent" />
          دوراتي
        </h1>
        <div className="flex items-center gap-2 text-sm font-ui text-muted">
          <Badge variant="outline" className="px-3 py-1 text-primary shadow-sm bg-surface">
            {enrollments.length} دورة
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
      />

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="ابحث في دوراتك..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-surfaceBorder rounded-button font-ui text-sm text-muted hover:border-primary/20 hover:text-primary transition-all duration-200 shadow-sm"
          >
            <ArrowDownUp size={16} />
            <span>{sortLabels[sortBy]}</span>
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
              <div className="absolute left-0 top-full mt-2 w-48 bg-surface rounded-modal border border-surfaceBorder shadow-soft z-50 overflow-hidden animate-scale-in">
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                    className={`w-full text-right px-4 py-2.5 text-sm font-ui transition-colors ${
                      sortBy === key ? "bg-primary text-inverse font-bold" : "text-muted hover:bg-surfaceHover"
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {sortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {sortedCourses.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              id={enrollment.courseId}
              title={enrollment.title}
              thumbnailUrl={enrollment.thumbnailUrl}
              progress={enrollment.progress}
              isExpired={enrollment.isExpired}
              isCompleted={enrollment.isCompleted}
              hasCertificate={enrollment.hasCertificate}
              lastViewedAt={enrollment.lastViewedAt}
              daysRemaining={enrollment.daysRemaining}
            />
          ))}
        </div>
      ) : (
        <div className="py-4">
          {activeTab === "current" && searchQuery ? (
            <EmptyState
              icon={<BookOpen size={32} />}
              title="لا توجد نتائج"
              description={`لم نجد دورات تطابق "${searchQuery}"`}
            />
          ) : activeTab === "current" ? (
            <EmptyState
              icon={<PlayCircle size={32} />}
              title="لا توجد دورات حالية"
              description="لم تسجل في أي دورات بعد. تصفح الدورات المتاحة وابدأ رحلة التعلم."
              action={{ label: "تصفح الدورات", href: "/courses" }}
            />
          ) : activeTab === "completed" ? (
            <EmptyState
              icon={<Award size={32} />}
              title="لم تكمل أي دورة بعد"
              description="واصل التعلم في دوراتك الحالية للحصول على شهادات الإتمام."
              action={{ label: "عرض دوراتي", onClick: () => setActiveTab("current") }}
            />
          ) : (
            <EmptyState
              icon={<Heart size={32} />}
              title="قائمة المفضلة فارغة"
              description="احفظ الدورات التي تعجبك لتجدها بسهولة لاحقاً."
              action={{ label: "تصفح الدورات", href: "/courses" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
