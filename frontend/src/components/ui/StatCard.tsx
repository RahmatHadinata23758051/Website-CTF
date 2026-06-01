import React from "react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  accent?: boolean;
}

export function StatCard({ value, label, accent = false, className = "", ...props }: StatCardProps) {
  return (
    <div
      className={`p-5 bg-card-bg border border-border-subtle font-mono text-left flex flex-col justify-between relative transition-colors duration-200 ${className}`}
      {...props}
    >
      <span className="text-[9px] text-fg-subtle uppercase tracking-widest block">{label}</span>
      <span className={`block font-mono text-2xl sm:text-3xl font-bold mt-1.5 ${accent ? "text-cyber-cyan" : "text-fg"}`}>
        {value}
      </span>
    </div>
  );
}
