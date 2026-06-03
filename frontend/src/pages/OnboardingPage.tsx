import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, BookOpen, Terminal, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { useAcceptRules } from "../features/account/hooks";
import { getErrorMessage } from "../lib/error";

export function OnboardingPage() {
  const navigate = useNavigate();
  const acceptRulesMutation = useAcceptRules();
  const [agreed, setAgreed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAccept = async () => {
    if (!agreed) return;
    setError(null);
    try {
      const response = await acceptRulesMutation.mutateAsync();
      if (response.success) {
        navigate("/challenges");
      } else {
        setError(response.message || "Failed to process rules acceptance.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err, "Network connection failure. Unable to submit rules acceptance."));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 select-text animate-fade-in">
      <div className="bg-card-bg border border-border-ui relative overflow-hidden flex flex-col justify-between text-left space-y-6 p-6 sm:p-8 shadow-2xl">
        {/* Top lime neon bar on form card */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-cyan animate-pulse"></div>

        <div className="space-y-2">
          <div className="font-mono text-[9px] text-cyber-cyan tracking-[0.2em] uppercase font-bold select-none flex items-center gap-1.5">
            <Terminal className="h-3 w-3" /> SECURITY_GATE / PROXY_GATEWAY
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-fg uppercase tracking-tight leading-none">
            Platform Onboarding
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Welcome to RBLXSec. To establish connection tunnels and gain operational access to active labs, you must review and accept our rules of engagement.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="ONBOARDING REJECTED" className="max-w-full">
            {error}
          </Alert>
        )}

        {/* Warning Callout Box */}
        <div className="border border-cyber-crimson/20 bg-cyber-crimson/5 p-4 rounded-none space-y-2 relative">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-crimson"></div>
          <div className="flex items-center gap-2 text-cyber-crimson font-mono text-[10px] uppercase font-bold tracking-wider select-none">
            <AlertTriangle className="h-4 w-4" /> Crucial Operational Warning
          </div>
          <p className="text-fg-muted text-xs leading-relaxed pl-6">
            RBLXSec is a controlled cybersecurity challenge lab. Only test targets explicitly provided inside challenges. 
            Do not scan, attack, disrupt, or abuse infrastructure outside the stated challenge scope. Responsible testing rules are strictly monitored and enforced.
          </p>
        </div>

        {/* Core Rules Grid */}
        <div className="space-y-4 pt-2">
          <h3 className="font-mono text-xs text-cyber-cyan uppercase tracking-wider font-bold select-none">
            Rules of Engagement:
          </h3>
          <div className="grid grid-cols-1 gap-3 font-sans text-xs">
            <div className="flex items-start gap-3 p-3 bg-surface border border-border-subtle rounded-none hover:border-border-ui transition-colors">
              <ShieldCheck className="h-5 w-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-fg uppercase tracking-wide text-[11px] mb-1">1. Scope Limitations</h4>
                <p className="text-fg-muted leading-relaxed">Only perform security assessments on targets and endpoints specifically designated for each individual challenge.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-surface border border-border-subtle rounded-none hover:border-border-ui transition-colors">
              <CheckCircle2 className="h-5 w-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-fg uppercase tracking-wide text-[11px] mb-1">2. Fair Play & Solves</h4>
                <p className="text-fg-muted leading-relaxed">Do not share flags, write-ups, or solutions before the active CTF is completed. Refrain from colluding or using multiple accounts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-surface border border-border-subtle rounded-none hover:border-border-ui transition-colors">
              <AlertTriangle className="h-5 w-5 text-cyber-crimson shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-fg uppercase tracking-wide text-[11px] mb-1">3. Infrastructure Integrity</h4>
                <p className="text-fg-muted leading-relaxed">Do not attack, DDOS, or attempt to compromise the RBLXSec platform hosting services, submission engines, or dashboard portals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 border-t border-b border-border-subtle font-mono text-[10px] uppercase select-none">
          <span className="text-fg-subtle">Review Documentation:</span>
          <a href="/rules" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-fg transition-colors font-bold flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Platform Rules
          </a>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-fg transition-colors font-bold flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Terms of Service
          </a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-fg transition-colors font-bold flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Privacy Policy
          </a>
        </div>

        {/* Acknowledgment checkbox and Accept button */}
        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={acceptRulesMutation.isPending}
              className="mt-0.5 h-4.5 w-4.5 rounded-none border-border-ui bg-slate-950 text-cyber-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
            />
            <span className="text-fg-muted text-xs leading-relaxed group-hover:text-fg transition-colors">
              I have read, understood, and agree to follow all the RBLXSec Rules of Engagement, Terms of Service, and Privacy Policy.
            </span>
          </label>

          <div className="pt-2">
            <Button
              onClick={handleAccept}
              variant="primary"
              className="w-full py-3"
              disabled={!agreed || acceptRulesMutation.isPending}
            >
              {acceptRulesMutation.isPending ? "SYNCHRONIZING RULES STATE..." : "Accept Rules & Enter Laboratory"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
