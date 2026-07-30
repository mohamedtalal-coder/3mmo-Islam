"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";

export function BookmarkButton({ courseId, lessonId }: { courseId?: string; lessonId?: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if it's bookmarked by fetching all bookmarks and checking
    // A more optimized way would be a specific endpoint, but for now we filter
    fetchApi("/student/bookmarks")
      .then((data) => {
        if (data.bookmarks) {
          const found = data.bookmarks.some((b: any) => 
            (courseId && b.courseId === courseId) || (lessonId && b.lessonId === lessonId)
          );
          setIsBookmarked(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  const toggleBookmark = async () => {
    if (loading) return;
    
    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    
    if (!previousState) toast.success("تم الحفظ في المحفوظات");
    else toast.success("تمت الإزالة من المحفوظات");

    try {
      const res = await fetchApi("/student/bookmarks/toggle", {
        method: "POST",
        body: JSON.stringify({ courseId, lessonId }),
      });
      setIsBookmarked(res.bookmarked);
    } catch (error) {
      // Revert on error
      setIsBookmarked(previousState);
      toast.error("حدث خطأ أثناء حفظ العنصر");
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${
        isBookmarked 
          ? "bg-primary text-white shadow-sm" 
          : "bg-surface border border-primary/20 text-primary hover:bg-primary/5"
      }`}
      title={isBookmarked ? "إزالة من المحفوظات" : "حفظ للرجوع إليه لاحقاً"}
    >
      <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
}
