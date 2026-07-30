export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gold/10 rounded-[10px] ${className || ""}`}
    />
  );
}
