export default function AchievementsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="skeleton-shimmer h-9 w-36 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-[120px] rounded-[16px]" />
        ))}
      </div>
      <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-[100px] rounded-[16px]" />
        ))}
      </div>
      <div className="skeleton-shimmer h-[200px] rounded-[16px]" />
    </div>
  );
}
