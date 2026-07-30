export function GeometricPattern({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg width="100%" height="100%" style={{ opacity }}>
      <pattern id="islamic-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0 0L40 40M40 0L0 40" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
