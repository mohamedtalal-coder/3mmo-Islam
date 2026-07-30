export default function NotificationsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="skeleton-shimmer h-9 w-36 rounded-lg" />
      <div className="skeleton-shimmer h-12 w-full max-w-lg rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-[80px] rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
