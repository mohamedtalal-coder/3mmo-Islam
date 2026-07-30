import React from "react";

export function HeroBrushHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Huge SVG Brush Background */}
      <svg 
        className="absolute inset-0 w-full h-full text-primary" 
        preserveAspectRatio="none" 
        viewBox="0 0 800 200" 
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M25 50C-5 60 -10 130 25 160C60 190 200 170 400 175C600 180 780 190 790 140C800 90 750 20 600 25C450 30 200 40 25 50Z" />
        <path d="M10 80C-10 100 50 160 150 160" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
        <path d="M790 60C810 80 750 30 650 30" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
        <path d="M70 30C50 10 150 -10 250 30" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <path d="M730 160C750 180 650 200 550 160" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      </svg>
      
      <div className="relative z-10 px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        {children}
      </div>
    </div>
  );
}
