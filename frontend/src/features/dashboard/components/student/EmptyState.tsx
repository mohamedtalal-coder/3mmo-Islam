"use client";

import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 animate-float">
        <div className="text-accent">{icon}</div>
      </div>
      <h3 className="font-display text-2xl text-primary mb-3">{title}</h3>
      <p className="font-body text-muted max-w-md mb-8 leading-relaxed">{description}</p>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-inverse font-ui font-bold px-8 py-3 rounded-xl hover:shadow-gold transition-all duration-300 hover:scale-[1.02]"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-inverse font-ui font-bold px-8 py-3 rounded-xl hover:shadow-gold transition-all duration-300 hover:scale-[1.02]"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
