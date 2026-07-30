import { HTMLAttributes } from "react";

export function InkDivider({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`w-full flex items-center gap-4 ${className || ''}`} {...props}>
      <div className="h-[1px] bg-stone/20 flex-1" />
      <div className="w-1.5 h-1.5 rotate-45 bg-petrol/50" />
      <div className="w-2 h-2 rotate-45 bg-petrol" />
      <div className="w-1.5 h-1.5 rotate-45 bg-petrol/50" />
      <div className="h-[1px] bg-stone/20 flex-1" />
    </div>
  );
}
