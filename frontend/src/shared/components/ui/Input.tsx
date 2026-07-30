import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-ui text-muted flex items-center gap-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-11 border border-primary/10 rounded-lg font-body bg-surface text-primary placeholder:text-muted/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-colors text-sm hover:bg-surfaceHover ${
              leftIcon ? "pl-10" : "px-4"
            } ${rightIcon ? "pr-10" : ""} ${
              error ? "border-danger focus:border-danger focus:ring-danger/50" : ""
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger font-ui">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
