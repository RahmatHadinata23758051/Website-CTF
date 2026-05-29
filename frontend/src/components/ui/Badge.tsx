import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export function Badge({ variant = "primary", className = "", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 font-bold rounded-none select-none";

  const variants = {
    primary: "text-cyber-cyan border-cyber-cyan/15 bg-cyber-cyan/3",
    secondary: "text-[#7B9FFF] border-[#7B9FFF]/15 bg-[#7B9FFF]/3",
    success: "text-cyber-emerald border-cyber-emerald/15 bg-cyber-emerald/3",
    danger: "text-cyber-crimson border-cyber-crimson/15 bg-cyber-crimson/3",
    warning: "text-cyber-amber border-cyber-amber/15 bg-cyber-amber/3",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
