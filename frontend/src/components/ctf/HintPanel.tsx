import React from "react";
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle, HelpCircle } from "lucide-react";
import { usePublicHints } from "../../features/challenges/hintsHooks";
import { InlineLoading } from "../ui/InlineLoading";
import { InlineError } from "../ui/InlineError";

interface HintPanelProps {
  slug: string;
}

export function HintPanel({ slug }: HintPanelProps) {
  const { data: hints = [], isLoading, error } = usePublicHints(slug);
  const [revealedHintIds, setRevealedHintIds] = React.useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedHintIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-card-bg border border-border-ui flex items-center justify-center min-h-[140px]">
        <InlineLoading message="Synchronizing hints..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card-bg border border-cyber-crimson/30">
        <InlineError error={error} fallback="Unable to synchronize hints from dynamic lab node. Check connections." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-card-bg border border-border-ui space-y-4 select-text text-left">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 select-none">
        <div className="flex items-center gap-2 font-mono text-[10px] text-fg-muted tracking-[0.2em] uppercase font-bold">
          <Lightbulb className="h-4 w-4 text-cyber-cyan animate-pulse" />
          03 // Challenge Hints Standby ({hints.length})
        </div>
        <span className="text-[8px] text-fg-muted font-mono uppercase tracking-widest bg-bg px-2 py-0.5 border border-border-subtle">
          MVP MODE: FREE DECRYPT (0 PTS)
        </span>
      </div>

      {hints.length > 0 ? (
        <div className="space-y-3">
          {hints.map((hint, idx) => {
            const isRevealed = !!revealedHintIds[hint.id];
            return (
              <div
                key={hint.id}
                className={`border transition-all duration-300 font-mono text-xs ${
                  isRevealed
                    ? "border-cyber-cyan/30 bg-bg"
                    : "border-border-ui bg-surface/20 hover:border-border-strong"
                }`}
              >
                {/* Header Collapsible Trigger */}
                <button
                  type="button"
                  onClick={() => toggleReveal(hint.id)}
                  className="w-full p-3.5 flex items-center justify-between font-mono text-left cursor-pointer hover:bg-surface/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-fg-muted font-bold">HINT #{idx + 1}</span>
                    <span className="text-[10px] text-fg-subtle">
                      (Cost: {hint.cost} PTS — Free Unlock)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyber-cyan font-bold text-[10px] tracking-wider uppercase">
                    <span>{isRevealed ? "Hide content" : "Reveal hint"}</span>
                    {isRevealed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </div>
                </button>

                {/* Collapsible Decrypted Content Area */}
                {isRevealed && (
                  <div className="p-4 pt-0 border-t border-dashed border-border-strong font-sans text-fg-muted text-xs leading-relaxed animate-fade-in space-y-2">
                    <p className="font-sans font-medium text-fg">{hint.content}</p>
                    <div className="pt-2 border-t border-border-subtle flex items-center gap-1.5 font-mono text-[9px] text-fg-subtle select-none">
                      <HelpCircle className="h-3 w-3 text-fg-subtle" />
                      <span>Hints are configured to help you progress without directly exposing flag keys.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-fg-subtle border border-dashed border-border-strong p-4 bg-bg font-mono text-xs">
          <AlertCircle className="h-5 w-5 text-fg-subtle shrink-0" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-fg-muted">NO HINTS AVAILABLE</span>
            No guidance matrices have been provisioned for this trial vector.
          </div>
        </div>
      )}
    </div>
  );
}
