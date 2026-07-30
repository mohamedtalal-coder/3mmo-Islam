import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface rounded-xl shadow-sm transition-all duration-300 ${
          hoverable ? "hover:shadow-md hover:-translate-y-1" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
