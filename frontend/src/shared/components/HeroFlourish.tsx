import { HTMLAttributes } from "react";

export function HeroFlourish({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative flex items-center justify-center text-gold opacity-90 ${className || ''}`} {...props}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-spin-slow">
        {/* Abstract Arabic-inspired geometry */}
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
        <path d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="10" fill="currentColor" />
      </svg>
    </div>
  );
}
