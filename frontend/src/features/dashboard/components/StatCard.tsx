import React from "react";
import { Card } from "@/src/shared/components/ui/Card";

export function StatCard({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType;
}) {
  return (
    <Card className="p-6 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <div className="font-display text-4xl text-primary leading-none mb-2">{value}</div>
        <span className="font-ui text-xs text-muted font-bold block">{label}</span>
      </div>
    </Card>
  );
}
