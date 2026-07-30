import Link from "next/link";
import React from "react";
import { siteConfig } from "@/config/site.config";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  platformName?: string;
}

export function AuthShell({ title, subtitle, children, platformName = siteConfig.teacher.name }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-surface md:grid md:grid-cols-2 text-primary">
      {/* Right side (logically first in DOM, visually right in RTL) - Decorative panel */}
      <div className="hidden md:flex relative bg-background flex-col items-center justify-center overflow-hidden shadow-lg z-10">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        
        {/* Large centered gold Islamic geometric star pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 400 400" width="800" height="800" className="text-accent stroke-current" fill="none" strokeWidth="1">
            <path d="M200,0 L250,150 L400,200 L250,250 L200,400 L150,250 L0,200 L150,150 Z" />
            <path d="M58,58 L160,160 M342,58 L240,160 M342,342 L240,240 M58,342 L160,240" strokeWidth="2"/>
            <circle cx="200" cy="200" r="140" />
            <circle cx="200" cy="200" r="100" />
          </svg>
        </div>

        <div className="relative z-10 bg-surface/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-primary/5">
          <h2 className="font-display text-5xl md:text-6xl text-accent text-center tracking-wider leading-relaxed">{platformName}</h2>
        </div>
      </div>

      {/* Left side (logically second in DOM, visually left in RTL) - Form side */}
      <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-surface min-h-screen w-full">
        <div className="w-full max-w-md relative z-10 bg-surface p-6 md:p-10 rounded-[24px] shadow-soft border border-primary/5">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-accent mb-6 hover:scale-110 transition-transform">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </Link>
            <h1 className="font-display text-4xl text-primary mb-2">{title}</h1>
            <p className="font-body text-muted text-sm">{subtitle}</p>
          </div>
          
          <div className="form-container-override">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
