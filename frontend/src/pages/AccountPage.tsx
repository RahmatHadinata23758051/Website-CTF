import React from "react";
import { Settings, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { useAuthStore } from "../stores/authStore";
import { useUpdateProfile, useChangePassword } from "../features/account/hooks";
import { getErrorMessage } from "../lib/error";

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [displayName, setDisplayName] = React.useState(user?.name || "");
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [prevUser, setPrevUser] = React.useState(user);
  if (prevUser !== user) {
    setPrevUser(user);
    if (user?.name) {
      setDisplayName(user.name);
    }
  }

  // Handle Display Name Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    const nameToSave = displayName.trim();
    if (!nameToSave) {
      setProfileError("Name is required");
      return;
    }
    if (nameToSave.length < 2 || nameToSave.length > 60) {
      setProfileError("Name must be between 2 and 60 characters long");
      return;
    }

    updateProfileMutation.mutate(
      { name: nameToSave },
      {
        onSuccess: (res) => {
          if (res.success) {
            setProfileSuccess("Display name updated successfully.");
          } else {
            setProfileError(res.message || "Failed to update profile settings.");
          }
        },
        onError: (err: any) => {
          setProfileError(getErrorMessage(err, "Failed to update profile settings."));
        }
      }
    );
  };

  // Handle Password Secure Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (!confirmPassword) {
      setPasswordError("Confirm password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password confirmation does not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    changePasswordMutation.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setPasswordSuccess("Password changed successfully.");
            // Clear password inputs on successful update
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          } else {
            setPasswordError(res.message || "Failed to change password securely.");
          }
        },
        onError: (err: any) => {
          setPasswordError(getErrorMessage(err, "Failed to change password securely."));
        }
      }
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-ui pb-6 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold">
            <Settings className="h-4 w-4" />
            05 // ACCOUNT OPERATIONS
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            ACCOUNT SETTINGS
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Update your public competitor identity, establish key tunnels, and configure account parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: SECURITY SETTINGS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* UPDATE PROFILE CARD */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              00 // IDENTITY PREFERENCE CONFIG
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
              {profileSuccess && (
                <Alert variant="success" title="IDENTITY PARAM UPDATED">
                  {profileSuccess}
                </Alert>
              )}
              {profileError && (
                <Alert variant="error" title="CONFIGURATION ERROR">
                  {profileError}
                </Alert>
              )}

              <div className="space-y-1.5">
                <label className="text-fg-subtle uppercase tracking-widest text-[9px] block">
                  Competitor Name (Display Name)
                </label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  required
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "SAVING CONFIGS..." : "SAVE DISPLAY NAME"}
                </Button>
              </div>
            </form>
          </div>

          {/* CHANGE PASSWORD CARD */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none flex items-center gap-1">
              <KeyRound className="h-3.5 w-3.5 text-cyber-cyan" />
              01 // CRYPTOGRAPHIC KEY GENERATOR (CHANGE PASSWORD)
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              {passwordSuccess && (
                <Alert variant="success" title="PASSWORD SECURED">
                  {passwordSuccess}
                </Alert>
              )}
              {passwordError && (
                <Alert variant="error" title="KEY VERIFICATION FAILED">
                  {passwordError}
                </Alert>
              )}

              <div className="space-y-1.5">
                <label className="text-fg-subtle uppercase tracking-widest text-[9px] block">
                  Current Password Credentials
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-fg-subtle uppercase tracking-widest text-[9px] block">
                    New Cryptographic Passphrase
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-fg-subtle uppercase tracking-widest text-[9px] block">
                    Confirm Passphrase Tunnels
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "GENERATING HASH..." : "CHANGE PASSWORD KEY"}
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* COLUMN RIGHT: SECURE PARAMETERS INFO & DISCLAIMERS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECURE PARAMS CONSOLE */}
          <div className="p-5 bg-card-bg border border-border-ui space-y-4 font-mono select-none">
            <h4 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase">
              02 // IDENT PARAMS FEED
            </h4>
            
            <div className="space-y-3 text-[11px] uppercase tracking-wide">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">Node Username:</span>
                <span className="font-bold text-fg">{user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">Node Node (Email):</span>
                <span className="font-bold text-fg lowercase select-all">{user?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">Privilege Range:</span>
                <span className="text-cyber-cyan font-bold">{user?.role || "USER"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-fg-subtle">Establish Link:</span>
                <span className="font-bold text-fg">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  }) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* SECURITY ALERTS MATRIX */}
          <div className="p-5 bg-card-bg border border-border-ui space-y-3 text-left">
            <h4 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-cyber-amber" />
              03 // OPERATIONAL NOTES
            </h4>
            
            <div className="space-y-3 font-sans text-xs text-fg-muted leading-relaxed">
              <p>
                <strong className="text-fg block font-mono text-[10px] uppercase tracking-wider mb-0.5">Secure Hash Tunnels</strong>
                Your passphrases undergo strict bcrypt salting rounds before writing to persistent PostgreSQL databases. Plain passwords are never stored, logged, or exposed in any relational aggregates.
              </p>
              <p>
                <strong className="text-fg block font-mono text-[10px] uppercase tracking-wider mb-0.5">Never Share Credentials</strong>
                Keep your authentication tokens and password keys completely secure. Never expose credentials inside plain files or submit them within flag exploitation submissions.
              </p>
              <p>
                <strong className="text-fg block font-mono text-[10px] uppercase tracking-wider mb-0.5">Recovery Placeholders</strong>
                Automatic email reset verification pipelines are disabled inside this environment. To recover a locked out profile terminal, please directly query platform administrators.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
