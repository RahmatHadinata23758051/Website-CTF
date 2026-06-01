import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base =
    "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyber-cyan/30 focus:ring-offset-1 focus:ring-offset-transparent";

  const variants = {
    primary:
      "bg-cyber-cyan text-slate-950 hover:opacity-90 active:scale-[0.98]",
    secondary:
      "border border-border-strong bg-transparent text-fg-muted hover:text-fg hover:border-border-ui active:scale-[0.98]",
    danger:
      "border border-cyber-crimson/30 bg-cyber-crimson/10 text-cyber-crimson hover:bg-cyber-crimson hover:text-white active:scale-[0.98]",
    ghost:
      "bg-transparent text-fg-muted hover:text-fg",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
