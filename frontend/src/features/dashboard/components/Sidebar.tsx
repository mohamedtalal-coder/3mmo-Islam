"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import React from "react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function Sidebar({ 
  links, 
  isOpen, 
  onClose 
}: { 
  links: SidebarLink[], 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const pathname = usePathname();

  // Split links into main and secondary (last item = profile/settings)
  const mainLinks = links.slice(0, -1);
  const secondaryLinks = links.slice(-1);

  const isActiveLink = (href: string) => {
    if (href === "/dashboard/student" || href === "/dashboard/teacher") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 right-0 z-50 w-[88px] bg-surface border-l border-primary/5 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-4 flex flex-col items-center justify-center min-h-[88px]">
          <Link href="/" className="text-primary flex flex-col items-center justify-center hover:opacity-80 transition-opacity group">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden text-muted hover:text-primary transition-colors mt-2">
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => onClose()}
                className={`
                  relative flex flex-col items-center justify-center gap-2 py-4 mx-2 rounded-2xl transition-all duration-300 font-ui text-[11px]
                  ${isActive 
                    ? "bg-gold text-primary dark:text-[#1c2a39] font-bold shadow-sm" 
                    : "text-muted hover:bg-primary/5 hover:text-primary"
                  }
                `}
                title={link.label}
              >
                <div className="relative">
                  <Icon size={22} className={isActive ? "text-primary dark:text-[#1c2a39]" : ""} />
                  {/* Badge */}
                  {link.badge && link.badge > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 bg-danger text-inverse dark:text-primary text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
                      {link.badge > 9 ? "9+" : link.badge}
                    </span>
                  )}
                </div>
                <span className="leading-none">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer instead of Divider */}
        <div className="mx-4 my-2" />

        {/* Secondary Navigation (Profile) */}
        <div className="py-4">
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => onClose()}
                className={`
                  relative flex flex-col items-center justify-center gap-2 py-4 mx-2 rounded-2xl transition-all duration-300 font-ui text-[11px]
                  ${isActive 
                    ? "bg-gold text-primary dark:text-[#1c2a39] font-bold shadow-sm" 
                    : "text-muted hover:bg-primary/5 hover:text-primary"
                  }
                `}
                title={link.label}
              >
                <Icon size={22} className={isActive ? "text-primary dark:text-[#1c2a39]" : ""} />
                <span className="leading-none">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
