import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left w-full">
        {label && (
          <label className="font-mono text-[10px] text-fg-muted uppercase tracking-widest block select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-input-bg border ${
            error
              ? "border-cyber-crimson focus:border-cyber-crimson"
              : "border-border-ui hover:border-border-strong focus:border-cyber-cyan"
          } p-2.5 text-xs text-fg font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan/20 transition-colors placeholder:text-fg-subtle ${className}`}
          {...props}
        />
        {helper && !error && (
          <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-wide block pt-0.5">
            {helper}
          </span>
        )}
        {error && (
          <span className="font-mono text-[10px] text-cyber-crimson uppercase tracking-wide block pt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
