import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = true, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`p-6 bg-card-bg border border-border-subtle transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        hoverable ? "hover:border-cyber-cyan/30 hover:bg-elevated hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {/* Top accent line visible on hover */}
      {hoverable && (
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-cyber-cyan transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></div>
      )}
      {children}
    </div>
  );
}
