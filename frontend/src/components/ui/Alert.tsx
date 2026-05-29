import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Terminal } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
}

export function Alert({ variant = "info", title, className = "", children, ...props }: AlertProps) {
  const baseStyles = "p-4 border flex items-start gap-3 shadow-2xl max-w-sm font-mono text-xs transition-all duration-300 animate-slide-in";

  const variants = {
    success: "bg-[#0a0a0a] border-cyber-cyan text-cyber-cyan",
    error: "bg-[#0a0a0a] border-cyber-crimson text-cyber-crimson",
    warning: "bg-[#0a0a0a] border-cyber-amber text-cyber-amber",
    info: "bg-[#0a0a0a] border-slate-700 text-slate-350",
  };

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Terminal,
  }[variant];

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <Icon className="h-4.5 w-4.5 shrink-0 pt-0.5" />
      <div className="text-left">
        {title && <div className="font-bold tracking-wider uppercase mb-1">{title}</div>}
        <div className="text-slate-300 text-[11px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
