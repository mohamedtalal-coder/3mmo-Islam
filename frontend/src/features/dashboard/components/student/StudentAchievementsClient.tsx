"use client";

import { Trophy, Flame, Star, Zap, BookOpen, Award, Target, Clock, CheckCircle, Lock } from "lucide-react";
import { Card } from "@/src/shared/components/ui/Card";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedAt?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

const badges: Badge[] = [
  { id: "1", name: "البداية", description: "أكملت أول درس", icon: <BookOpen size={24} />, earned: true, earnedAt: "2025-01-15" },
  { id: "2", name: "المثابر", description: "تعلمت 7 أيام متتالية", icon: <Flame size={24} />, earned: true, earnedAt: "2025-02-01" },
  { id: "3", name: "متفوق", description: "حصلت على 100% في اختبار", icon: <Star size={24} />, earned: true, earnedAt: "2025-02-10" },
  { id: "4", name: "المنجز", description: "أكملت أول دورة", icon: <Award size={24} />, earned: false },
  { id: "5", name: "خبير", description: "أكملت 5 دورات", icon: <Trophy size={24} />, earned: false },
  { id: "6", name: "المتفاني", description: "تعلمت 50 ساعة", icon: <Clock size={24} />, earned: false },
];

const milestones: Milestone[] = [
  { id: "1", title: "أول درس", description: "شاهدت أول درس", completed: true, icon: <BookOpen size={16} /> },
  { id: "2", title: "10 دروس", description: "أكملت 10 دروس", completed: true, icon: <Target size={16} /> },
  { id: "3", title: "أول اختبار", description: "اجتزت أول اختبار", completed: true, icon: <CheckCircle size={16} /> },
  { id: "4", title: "أول شهادة", description: "حصلت على أول شهادة", completed: false, icon: <Award size={16} /> },
  { id: "5", title: "50 درس", description: "أكملت 50 درساً", completed: false, icon: <Star size={16} /> },
];

export function StudentAchievementsClient() {
  const xp = 1250;
  const currentStreak = 5;
  const longestStreak = 12;
  const badgesEarned = badges.filter(b => b.earned).length;

  // Mock streak calendar (last 28 days)
  const streakCalendar = Array.from({ length: 28 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    const random = Math.random();
    return {
      date: date.toISOString().split("T")[0],
      active: random > 0.4,
      intensity: random > 0.7 ? 3 : random > 0.5 ? 2 : random > 0.4 ? 1 : 0,
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <h1 className="font-display text-3xl text-primary flex items-center gap-3">
        <Trophy size={28} className="text-accent" />
        إنجازاتي
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <Card className="p-5">
          <div className="w-11 h-11 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Zap size={20} />
          </div>
          <p className="font-display text-3xl text-primary mb-1">{xp.toLocaleString()}</p>
          <p className="font-ui text-xs text-muted">نقاط الخبرة</p>
        </Card>
        <Card className="p-5">
          <div className="w-11 h-11 rounded-[14px] bg-orange-500/10 flex items-center justify-center text-orange-500 mb-3">
            <Flame size={20} />
          </div>
          <p className="font-display text-3xl text-primary mb-1">{currentStreak}</p>
          <p className="font-ui text-xs text-muted">أيام متتالية</p>
        </Card>
        <Card className="p-5">
          <div className="w-11 h-11 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Star size={20} />
          </div>
          <p className="font-display text-3xl text-primary mb-1">{longestStreak}</p>
          <p className="font-ui text-xs text-muted">أطول سلسلة</p>
        </Card>
        <Card className="p-5">
          <div className="w-11 h-11 rounded-[14px] bg-success/10 flex items-center justify-center text-success mb-3">
            <Award size={20} />
          </div>
          <p className="font-display text-3xl text-primary mb-1">{badgesEarned}/{badges.length}</p>
          <p className="font-ui text-xs text-muted">شارات مكتسبة</p>
        </Card>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-primary flex items-center gap-2">
          <Award size={22} className="text-accent" />
          الشارات
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 stagger-children">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-4 text-center transition-all duration-300 ${
                badge.earned ? "hover:border-primary/50" : "opacity-60 grayscale hover:grayscale-0"
              }`}
            >
              <div className={`w-14 h-14 rounded-[16px] mx-auto mb-3 flex items-center justify-center ${
                badge.earned ? "bg-primary/10 text-primary" : "bg-surfaceHover text-muted border border-surfaceBorder"
              }`}>
                {badge.earned ? badge.icon : <Lock size={20} />}
              </div>
              <h3 className="font-ui font-bold text-primary text-xs mb-0.5">{badge.name}</h3>
              <p className="text-[10px] text-muted font-body">{badge.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Streak Calendar */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-primary flex items-center gap-2">
          <Flame size={22} className="text-accent" />
          سجل النشاط
        </h2>
        <Card className="p-5">
          <div className="grid grid-cols-7 gap-1.5">
            {["سبت", "أحد", "إثن", "ثلا", "أرب", "خمي", "جمع"].map((day) => (
              <div key={day} className="text-center text-[10px] font-ui text-muted mb-1">{day}</div>
            ))}
            {streakCalendar.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md transition-colors ${
                  day.intensity === 3
                    ? "bg-primary"
                    : day.intensity === 2
                    ? "bg-primary/60"
                    : day.intensity === 1
                    ? "bg-primary/30"
                    : "bg-surfaceHover border border-surfaceBorder"
                }`}
                title={`${day.date}: ${day.active ? "نشاط" : "لا نشاط"}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[10px] text-muted font-ui">أقل</span>
            {[5, 30, 60, 100].map((opacity) => (
              <div key={opacity} className={`w-3 h-3 rounded-sm`} style={{ backgroundColor: `rgba(45,45,45,${opacity / 100})` }} />
            ))}
            <span className="text-[10px] text-muted font-ui">أكثر</span>
          </div>
        </Card>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-primary flex items-center gap-2">
          <Target size={22} className="text-accent" />
          المراحل
        </h2>
        <Card className="p-5">
          <div className="space-y-0">
            {milestones.map((milestone, i) => (
              <div key={milestone.id} className="flex items-start gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    milestone.completed
                      ? "bg-primary text-inverse"
                      : "bg-surfaceHover border border-surfaceBorder text-muted"
                  }`}>
                    {milestone.completed ? <CheckCircle size={16} /> : milestone.icon}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className={`w-0.5 h-10 ${
                      milestone.completed ? "bg-primary/40" : "bg-surfaceBorder"
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8">
                  <h3 className={`font-ui font-bold text-sm ${milestone.completed ? "text-primary" : "text-muted"}`}>
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-muted font-body">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
