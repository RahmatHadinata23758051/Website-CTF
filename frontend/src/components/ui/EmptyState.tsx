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
      className={`border border-dashed border-slate-800 rounded p-12 text-center bg-slate-900/10 font-sans ${className}`}
      {...props}
    >
      <div className="h-10 w-10 bg-slate-900 border border-slate-800 text-slate-500 rounded flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="h-5 w-5" />
      </div>
      <p className="font-display font-medium text-sm text-slate-300 uppercase tracking-wide">{title}</p>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
        {description}
      </p>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 px-4 py-2 border border-slate-700 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors text-xs font-mono text-slate-400 rounded cursor-pointer uppercase tracking-wider font-bold"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
