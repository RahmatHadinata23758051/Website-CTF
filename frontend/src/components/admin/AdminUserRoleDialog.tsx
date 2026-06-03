import React from "react";
import { Button } from "../ui/Button";
import { AlertTriangle, X } from "lucide-react";
import type { AdminUser } from "../../features/admin/users/types";

import { getErrorMessage } from "../../lib/error";

interface AdminUserRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: (role: "user" | "admin") => Promise<void>;
}

export function AdminUserRoleDialog({ isOpen, onClose, user, onConfirm }: AdminUserRoleDialogProps) {
  const [role, setRole] = React.useState<"user" | "admin">("user");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && user) {
      setRole(user.role);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === user.role) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(role);
      onClose();
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to update role.");
      setError(msg);
      setIsSubmitting(false);
    }
  };

  const isRoleChanged = role !== user.role;

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
          <AlertTriangle className="h-4.5 w-4.5 text-cyber-amber animate-pulse" />
          <div className="text-left font-mono">
            <span className="font-display font-light text-sm tracking-widest text-fg uppercase block">
              Modify User Role
            </span>
            <span className="text-[10px] text-fg-subtle font-bold block uppercase -mt-0.5">
              TARGET: <span className="text-cyber-cyan">{user.name}</span> ({user.email})
            </span>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="flex items-center gap-2 p-2 bg-cyber-crimson/5 border border-cyber-crimson/25 text-cyber-crimson font-mono text-[10px] rounded">
              <X className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-fg-muted uppercase tracking-widest block font-bold">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`py-3 px-4 border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  role === "user"
                    ? "border-cyber-cyan bg-cyber-cyan/5 text-fg"
                    : "border-border-ui hover:border-border-strong text-fg-muted"
                }`}
              >
                Standard User
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-3 px-4 border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  role === "admin"
                    ? "border-cyber-amber bg-cyber-amber/5 text-fg"
                    : "border-border-ui hover:border-border-strong text-fg-muted"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Warnings */}
          {isRoleChanged && role === "admin" && (
            <div className="p-3 bg-cyber-amber/5 border border-cyber-amber/20 text-[11px] font-mono leading-relaxed text-fg-muted space-y-1.5 animate-fade-in">
              <span className="font-bold text-cyber-amber uppercase block">PROMOTION WARNING:</span>
              <p>
                You are promoting this user to an Administrator. They will obtain full read/write permissions across the dashboard, challenge sets, flags, user accounts database, and hints structures.
              </p>
            </div>
          )}

          {isRoleChanged && role === "user" && (
            <div className="p-3 bg-cyber-amber/5 border border-cyber-amber/20 text-[11px] font-mono leading-relaxed text-fg-muted space-y-1.5 animate-fade-in">
              <span className="font-bold text-cyber-amber uppercase block">DOWNGRADE WARNING:</span>
              <p>
                You are downgrading this administrator to a standard User. They will lose access to the administrator control panel immediately. If they are the last active admin, the system will block this action on confirmation.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border-ui pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || !isRoleChanged}>
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
