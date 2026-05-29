import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyber-cyan text-slate-950 hover:bg-cyber-cyan hover:opacity-90 active:scale-98",
    secondary: "border border-slate-700 bg-transparent text-slate-300 hover:border-slate-500 hover:text-slate-50 active:scale-98",
    danger: "border border-cyber-crimson/30 bg-cyber-crimson/10 text-cyber-crimson hover:bg-cyber-crimson hover:text-white active:scale-98",
    ghost: "bg-transparent text-slate-450 hover:text-slate-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
