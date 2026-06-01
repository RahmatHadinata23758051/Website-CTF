import React from "react";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  index: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
}

export function SectionHeader({ index, title, description, aside, className = "", ...props }: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 mb-8 text-left ${className}`} {...props}>
      <div className="space-y-1">
        <div className="font-mono text-[9px] text-cyber-cyan tracking-[0.15em] uppercase">
          {index} / INDEX
        </div>
        <h2 className="font-display font-medium text-3xl text-fg tracking-tight leading-none uppercase">
          {title}
        </h2>
        {description && (
          <p className="font-sans text-fg-muted text-xs sm:text-sm max-w-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
