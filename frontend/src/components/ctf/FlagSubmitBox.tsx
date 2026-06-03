import React from "react";
import { Link } from "react-router-dom";
import { FolderLock, HelpCircle, ShieldAlert } from "lucide-react";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../stores/authStore";
import { useSubmitFlag } from "../../features/challenges/hooks";
import { getErrorMessage } from "../../lib/error";

interface FlagSubmitBoxProps {
  slug: string;
  isSolved: boolean;
}

export function FlagSubmitBox({ slug, isSolved }: FlagSubmitBoxProps) {
  const { isAuthenticated } = useAuthStore();
  const submitMutation = useSubmitFlag(slug);

  const [flagInput, setFlagInput] = React.useState("");
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  React.useEffect(() => {
    setFlagInput("");
    setLocalError(null);
    setFeedback(null);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setFeedback(null);

    const flag = flagInput.trim();
    if (!flag) {
      setLocalError("Flag is required. Connection stream aborted.");
      return;
    }

    if (!isAuthenticated) {
      setLocalError("Authentication required. Please sign in to submit flags.");
      return;
    }

    submitMutation.mutate(flag, {
      onSuccess: (response) => {
        if (response.success) {
          if (response.correct) {
            const isAlreadySolved = response.data?.already_solved;
            setFeedback({
              text: isAlreadySolved
                ? "AUTHENTICATION SUCCESS: Correct flag. Challenge already solved."
                : "AUTHENTICATION SUCCESS: Correct flag. Challenge resolved correctly.",
              type: "success",
            });
            setFlagInput("");
          } else {
            setFeedback({
              text: response.message || "VERIFICATION TERMINATED: Incorrect key hash checksum.",
              type: "error",
            });
          }
        } else {
          setFeedback({
            text: response.message || "VERIFICATION REJECTED: Decryption sequence terminated.",
            type: "error",
          });
        }
      },
      onError: (err: any) => {
        const errMsg = getErrorMessage(err, "TRANSACTION FAILURE: Backend node unresponsive.");
        setFeedback({
          text: errMsg,
          type: "error",
        });
      },
    });
  };

  return (
    <div className="p-6 bg-card-bg border border-border-ui space-y-4">
      {/* Box Header */}
      <div className="flex items-center justify-between border-b border-border-ui pb-3 select-none">
        <span className="font-mono text-[10px] font-bold text-fg-muted flex items-center gap-2 uppercase tracking-[0.15em]">
          <FolderLock className="h-4 w-4 text-cyber-cyan" />
          FLAG VALIDATOR CHECKSUM
        </span>
        <span className="font-mono text-[9px] border border-cyber-cyan/15 bg-cyber-cyan/5 px-2 py-0.5 text-cyber-cyan tracking-wider uppercase font-bold">
          SHA-256 COMPARE
        </span>
      </div>

      {/* Solved Status Indicator Banner */}
      {isSolved && (
        <div className="p-4 border border-cyber-emerald/20 bg-cyber-emerald/3 flex items-start gap-3.5 font-sans animate-fade-in text-left">
          <span className="text-cyber-emerald text-base font-bold select-none shrink-0 mt-0.5">✓</span>
          <div className="text-xs">
            <p className="font-mono font-bold text-fg uppercase tracking-wider">SOLVE VERIFIED</p>
            <p className="text-fg-muted leading-relaxed mt-1">
              Excellent tracing sequence. Flag matched server configuration database. This challenge has been recorded as solved for your competitor signature.
            </p>
          </div>
        </div>
      )}

      {/* Authentication required banner block */}
      {!isAuthenticated ? (
        <div className="p-5 bg-surface border border-border-ui flex flex-col items-center justify-center text-center space-y-4 py-8 animate-fade-in select-none">
          <div className="p-2.5 rounded-full bg-cyber-amber/5 border border-cyber-amber/15 text-cyber-amber">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h4 className="font-mono font-bold text-xs text-fg uppercase tracking-wider">LOGIN REQUIRED</h4>
            <p className="font-sans text-[11px] text-fg-muted leading-normal">
              You must authenticate with a cryptographic signature before you can submit flag checksum vectors.
            </p>
          </div>
          <div className="flex gap-2 w-full max-w-xs pt-1">
            <Link to="/login" className="flex-1">
              <Button variant="primary" className="w-full py-2.5">
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button variant="secondary" className="w-full py-2.5">
                Register
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Authenticated Form entry block */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="iet{secret_key_parameters}"
                required
                value={flagInput}
                disabled={submitMutation.isPending}
                onChange={(e) => {
                  setFlagInput(e.target.value);
                  if (localError) setLocalError(null);
                  if (feedback) setFeedback(null);
                }}
                className="w-full bg-input-bg border border-border-ui focus:border-cyber-cyan p-3 text-xs text-fg font-mono focus:outline-none transition-all placeholder:text-fg-subtle disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="px-6 py-3 bg-cyber-cyan hover:opacity-95 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-opacity shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitMutation.isPending ? "VERIFYING KEY..." : "Verify Flag"}
            </button>
          </div>

          {/* Validation Alert */}
          {localError && (
            <Alert variant="error" title="VALIDATION ERROR" className="max-w-full font-mono text-xs">
              {localError}
            </Alert>
          )}

          {/* Server Mutating Feedback Alert */}
          {feedback && (
            <Alert
              variant={feedback.type}
              title={feedback.type === "success" ? "TRANSACTION CONFIRMED" : "TRANSACTION REJECTED"}
              className="max-w-full"
            >
              {feedback.text}
            </Alert>
          )}

          {/* Helpful standard subtext formats */}
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-fg-subtle leading-normal flex-wrap select-none pt-1">
            <HelpCircle className="h-3.5 w-3.5 text-fg-subtle shrink-0" />
            <span>SUBMISSION SIGNATURE FORMAT IS STRICTLY:</span>
            <code className="text-cyber-cyan bg-bg px-1 border border-border-subtle font-semibold">
              iet{'{secret_key_parameters}'}
            </code>
          </div>
        </form>
      )}
    </div>
  );
}
