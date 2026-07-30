"use client";

import { useState } from "react";
import { fetchApi } from "@/src/lib/api";
import { Button } from "@/src/shared/components/ui/Button";
import { Card } from "@/src/shared/components/ui/Card";
import { Input } from "@/src/shared/components/ui/Input";
import { Modal } from "@/src/shared/components/ui/Modal";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GraduationCap, GripVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Grade {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  courseCount: number;
  studentCount: number;
}

export function GradesManager({ initialGrades }: { initialGrades: Grade[] }) {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📚",
    isActive: true,
  });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(grades);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order locally immediately
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));
    
    setGrades(updatedItems);

    try {
      await fetchApi("/teacher/grades/reorder", {
        method: "PUT",
        body: JSON.stringify({
          updates: updatedItems.map((item) => ({
            id: item.id,
            order: item.order,
          })),
        }),
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "فشل في إعادة الترتيب");
      setGrades(grades); // revert on failure
    }
  };

  const openModal = (grade?: Grade) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        name: grade.name,
        description: grade.description || "",
        icon: grade.icon || "📚",
        isActive: grade.isActive,
      });
    } else {
      setEditingGrade(null);
      setFormData({
        name: "",
        description: "",
        icon: "📚",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGrade(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingGrade ? "جاري التحديث..." : "جاري الإضافة...");

    try {
      if (editingGrade) {
        const data = await fetchApi(`/teacher/grades/${editingGrade.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        setGrades(grades.map(g => g.id === editingGrade.id ? { ...data.grade, courseCount: g.courseCount, studentCount: g.studentCount } : g));
        toast.success("تم التحديث بنجاح", { id: toastId });
      } else {
        const data = await fetchApi("/teacher/grades", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setGrades([...grades, { ...data.grade, courseCount: 0, studentCount: 0 }]);
        toast.success("تم الإضافة بنجاح", { id: toastId });
      }
      closeModal();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (grade: Grade) => {
    if (grade.courseCount > 0) {
      const confirm = window.confirm(`هذه المرحلة مرتبط بها ${grade.courseCount} كورس. هل أنت متأكد من حذفها وسيتم إزالة ارتباط الكورسات بها؟`);
      if (!confirm) return;
    } else {
      const confirm = window.confirm("هل أنت متأكد من حذف هذه المرحلة؟");
      if (!confirm) return;
    }

    const toastId = toast.loading("جاري الحذف...");
    try {
      await fetchApi(`/teacher/grades/${grade.id}`, { method: "DELETE" });
      setGrades(grades.filter(g => g.id !== grade.id));
      toast.success("تم الحذف بنجاح", { id: toastId });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحذف", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-primary flex items-center gap-2">
            <GraduationCap className="text-accent" />
            المراحل الدراسية
          </h2>
          <p className="text-muted text-sm mt-1">إدارة وترتيب المراحل الدراسية للمنصة</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={18} />
          إضافة مرحلة
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="grades">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {grades.map((grade, index) => (
                <Draggable key={grade.id} draggableId={grade.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-4 transition-shadow ${
                        snapshot.isDragging ? "shadow-xl border-accent" : "hover:border-primary/20"
                      } ${!grade.isActive ? "opacity-60 grayscale" : ""}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          {...provided.dragHandleProps}
                          className="text-muted hover:text-primary cursor-grab active:cursor-grabbing p-1"
                        >
                          <GripVertical size={20} />
                        </div>
                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-xl">
                          {grade.icon}
                        </div>
                        <div>
                          <h3 className="font-ui font-bold text-primary flex items-center gap-2">
                            {grade.name}
                            {!grade.isActive && (
                              <span className="text-xs bg-muted/20 text-muted px-2 py-0.5 rounded-full font-normal">
                                غير مفعل
                              </span>
                            )}
                          </h3>
                          {grade.description && (
                            <p className="text-sm text-muted mt-1">{grade.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <span className="block font-bold text-primary">{grade.courseCount}</span>
                          <span className="text-xs text-muted">كورس</span>
                        </div>
                        <div className="text-center mr-2">
                          <span className="block font-bold text-primary">{grade.studentCount}</span>
                          <span className="text-xs text-muted">طالب</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border-r border-border pr-6 ml-2">
                          <button
                            onClick={() => openModal(grade)}
                            className="p-2 text-muted hover:text-accent bg-surfaceHover rounded-full transition-colors"
                            title="تعديل"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(grade)}
                            className="p-2 text-muted hover:text-danger bg-surfaceHover rounded-full transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {grades.length === 0 && (
                <div className="text-center py-12 text-muted bg-surface rounded-xl border border-dashed border-border">
                  لا توجد مراحل دراسية مضافة حتى الآن
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGrade ? "تعديل المرحلة" : "إضافة مرحلة جديدة"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-primary mb-1">اسم المرحلة</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: الصف الأول الثانوي"
            />
          </div>
          <div>
            <label className="block text-sm text-primary mb-1">رمز تعبيري (Icon)</label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📚"
              className="text-2xl"
            />
          </div>
          <div>
            <label className="block text-sm text-primary mb-1">الوصف (اختياري)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف مختصر للمرحلة..."
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-2 font-body bg-surface text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            <label htmlFor="isActive" className="text-sm text-primary cursor-pointer">
              تفعيل المرحلة (تظهر للطلاب)
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeModal}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
