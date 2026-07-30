"use client";

import { useState } from "react";
import { Bookmark, BookOpen, Heart, PlayCircle, Trash2, BookmarkX } from "lucide-react";
import { TabBar } from "./TabBar";
import { EmptyState } from "./EmptyState";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";

interface SavedLesson {
  id: string;
  title: string;
  courseName: string;
  moduleName: string;
  courseId: string;
}

interface FavoriteCourse {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

// Mock data
const mockSavedLessons: SavedLesson[] = [
  { id: "1", title: "مقدمة في المعادلات التفاضلية", courseName: "الرياضيات المتقدمة", moduleName: "الوحدة الثالثة", courseId: "abc" },
  { id: "2", title: "التكامل بالتعويض", courseName: "الرياضيات المتقدمة", moduleName: "الوحدة الرابعة", courseId: "abc" },
  { id: "3", title: "قوانين نيوتن", courseName: "الفيزياء الحديثة", moduleName: "الوحدة الأولى", courseId: "def" },
];

const mockFavoriteCourses: FavoriteCourse[] = [
  { id: "1", title: "الرياضيات المتقدمة", thumbnailUrl: null },
  { id: "2", title: "الفيزياء الحديثة", thumbnailUrl: null },
];

type TabId = "lessons" | "courses";

export function StudentBookmarksClient() {
  const [activeTab, setActiveTab] = useState<TabId>("lessons");
  const [savedLessons, setSavedLessons] = useState(mockSavedLessons);
  const [favoriteCourses, setFavoriteCourses] = useState(mockFavoriteCourses);

  const tabs = [
    { id: "lessons", label: "الدروس المحفوظة", count: savedLessons.length, icon: <Bookmark size={14} /> },
    { id: "courses", label: "الدورات المفضلة", count: favoriteCourses.length, icon: <Heart size={14} /> },
  ];

  const removeLesson = (id: string) => {
    setSavedLessons(prev => prev.filter(l => l.id !== id));
  };

  const removeCourse = (id: string) => {
    setFavoriteCourses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <h1 className="font-display text-3xl text-primary flex items-center gap-3">
        <Bookmark size={28} className="text-accent" />
        المحفوظات
      </h1>

      {/* Tabs */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
      />

      {/* Content */}
      {activeTab === "lessons" && (
        <>
          {savedLessons.length > 0 ? (
            <div className="space-y-2 stagger-children">
              {savedLessons.map((lesson) => (
                <Card key={lesson.id} hoverable className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <PlayCircle size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ui font-bold text-primary text-sm truncate">{lesson.title}</h3>
                    <p className="text-xs text-muted font-ui mt-0.5">
                      {lesson.courseName} • {lesson.moduleName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => removeLesson(lesson.id)}
                      className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                      title="إزالة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark size={32} />}
              title="لا توجد دروس محفوظة"
              description="احفظ الدروس المهمة أثناء مشاهدة الدورات للعودة إليها لاحقاً."
              action={{ label: "عرض دوراتي", href: "/dashboard/student/courses" }}
            />
          )}
        </>
      )}

      {activeTab === "courses" && (
        <>
          {favoriteCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {favoriteCourses.map((course) => (
                <Card key={course.id} hoverable className="overflow-hidden group p-0">
                  <div className="h-40 bg-surfaceHover border-b border-surfaceBorder rounded-t-[19px] flex items-center justify-center relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <BookOpen size={32} className="text-surfaceBorder" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-ui font-bold text-primary text-sm mb-3 group-hover:text-accent transition-colors">{course.title}</h3>
                    <div className="flex gap-2">
                      <Button variant="primary" className="flex-1" leftIcon={<PlayCircle size={14} />}>
                        عرض الدورة
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => removeCourse(course.id)}
                        className="px-3"
                      >
                        <BookmarkX size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Heart size={32} />}
              title="لا توجد دورات مفضلة"
              description="أضف الدورات التي تعجبك إلى المفضلة للوصول إليها بسرعة."
              action={{ label: "تصفح الدورات", href: "/courses" }}
            />
          )}
        </>
      )}
    </div>
  );
}
