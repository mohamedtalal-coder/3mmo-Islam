"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="relative">
      <div className="flex gap-1 bg-surface border border-surfaceBorder rounded-button p-1 shadow-sm w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-ui text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-primary text-inverse shadow-sm"
                  : "text-muted hover:text-primary hover:bg-surfaceHover"
              }`}
              role="tab"
              aria-selected={isActive}
            >
              {tab.icon && <span className={isActive ? "text-accent" : "opacity-60"}>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? "bg-surface/20 text-inverse"
                    : "bg-textMuted/10 text-muted"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
