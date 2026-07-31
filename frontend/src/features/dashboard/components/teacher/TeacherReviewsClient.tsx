"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/src/lib/api";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function TeacherReviewsClient() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await fetchApi("/reviews/teacher");
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await fetchApi(`/reviews/teacher/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      toast.success(!currentStatus ? "تمت الموافقة على المراجعة" : "تم إلغاء الموافقة");
      fetchReviews();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المراجعة نهائياً؟")) return;
    try {
      await fetchApi(`/reviews/teacher/${id}`, { method: "DELETE" });
      toast.success("تم الحذف بنجاح");
      fetchReviews();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
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
        <div className="p-3 bg-accent/10 text-accent rounded-xl">
          <Star size={28} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-primary mb-1">المراجعات والتقييمات</h1>
          <p className="font-body text-sm text-muted">
            إدارة آراء الطلاب التي تظهر في الصفحة الرئيسية
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-primary/5 rounded-[24px]">
            <Star size={48} className="mx-auto text-primary/20 mb-4" />
            <h3 className="font-ui text-xl text-primary mb-2">لا توجد مراجعات بعد</h3>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-surface border border-primary/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-ui font-bold text-xl">
                  {review.student.fullName ? review.student.fullName.charAt(0) : "T"}
                </div>
                <div>
                  <h3 className="font-ui font-semibold text-primary">{review.student.fullName}</h3>
                  <p className="text-xs text-muted mb-2">{review.course?.title} • {new Date(review.createdAt).toLocaleDateString("ar-EG")}</p>
                  
                  <div className="flex items-center gap-1 mb-2 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-sm font-body text-primary/80">{review.comment}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleToggleApproval(review.id, review.isApproved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm transition-colors ${
                    review.isApproved 
                      ? "bg-success/10 text-success hover:bg-success/20" 
                      : "bg-surface border border-surfaceBorder hover:bg-primary/5 text-primary"
                  }`}
                >
                  {review.isApproved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {review.isApproved ? "مقبول ومسجل" : "قيد المراجعة"}
                </button>
                
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title="حذف المراجعة"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
