import { fetchServerApi } from "@/src/lib/serverApi";
import { Star, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آراء الطلاب | المنصة التعليمية",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  let reviews = [];
  try {
    // Fetch a larger limit for the dedicated page, e.g., 50
    const data = await fetchServerApi("/reviews/public?limit=50");
    if (data && data.reviews) {
      reviews = data.reviews;
    }
  } catch (error) {
    console.error("Failed to fetch all reviews", error);
  }

  return (
    <div className="min-h-screen bg-background text-primary pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="h1 text-primary mb-4">آراء طلابنا الأعزاء</h1>
          <p className="subtitle text-secondary">نفخر بما يقوله طلابنا عن تجربتهم التعليمية معنا</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-primary/5 rounded-[24px]">
            <MessageCircle size={64} className="mx-auto text-primary/20 mb-6" />
            <h3 className="h3 text-primary mb-2">لا توجد آراء بعد</h3>
            <p className="text-secondary">كن أول من يشاركنا رأيه بعد إتمام إحدى دوراتنا!</p>
            <Link href="/" className="btn btn-primary mt-6 inline-block">العودة للرئيسية</Link>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {reviews.map((review: any) => (
              <div 
                key={review.id} 
                className="break-inside-avoid bg-surface border border-primary/5 p-6 rounded-[24px] shadow-sm hover:shadow-soft transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/5 shrink-0 relative">
                    <Image src={review.student.avatarUrl || "/placeholder-avatar.png"} alt={review.student.fullName} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-ui font-bold text-primary">{review.student.fullName}</h4>
                    <p className="text-xs text-muted font-ui">{review.course?.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-4 text-gold">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                
                <p className="font-body text-secondary/90 leading-relaxed italic relative z-10">
                  <span className="text-4xl text-primary/10 absolute -top-4 -right-2 -z-10 select-none">"</span>
                  {review.comment}
                  <span className="text-4xl text-primary/10 absolute -bottom-6 -left-2 -z-10 select-none">"</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
