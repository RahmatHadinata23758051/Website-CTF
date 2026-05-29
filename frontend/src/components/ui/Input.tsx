import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left w-full">
        {label && (
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-950 border ${
            error ? "border-cyber-crimson focus:border-cyber-crimson" : "border-slate-800 hover:border-slate-700 focus:border-cyber-cyan"
          } rounded p-2.5 text-xs text-slate-100 font-mono focus:outline-none transition-colors placeholder:text-slate-800 ${className}`}
          {...props}
        />
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
