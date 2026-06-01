import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 select-text">
      
      <div className="max-w-md w-full p-8 bg-card-bg border border-border-ui space-y-6 text-left animate-fade-in">
        
        {/* HEADER ICON & TITLE */}
        <div className="space-y-2 select-none text-center sm:text-left">
          <div className="h-10 w-10 bg-cyber-amber/5 border border-cyber-amber/20 text-cyber-amber flex items-center justify-center rounded-none mb-4 mx-auto sm:mx-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="font-display font-light text-2xl text-fg uppercase tracking-tight">
            RECOVERY TICKET
          </h2>
          <p className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest">
            TNL // PASSWORD RECOVERY FEED
          </p>
        </div>

        {/* COMPROMISED DISCLAIMER WARNING PANEL */}
        <div className="p-4 bg-bg border border-border-subtle space-y-3">
          <h4 className="font-mono font-bold text-[10px] text-cyber-amber uppercase tracking-wider select-none flex items-center gap-1.5 animate-pulse">
            [!] RECOVERY CHANNEL INACTIVE
          </h4>
          <p className="font-sans text-xs text-fg-muted leading-relaxed">
            Password reset is not available yet.
            Email verification reset will be enabled after deployment.
            Please contact the platform administrator if you need access restored.
          </p>
        </div>

        {/* INFORMATIONAL INPUT FIELD */}
        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-fg-subtle uppercase tracking-widest text-[9px] block select-none">
              Node Email (Informational Only)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-subtle">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <Input
                type="email"
                disabled
                placeholder="Enter node email address"
                className="pl-9 select-none cursor-not-allowed opacity-50 bg-[#121212] placeholder:text-fg-subtle border-border-subtle"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full cursor-not-allowed opacity-50 flex items-center justify-center select-none"
              disabled
            >
              RECOVERY INTERRUPTED
            </Button>
          </div>
        </div>

        {/* RETURN NAVIGATION ANCHOR */}
        <div className="pt-2 border-t border-border-subtle select-none text-center sm:text-left">
          <Link 
            to="/login"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-fg-subtle hover:text-cyber-cyan transition-colors uppercase tracking-widest cursor-pointer font-bold"
          >
            <ArrowLeft className="h-3 w-3" />
            BACK TO LOGIN TERMINAL
          </Link>
        </div>

      </div>

    </div>
  );
}
