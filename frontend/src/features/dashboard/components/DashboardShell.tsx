"use client";

import { useState } from "react";
import { Sidebar, SidebarLink } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ 
  children, 
  links, 
  user, 
  breadcrumbs,
  unreadCount = 0,
}: { 
  children: React.ReactNode; 
  links: SidebarLink[]; 
  user?: { name: string; avatar?: string; email?: string; phone?: string };
  breadcrumbs?: React.ReactNode;
  unreadCount?: number;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary flex">
      <Sidebar 
        links={links} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden md:ps-[88px]">
        <Topbar 
          user={user} 
          breadcrumbs={breadcrumbs} 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          unreadCount={unreadCount}
        />
        
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
