import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConnectionErrorProps {
  onRetry?: () => void;
  message?: string;
}

export function ConnectionError({
  onRetry,
  message = "The RBLXSec backend laboratory is currently unreachable. Please check your network connection or try again later.",
}: ConnectionErrorProps) {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center animate-fade-in">
      <div className="border border-cyber-crimson p-6 bg-surface/30 max-w-md w-full flex flex-col items-center">
        <div className="h-12 w-12 rounded-none bg-cyber-crimson/10 border border-cyber-crimson/30 flex items-center justify-center mb-4 text-cyber-crimson">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-fg uppercase tracking-wide mb-2">
          LABORATORY_CONNECTION_OFFLINE
        </h3>
        <p className="font-sans text-xs text-fg-muted leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="secondary"
            className="mt-6 font-mono text-xs uppercase tracking-wider px-6 py-2 border-cyber-crimson/50 hover:border-cyber-crimson text-fg"
          >
            ESTABLISH CONNECTION
          </Button>
        )}
      </div>
    </div>
  );
}
