export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="skeleton-shimmer h-[140px] rounded-[16px]" />
      {/* Sections */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-[200px] rounded-[16px]" />
      ))}
    </div>
  );
}
