export default function StudentDashboardLoading() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Welcome Banner Skeleton */}
      <div className="skeleton-shimmer h-40 md:h-44 rounded-2xl" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-[120px] rounded-[16px]" />
        ))}
      </div>

      {/* Continue Learning + Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-[88px] rounded-[16px]" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
          <div className="skeleton-shimmer h-[200px] rounded-[16px]" />
        </div>
      </div>

      {/* Recently Viewed + Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-[80px] rounded-[16px]" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-[72px] rounded-[16px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
