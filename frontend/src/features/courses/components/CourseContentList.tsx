"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Grip, PlayCircle, Book } from "lucide-react";
import { ModuleActions } from "@/src/features/courses/components/ModuleActions";
import { LessonActions } from "@/src/features/courses/components/LessonActions";
import { QuizActions } from "@/src/features/exams/components/QuizActions";
import { LessonForm } from "@/src/features/courses/components/LessonForm";
import { QuizForm } from "@/src/features/exams/components/QuizForm";
import { siteConfig } from "@/config/site.config";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/src/lib/api";

interface CourseContentListProps {
  courseId: string;
  initialModules: any[];
  quizzes: any[];
}

export function CourseContentList({ courseId, initialModules, quizzes }: CourseContentListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [modules, setModules] = useState(initialModules);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setModules(initialModules);
  }, [initialModules]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "module") {
      const items = Array.from(modules);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      setModules(items);

      const updates = items.map((mod, idx) => ({ id: mod.id, position: idx }));
      try {
        await fetchApi(`/teacher/courses/${courseId}/modules/reorder`, {
          method: "PUT",
          body: JSON.stringify({ updates })
        });
        router.refresh();
      } catch (e) {
        console.error("Failed to reorder modules", e);
      }
    } else if (type === "lesson") {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;

      const items = Array.from(modules);
      const sourceModule = items.find(m => m.id === sourceModuleId);
      const destModule = items.find(m => m.id === destModuleId);

      if (!sourceModule || !destModule) return;

      if (sourceModuleId === destModuleId) {
        const reorderedLessons = Array.from(sourceModule.lessons || []);
        const [reorderedItem] = reorderedLessons.splice(source.index, 1);
        reorderedLessons.splice(destination.index, 0, reorderedItem);
        sourceModule.lessons = reorderedLessons;
        setModules(items);

        const updates = reorderedLessons.map((l: any, idx) => ({ id: l.id, position: idx }));
        try {
          await fetchApi(`/teacher/courses/${courseId}/lessons/reorder`, {
             method: "PUT",
             body: JSON.stringify({ updates })
          });
          router.refresh();
        } catch(e) {
          console.error("Failed to reorder lessons", e);
        }
      } else {
        const sourceLessons = Array.from(sourceModule.lessons || []);
        const destLessons = Array.from(destModule.lessons || []);
        const [movedItem] = sourceLessons.splice(source.index, 1) as [any];
        destLessons.splice(destination.index, 0, movedItem);
        sourceModule.lessons = sourceLessons;
        destModule.lessons = destLessons;
        setModules(items);

        try {
          await fetchApi(`/teacher/courses/${courseId}/lessons/move`, {
             method: "PUT",
             body: JSON.stringify({ lessonId: movedItem.id, moduleId: destModuleId, position: destination.index })
          });
          router.refresh();
        } catch(e) {
          console.error("Failed to move lesson", e);
        }
      }
    }
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules" type="module">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
            {modules.map((mod, index) => {
              const moduleQuizzes = quizzes.filter(q => q.module_id === mod.id);
              const nextLessonPosition = mod.lessons?.length || 0;
              const nextQuizPosition = moduleQuizzes.length;

              return (
                <Draggable key={mod.id} draggableId={mod.id} index={index}>
                  {(provided) => (
                    <section
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-primary/5 border-none shadow-sm rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="text-muted hover:text-accent cursor-grab active:cursor-grabbing">
                            <Grip size={20} />
                          </div>
                          <h2 className="font-display text-2xl text-accent">{mod.title}</h2>
                        </div>
                        <ModuleActions moduleId={mod.id} initialTitle={mod.title} />
                      </div>

                      <div className="space-y-4">
                        <Droppable droppableId={mod.id} type="lesson">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {mod.lessons?.map((lesson: any, lessonIndex: number) => (
                                <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center justify-between bg-surface shadow-sm border border-primary/5 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div {...provided.dragHandleProps} className="text-muted hover:text-accent cursor-grab active:cursor-grabbing">
                                          <Grip size={16} />
                                        </div>
                                        <PlayCircle size={18} className="text-primary" />
                                        <span className="font-body text-sm text-primary">{lesson.title}</span>
                                      </div>
                                      <LessonActions lessonId={lesson.id} initialTitle={lesson.title} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <LessonForm moduleId={mod.id} nextPosition={nextLessonPosition} />
                      </div>

                      {siteConfig.features.quizzes && (
                        <div className="mt-8 pt-6 border-t border-gold/10">
                          <h3 className="font-ui font-semibold text-accent mb-4 flex items-center gap-2">
                            <Book size={18} /> اختبارات الوحدة
                          </h3>
                          {moduleQuizzes.length > 0 && (
                            <ul className="space-y-2 mb-4">
                              {moduleQuizzes.map((q: any) => (
                                <li key={q.id} className="font-body text-sm flex items-center justify-between bg-surface shadow-sm border border-primary/5 rounded-lg p-3 hover:shadow-md transition-shadow">
                                  <span className="text-primary flex-1">{q.title}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-primary text-xs bg-primary/10 px-2 py-1 rounded-full">
                                      {q.quiz_questions?.length ?? 0} سؤال · درجة النجاح {q.passing_score}%
                                    </span>
                                    <QuizActions quizId={q.id} initialTitle={q.title} initialScore={q.passing_score} />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          <QuizForm courseId={courseId} moduleId={mod.id} nextPosition={nextQuizPosition} />
                        </div>
                      )}
                    </section>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
