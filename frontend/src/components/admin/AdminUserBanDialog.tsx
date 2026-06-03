import React from "react";
import { Button } from "../ui/Button";
import { AlertCircle, X } from "lucide-react";
import type { AdminUser } from "../../features/admin/users/types";

import { getErrorMessage } from "../../lib/error";

interface AdminUserBanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: (reason: string) => Promise<void>;
}

export function AdminUserBanDialog({ isOpen, onClose, user, onConfirm }: AdminUserBanDialogProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Ban reason is required.");
      return;
    }
    if (trimmedReason.length < 3 || trimmedReason.length > 255) {
      setError("Reason must be between 3 and 255 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(trimmedReason);
      onClose();
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to ban user.");
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in select-text">
      <div className="w-full max-w-md bg-surface border border-border-strong shadow-2xl relative transition-all duration-300 flex flex-col my-8 rounded-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-fg-muted hover:text-fg transition-colors p-1 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-border-ui flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-cyber-crimson animate-pulse" />
          <div className="text-left font-mono">
            <span className="font-display font-light text-sm tracking-widest text-fg uppercase block">
              Ban User Account
            </span>
            <span className="text-[10px] text-fg-subtle font-bold block uppercase -mt-0.5">
              TARGET: <span className="text-cyber-crimson">{user.name}</span> ({user.email})
            </span>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div className="p-3 bg-cyber-crimson/5 border border-cyber-crimson/20 text-[11px] font-mono leading-relaxed text-fg-muted space-y-2">
            <span className="font-bold text-cyber-crimson uppercase block">LOCKOUT NOTICE:</span>
            <p>
              Banning this account will immediately revoke all current active sessions. The user will be blocked from logging in or calling any endpoints. If they are in the middle of active gameplay, they will be disconnected on their next network request.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-cyber-crimson/5 border border-cyber-crimson/25 text-cyber-crimson font-mono text-[10px] rounded">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-fg-muted uppercase tracking-widest block font-bold">
              Ban Reason *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-input-bg border border-border-ui hover:border-border-strong focus:border-cyber-cyan p-2.5 text-xs text-fg font-mono focus:outline-none transition-colors placeholder:text-fg-subtle resize-none"
              placeholder="Violation of platform rules, malicious activities..."
            />
            <span className="font-mono text-[9px] text-fg-subtle block uppercase text-right">
              {reason.length} / 255 chars
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border-ui pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={isSubmitting}>
              {isSubmitting ? "Banning..." : "Confirm Ban"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
