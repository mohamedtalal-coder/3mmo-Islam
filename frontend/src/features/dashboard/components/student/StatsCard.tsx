"use client";

import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
}

export function StatsCard({ icon, label, value, trend, accentColor }: StatsCardProps) {
  return (
    <div className="bg-surface shadow-sm border border-primary/5 rounded-[24px] p-5 group relative overflow-hidden" style={accentColor ? { '--accent': accentColor } as React.CSSProperties : undefined}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-accent group-hover:bg-gold/20 transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-ui font-bold px-2.5 py-1 rounded-full ${
            trend.positive
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="animate-count-up">
        <p className="font-display text-3xl text-primary mb-1">{value}</p>
        <p className="font-ui text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
