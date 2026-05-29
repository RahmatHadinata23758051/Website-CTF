import React from "react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  accent?: boolean;
}

export function StatCard({ value, label, accent = false, className = "", ...props }: StatCardProps) {
  return (
    <div
      className={`p-5 bg-[#0c0c0c] border border-white/[0.04] font-mono text-left flex flex-col justify-between relative ${className}`}
      {...props}
    >
      <span className="text-[9px] text-slate-500 uppercase tracking-widest block">{label}</span>
      <span className={`block font-mono text-2xl sm:text-3xl font-bold mt-1.5 ${accent ? "text-cyber-cyan" : "text-slate-100"}`}>
        {value}
      </span>
    </div>
  );
}
