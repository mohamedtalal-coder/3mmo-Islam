"use client";

interface DayActivity {
  day: string;
  hours: number;
}

interface WeeklyActivityChartProps {
  data: DayActivity[];
  maxHours?: number;
}

const dayLabels: Record<string, string> = {
  Sun: "أحد",
  Mon: "إثن",
  Tue: "ثلا",
  Wed: "أرب",
  Thu: "خمي",
  Fri: "جمع",
  Sat: "سبت",
};

export function WeeklyActivityChart({ data, maxHours }: WeeklyActivityChartProps) {
  const max = maxHours || Math.max(...data.map((d) => d.hours), 1);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-ui font-bold text-primary text-sm">النشاط الأسبوعي</h3>
        <span className="text-xs font-ui text-muted">
          إجمالي: <span className="font-bold text-accent">{totalHours.toFixed(1)}</span> ساعة
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, i) => {
          const heightPercent = max > 0 ? (item.hours / max) * 100 : 0;
          const isToday = i === data.length - 1;

          return (
            <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[10px] font-ui font-bold text-muted">
                {item.hours > 0 ? `${item.hours}h` : ""}
              </span>
              <div className="w-full flex justify-center" style={{ height: '80px' }}>
                <div className="w-full max-w-[32px] flex items-end h-full">
                  <div
                    className={`w-full activity-bar ${
                      isToday
                        ? "bg-gradient-to-t from-gold to-gold-soft"
                        : "bg-gold/20 group-hover:bg-gold/30"
                    }`}
                    style={{
                      height: `${Math.max(heightPercent, 5)}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
              <span className={`text-[11px] font-ui ${isToday ? "font-bold text-accent" : "text-muted"}`}>
                {dayLabels[item.day] || item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
