import React from "react";
import { ShieldAlert } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onActionClick?: () => void;
  actionText?: string;
}

export function EmptyState({
  title = "No Target Match Located",
  description = "Your filter combination did not resolve any challenge node in our local index.",
  onActionClick,
  actionText = "RESET FILTERS",
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`border border-dashed border-border-strong p-12 text-center bg-surface/40 font-sans ${className}`}
      {...props}
    >
      <div className="h-10 w-10 bg-elevated border border-border-ui text-fg-subtle flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="h-5 w-5" />
      </div>
      <p className="font-display font-medium text-sm text-fg uppercase tracking-wide">{title}</p>
      <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1 leading-relaxed">
        {description}
      </p>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 px-4 py-2 border border-border-strong hover:border-cyber-cyan hover:text-cyber-cyan transition-colors text-xs font-mono text-fg-muted cursor-pointer uppercase tracking-wider font-bold focus:outline-none focus:ring-2 focus:ring-cyber-cyan/30"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
