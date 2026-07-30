"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/lib/api";
import { Send, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: { full_name: string; role: string } | null;
};

export function LessonComments({ lessonId }: { lessonId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchApi(`/courses/lessons/${lessonId}/comments`)
      .then((data) => {
        if (!cancelled) setComments((data as any) ?? []);
      })
      .catch((err) => {
        console.error("Failed to fetch comments", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);

    try {
      const data = await fetchApi(`/courses/lessons/${lessonId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      
      setComments((c) => [...c, data as any]);
      setContent("");
    } catch (err: any) {
      if (err.message === "Unauthorized" || err.message === "No token provided") {
        toast.error("يرجى تسجيل الدخول للتعليق");
      } else {
        toast.error("حدث خطأ أثناء إرسال التعليق");
      }
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="w-full mt-10 border-t border-primary/5 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="text-accent" size={24} />
        <h3 className="font-display font-bold text-2xl text-accent">أسئلة ونقاشات حول الدرس</h3>
      </div>

      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && comments.length === 0 && (
          <div className="text-center py-8 bg-surface shadow-sm rounded-xl border border-dashed border-primary/10">
            <p className="text-muted text-sm font-ui">لا توجد تعليقات حتى الآن. كن أول من يطرح سؤالاً!</p>
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-surface border-transparent shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-accent">
                  <User size={16} />
                </div>
                <span className={`font-ui text-sm font-bold ${c.profiles?.role === "teacher" ? "text-accent" : "text-primary"}`}>
                  {c.profiles?.full_name || "مستخدم"}
                  {c.profiles?.role === "teacher" && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs mr-2 font-semibold border border-primary/10">المعلّم</span>
                  )}
                </span>
              </div>
              <span className="text-xs text-muted font-ui">
                {new Date(c.created_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-sm font-body text-primary/90 pr-10">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handlePost} className="flex gap-3 bg-surface p-2 rounded-xl border border-primary/5 shadow-sm">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب سؤالك أو تعليقك هنا..."
          className="flex-1 bg-transparent border-none px-4 py-2 font-body text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          disabled={posting || !content.trim()}
          className="bg-primary text-inverse font-ui font-semibold p-3 rounded-lg hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          <Send size={18} className={document.dir === 'rtl' ? "rotate-180" : ""} />
        </button>
      </form>
    </div>
  );
}
