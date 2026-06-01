import { Link, useLocation } from "react-router-dom";
import { FileText, ShieldAlert, Lock, ArrowLeft, ExternalLink } from "lucide-react";

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-display font-semibold text-sm text-fg uppercase tracking-wider border-l-2 border-cyber-cyan pl-3">
        {title}
      </h2>
      <div className="text-sm text-fg-muted leading-relaxed space-y-2 font-sans pl-3">
        {children}
      </div>
    </div>
  );
}

const legalNav = [
  { path: "/rules", label: "Rules", Icon: ShieldAlert },
  { path: "/terms", label: "Terms of Service", Icon: FileText },
  { path: "/privacy", label: "Privacy Policy", Icon: Lock },
];

interface LegalPageLayoutProps {
  icon: React.ReactNode;
  tag: string;
  title: React.ReactNode;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  icon,
  tag,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const location = useLocation();

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-6 text-left space-y-10">
      {/* HEADER */}
      <div className="border-b border-border-subtle pb-6 space-y-4">
        <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan uppercase tracking-wider font-bold select-none">
          {icon}
          {tag}
        </div>
        <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
          {title}
        </h1>
        <p className="font-sans text-fg-muted text-sm mt-2 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
        <p className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest">
          Last Updated: {lastUpdated}
        </p>
      </div>

      {/* LEGAL NAV */}
      <div className="flex flex-wrap gap-2 border border-border-subtle bg-card-bg p-3">
        {legalNav.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all border ${
                isActive
                  ? "border-cyber-cyan/50 text-cyber-cyan bg-cyber-cyan/5"
                  : "border-border-ui text-fg-muted hover:border-border-strong hover:text-fg"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Link>
          );
        })}
        <div className="ml-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border border-border-ui text-fg-muted hover:border-border-strong hover:text-fg transition-all"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-8">{children}</div>

      {/* FOOTER CTA */}
      <div className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest">
          RBLXSec Labs — Cybersecurity Learning Platform
        </div>
        <div className="flex gap-3">
          <Link
            to="/challenges"
            className="flex items-center gap-1.5 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/20 text-cyber-cyan text-xs font-mono uppercase tracking-wider transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            Enter Challenges
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-4 py-2 border border-border-ui text-fg-muted hover:border-border-strong hover:text-fg text-xs font-mono uppercase tracking-wider transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
