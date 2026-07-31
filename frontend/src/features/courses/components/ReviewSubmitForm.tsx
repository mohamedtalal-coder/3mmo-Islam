"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";

export function ReviewSubmitForm({ courseId }: { courseId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/reviews/student/courses/${courseId}`, {
        method: "POST",
        body: JSON.stringify({ rating, comment })
      });
      setIsSubmitted(true);
      toast.success("تم إرسال تقييمك بنجاح! شكراً لك.");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 bg-success/10 border border-success/20 rounded-2xl text-center">
        <Star className="mx-auto text-success mb-3" size={32} fill="currentColor" />
        <h3 className="font-ui text-lg text-success font-semibold mb-2">شكراً لتقييمك!</h3>
        <p className="text-success/80 font-body text-sm">تم استلام تقييمك بنجاح وسيتم مراجعته قريباً.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-primary/10 rounded-[24px] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gold/10 text-gold rounded-xl">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="font-display text-xl text-primary mb-1">ما رأيك في الدورة؟</h3>
          <p className="font-body text-xs text-muted">رأيك يهمنا ويساعد الطلاب الآخرين</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={star <= (hoveredRating || rating) ? "text-gold" : "text-surfaceBorder"}
                fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا (اختياري)..."
            className="w-full bg-background border border-surfaceBorder rounded-xl p-4 font-body text-sm text-primary focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none transition-all"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-inverse rounded-xl font-ui font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
        </button>
      </form>
    </div>
  );
}
