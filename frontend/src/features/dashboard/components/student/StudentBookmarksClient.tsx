"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/lib/api";
import { Bookmark, PlayCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function StudentBookmarksClient() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = () => {
    fetchApi("/student/bookmarks")
      .then((data) => setBookmarks(data.bookmarks || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const removeBookmark = async (courseId?: string, lessonId?: string) => {
    try {
      await fetchApi("/student/bookmarks/toggle", {
        method: "POST",
        body: JSON.stringify({ courseId, lessonId }),
      });
      fetchBookmarks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Bookmark size={28} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-primary mb-1">المحفوظات</h1>
          <p className="font-body text-sm text-muted">
            الكورسات والدروس التي قمت بحفظها للرجوع إليها لاحقاً
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-primary/5 rounded-[24px]">
          <Bookmark size={48} className="mx-auto text-primary/20 mb-4" />
          <h3 className="font-ui text-xl text-primary mb-2">لا توجد محفوظات</h3>
          <p className="text-muted font-body">
            يمكنك حفظ الكورسات والدروس المفضلة لديك للرجوع إليها بسهولة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <div key={b.id} className="bg-surface border border-primary/5 rounded-[24px] overflow-hidden hover:shadow-soft transition-all duration-300 flex flex-col">
              {b.course ? (
                <>
                  <div className="relative h-40 w-full bg-primary/5">
                    {b.course.thumbnailUrl ? (
                      <Image src={b.course.thumbnailUrl} alt={b.course.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-primary/20">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <button 
                      onClick={() => removeBookmark(b.course.id, undefined)}
                      className="absolute top-3 left-3 p-2 bg-white/90 text-primary rounded-full hover:bg-danger hover:text-white transition-colors"
                      title="إزالة من المحفوظات"
                    >
                      <Bookmark size={18} fill="currentColor" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-ui rounded-full mb-3 w-fit">
                      كورس
                    </div>
                    <h3 className="font-ui text-lg text-primary font-semibold mb-4 flex-1 line-clamp-2">
                      {b.course.title}
                    </h3>
                    <Link
                      href={`/dashboard/student/courses/${b.course.id}`}
                      className="w-full text-center py-2.5 bg-primary/5 text-primary hover:bg-primary hover:text-inverse rounded-xl font-ui transition-colors"
                    >
                      متابعة الكورس
                    </Link>
                  </div>
                </>
              ) : b.lesson ? (
                <>
                  <div className="p-5 flex-1 flex flex-col relative">
                    <button 
                      onClick={() => removeBookmark(undefined, b.lesson.id)}
                      className="absolute top-5 left-5 p-2 bg-primary/5 text-primary rounded-full hover:bg-danger hover:text-white transition-colors"
                      title="إزالة من المحفوظات"
                    >
                      <Bookmark size={18} fill="currentColor" />
                    </button>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-accent/10 text-accent text-xs font-ui rounded-full mb-3 w-fit">
                      <PlayCircle size={14} />
                      درس
                    </div>
                    <h3 className="font-ui text-lg text-primary font-semibold mb-2 line-clamp-2">
                      {b.lesson.title}
                    </h3>
                    <p className="font-body text-sm text-muted mb-6 line-clamp-1">
                      {b.lesson.module?.course?.title}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={`/dashboard/student/courses/${b.lesson.module?.courseId}`}
                        className="block w-full text-center py-2.5 border border-primary/20 text-primary hover:bg-primary hover:border-primary hover:text-inverse rounded-xl font-ui transition-all"
                      >
                        الذهاب للدرس
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
