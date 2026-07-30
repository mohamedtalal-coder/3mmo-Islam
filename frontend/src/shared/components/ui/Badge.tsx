import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", icon, children, ...props }, ref) => {
    const variants = {
      default: "bg-surface shadow-sm text-muted",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
      outline: "bg-transparent border border-primary/20 text-muted",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui text-[11px] font-bold tracking-wide ${variants[variant]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
