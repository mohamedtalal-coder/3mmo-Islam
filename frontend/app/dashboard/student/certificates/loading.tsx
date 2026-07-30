export default function CertificatesLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer h-9 w-36 rounded-lg" />
        <div className="skeleton-shimmer h-7 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[16px] overflow-hidden">
            <div className="skeleton-shimmer h-36" />
            <div className="p-5 space-y-3 bg-surface/50">
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="flex gap-2">
                <div className="skeleton-shimmer h-10 flex-1 rounded-xl" />
                <div className="skeleton-shimmer h-10 w-12 rounded-xl" />
                <div className="skeleton-shimmer h-10 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
