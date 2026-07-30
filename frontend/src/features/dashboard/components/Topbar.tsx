"use client";

import { Menu, Bell, Search, User as UserIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { LogoutButton } from "@/src/features/auth/components/LogoutButton";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function Topbar({ 
  onOpenSidebar, 
  user,
  breadcrumbs,
  unreadCount = 0,
}: { 
  onOpenSidebar?: () => void;
  user?: { name: string; avatar?: string; email?: string; phone?: string };
  breadcrumbs?: React.ReactNode;
  unreadCount?: number;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const pathname = usePathname();
  const isTeacher = pathname?.includes("/dashboard/teacher");
  const roleLabel = isTeacher ? "Admin" : "طالب";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-primary/5 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="md:hidden text-muted hover:text-accent transition-colors w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10"
            aria-label="فتح القائمة"
          >
            <Menu size={22} />
          </button>
          
          {breadcrumbs ? (
            <div className="hidden sm:block text-sm font-ui text-muted">
              {breadcrumbs}
            </div>
          ) : (
            <div className="hidden sm:block">
              <h2 className="font-ui font-bold text-primary text-sm">لوحة التحكم</h2>
            </div>
          )}
        </div>

        {/* Right: Search + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent w-8 h-8 flex items-center justify-center" aria-label="بحث">
              <Search size={16} />
            </button>
            <input 
              type="text" 
              placeholder="بحث في الدورات..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-primary/5 rounded-full py-2.5 pr-10 pl-5 text-sm font-ui text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-primary/10 w-64 transition-all duration-200 placeholder:text-muted/60"
            />
          </form>

          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setShowSearch(!showSearch)} 
            className="md:hidden text-muted hover:text-accent transition-colors w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10"
            aria-label="بحث"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <Link 
            href={isTeacher ? "/dashboard/teacher/notifications" : "/dashboard/student/notifications"}
            className="relative text-muted hover:text-accent transition-colors w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10"
            aria-label="الإشعارات"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 left-1.5 min-w-[16px] h-4 px-1 bg-danger text-inverse text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-full hover:bg-gold/10 transition-colors"
              aria-label="الملف الشخصي"
            >
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center overflow-hidden group-hover:bg-primary/10 transition-colors shadow-sm">
                {user?.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} className="text-primary" />
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-ui text-sm font-bold text-primary leading-tight">{user?.name || "المستخدم"}</span>
                <span className="font-ui text-[11px] text-muted leading-tight">{roleLabel}</span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-surface backdrop-blur-xl rounded-[24px] shadow-lg overflow-hidden animate-scale-in z-50">
                <div className="p-4 bg-primary/5">
                  <p className="font-ui font-bold text-primary text-sm">{user?.name || "المستخدم"}</p>
                  {user?.phone && <p className="font-ui text-xs text-muted mt-0.5 font-mono">رقم الطالب: {user.phone}</p>}
                  {user?.email && <p className="font-ui text-xs text-muted mt-0.5">{user.email}</p>}
                </div>
                <div className="py-2">
                  <Link href="/dashboard/student/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-ui text-muted hover:text-primary hover:bg-gold/5 transition-colors">
                    <UserIcon size={16} />
                    الملف الشخصي
                  </Link>
                </div>
                <div className="py-2 px-4 border-t border-primary/5">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <form onSubmit={handleSearch} className="md:hidden mt-3 animate-fade-in-up relative">
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent" aria-label="بحث">
            <Search size={16} />
          </button>
          <input 
            type="text" 
            placeholder="بحث في الدورات..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary/5 rounded-full py-3 pr-10 pl-5 text-sm font-ui text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:bg-primary/10 transition-all duration-200 placeholder:text-muted/60"
            autoFocus
          />
        </form>
      )}
    </header>
  );
}
