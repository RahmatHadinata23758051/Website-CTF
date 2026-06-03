import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { register } from "../features/auth/api";
import { useAuthStore } from "../stores/authStore";

import { getErrorMessage } from "../lib/error";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name.trim()) {
      setError("Competitor Display Name is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please input a valid email node address containing '@'.");
      return;
    }
    if (password.length < 6) {
      setError("Passphrase must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(name, email, password);
      if (response.success && response.data) {
        setAuth(response.data.token, response.data.user);
        navigate("/onboarding");
      } else {
        setError(response.message || "Registration failed. Please check inputs.");
      }
    } catch (err: any) {
      setError(getErrorMessage(err, "Network connection failure. Unable to reach the server."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 select-text">
      <div className="bg-card-bg border border-border-ui p-8 relative overflow-hidden flex flex-col justify-between text-left space-y-6">
        {/* Top lime neon bar on form card */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-cyber-cyan"></div>

        <div className="space-y-1">
          <div className="font-mono text-[9px] text-cyber-cyan tracking-[0.2em] uppercase font-bold select-none">
            STAGE_AUTH / SIGNUP
          </div>
          <h1 className="font-display font-bold text-2xl text-fg uppercase tracking-tight leading-none">
            Create Account
          </h1>
          <p className="font-sans text-fg-muted text-xs mt-2 leading-relaxed">
            Create your cryptographic competitor signature to register solves and climb the overall system leaderboard.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="REGISTRATION REJECTED" className="max-w-full">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Competitor Display Name"
            type="text"
            placeholder="e.g. 0xVoid_Walker"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
          />

          <Input
            label="Security Email Node"
            type="email"
            placeholder="operator@rblxsec.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />

          <Input
            label="Cryptographic Passphrase"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
              {isLoading ? "ESTABLISHING CONTEXT..." : "Establish Competitor Account"}
            </Button>
          </div>
        </form>

        <div className="border-t border-border-subtle pt-4 text-center font-mono text-[10px] text-fg-subtle uppercase tracking-wide">
          Already registered?{" "}
          <Link to="/login" className="text-cyber-cyan hover:text-fg transition-colors font-bold ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
