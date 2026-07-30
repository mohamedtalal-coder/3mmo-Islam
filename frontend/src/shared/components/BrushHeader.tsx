import React from "react";

export function BrushHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* SVG Brush Background */}
      <svg 
        className="absolute inset-0 w-full h-full text-primary" 
        preserveAspectRatio="none" 
        viewBox="0 0 400 100" 
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15.5 25.5C-2.5 31.5 -4.5 69.5 12.5 83.5C29.5 97.5 108.5 90.5 198.5 91.5C288.5 92.5 385.5 98.5 393.5 75.5C401.5 52.5 384.5 17.5 367.5 13.5C350.5 9.5 283.5 11.5 198.5 11.5C113.5 11.5 33.5 19.5 15.5 25.5Z" />
        <path d="M5.5 45.5C-5.5 55.5 25.5 85.5 75.5 85.5" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M395.5 35.5C405.5 45.5 375.5 15.5 325.5 15.5" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M35.5 15.5C25.5 5.5 75.5 -5.5 125.5 15.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M365.5 85.5C375.5 95.5 325.5 105.5 275.5 85.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </svg>
      
      <div className="relative z-10 px-12 py-6 text-accent font-display text-3xl text-center">
        {children}
      </div>
    </div>
  );
}
