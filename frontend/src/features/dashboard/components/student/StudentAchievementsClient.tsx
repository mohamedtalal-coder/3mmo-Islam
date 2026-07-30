"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/lib/api";
import { Trophy } from "lucide-react";

export function StudentAchievementsClient() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/student/achievements")
      .then((data) => setAchievements(data.achievements || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          <Trophy size={28} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-primary mb-1">الإنجازات</h1>
          <p className="font-body text-sm text-muted">
            تتبع أوسمتك ونقاطك التي حصلت عليها
          </p>
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-primary/5 rounded-[24px]">
          <Trophy size={48} className="mx-auto text-primary/20 mb-4" />
          <h3 className="font-ui text-xl text-primary mb-2">لا توجد إنجازات بعد</h3>
          <p className="text-muted font-body">
            استمر في إتمام الدورات والاختبارات لتحصل على أوسمة جديدة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <div key={a.id} className="bg-surface border border-primary/5 rounded-[24px] p-6 text-center hover:shadow-soft transition-all duration-300">
              <div className="text-5xl mb-4">{a.icon || '🏆'}</div>
              <h3 className="font-ui text-lg text-primary font-semibold mb-2">{a.title}</h3>
              {a.description && <p className="font-body text-sm text-muted mb-4">{a.description}</p>}
              <div className="inline-block bg-accent/10 text-accent font-ui text-sm font-semibold px-4 py-1.5 rounded-full">
                {a.points} نقطة
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
