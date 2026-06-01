import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Terminal } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
}

export function Alert({ variant = "info", title, className = "", children, ...props }: AlertProps) {
  const base =
    "p-4 border flex items-start gap-3 shadow-xl max-w-sm font-mono text-xs transition-all duration-300";

  const variants = {
    success: "bg-surface border-cyber-emerald text-cyber-emerald",
    error:   "bg-surface border-cyber-crimson text-cyber-crimson",
    warning: "bg-surface border-cyber-amber   text-cyber-amber",
    info:    "bg-surface border-border-strong  text-fg-muted",
  };

  const Icon = {
    success: CheckCircle,
    error:   XCircle,
    warning: AlertTriangle,
    info:    Terminal,
  }[variant];

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Icon className="h-4.5 w-4.5 shrink-0 pt-0.5" />
      <div className="text-left">
        {title && <div className="font-bold tracking-wider uppercase mb-1">{title}</div>}
        <div className="text-fg text-[11px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
