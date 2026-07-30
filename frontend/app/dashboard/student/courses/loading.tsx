export default function StudentCoursesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer h-9 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-7 w-20 rounded-full" />
      </div>

      {/* Tabs */}
      <div className="skeleton-shimmer h-12 w-full max-w-md rounded-xl" />

      {/* Search + Sort */}
      <div className="flex gap-3">
        <div className="flex-1 skeleton-shimmer h-11 rounded-xl" />
        <div className="skeleton-shimmer h-11 w-36 rounded-xl" />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[16px] overflow-hidden">
            <div className="skeleton-shimmer h-40" />
            <div className="p-5 space-y-3 bg-surface/50">
              <div className="skeleton-shimmer h-5 w-3/4 rounded" />
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="skeleton-shimmer h-2 w-full rounded-full" />
              <div className="skeleton-shimmer h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
